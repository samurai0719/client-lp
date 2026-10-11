import { NextResponse, after } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/check";
import { UPLOAD_BUCKET } from "@/lib/hpDesign/options";
import { validateHpDesign, type HpDesignInput } from "@/lib/hpDesign/validate";
import {
  GENERIC_ERROR, TABLE, clientIp, logEmail, newPublicToken, rateLimited, sameOrigin,
} from "@/lib/hpDesign/server";
import { adminAddress, sendAdminNotice, sendCustomerAck, type RequestForMail } from "@/lib/hpDesign/mail";

/**
 * 無料ホームページデザインの申し込み受付。
 *
 * ・ブラウザから Supabase へは直接書き込ませず、このAPIが service role で保存する
 * ・同じ submissionId の再送信（ボタン連打・通信の再試行）は1件にまとめ、メールも送り直さない
 * ・メールは応答を返した後に送る（送信失敗でも受付は成立。管理画面に失敗が記録される）
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    if (!sameOrigin(req)) return NextResponse.json({ error: GENERIC_ERROR }, { status: 403 });

    if (rateLimited(`submit:${clientIp(req)}`, 5, 10 * 60 * 1000)) {
      return NextResponse.json(
        { error: "送信回数の上限に達しました。しばらく時間をおいてからお試しください。" },
        { status: 429 }
      );
    }

    let body: HpDesignInput;
    try {
      body = (await req.json()) as HpDesignInput;
    } catch {
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });
    }

    // ハニーポット・極端に速い送信はボットとみなす。悟らせないため成功に見せて保存しない
    if (typeof body.website2 === "string" && body.website2.trim() !== "") {
      return NextResponse.json({ success: true });
    }
    if (typeof body.elapsedMs === "number" && body.elapsedMs >= 0 && body.elapsedMs < 5000) {
      return NextResponse.json({ success: true });
    }

    const result = validateHpDesign(body);
    if (!result.ok) return NextResponse.json({ error: result.message }, { status: 400 });

    if (!isSupabaseAdminConfigured()) {
      console.error("[free-design] Supabase admin is not configured");
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
    }

    const db = createAdminClient();
    const row = result.row;

    // アップロード済みと申告されたファイルが、本当にこの申し込みのフォルダにあるかを確かめる
    if (row.uploaded_files.length > 0) {
      const folder = `pending/${row.client_submission_id}`;
      const { data: objects } = await db.storage.from(UPLOAD_BUCKET).list(folder, { limit: 100 });
      const actual = new Map((objects ?? []).map((o) => [`${folder}/${o.name}`, o]));
      row.uploaded_files = row.uploaded_files
        .filter((f) => actual.has(f.path))
        .map((f) => {
          const meta = actual.get(f.path)?.metadata as { size?: number; mimetype?: string } | undefined;
          return { ...f, size: meta?.size ?? f.size, type: meta?.mimetype ?? f.type };
        });
    }

    const { data, error } = await db
      .from(TABLE)
      .insert({ ...row, public_token: newPublicToken() })
      .select("*")
      .single();

    if (error) {
      // 同じ申し込みの再送信。すでに受け付けているので成功を返す（メールは送り直さない）
      if (error.code === "23505") return NextResponse.json({ success: true, duplicate: true });
      console.error("[free-design] insert failed:", error.code, error.message);
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
    }

    const saved = data as RequestForMail;
    after(() => sendSubmissionMails(saved));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[free-design] unexpected error:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  }
}

async function sendSubmissionMails(r: RequestForMail): Promise<void> {
  const db = createAdminClient();
  const [ack, notice] = await Promise.all([sendCustomerAck(r), sendAdminNotice(r)]);

  await db
    .from(TABLE)
    .update({
      customer_ack_status: ack.ok ? "sent" : "failed",
      admin_notice_status: notice.ok ? "sent" : "failed",
    })
    .eq("id", r.id);

  await logEmail(db, {
    request_id: r.id, kind: "ack", to_email: r.email,
    status: ack.ok ? "sent" : "failed",
    provider_id: ack.ok ? ack.id : null, error: ack.ok ? null : ack.error,
  });
  await logEmail(db, {
    request_id: r.id, kind: "admin_notice", to_email: adminAddress(),
    status: notice.ok ? "sent" : "failed",
    provider_id: notice.ok ? notice.id : null, error: notice.ok ? null : notice.error,
  });

  if (!ack.ok) console.error("[free-design] customer ack failed:", ack.error);
  if (!notice.ok) console.error("[free-design] admin notice failed:", notice.error);
}
