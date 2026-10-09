import { Resend } from "resend";

/**
 * メール配信サービスの差し替え口。
 *
 * このプロジェクトは既に Resend を使っているため、既定は Resend。
 * Amazon SES / SendGrid / Postmark に切り替える場合は、この MailProvider を実装した
 * アダプタを追加して OUTREACH_MAIL_PROVIDER で選ぶ（呼び出し側は変更不要）。
 * APIキーは必ず環境変数から読む。
 */

export type OutgoingMail = {
  from: string;
  to: string;
  replyTo?: string | null;
  subject: string;
  text: string;
  html: string;
  headers: Record<string, string>;
  /** 再送時に二重送信しないためのキー（送信IDを使う） */
  idempotencyKey: string;
  tags: Record<string, string>;
};

export type SendOutcome =
  | { ok: true; messageId: string | null }
  /** retryable: 一時的な失敗（レート制限など）。キューに戻して後で再送してよい */
  | { ok: false; error: string; retryable: boolean };

export interface MailProvider {
  readonly name: string;
  send(mail: OutgoingMail): Promise<SendOutcome>;
}

class ResendProvider implements MailProvider {
  readonly name = "resend";
  private client: Resend;
  constructor(apiKey: string) {
    this.client = new Resend(apiKey);
  }
  async send(mail: OutgoingMail): Promise<SendOutcome> {
    try {
      const { data, error } = await this.client.emails.send(
        {
          from: mail.from,
          to: mail.to,
          subject: mail.subject,
          text: mail.text,
          html: mail.html,
          headers: mail.headers,
          ...(mail.replyTo ? { replyTo: mail.replyTo } : {}),
          tags: Object.entries(mail.tags).map(([name, value]) => ({ name, value })),
        },
        { idempotencyKey: mail.idempotencyKey }
      );
      if (error) {
        const e = error as { name?: string; message?: string; statusCode?: number | null };
        const retryable =
          e.statusCode === 429 || (e.statusCode ?? 0) >= 500 || /rate|limit|too many/i.test(`${e.name} ${e.message}`);
        return { ok: false, error: `${e.name ?? "error"}: ${e.message ?? ""}`.slice(0, 300), retryable };
      }
      return { ok: true, messageId: data?.id ?? null };
    } catch (err) {
      return { ok: false, error: (err instanceof Error ? err.message : String(err)).slice(0, 300), retryable: true };
    }
  }
}

/** 開発用：実際には送らず、ログに出すだけ。本番（VERCEL_ENV=production）では使えない */
class LogProvider implements MailProvider {
  readonly name = "log";
  async send(mail: OutgoingMail): Promise<SendOutcome> {
    console.log(`[outreach:log] to=${mail.to} subject=${mail.subject}`);
    return { ok: true, messageId: `log-${mail.idempotencyKey}` };
  }
}

export function getMailProvider(): MailProvider | null {
  const name = (process.env.OUTREACH_MAIL_PROVIDER ?? "resend").toLowerCase();
  if (name === "log" && process.env.VERCEL_ENV !== "production" && process.env.NODE_ENV !== "production") {
    return new LogProvider();
  }
  if (name === "resend") {
    const key = process.env.RESEND_API_KEY;
    return key ? new ResendProvider(key) : null;
  }
  console.error(`[outreach] unsupported OUTREACH_MAIL_PROVIDER: ${name}`);
  return null;
}
