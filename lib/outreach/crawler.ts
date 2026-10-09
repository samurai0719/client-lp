import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { detectRefusal, judgeEmail } from "./emailPolicy";
import { hostOf } from "./normalize";

/**
 * 営業先企業の公式HPを確認し、公開されている法人向けメールアドレスを探す。
 *
 * ・robots.txt で禁止されているパスは読まない
 * ・同じサイト内の「会社概要」「お問い合わせ」「採用」系のページだけを最大数ページ読む
 * ・ページ上に実際に書かれているアドレスだけを拾い、推測でアドレスを作らない
 * ・担当者個人のアドレスは拾わない（判定は emailPolicy.ts）
 * ・HPに「営業メールお断り」等の表示があれば送信不可として返す
 * ・社内ネットワーク等へのアクセス（SSRF）を防ぐため、プライベートIPには接続しない
 */

export const CRAWLER_UA =
  "DoratechSalesBot/1.0 (+https://driver.taxidriver-beginner.com/company; company-contact-check)";

const FETCH_TIMEOUT_MS = 8000;
const MAX_BYTES = 1_500_000;
const MAX_EXTRA_PAGES = 5;
const MAX_REDIRECTS = 5;

const PAGE_KEYWORDS =
  /(company|about|corporate|profile|outline|gaiyou?|gaiyo|annai|access|contact|inquiry|otoiawase|toiawase|recruit|saiyou?|career|会社概要|会社案内|会社情報|企業情報|企業概要|お問い?合わ?せ|問い?合わ?せ|アクセス|採用|求人)/i;
const CONTACT_KEYWORDS = /(contact|inquiry|otoiawase|toiawase|お問い?合わ?せ|問い?合わ?せ)/i;
const PROFILE_KEYWORDS = /(company|about|corporate|profile|outline|gaiyou?|会社概要|会社案内|会社情報|企業情報|企業概要)/i;

export type CrawlResult = {
  status: "checked" | "failed" | "blocked";
  finalUrl: string | null;
  /** サイト名（og:site_name / title）。URL一覧から登録した会社の名前を補うのに使う */
  siteTitle: string | null;
  email: string | null;
  emailSourceUrl: string | null;
  /** 見つかったが対象外にしたアドレスの件数（個人アドレス・別ドメインなど） */
  rejectedCount: number;
  contactFormUrl: string | null;
  companyProfileUrl: string | null;
  refusal: string | null;
  error: string | null;
};

/* ── SSRF 対策 ─────────────────────────────────────────────────────── */

