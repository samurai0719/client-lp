import { createHash } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdofyAccess, forbiddenResponse } from "@/lib/auth/adofyCheck";
import { normalizeUrl } from "@/lib/hpDesign/validate";
import { TABLE, logEmail } from "@/lib/hpDesign/server";
import { mailConfigured, sendDesignEmail, type RequestForMail } from "@/lib/hpDesign/mail";

/**
 * 完成したデザインのプレビューURLをお客様へメールで送る。
 *
 * 重複送信防止：
 *  1. 送信前に design_email_status を「sending」へ条件付きで切り替え、取れた1リクエストだけが送る
 *     （ボタン連打・複数タブからの同時送信でも1通）
 *  2. Resend の idempotencyKey に「回数＋内容」を入れ、通信の再試行でも同じ回は1通にまとめる
 *  3. 送付済みの再送は、画面で確認したうえで resend: true を付けたときだけ受け付ける
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

type Params = { params: Promise<{ id: string }> };

// 「sending」のまま止まった場合（関数のタイムアウト等）に再送できるようにするまでの時間
const STALE_MS = 2 * 60 * 1000;

export async function POST(req: NextRequest, { params }: Params) {
  const supabase = await createClient();
  const admin = await requireAdofyAccess(supabase);
  if (!admin) return forbiddenResponse();

  const { id } = await params;
  let body: { previewUrl?: unknown; message?: unknown; resend?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "不正なリクエストです" }, { status: 400 });
  }

  const previewUrl = typeof body.previewUrl === "string" ? normalizeUrl(body.previewUrl) : null;
  if (!previewUrl) return NextResponse.json({ error: "プレビューURLを正しく入力してください" }, { status: 400 });
  const message = typeof body.message === "string" ? body.message.trim().slice(0, 1000) : "";
  if (!mailConfigured()) {
    return NextResponse.json({ error: "メール送信の設定（RESEND_API_KEY）がありません" }, { status: 500 });
  }

  const db = createAdminClient();
  const allowed = body.resend === true ? ["none", "failed", "sent"] : ["none", "failed"];
  const staleIso = new Date(Date.now() - STALE_MS).toISOString();

  // 送信権の取得（条件に合うときだけ sending に切り替わる）
  const { data: claimed, error: claimError } = await db
    .from(TABLE)
    .update({ design_email_status: "sending", design_email_locked_at: new Date().toISOString(), preview_url: previewUrl })
    .eq("id", id)
    .or(`design_email_status.in.(${allowed.join(",")}),and(design_email_status.eq.sending,design_email_locked_at.lt.${staleIso})`)
    .select("*")
    .maybeSingle();

  if (claimError) {
    console.error("[admin/hp-design/send] claim failed:", claimError.code, claimError.message);
    return NextResponse.json({ error: "送信の準備に失敗しました" }, { status: 500 });
  }
  if (!claimed) {
    return NextResponse.json(
      { error: "送信処理中か、すでに送付済みです。画面を再読み込みして状況を確認してください。" },
      { status: 409 }
    );
  }

  const r = claimed as RequestForMail & { design_email_count: number; status: string };
  const attempt = `${r.design_email_count + 1}-${createHash("sha256").update(`${previewUrl}\n${message}`).digest("hex").slice(0, 12)}`;
  const result = await sendDesignEmail(r, previewUrl, message, attempt);

  if (!result.ok) {
    await db
      .from(TABLE)
      .update({ design_email_status: "failed", design_email_locked_at: null, design_email_error: result.error.slice(0, 300) })
      .eq("id", id);
    await logEmail(db, { request_id: id, kind: "design", to_email: r.email, status: "failed", error: result.error });
    console.error("[admin/hp-design/send] send failed:", result.error);
    return NextResponse.json({ error: "メールの送信に失敗しました。もう一度お試しください。" }, { status: 502 });
  }

  // 送付済みへ。購入済み・見送りなど、送付より先の状態は巻き戻さない
  const advance = ["new", "in_production", "design_ready"].includes(r.status);
  await db
    .from(TABLE)
    .update({
      design_email_status: "sent",
      design_email_locked_at: null,
      design_email_sent_at: new Date().toISOString(),
      design_email_count: r.design_email_count + 1,
      design_email_error: null,
      ...(advance ? { status: "sent" } : {}),
    })
    .eq("id", id);
  await logEmail(db, { request_id: id, kind: "design", to_email: r.email, status: "sent", provider_id: result.id });

  return NextResponse.json({ success: true });
}
