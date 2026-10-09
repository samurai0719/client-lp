import { renderEmail, type RenderTarget } from "./render";
import type { OutreachSettings } from "./settings";

/**
 * 送信履歴に表示する「送信した文面」。
 * テスト送信分は保存した全文をそのまま使い、それ以外はテンプレートから作り直す
 * （送信開始後はテンプレートを編集できないため、差し込み内容は送信時と同じになる。
 *   送信者情報を後から変更した場合だけ、フッターが現在の設定で表示される）。
 */
export function sentMailFor(
  send: { token: string; rendered_subject: string | null; rendered_body: string | null; sent_at: string | null },
  campaign: { id: string; subject: string; body: string; landing_page_url: string } | null,
  company: RenderTarget | null,
  settings: OutreachSettings
): { subject: string; body: string; reproduced: boolean } | null {
  if (send.rendered_body) return { subject: send.rendered_subject ?? "", body: send.rendered_body, reproduced: false };
  if (!send.sent_at || !campaign || !company) return null;
  const m = renderEmail(campaign, company, {
    campaignId: campaign.id,
    landingPageUrl: campaign.landing_page_url,
    token: send.token,
    settings,
  });
  return { subject: send.rendered_subject ?? m.subject, body: m.text, reproduced: true };
}