function isPrivateAddress(ip: string): boolean {
  if (isIP(ip) === 6) {
    const v = ip.toLowerCase();
    if (v === "::1" || v === "::") return true;
    if (v.startsWith("fc") || v.startsWith("fd") || v.startsWith("fe80")) return true;
    const mapped = v.match(/::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    return mapped ? isPrivateAddress(mapped[1]) : false;
  }
  const p = ip.split(".").map(Number);
  if (p.length !== 4) return true;
  return (
    p[0] === 0 || p[0] === 10 || p[0] === 127 ||
    (p[0] === 100 && p[1] >= 64 && p[1] <= 127) ||
    (p[0] === 169 && p[1] === 254) ||
    (p[0] === 172 && p[1] >= 16 && p[1] <= 31) ||
    (p[0] === 192 && p[1] === 168) ||
    (p[0] === 198 && (p[1] === 18 || p[1] === 19)) ||
    p[0] >= 224
  );
}

async function assertPublicHost(url: URL): Promise<void> {
  if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("http(s)以外のURL");
  if (url.port && url.port !== "80" && url.port !== "443") throw new Error("標準以外のポート");
  const host = url.hostname;
  if (host === "localhost" || host.endsWith(".local") || host.endsWith(".internal")) throw new Error("内部ホスト");
  const addrs = isIP(host) ? [{ address: host }] : await lookup(host, { all: true });
  if (addrs.length === 0 || addrs.some((a) => isPrivateAddress(a.address))) throw new Error("内部アドレス");
}

/** リダイレクトを1回ずつ検査しながら取得する */
async function safeFetch(rawUrl: string): Promise<{ url: string; status: number; body: string; contentType: string }> {
  let url = new URL(rawUrl);
  for (let i = 0; i <= MAX_REDIRECTS; i++) {
    await assertPublicHost(url);
    const res = await fetch(url, {
      redirect: "manual",
      headers: { "User-Agent": CRAWLER_UA, Accept: "text/html,application/xhtml+xml,text/plain;q=0.8", "Accept-Language": "ja" },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (res.status >= 300 && res.status < 400 && res.headers.get("location")) {
      url = new URL(res.headers.get("location")!, url);
      await res.body?.cancel();
      continue;
    }
    const contentType = res.headers.get("content-type") ?? "";
    const body = await readLimited(res, contentType);
    return { url: url.toString(), status: res.status, body, contentType };
  }
  throw new Error("リダイレクトが多すぎます");
}

async function readLimited(res: Response, contentType: string): Promise<string> {
  if (!res.body) return "";
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (total < MAX_BYTES) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    total += value.byteLength;
  }
  await reader.cancel().catch(() => {});
  const buf = Buffer.concat(chunks.map((c) => Buffer.from(c)));
  // 古い運送会社のHPは Shift_JIS / EUC-JP のことが多い
  const head = buf.subarray(0, 4096).toString("latin1");
  const charset = (
    contentType.match(/charset=["']?([\w-]+)/i)?.[1] ??
    head.match(/<meta[^>]+charset=["']?([\w-]+)/i)?.[1] ??
    "utf-8"
  ).toLowerCase();
  const label = /shift[_-]?jis|sjis|x-sjis|windows-31j|cp932/.test(charset)
    ? "shift_jis"
    : /euc-?jp/.test(charset)
      ? "euc-jp"
      : "utf-8";
  try {
    return new TextDecoder(label).decode(buf);
  } catch {
    return buf.toString("utf-8");
  }
}

/* ── robots.txt ────────────────────────────────────────────────────── */

type Robots = { disallow: string[]; allow: string[] };

async function loadRobots(origin: string): Promise<Robots> {
  try {
    const r = await safeFetch(`${origin}/robots.txt`);
    if (r.status >= 400) return { disallow: [], allow: [] };
    return parseRobots(r.body);
  } catch {
    return { disallow: [], allow: [] };
  }
}

function parseRobots(txt: string): Robots {
  const groups: { agents: string[]; disallow: string[]; allow: string[] }[] = [];
  let cur: (typeof groups)[number] | null = null;
  let lastWasAgent = false;
  for (const rawLine of txt.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*/, "").trim();
    const m = line.match(/^([\w-]+)\s*:\s*(.*)$/);
    if (!m) continue;
    const key = m[1].toLowerCase();
    const val = m[2].trim();
    if (key === "user-agent") {
      if (!cur || !lastWasAgent) {
        cur = { agents: [], disallow: [], allow: [] };
        groups.push(cur);
      }
      cur.agents.push(val.toLowerCase());
      lastWasAgent = true;
    } else {
      lastWasAgent = false;
      if (!cur) continue;
      if (key === "disallow" && val) cur.disallow.push(val);
      if (key === "allow" && val) cur.allow.push(val);
    }
  }
  const mine = groups.find((g) => g.agents.some((a) => a !== "*" && "doratechsalesbot".includes(a)));
  const any = groups.find((g) => g.agents.includes("*"));
  const g = mine ?? any;
  return g ? { disallow: g.disallow, allow: g.allow } : { disallow: [], allow: [] };
}

function ruleMatches(rule: string, path: string): number {
  const anchored = rule.endsWith("$");
  const body = anchored ? rule.slice(0, -1) : rule;
  const re = new RegExp("^" + body.split("*").map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join(".*") + (anchored ? "$" : ""));
  return re.test(path) ? body.length : -1;
}

function robotsAllows(robots: Robots, url: URL): boolean {
  const path = url.pathname + url.search;
  let best = -1;
  let allowed = true;
  for (const r of robots.disallow) {
    const len = ruleMatches(r, path);
    if (len > best) { best = len; allowed = false; }
  }
  for (const r of robots.allow) {
    const len = ruleMatches(r, path);
    if (len >= best && len >= 0) { best = len; allowed = true; }
  }
  return allowed;
}

/* ── HTML 解析 ─────────────────────────────────────────────────────── */

function decodeEntities(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&commat;/g, "@")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"');
}

function htmlToText(html: string): string {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|li|tr|h\d)>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
  ).replace(/[ \t]+/g, " ");
}

function extractLinks(html: string, base: string): { href: string; text: string }[] {
  const out: { href: string; text: string }[] = [];
  const re = /<a\b[^>]*href\s*=\s*["']([^"'#][^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    try {
      out.push({ href: new URL(decodeEntities(m[1]), base).toString(), text: htmlToText(m[2]).trim() });
    } catch {
      /* 無効なURLは無視 */
    }
  }
  return out;
}

function extractEmails(html: string): string[] {
  const found = new Set<string>();
  for (const m of html.matchAll(/mailto:([^"'?\s>]+)/gi)) {
    try {
      found.add(decodeURIComponent(decodeEntities(m[1])));
    } catch {
      found.add(decodeEntities(m[1]));
    }
  }
  const text = htmlToText(html);
  for (const m of text.matchAll(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g)) found.add(m[0]);
  return [...found];
}

function extractSiteTitle(html: string): string | null {
  const og = html.match(/<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i)?.[1];
  const title = og ?? html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  if (!title) return null;
  const parts = decodeEntities(title).replace(/\s+/g, " ").split(/\s*[|｜\-–—:：/]\s*/).map((t) => t.trim()).filter(Boolean);
  const corp = parts.find((t) => /株式会社|有限会社|合同会社|㈱|㈲|\(株\)|（株）/.test(t));
  return (corp ?? parts[0] ?? "").slice(0, 100) || null;
}

/* ── 本体 ─────────────────────────────────────────────────────────── */

export async function crawlCompanySite(websiteUrl: string): Promise<CrawlResult> {
  const result: CrawlResult = {
    status: "checked",
    finalUrl: null,
    siteTitle: null,
    email: null,
    emailSourceUrl: null,
    rejectedCount: 0,
    contactFormUrl: null,
    companyProfileUrl: null,
    refusal: null,
    error: null,
  };

  let home: Awaited<ReturnType<typeof safeFetch>>;
  try {
    const start = new URL(websiteUrl);
    const robots = await loadRobots(start.origin);
    if (!robotsAllows(robots, start)) return { ...result, status: "blocked", error: "robots.txtでクロールが禁止されています" };

    home = await safeFetch(websiteUrl);
    if (home.status >= 400) return { ...result, status: "failed", error: `HTTP ${home.status}` };
    result.finalUrl = home.url;
    result.siteTitle = extractSiteTitle(home.body);

    const siteHost = hostOf(home.url);
    const homeRobots = new URL(home.url).origin === start.origin ? robots : await loadRobots(new URL(home.url).origin);

    // 読むページ：トップ＋会社概要・お問い合わせ・採用系のリンク（同じサイト内のみ）
    const links = extractLinks(home.body, home.url);
    const extra: string[] = [];
    for (const l of links) {
      if (extra.length >= MAX_EXTRA_PAGES) break;
      const u = new URL(l.href);
      if (hostOf(u.toString()) !== siteHost) continue;
      if (!/^https?:$/.test(u.protocol)) continue;
      if (/\.(pdf|jpe?g|png|gif|zip|docx?|xlsx?)$/i.test(u.pathname)) continue;
      if (!PAGE_KEYWORDS.test(l.href) && !PAGE_KEYWORDS.test(l.text)) continue;
      u.hash = "";
      const key = u.toString();
      if (key === home.url || extra.includes(key)) continue;
      if (!robotsAllows(homeRobots, u)) continue;
      extra.push(key);

      if (!result.contactFormUrl && (CONTACT_KEYWORDS.test(l.href) || CONTACT_KEYWORDS.test(l.text))) {
        result.contactFormUrl = key;
      }
      if (!result.companyProfileUrl && (PROFILE_KEYWORDS.test(l.href) || PROFILE_KEYWORDS.test(l.text))) {
        result.companyProfileUrl = key;
      }
    }

    const pages: { url: string; html: string }[] = [{ url: home.url, html: home.body }];
    for (const url of extra) {
      try {
        const p = await safeFetch(url);
        if (p.status < 400 && /html|text\/plain/i.test(p.contentType || "text/html")) pages.push({ url: p.url, html: p.body });
      } catch {
        /* 個別ページの失敗は無視して続ける */
      }
    }

    let best: { email: string; priority: number; source: string } | null = null;
    const rejected = new Set<string>();
    for (const page of pages) {
      const text = htmlToText(page.html);
      const refusal = detectRefusal(text);
      if (refusal && !result.refusal) result.refusal = refusal;

      // お問い合わせページにフォームが無ければ「問い合わせフォームあり」とはしない
      if (page.url === result.contactFormUrl && !/<form\b/i.test(page.html)) {
        result.contactFormUrl = null;
      }

      for (const raw of extractEmails(page.html)) {
        const v = judgeEmail(raw, home.url);
        if (!v.ok) {
          if (v.email) rejected.add(v.email);
          continue;
        }
        if (!best || v.priority < best.priority) best = { email: v.email, priority: v.priority, source: page.url };
      }
    }
    if (best) {
      result.email = best.email;
      result.emailSourceUrl = best.source;
      rejected.delete(best.email);
    }
    result.rejectedCount = rejected.size;
    return result;
  } catch (err) {
    const msg = err instanceof Error ? (err.name === "TimeoutError" ? "タイムアウト" : err.message) : String(err);
    return { ...result, status: "failed", error: msg.slice(0, 200) };
  }
}
