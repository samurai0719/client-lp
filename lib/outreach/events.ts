import type { SupabaseClient } from "@supabase/supabase-js";
import { TABLES } from "./constants";
import type { SendRow } from "./queue";
import { addSuppression } from "./suppress";

/**
 * 送信後に起きた出来事（配信成功・バウンス・開封・クリック・返信・配信停止）の記録。
 * Webhook・計測URL・配信停止ページ・管理画面の手動操作から共通で使う。
 */

const TOKEN = /^[0-9a-f]{64}$/;

export function isValidToken(t: string | null | undefined): t is string {
  return Boolean(t && TOKEN.test(t));
}

export async function findSendByToken(db: SupabaseClient, token: string): Promise<SendRow | null> {
  if (!isValidToken(token)) return null;
  const { data } = await db.from(TABLES.sends).select("*").eq("token", token).maybeSingle();
  return (data as SendRow) ?? null;
}

async function findSendByMessageId(db: SupabaseClient, messageId: string): Promise<SendRow | null> {
  const { data } = await db.from(TABLES.sends).select("*").eq("provider_message_id", messageId).maybeSingle();
  return (data as SendRow) ?? null;
}

const nowIso = () => new Date().toISOString();

/** 未送信・送信待ちの同じアドレス宛てを止める（配信停止・バウンス後に残りを送らない） */
async function cancelPending(db: SupabaseClient, email: string, reason: string) {
  await db
    .from(TABLES.sends)
    .update({ status: "skipped", error_message: reason })
    .eq("email", email.toLowerCase())
    .eq("status", "queued");
}

export async function markUnsubscribed(
  db: SupabaseClient,
  target: { send?: SendRow | null; email?: string; companyId?: string },
  reason: "unsubscribe" | "refused" | "complaint" = "unsubscribe"
): Promise<void> {
  const t = nowIso();
  const email = (target.send?.email ?? target.email ?? "").toLowerCase();
  if (email) {
    await addSuppression(db, email, reason, target.send ? `send:${target.send.id}` : null);
    await cancelPending(db, email, "配信停止済み");
  }
  if (target.send) {
    await db
      .from(TABLES.sends)
      .update(reason === "complaint" ? { complained_at: t, unsubscribed_at: t } : { unsubscribed_at: t })
      .eq("id", target.send.id)
      .is("unsubscribed_at", null);
  }
  const companyId = target.send?.company_id ?? target.companyId;
  const q = db.from(TABLES.companies).update({ outreach_status: "unsubscribed", unsubscribed_at: t, updated_at: t });
  if (companyId) await q.eq("id", companyId);
  else if (email) await q.eq("email", email);
}

export async function markDelivered(db: SupabaseClient, messageId: string, at?: string) {
  const s = await findSendByMessageId(db, messageId);
  if (!s) return;
  const t = at ?? nowIso();
  await db.from(TABLES.sends).update({ status: "delivered", delivered_at: t }).eq("id", s.id).in("status", ["sent", "sending"]);
  await db
    .from(TABLES.companies)
    .update({ outreach_status: "delivered", updated_at: nowIso() })
    .eq("id", s.company_id)
    .in("outreach_status", ["queued", "sent"]);
}

/** 恒久的に届かないアドレス（ハードバウンス）。以後の送信対象から外す */
export async function markBounced(db: SupabaseClient, messageId: string, info: { type?: string; message?: string }) {
  const s = await findSendByMessageId(db, messageId);
  if (!s) return;
  const t = nowIso();
  await db
    .from(TABLES.sends)
    .update({ status: "bounced", bounced_at: t, bounce_type: info.type ?? "Permanent", error_message: info.message?.slice(0, 300) ?? null })
    .eq("id", s.id);
  await addSuppression(db, s.email, "hard_bounce", info.message ?? null);
  await cancelPending(db, s.email, "ハードバウンス済み");
  await db
    .from(TABLES.companies)
    .update({ outreach_status: "bounced", bounced_at: t, last_error: info.message?.slice(0, 300) ?? "バウンス", updated_at: t })
    .eq("id", s.company_id);
}

export async function markFailed(db: SupabaseClient, messageId: string, reason: string) {
  const s = await findSendByMessageId(db, messageId);
  if (!s) return;
  await db.from(TABLES.sends).update({ status: "failed", error_message: reason.slice(0, 300) }).eq("id", s.id);
  await db
    .from(TABLES.companies)
    .update({ outreach_status: "error", last_error: reason.slice(0, 300), updated_at: nowIso() })
    .eq("id", s.company_id)
    .in("outreach_status", ["queued", "sent", "delivered"]);
}

/** 開封（画像の読み込みで判定するため参考値。画像を表示しない受信環境では記録されない） */
export async function markOpened(db: SupabaseClient, send: SendRow) {
  if (send.opened_at) return;
  const t = nowIso();
  await db.from(TABLES.sends).update({ opened_at: t }).eq("id", send.id).is("opened_at", null);
  await db.from(TABLES.companies).update({ opened_at: t }).eq("id", send.company_id).is("opened_at", null);
}

export async function markClicked(db: SupabaseClient, send: SendRow) {
  const t = nowIso();
  await db
    .from(TABLES.sends)
    .update({ clicked_at: send.clicked_at ?? t, click_count: (send.click_count ?? 0) + 1, opened_at: send.opened_at ?? t })
    .eq("id", send.id);
  await db.from(TABLES.companies).update({ clicked_at: t, updated_at: t }).eq("id", send.company_id);
}

/** 返信あり（受信Webhook または管理画面の手動操作）。返信した企業には以後一斉送信しない */
export async function markReplied(db: SupabaseClient, target: { send?: SendRow | null; fromEmail?: string; companyId?: string }) {
  const t = nowIso();
  let send = target.send ?? null;
  if (!send && (target.fromEmail || target.companyId)) {
    let q = db.from(TABLES.sends).select("*").not("sent_at", "is", null).order("sent_at", { ascending: false }).limit(1);
    q = target.companyId ? q.eq("company_id", target.companyId) : q.eq("email", target.fromEmail!.toLowerCase());
    const { data } = await q;
    send = ((data ?? []) as SendRow[])[0] ?? null;
  }
  if (send) {
    await db.from(TABLES.sends).update({ replied_at: t }).eq("id", send.id).is("replied_at", null);
    await cancelPending(db, send.email, "返信あり");
  }
  const companyId = send?.company_id ?? target.companyId;
  if (companyId) {
    await db
      .from(TABLES.companies)
      .update({ outreach_status: "replied", replied_at: t, updated_at: t })
      .eq("id", companyId)
      .neq("outreach_status", "unsubscribed");
  }
  return Boolean(send || companyId);
}
