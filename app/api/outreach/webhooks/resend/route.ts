import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/check";
import { markBounced, markDelivered, markFailed, markReplied, markUnsubscribed } from "@/lib/outreach/events";
import { normalizeEmail } from "@/lib/outreach/normalize";
import { addSuppression } from "@/lib/outreach/suppress";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Resend の Webhook（配信結果）。
 *   email.delivered  → 配信成功
 *   email.bounced    → ハードバウンス（恒久的に届かない）→ 配信停止リストへ
 *   email.complained → 迷惑メール報告 → 配信停止リストへ
 *   email.suppressed / email.failed → エラー
 *   email.received   → 返信あり（受信設定をしている場合のみ）
 * 開封・クリックは自前の計測URLで記録しているため、ここでは扱わない。
 *
 * 署名検証用シークレット：RESEND_WEBHOOK_SECRET（whsec_...）
 */
export async function POST(req: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "not configured" }, { status: 503 });

  const payload = await req.text();
  let event: { type: string; created_at?: string; data: Record<string, unknown> };
  try {
    event = new Resend(process.env.RESEND_API_KEY).webhooks.verify({
      payload,
      headers: {
        id: req.headers.get("svix-id") ?? "",
        timestamp: req.headers.get("svix-timestamp") ?? "",
        signature: req.headers.get("svix-signature") ?? "",
      },
      webhookSecret: secret,
    }) as unknown as typeof event;
  } catch {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  if (!isSupabaseAdminConfigured()) return NextResponse.json({ error: "db not configured" }, { status: 503 });
  const db = createAdminClient();
  const data = event.data ?? {};
  const emailId = typeof data.email_id === "string" ? data.email_id : "";
  const tags = (data.tags ?? {}) as Record<string, string>;
  // 営業メール以外（既存の通知メール等）の配信結果は無視する
  const isOutreach = tags.kind === "outreach";

  try {
    switch (event.type) {
      case "email.delivered":
        if (isOutreach && emailId) await markDelivered(db, emailId, event.created_at);
        break;
      case "email.bounced": {
        const bounce = (data.bounce ?? {}) as { type?: string; message?: string };
        // Resend の email.bounced は受信側が恒久的に拒否したもの。Transient と明示されたものだけ除く
        if (isOutreach && emailId && !/transient/i.test(bounce.type ?? "")) await markBounced(db, emailId, bounce);
        else if (isOutreach && emailId) await markFailed(db, emailId, `一時的な配信エラー: ${bounce.message ?? ""}`);
        break;
      }
      case "email.complained":
        if (isOutreach && emailId) {
          const to = Array.isArray(data.to) ? String(data.to[0] ?? "") : "";
          if (to) await markUnsubscribed(db, { email: to }, "complaint");
        }
        break;
      case "email.suppressed":
        if (isOutreach && emailId) {
          const to = Array.isArray(data.to) ? String(data.to[0] ?? "") : "";
          if (to) await addSuppression(db, to, "hard_bounce", "配信サービス側の停止リストに登録済み");
          await markFailed(db, emailId, "配信サービス側の停止リストに登録済みのため送信されませんでした");
        }
        break;
      case "email.failed":
        if (isOutreach && emailId) {
          const failed = (data.failed ?? {}) as { reason?: string };
          await markFailed(db, emailId, failed.reason ?? "送信に失敗しました");
        }
        break;
      case "email.received": {
        const from = normalizeEmail(String(data.from ?? "").match(/<([^>]+)>/)?.[1] ?? String(data.from ?? ""));
        if (from) {
          await markReplied(db, { fromEmail: from });
          // 件名・本文に「配信停止」等があれば送信拒否として扱う
          const subject = String(data.subject ?? "");
          if (/配信停止|停止希望|不要|unsubscribe|お断り/i.test(subject)) {
            await markUnsubscribed(db, { email: from }, "refused");
          }
        }
        break;
      }
    }
  } catch (err) {
    console.error("[outreach] webhook handling failed:", event.type, err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
