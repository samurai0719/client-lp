import { NextResponse, after } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/check";
import { GENERIC_ERROR, TABLE, clientIp, logEmail, rateLimited, sameOrigin } from "@/lib/hpDesign/server";
import { adminAddress, sendPurchaseNotice, type RequestForMail } from "@/lib/hpDesign/mail";

/**
 * デザイン送付メールの「このデザインで購入を希望する」から届く意思表示。
 *
 * 契約や決済ではない。購入希望日時を記録し、運営者へ通知するだけ。
 * メールのリンク先（GET）では記録せず、ページ上のボタン（POST）でのみ記録する
 * （メールソフトのリンク先読み込みで勝手に記録されないようにするため）。
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: GENERIC_ERROR }, { status: 403 });
  if (rateLimited(`purchase:${clientIp(req)}`, 10, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "しばらく時間をおいてからお試しください。" }, { status: 429 });
  }

  let body: { token?: unknown; message?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });
  }
  const token = typeof body.token === "string" ? body.token.trim() : "";
  if (!/^[A-Za-z0-9_-]{20,64}$/.test(token)) {
    return NextResponse.json({ error: "リンクが正しくありません。メールのリンクから開き直してください。" }, { status: 400 });
  }
  const message = typeof body.message === "string" ? body.message.trim().slice(0, 1000) : "";

  if (!isSupabaseAdminConfigured()) return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  const db = createAdminClient();

  // 初回だけ記録する（2回目以降は記録済みとして成功を返し、通知も送らない）
  const { data, error } = await db
    .from(TABLE)
    .update({ purchase_requested_at: new Date().toISOString(), purchase_message: message || null })
    .eq("public_token", token)
    .is("purchase_requested_at", null)
    .select("*")
    .maybeSingle();

  if (error) {
    console.error("[free-design/purchase] update failed:", error.code);
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  }

  if (!data) {
    const { data: exists } = await db.from(TABLE).select("id").eq("public_token", token).maybeSingle();
    if (!exists) {
      return NextResponse.json({ error: "リンクが正しくありません。メールのリンクから開き直してください。" }, { status: 404 });
    }
    return NextResponse.json({ success: true, already: true });
  }

  const r = data as RequestForMail;
  after(async () => {
    const res = await sendPurchaseNotice(r, message || null);
    await logEmail(createAdminClient(), {
      request_id: r.id, kind: "purchase_notice", to_email: adminAddress(),
      status: res.ok ? "sent" : "failed",
      provider_id: res.ok ? res.id : null, error: res.ok ? null : res.error,
    });
  });

  return NextResponse.json({ success: true });
}
