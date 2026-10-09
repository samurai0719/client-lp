import { hostOf, isSharedHost, normalizeEmail } from "./normalize";

/**
 * 公式HPから見つけたメールアドレスを「送信候補にしてよいか」判定するルール。
 *
 * ・会社の公式ドメインのアドレスだけを対象にする（フリーメール・別ドメインは対象外）
 * ・info@ / contact@ / recruit@ / soumu@ などの部署・窓口アドレスだけを対象にする
 *   （yamada@ や t.suzuki@ のような担当者個人のアドレスは集めない）
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

export type EmailVerdict =
  | { ok: true; email: string; priority: number }
  | { ok: false; email: string | null; reason: string };

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
  if (isSharedHost(domain)) return { ok: false, email, reason: "共有ドメイン・フリーメール" };
  if (!sameOrganization(domain, site)) return { ok: false, email, reason: "公式HPと別ドメイン" };

  const head = local.split(/[._+-]/)[0];
  if (DENY_TOKENS.some((t) => local === t || head === t || local.startsWith(t))) {
    return { ok: false, email, reason: "送信先に適さない窓口" };
  }
  if (!ROLE_TOKENS.some((t) => local === t || local.startsWith(t))) {
    return { ok: false, email, reason: "個人アドレスの可能性" };
  }

  const priority = PRIORITY.find(([re]) => re.test(local))?.[1] ?? 3;
  return { ok: true, email, priority };
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
