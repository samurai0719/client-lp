import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { detectRefusal, judgeEmail, type EmailKind } from "./emailPolicy";
import { extractPhones, hostOf, nameKey, phoneKey } from "./normalize";

/**
 * 営業先企業の公式HPを確認し、公開されている法人向けメールアドレスを探す。
 *
 * ・robots.txt で禁止されているパスは読まない
 * ・同じサイト内を最大40ページまで巡回する（「会社概要」「お問い合わせ」「採用」系のページを優先）
 * ・ページ上に実際に書かれているアドレスだけを拾い、推測でアドレスを作らない
 * ・担当者個人のアドレスは拾わない（判定は emailPolicy.ts）
 * ・HPに「営業メールお断り」等の表示があれば送信不可として返す
 * ・社内ネットワーク等へのアクセス（SSRF）を防ぐため、プライベートIPには接続しない
 */

export const CRAWLER_UA =
  "DoratechSalesBot/1.0 (+https://driver.taxidriver-beginner.com/company; company-contact-check)";

const FETCH_TIMEOUT_MS = 8000;
const MAX_BYTES = 1_500_000;
/** 1サイトで読む最大ページ数・リンクをたどる深さ・時間の上限・ページ間の間隔 */
const MAX_PAGES = 40;
const MAX_DEPTH = 3;
const SITE_TIME_BUDGET_MS = 20_000;
const PAGE_INTERVAL_MS = 250;

/** 同じページを二度読まないための正規形（末尾のスラッシュ・index.html の違いを無視） */
function canonical(url: string): string {
  const u = new URL(url);
  u.hash = "";
  u.pathname = u.pathname.replace(/\/index\.(html?|php)$/i, "/").replace(/\/$/, "") || "/";
  return u.toString();
}
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
  emailKind: EmailKind | null;
  /** HPに載っていた代表電話番号（TELと書かれた番号・tel:リンクを優先） */
  phone: string | null;
  /** 見つかったが対象外にしたアドレスの件数（個人アドレス・別ドメインなど） */
  rejectedCount: number;
  contactFormUrl: string | null;
  companyProfileUrl: string | null;
  refusal: string | null;
  /** expect を渡したときだけ：HP上に会社名または電話番号があったか（別会社のHPを誤登録しないため） */
  identityMatched: boolean | null;
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

/**
 * 登録されているURLで開けない場合に試す別の形。
 * 例：https://www.example.jp/ の証明書が www 無しにしか対応していない／https 非対応 など、
 * 中小の運送会社のサイトでよくある設定ミスを吸収する。
 */
function urlVariants(websiteUrl: string): string[] {
  const u = new URL(websiteUrl);
  const hosts = u.hostname.startsWith("www.") ? [u.hostname, u.hostname.slice(4)] : [u.hostname, `www.${u.hostname}`];
  const out: string[] = [];
  for (const proto of [u.protocol, u.protocol === "https:" ? "http:" : "https:"]) {
    for (const h of hosts) out.push(`${proto}//${h}${u.pathname}${u.search}`);
  }
  return [...new Set(out)];
}

/** 本人確認に使う情報（ChatGPT など、確実でない経路で見つけたHPのときに渡す） */
export type ExpectedCompany = { name: string; phone?: string | null };

export async function crawlCompanySite(websiteUrl: string, expect?: ExpectedCompany): Promise<CrawlResult> {
  let last: CrawlResult | null = null;
  for (const url of urlVariants(websiteUrl)) {
    const r = await crawlOnce(url, expect);
    // 開けた（またはrobots.txtで禁止されていた）ら、それを結果にする。接続できない場合だけ別の形を試す
    if (r.status !== "failed" || /^HTTP \d/.test(r.error ?? "")) return r;
    last = r;
  }
  return last!;
}

