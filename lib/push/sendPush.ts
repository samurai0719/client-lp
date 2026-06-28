import webpush from "web-push";
import { createAdminClient } from "@/lib/supabase/admin";

function getVapidKeys() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT ?? "mailto:admin@takanagakensetu.com";
  return { publicKey, privateKey, subject };
}

interface PushPayload {
  title: string;
  body: string;
  url?: string;
  badge?: number;
}

export async function sendPushToUser(userId: string, payload: PushPayload) {
  const { publicKey, privateKey, subject } = getVapidKeys();
  if (!publicKey || !privateKey) return;

  webpush.setVapidDetails(subject, publicKey, privateKey);

  const db = createAdminClient();
  const { data: subs } = await db
    .from("push_subscriptions")
    .select("id, endpoint, p256dh, auth")
    .eq("user_id", userId)
    .eq("is_active", true);

  if (!subs?.length) return;

  await Promise.allSettled(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          JSON.stringify(payload)
        );
      } catch (err: unknown) {
        const status = (err as { statusCode?: number }).statusCode;
        if (status === 410 || status === 404) {
          await db.from("push_subscriptions").update({ is_active: false }).eq("id", sub.id);
        }
        console.error("[push] send failed for subscription");
      }
    })
  );
}

export async function sendPushToAll(payload: PushPayload) {
  const { publicKey, privateKey, subject } = getVapidKeys();
  if (!publicKey || !privateKey) return;

  webpush.setVapidDetails(subject, publicKey, privateKey);

  const db = createAdminClient();
  const { data: subs } = await db
    .from("push_subscriptions")
    .select("id, user_id, endpoint, p256dh, auth")
    .eq("is_active", true);

  if (!subs?.length) return;

  await Promise.allSettled(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          JSON.stringify(payload)
        );
      } catch (err: unknown) {
        const status = (err as { statusCode?: number }).statusCode;
        if (status === 410 || status === 404) {
          await db.from("push_subscriptions").update({ is_active: false }).eq("id", sub.id);
        }
        console.error("[push] send failed");
      }
    })
  );
}
