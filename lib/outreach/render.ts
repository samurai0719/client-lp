import { SERVICE } from "@/config/driver-company";
import type { OutreachSettings } from "./settings";
import { publicBaseUrl } from "./settings";
import { hasCorpType } from "./normalize";

/**
 * 営業メールの差し込み・フッター・HTML化。
 *
 * 差し込み：{{company_name}} {{contact_name}} {{prefecture}} {{city}} {{landing_page_url}}
 *           {{recipient}}（宛名ブロック。会社名があれば「株式会社○○\nご担当者様」、無ければ「採用ご担当者様」）
 *
 * フッター（送信者情報・配信停止方法）はテンプレートに関係なく必ず末尾に付ける。
 * テンプレート側で消したり書き換えたりできないようにするため。
 */

export { DEFAULT_BODY, DEFAULT_SUBJECT, PLACEHOLDERS } from "./templates";

export type RenderTarget = {
  id: string;
  company_name: string | null;
  contact_name: string | null;
  prefecture: string | null;
  city: string | null;
  source?: string | null;
  email_source_url?: string | null;
};

export type RenderContext = {
  campaignId: string;
  landingPageUrl: string;
  /** email_sends.token。無い場合（プレビュー）は計測リンクを作らず、LPのURLをそのまま入れる */
  token?: string | null;
  settings: OutreachSettings;
};

/** LPのURLに企業ごとのUTMを付ける */
export function withUtm(landing: string, companyId: string, campaignId: string): string {
  const u = new URL(landing);
  u.searchParams.set("utm_source", "email");
  u.searchParams.set("utm_medium", "outreach");
  u.searchParams.set("utm_campaign", "driver_company");
  u.searchParams.set("utm_content", companyId);
  u.searchParams.set("utm_term", `cmp_${campaignId.slice(0, 8)}`);
  return u.toString();
}

export function clickUrl(token: string): string {
  return `${publicBaseUrl()}/api/outreach/c/${token}`;
}
export function unsubscribeUrl(token: string): string {
  return `${publicBaseUrl()}/unsubscribe?t=${token}`;
}
export function unsubscribeOneClickUrl(token: string): string {
  return `${publicBaseUrl()}/api/outreach/unsubscribe?t=${token}`;
}
export function openPixelUrl(token: string): string {
  return `${publicBaseUrl()}/api/outreach/o/${token}`;
}

function recipientBlock(t: RenderTarget): string {
  const name = (t.company_name ?? "").trim();
  if (!name) return "採用ご担当者様";
  const contact = (t.contact_name ?? "").trim();
  return `${name}\n${contact ? `${contact} 様` : "ご担当者様"}`;
}

function applyPlaceholders(template: string, t: RenderTarget, landing: string): string {
  const name = (t.company_name ?? "").trim();
  let s = template;

  // 「株式会社{{company_name}}」と書かれていて、会社名に既に法人格が付いている場合の二重表記を防ぐ
  if (name && hasCorpType(name)) {
    s = s.replace(/(株式会社|有限会社|合同会社)\s*\{\{\s*company_name\s*\}\}/g, "{{company_name}}");
  }
  // 会社名が無い場合：「株式会社{{company_name}}\nご担当者様」の形は「採用ご担当者様」にまとめる
  if (!name) {
    s = s.replace(/^[^\S\n]*(株式会社|有限会社|合同会社)?\s*\{\{\s*company_name\s*\}\}[^\S\n]*(様|御中)?[^\S\n]*\n\s*(ご担当者様|ご担当者さま|採用ご担当者様)/m, "採用ご担当者様");
    s = s.replace(/^[^\S\n]*(株式会社|有限会社|合同会社)?\s*\{\{\s*company_name\s*\}\}[^\S\n]*(様|御中)?[^\S\n]*$/m, "採用ご担当者様");
    s = s.replace(/(株式会社|有限会社|合同会社)?\{\{\s*company_name\s*\}\}(様|御中)?/g, "貴社");
  }

  const values: Record<string, string> = {
    recipient: recipientBlock(t),
    company_name: name,
    contact_name: (t.contact_name ?? "").trim(),
    prefecture: (t.prefecture ?? "").trim(),
    city: (t.city ?? "").trim(),
    landing_page_url: landing,
  };
  s = s.replace(/\{\{\s*(\w+)\s*\}\}/g, (m, key: string) => (key in values ? values[key] : m));
  // 担当者名が空のときの「 様」だけが残った行を整える
  s = s.replace(/^[^\S\n]*様[^\S\n]*$/gm, "ご担当者様");
  return s.replace(/\n{3,}/g, "\n\n").trim();
}

function footer(t: RenderTarget, ctx: RenderContext): string {
  const s = ctx.settings;
  const unsub = ctx.token ? unsubscribeUrl(ctx.token) : `${publicBaseUrl()}/unsubscribe?t=（送信時に発行）`;
  const why =
    t.source === "csv" || t.source === "manual"
      ? "本メールは、運送会社様向けに当サービスのご案内としてお送りしています。"
      : "本メールは、貴社ウェブサイトで公開されている連絡先メールアドレス宛にお送りしています。";
  return [
    "",
    "",
    "────────────────────────",
    why,
    "今後のご案内が不要な場合は、下記URLから配信を停止できます。",
    unsub,
    "本メールに「配信停止」とご返信いただいても停止いたします。",
    "",
    `送信者：${s.sender_name}（${SERVICE.name}）`,
    `住所：${s.sender_address}`,
    `お問い合わせ・配信停止の連絡先：${s.sender_email}${s.sender_phone ? ` / ${s.sender_phone}` : ""}`,
    SERVICE.url,
    "────────────────────────",
  ].join("\n");
}

export function renderEmail(
  campaign: { subject: string; body: string },
  t: RenderTarget,
  ctx: RenderContext
): { subject: string; text: string; html: string } {
  const trackedLanding = withUtm(ctx.landingPageUrl, t.id, ctx.campaignId);
  const linkInMail = ctx.token ? clickUrl(ctx.token) : trackedLanding;

  const subject = applyPlaceholders(campaign.subject, t, linkInMail).replace(/\s*\n\s*/g, " ").slice(0, 200);
  const text = applyPlaceholders(campaign.body, t, linkInMail) + footer(t, ctx);
  return { subject, text, html: toHtml(text, ctx.token ?? null) };
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

/** テキスト本文をそのまま見た目を崩さずHTMLにする（開封計測の画像だけ追加） */
function toHtml(text: string, token: string | null): string {
  const linked = escapeHtml(text).replace(/https?:\/\/[^\s<]+/g, (u) => `<a href="${u}">${u}</a>`);
  const pixel = token ? `<img src="${openPixelUrl(token)}" width="1" height="1" alt="" style="display:block;border:0;width:1px;height:1px">` : "";
  return `<!doctype html><html><body style="margin:0;padding:16px;font-family:-apple-system,'Hiragino Sans','Yu Gothic',sans-serif;font-size:15px;line-height:1.8;color:#222"><div style="white-space:pre-wrap;max-width:640px">${linked}</div>${pixel}</body></html>`;
}