async function crawlOnce(websiteUrl: string, expect?: ExpectedCompany): Promise<CrawlResult> {
  const result: CrawlResult = {
    status: "checked",
    finalUrl: null,
    siteTitle: null,
    email: null,
    emailSourceUrl: null,
    emailKind: null,
    phone: null,
    rejectedCount: 0,
    contactFormUrl: null,
    companyProfileUrl: null,
    refusal: null,
    identityMatched: null,
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

    // サイト内を巡回する（同じサイト内のみ・最大 MAX_PAGES ページ）。
    // 会社概要・お問い合わせ・採用などのページを優先し、残りはリンクをたどって順に読む。
    // important … トップ・会社概要・お問い合わせ・採用などのページ（個人名・フリーメールはここに載っているものだけ使う）
    const pages: { url: string; html: string; important: boolean }[] = [{ url: home.url, html: home.body, important: true }];
    const seen = new Set<string>([canonical(home.url)]);
    const queue: { url: string; score: number; depth: number; important: boolean }[] = [];
    const deadline = Date.now() + SITE_TIME_BUDGET_MS;

    const enqueueLinks = (html: string, base: string, depth: number) => {
      for (const l of extractLinks(html, base)) {
        let u: URL;
        try {
          u = new URL(l.href);
        } catch {
          continue;
        }
        if (!/^https?:$/.test(u.protocol) || hostOf(u.toString()) !== siteHost) continue;
        if (/\.(pdf|jpe?g|png|gif|webp|svg|zip|docx?|xlsx?|pptx?|mp4|mp3|css|js)$/i.test(u.pathname)) continue;
        u.hash = "";
        const key = canonical(u.toString());
        if (seen.has(key) || !robotsAllows(homeRobots, u)) continue;
        seen.add(key);
        const important = PAGE_KEYWORDS.test(l.href) || PAGE_KEYWORDS.test(l.text);
        queue.push({ url: u.toString(), score: important ? 0 : depth, depth, important });

        if (!result.contactFormUrl && (CONTACT_KEYWORDS.test(l.href) || CONTACT_KEYWORDS.test(l.text))) {
          result.contactFormUrl = u.toString();
        }
        if (!result.companyProfileUrl && (PROFILE_KEYWORDS.test(l.href) || PROFILE_KEYWORDS.test(l.text))) {
          result.companyProfileUrl = u.toString();
        }
      }
      queue.sort((a, b) => a.score - b.score);
    };

    enqueueLinks(home.body, home.url, 1);
    while (queue.length > 0 && pages.length < MAX_PAGES && Date.now() < deadline) {
      const next = queue.shift()!;
      try {
        const p = await safeFetch(next.url);
        if (p.status < 400 && /html|text\/plain/i.test(p.contentType || "text/html") && hostOf(p.url) === siteHost) {
          pages.push({ url: p.url, html: p.body, important: next.important });
          if (next.depth < MAX_DEPTH) enqueueLinks(p.body, p.url, next.depth + 1);
        }
      } catch {
        /* 個別ページの失敗は無視して続ける */
      }
      // 相手のサーバーに負荷をかけないよう、少し間を空ける
      await new Promise((r) => setTimeout(r, PAGE_INTERVAL_MS));
    }

    let best: { email: string; priority: number; source: string; kind: EmailKind } | null = null;
    const rejected = new Set<string>();
    if (expect) {
      // 法人格・空白・記号を除いた社名、または電話番号（数字のみ）がどこかのページにあれば本人とみなす
      const wantName = nameKey(expect.name);
      const wantPhone = phoneKey(expect.phone ?? null);
      result.identityMatched = pages.some((pg) => {
        const t = htmlToText(pg.html);
        return (wantName.length >= 2 && nameKey(t).includes(wantName)) || (wantPhone !== null && t.replace(/\D/g, "").includes(wantPhone));
      });
    }

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
        // 個人名・フリーメールは、会社の連絡先として載っているページ（トップ・会社概要・問い合わせ・採用）のものだけ。
        // ブログや個別サービスのページにある個人のアドレス（例：社員の趣味の教室）を拾わないため
        if (v.kind !== "role" && !page.important) {
          rejected.add(v.email);
          continue;
        }
        if (!best || v.priority < best.priority) best = { email: v.email, priority: v.priority, source: page.url, kind: v.kind };
      }
    }
    // 電話番号：tel: リンク →「TEL」「電話」の直後 → ページ内の最初の番号 の順
    for (const page of pages) {
      const tel = page.html.match(/href=["']tel:([^"']+)["']/i)?.[1];
      const labeled = htmlToText(page.html).match(/(?:TEL|Tel|tel|電話番号|電話|代表)[\s:：.]*([0-9０-９(（][0-9０-９\-‐－()（）\s]{8,16})/)?.[1];
      const found = extractPhones(tel ?? labeled ?? "")[0] ?? null;
      if (found) {
        result.phone = found.display;
        break;
      }
    }
    if (!result.phone) result.phone = extractPhones(htmlToText(pages[0].html))[0]?.display ?? null;

    if (best) {
      result.email = best.email;
      result.emailSourceUrl = best.source;
      result.emailKind = best.kind;
      rejected.delete(best.email);
    }
    result.rejectedCount = rejected.size;
    return result;
  } catch (err) {
    const msg = err instanceof Error ? (err.name === "TimeoutError" ? "タイムアウト" : err.message) : String(err);
    return { ...result, status: "failed", error: msg.slice(0, 200) };
  }
}

/**
 * ChatGPT 等が「このページに載っている」と答えたメールアドレスを、実際にそのページを開いて確かめる。
 * ・ページに本当にそのアドレスが書かれているか（AIの思い違い・作り話を防ぐ）
 * ・同じページに「営業メールお断り」等の表示がないか
 */
export async function verifyEmailOnPage(
  email: string,
  pageUrl: string
): Promise<{ ok: true; finalUrl: string; refusal: string | null } | { ok: false; reason: string }> {
  try {
    const u = new URL(pageUrl);
    const robots = await loadRobots(u.origin);
    if (!robotsAllows(robots, u)) return { ok: false, reason: "掲載ページが robots.txt でクロール禁止" };
    const page = await safeFetch(pageUrl);
    if (page.status >= 400) return { ok: false, reason: `掲載ページを開けません（HTTP ${page.status}）` };
    const found = extractEmails(page.body).map((e) => e.trim().toLowerCase());
    if (!found.includes(email.toLowerCase())) return { ok: false, reason: "掲載ページにそのアドレスが見当たりません" };
    return { ok: true, finalUrl: page.url, refusal: detectRefusal(htmlToText(page.body)) };
  } catch (err) {
    return { ok: false, reason: `掲載ページを確認できません（${err instanceof Error ? err.message : String(err)}）`.slice(0, 200) };
  }
}
