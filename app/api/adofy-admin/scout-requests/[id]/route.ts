import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { forbiddenResponse, requireAdofyAccess } from "@/lib/auth/adofyCheck";
import { adminAddress, sendMail } from "@/lib/driverCompany/send";
import { NOTIFY_STATUSES, REQUEST_STATUSES, STATUS_LABEL, STATUS_MESSAGE, type RequestStatus } from "@/lib/driverScout/requests";
import { statusUrl, type RequestRow } from "@/lib/driverScout/requestsDb";

/**
 * 面接希望1件の更新（運営の管理画面から）。adofy 管理者だけが使える。
 *   ・対応状況、求職者の回答、双方の面接可能日時、確定した面接日時・場所、運営メモ
 *   ・依頼した企業を「契約済み」にする（contracted: true / false）
 *   ・notify: true のとき、知らせるべき状態（日程調整中・面接確定・見送り・連絡がつかない）に変わったら企業へメール。
 *     同じ状態を二度は送らない（company_notified_status で判定）。メールには求職者の氏名・連絡先を載せない。
 */

type Params = { params: Promise<{ id: string }> };

const TEXT_FIELDS = {
  candidateAnswers: ["candidate_answers", 3000],
  candidateAvailableTimes: ["candidate_available_times", 1000],
  companyAvailableTimes: ["company_available_times", 1000],
  interviewPlace: ["interview_place", 500],
  staffMemo: ["staff_memo", 5000],
} as const;

const fmt = new Intl.DateTimeFormat("ja-JP", { timeZone: "Asia/Tokyo", year: "numeric", month: "long", day: "numeric", weekday: "short", hour: "2-digit", minute: "2-digit" });

export async function PATCH(req: NextRequest, { params }: Params) {
  const supabase = await createClient();
  const admin = await requireAdofyAccess(supabase);
  if (!admin) return forbiddenResponse();

  const { id } = await params;
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "不正なリクエストです" }, { status: 400 });
  }

  const db = createAdminClient();
  const { data: current, error: getErr } = await db.from("scout_interview_requests").select("*").eq("id", id).maybeSingle();
  if (getErr) return NextResponse.json({ error: "読み込みに失敗しました" }, { status: 500 });
  if (!current) return NextResponse.json({ error: "見つかりませんでした" }, { status: 404 });
  const row = current as RequestRow;

  const patch: Record<string, unknown> = {};
  if (body.status !== undefined) {
    if (typeof body.status !== "string" || !(REQUEST_STATUSES as readonly string[]).includes(body.status)) {
      return NextResponse.json({ error: "不正な対応状況です" }, { status: 400 });
    }
    if (body.status !== row.status) {
      patch.status = body.status;
      patch.status_changed_at = new Date().toISOString();
    }
  }
  for (const [key, [col, max]] of Object.entries(TEXT_FIELDS)) {
    if (body[key] === undefined) continue;
    const v = typeof body[key] === "string" ? (body[key] as string).replace(/\r\n?/g, "\n").trim().slice(0, max) : "";
    patch[col] = v || null;
  }
  if (body.interviewAt !== undefined) {
    if (body.interviewAt === null || body.interviewAt === "") patch.interview_at = null;
    else {
      const d = new Date(String(body.interviewAt));
      if (Number.isNaN(d.getTime())) return NextResponse.json({ error: "面接日時の形式が正しくありません" }, { status: 400 });
      patch.interview_at = d.toISOString();
    }
  }
  const nextStatus = (patch.status as RequestStatus | undefined) ?? row.status;
  const nextInterviewAt = patch.interview_at !== undefined ? (patch.interview_at as string | null) : row.interview_at;
  if (nextStatus === "confirmed" && !nextInterviewAt) {
    return NextResponse.json({ error: "「面接確定」にするには、確定した面接日時を入力してください" }, { status: 400 });
  }

  if (Object.keys(patch).length > 0) {
    patch.updated_at = new Date().toISOString();
    const { error } = await db.from("scout_interview_requests").update(patch).eq("id", id);
    if (error) {
      console.error("[admin/scout-requests] update failed:", error.code, error.message);
      return NextResponse.json({ error: "更新に失敗しました" }, { status: 500 });
    }
  }

  // 企業の契約状態
  if (typeof body.contracted === "boolean" && row.company_inquiry_id) {
    const { error } = await db
      .from("driver_company_inquiries")
      .update({ contracted_at: body.contracted ? new Date().toISOString() : null })
      .eq("id", row.company_inquiry_id);
    if (error) return NextResponse.json({ error: "契約状態の更新に失敗しました（migration 016 が未適用の可能性があります）" }, { status: 500 });
  }

  // 企業へのお知らせメール（同じ状態は二度送らない。送れなかったら送ったことにしない）
  let mailed: boolean | null = null;
  if (body.notify === true && NOTIFY_STATUSES.includes(nextStatus) && row.company_notified_status !== nextStatus) {
    const lines = [
      `${row.company_name}\n${row.contact_name} 様`,
      "",
      "ドラテク ドライバー採用サービスです。",
      `求職者 No.${row.candidate_no} への面接のご希望について、状況が「${STATUS_LABEL[nextStatus]}」になりました。`,
      "",
      STATUS_MESSAGE[nextStatus],
      ...(nextStatus === "confirmed" && nextInterviewAt
        ? ["", `面接日時：${fmt.format(new Date(nextInterviewAt))}`, ...(((patch.interview_place as string | null | undefined) ?? row.interview_place) ? [`場所・方法：${(patch.interview_place as string | null | undefined) ?? row.interview_place}`] : [])]
        : []),
      "",
      "詳しくは受付状況ページをご確認ください。",
      statusUrl(row.public_token),
    ];
    mailed = await sendMail({
      to: row.email,
      subject: `【ドラテク】面接のご希望：${STATUS_LABEL[nextStatus]}（求職者 No.${row.candidate_no}）`,
      text: lines.join("\n"),
      replyTo: adminAddress(),
    });
    if (mailed) await db.from("scout_interview_requests").update({ company_notified_status: nextStatus }).eq("id", id);
  }

  return NextResponse.json({ success: true, mailed });
}
