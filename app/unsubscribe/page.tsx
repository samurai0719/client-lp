import type { Metadata } from "next";
import { SERVICE } from "@/config/driver-company";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/check";
import { findSendByToken } from "@/lib/outreach/events";
import { getSettings } from "@/lib/outreach/settings";
import UnsubscribeButton from "./UnsubscribeButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `配信停止｜${SERVICE.name}`,
  robots: { index: false, follow: false },
};

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  return `${local.slice(0, 2)}${"*".repeat(Math.max(1, local.length - 2))}@${domain}`;
}

/** 営業メールの配信停止ページ（メール本文のURLから開く） */
export default async function UnsubscribePage({ searchParams }: { searchParams: Promise<{ t?: string }> }) {
  const { t } = await searchParams;
  let email: string | null = null;
  let already = false;
  let contact = "";

  if (isSupabaseAdminConfigured() && t) {
    const db = createAdminClient();
    const send = await findSendByToken(db, t);
    if (send) {
      email = send.email;
      already = Boolean(send.unsubscribed_at);
    }
    contact = (await getSettings(db)).sender_email;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <p className="text-sm font-bold text-slate-500">{SERVICE.name}</p>
        <h1 className="mt-1 text-xl font-bold text-slate-900">ご案内メールの配信停止</h1>
        {email ? (
          <>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              <span className="font-bold text-slate-900">{maskEmail(email)}</span>
              <br />
              宛ての{SERVICE.name}からのご案内メールを停止します。
            </p>
            <UnsubscribeButton token={t!} already={already} />
          </>
        ) : (
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            URLが無効か、有効期限が切れています。
            <br />
            お手数ですが、受信したメールに「配信停止」とご返信いただくか
            {contact ? (
              <>
                、<a className="text-blue-700 underline" href={`mailto:${contact}?subject=配信停止`}>{contact}</a> まで
              </>
            ) : null}
            ご連絡ください。
          </p>
        )}
      </div>
    </main>
  );
}
