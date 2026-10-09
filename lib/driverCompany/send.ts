import { Resend } from "resend";

/**
 * ドラテク 企業向けのメール送信。
 * Route Handler とページの両方から使うため、lib 側に置いている。
 */

/** 運営の受信箱。企業向けメールの Reply-To と、運営通知の宛先に使う */
export function adminAddress(): string | undefined {
  return (
    process.env.DORATECH_NOTIFICATION_EMAIL ??
    process.env.NOTIFICATION_EMAIL ??
    process.env.ADMIN_NOTIFICATION_EMAIL
  );
}

/** 送信できたら true。RESEND_API_KEY 未設定・送信失敗はいずれも false */
export async function sendMail(params: {
  to: string;
  subject: string;
  text: string;
  /** 企業向けメールには運営の受信箱を返信先に入れ、編集・停止の依頼を受けられるようにする */
  replyTo?: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[driver-company] RESEND_API_KEY is not set");
    return false;
  }
  const from =
    process.env.RESEND_FROM_EMAIL ?? process.env.MAIL_FROM_ADDRESS ?? "onboarding@resend.dev";

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from,
      to: params.to,
      subject: params.subject,
      text: params.text,
      ...(params.replyTo ? { replyTo: params.replyTo } : {}),
    });
    if (error) {
      console.error("[driver-company] Resend error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[driver-company] send failed:", err instanceof Error ? err.message : err);
    return false;
  }
}
