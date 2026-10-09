import { NextResponse } from "next/server";
import { authed, bad, str } from "@/lib/outreach/api";
import { normalizeEmail, normalizeUrl } from "@/lib/outreach/normalize";
import { getMailProvider } from "@/lib/outreach/provider";
import { renderEmail } from "@/lib/outreach/render";
import { defaultLandingUrl, fromAddress, getSettings, replyToAddress, sendReadiness } from "@/lib/outreach/settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 自分宛てのテストメール（1通）。届き方・迷惑メール判定・表示崩れを、営業先へ送る前に確認する。
 * 宛先は 返信先 / 送信者の連絡先 / 管理者（ADOFY_ADMIN_EMAILS）のアドレスに限る（第三者へ送らせない）。
 * 送信履歴・計測には記録しない。
 */
export async function POST(req: Request) {
  const a = await authed(req);
  if ("error" in a) return a.error;
  const b = a.body;
  const settings = await getSettings(a.db);
  const readiness = sendReadiness(settings);
  if (!readiness.ready) return bad(`送信できません：${readiness.problems.join(" / ")}`, 409);

  const to = normalizeEmail(str(b.to, 200));
  const allowed = new Set(
    [replyToAddress(settings), settings.sender_email, a.user.email, ...(process.env.ADOFY_ADMIN_EMAILS ?? "").split(",")]
      .map((e) => normalizeEmail(e ?? ""))
      .filter(Boolean)
  );
  if (!to || !allowed.has(to)) return bad("テストメールは、返信先・送信者の連絡先・管理者のアドレスにだけ送れます");

  const subject = str(b.subject, 200);
  const body = typeof b.body === "string" ? b.body : "";
  if (!subject || !body) return bad("件名と本文を入力してください");
  const landing = normalizeUrl(str(b.landing_page_url, 500)) ?? defaultLandingUrl();

  const mail = renderEmail(
    { subject, body },
    { id: "test", company_name: "株式会社テスト運送", contact_name: null, prefecture: "東京都", city: "千代田区", source: "gbizinfo" },
    { campaignId: "00000000-0000-0000-0000-000000000000", landingPageUrl: landing, token: null, settings }
  );
  const provider = getMailProvider();
  if (!provider) return bad("メール配信サービスが未設定です", 503);
  const res = await provider.send({
    from: fromAddress()!,
    to,
    replyTo: replyToAddress(settings),
    subject: `【テスト】${mail.subject}`,
    text: mail.text,
    html: mail.html,
    headers: {},
    idempotencyKey: `outreach-test-${crypto.randomUUID()}`,
    tags: { kind: "outreach_test" },
  });
  if (!res.ok) return bad(`送信に失敗しました：${res.error}`, 502);
  return NextResponse.json({ ok: true });
}
