import { hostOf, isSharedHost, normalizeEmail } from "./normalize";

/**
 * 公式HPから見つけたメールアドレスを「送信候補にしてよいか」判定するルール。
 *
 * ・会社の公式ドメインのアドレスとフリーメールを対象にする（別の会社のドメインは対象外）
 * ・info@ / contact@ / recruit@ / soumu@ などの部署・窓口アドレスを優先する
 * ・窓口アドレスが無ければ、公式HPに公開されている個人名アドレス・フリーメールも対象にする
 *   （2026-10-09 運営者の判断で変更。個人名・フリーメールは目視確認して「送信OK」にするまで送らない）
 * ・アドレスを推測して作ることは一切しない（ページ上に実在したものだけ）
 */

/** 窓口アドレスとして扱うローカル部の語（先頭一致。info-tokyo@ / recruit2025@ なども含む） */
const ROLE_TOKENS = [
  // 採用系（ドライバー採用の案内なので優先度を高くする）
  "recruit", "recruiting", "saiyo", "saiyou", "jinji", "hr", "career", "job", "jobs",
  // 総務・本社
  "soumu", "somu", "general", "honsha", "headoffice", "office", "kanri",
  // 代表窓口
  "info", "information", "contact", "contactus", "inquiry", "inquiries", "otoiawase", "toiawase",
  "mail", "uketsuke", "support", "customer", "service", "desk", "center", "front",
  // 営業・配車（運送会社に多い窓口）
  "eigyo", "eigyou", "sales", "haisha", "unso", "unsou", "unyu", "butsuryu", "logistics", "transport",
];

/** 窓口アドレスに見えても営業メールの送り先に適さないもの */
const DENY_TOKENS = [
  "webmaster", "postmaster", "hostmaster", "abuse", "noreply", "no-reply", "donotreply", "do-not-reply",
  "privacy", "kojinjoho", "personal", "dpo", "security", "admin", "root", "system", "mailer-daemon",
  "unsubscribe", "bounce", "test", "example", "sample", "dummy", "xxx",
];

/** 優先順（小さいほど優先）。採用窓口 → 総務 → 代表窓口 → その他 */
const PRIORITY: [RegExp, number][] = [
  [/^(recruit|recruiting|saiyo|saiyou|jinji|hr|career|jobs?)/, 0],
  [/^(soumu|somu|general|honsha|headoffice|office|kanri)/, 1],
  [/^(info|information|contact|contactus|inquiry|inquiries|otoiawase|toiawase)/, 2],
];

/** role … info@ 等の会社の窓口 / personal … 会社ドメインの個人名アドレス / freemail … Gmail 等 */
export type EmailKind = "role" | "personal" | "freemail";

export type EmailVerdict =
  | { ok: true; email: string; priority: number; kind: EmailKind }
  | { ok: false; email: string | null; reason: string };

/** フリーメール・プロバイダ・携帯のドメイン（小規模な運送会社は会社の窓口として使っていることが多い） */
const FREEMAIL_DOMAINS = [
  "gmail.com", "googlemail.com", "yahoo.co.jp", "ymail.ne.jp", "icloud.com", "me.com", "mac.com", "outlook.com",
  "outlook.jp", "hotmail.com", "hotmail.co.jp", "live.jp", "live.com", "msn.com", "aol.com", "excite.co.jp",
  "ocn.ne.jp", "biglobe.ne.jp", "nifty.com", "nifty.ne.jp", "so-net.ne.jp", "plala.or.jp", "dion.ne.jp", "odn.ne.jp",
  "infoseek.jp", "docomo.ne.jp", "ezweb.ne.jp", "au.com", "softbank.ne.jp", "i.softbank.jp", "ymobile.ne.jp", "jcom.home.ne.jp",
];

export function isFreemailDomain(domain: string): boolean {
  const d = domain.toLowerCase();
  return FREEMAIL_DOMAINS.some((f) => d === f || d.endsWith("." + f));
}

function sameOrganization(emailDomain: string, siteHost: string): boolean {
  const e = emailDomain.toLowerCase();
  const s = siteHost.toLowerCase().replace(/^www\./, "");
  return e === s || e.endsWith("." + s) || s.endsWith("." + e);
}

export function judgeEmail(raw: string, siteUrl: string): EmailVerdict {
  const email = normalizeEmail(raw);
  if (!email) return { ok: false, email: null, reason: "形式が不正" };

  const [local, domain] = email.split("@");
  const site = hostOf(siteUrl);
  if (!site) return { ok: false, email, reason: "HPのドメインが不明" };

  const head = local.split(/[._+-]/)[0];
  if (DENY_TOKENS.some((t) => local === t || head === t || local.startsWith(t))) {
    return { ok: false, email, reason: "送信先に適さない窓口" };
  }

  // 公式HPに載っているフリーメールは、会社の窓口として使われていることが多いので対象にする
  if (isFreemailDomain(domain)) return { ok: true, email, priority: 5, kind: "freemail" };
  // 公式HPと別の会社ドメイン（HP制作会社の連絡先など）は、その会社の窓口ではないので対象外
  if (isSharedHost(domain)) return { ok: false, email, reason: "共有ドメイン" };
  if (!sameOrganization(domain, site)) return { ok: false, email, reason: "公式HPと別ドメイン" };

  // 会社ドメインの個人名アドレスも、公式HPに公開されていれば対象にする（窓口アドレスを優先）
  if (!ROLE_TOKENS.some((t) => local === t || local.startsWith(t))) {
    return { ok: true, email, priority: 4, kind: "personal" };
  }

  const priority = PRIORITY.find(([re]) => re.test(local))?.[1] ?? 3;
  return { ok: true, email, priority, kind: "role" };
}

/** CSV取り込み時の判定。窓口アドレスかどうかだけは確認する（ドメインは問わない） */
export function looksLikePersonalAddress(email: string): boolean {
  const local = email.split("@")[0] ?? "";
  return !ROLE_TOKENS.some((t) => local === t || local.startsWith(t));
}

/**
 * 「広告・営業メールお断り」等の表示。
 * 特定電子メール法では、アドレスが公表されていても、受信拒否の旨が併せて表示されている場合は
 * 広告宣伝メールを送ってはならないため、検出したら送信対象から外す。
 */
const REFUSAL_PATTERNS = [
  /(広告|宣伝|営業|勧誘|セールス|売り?込み|販促|特定電子)[^。\n]{0,40}(お断り|ご遠慮|禁止|拒否|受け付けて(お|い)?りません|受付(して)?(お|い)?りません|送らないで|送信しないで|お控え)/,
  /(お断り|ご遠慮|禁止|拒否)[^。\n]{0,10}(広告|宣伝|営業|勧誘|セールス)/,
];

export function detectRefusal(text: string): string | null {
  for (const re of REFUSAL_PATTERNS) {
    const m = text.match(re);
    if (m) return m[0].slice(0, 80);
  }
  return null;
}
