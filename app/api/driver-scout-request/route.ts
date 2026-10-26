import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/check";
import { adminAddress, sendMail } from "@/lib/driverCompany/send";
import { validateRequest, type RequestInput, type RequestValues } from "@/lib/driverScout/requests";
import {
  createCompany,
  findCompanyByEmail,
  findPublicCandidate,
  isMissingSchema,
  newToken,
  statusUrl,
} from "@/lib/driverScout/requestsDb";

/**
 * 「この方と面接を希望する」の受付API（匿名プロフィール一覧のライトボックスから呼ばれる）。
 *
 *   1. 入力チェック・送信元の確認・連投の制限・ボット除け
 *   2. 求職者がいま公開中か確認（非公開・取り下げの人には依頼できない）
 *   3. 同じメールアドレスの企業があれば結びつけ、なければ企業の登録を作る（済んだ手続きを繰り返させない）
 *   4. 依頼を保存（同じ企業から同じ求職者への依頼は1件まで）
 *   5. 運営へ通知メール、企業へ受付メール（受付状況ページのURL付き）
 *
 * 依頼を保存できなかった場合は、送れたように見せかけない（500 を返す）。
 * migration 016 が未適用で表が無い場合だけ、運営への通知メールが届けば受付成立とする。
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 8;
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  }
  return recent.length > MAX_PER_WINDOW;
}

function clientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for") ?? "";
  return fwd.split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
}

function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/** 運営の管理画面があるドメイン（adofy の管理画面） */
const ADMIN_ORIGIN = "https://www.adofy-site.com";

const GENERIC_ERROR = "送信に失敗しました。お手数ですが、時間をおいて再度お試しください。";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: GENERIC_ERROR }, { status: 403 });
  if (rateLimited(clientKey(req))) {
    return NextResponse.json({ error: "短時間に送信が続いたため、受付を一時停止しています。時間をおいて再度お試しください。" }, { status: 429 });
  }

  let body: RequestInput;
  try {
    body = (await req.json()) as RequestInput;
  } catch {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });
  }
  // ボット除け：人間には見えない欄に値がある／表示から極端に短い送信は、受け付けたふりをして保存しない
  if ((typeof body.websiteUrl === "string" && body.websiteUrl.trim() !== "") || (typeof body.elapsedMs === "number" && body.elapsedMs >= 0 && body.elapsedMs < 2000)) {
    return NextResponse.json({ ok: true });
  }

  const checked = validateRequest(body);
  if (!checked.ok) return NextResponse.json({ error: "入力内容をご確認ください。", errors: checked.errors }, { status: 400 });
  const v = checked.values;

  if (!isSupabaseAdminConfigured()) return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  const db = createAdminClient();

  const candidate = await findPublicCandidate(db, v.candidateNo);
  if (!candidate) {
    return NextResponse.json(
      { error: "この求職者は現在公開されていないため、面接の希望を受け付けられません。一覧を開き直してください。" },
      { status: 404 },
    );
  }

  const existing = await findCompanyByEmail(db, v.email);
  const companyId = existing?.id ?? (await createCompany(db, v));
  const contracted = existing?.contracted ?? false;

  const token = newToken();
  const { error } = await db.from("scout_interview_requests").insert({
    public_token: token,
    candidate_id: candidate.id,
    candidate_no: v.candidateNo,
    company_inquiry_id: companyId,
    company_name: v.companyName,
    contact_name: v.contactName,
    phone: v.phone,
    email: v.email,
    prefecture: v.prefecture,
    city: v.city,
    job_description: v.jobDescription,
    questions: v.questions,
    company_available_times: v.availableTimes,
    status: "received",
    status_changed_at: new Date().toISOString(),
  });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "この求職者には、すでに面接の希望を受け付けています。受付メールに記載の受付状況ページをご確認ください。", duplicate: true },
        { status: 409 },
      );
    }
    console.error("[scout-request] insert failed:", error.code, error.message);
    // 表が未作成（migration 016 未適用）のときだけ、運営への通知メールで受け付ける
    if (isMissingSchema(error.code)) {
      const mailed = await notifyAdmin(v, existing !== null, contracted, null);
      if (mailed) return NextResponse.json({ ok: true, contracted, existingCompany: existing !== null, statusUrl: null });
    }
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  }

  // 通知の失敗で受付を失敗にはしない（依頼は保存済み）
  await Promise.allSettled([notifyAdmin(v, existing !== null, contracted, token), notifyCompany(v, contracted, token)]);

  return NextResponse.json({ ok: true, contracted, existingCompany: existing !== null, statusUrl: statusUrl(token) });
}

/** 運営への通知（既存の運営向け通知メールと同じ送信先） */
async function notifyAdmin(v: RequestValues, existingCompany: boolean, contracted: boolean, token: string | null): Promise<boolean> {
  const to = adminAddress();
  if (!to) {
    console.error("[scout-request] notification address is not set");
    return false;
  }
  const text = [
    "【ドライバー採用サービス】面接の希望（連絡・日程調整の依頼）が届きました。",
    token ? "" : "\n※ 依頼の保存先（migration 016）が未作成のため、このメールの内容を控えてください。\n",
    `★ 対象の求職者：No.${v.candidateNo}`,
    `企業の状態：${contracted ? "契約済み" : existingCompany ? "登録済み・未契約（サービス説明・契約の案内が必要）" : "新規登録（サービス説明・契約の案内が必要）"}`,
    "",
    `会社名：${v.companyName}`,
    `担当者名：${v.contactName}`,
    `電話番号：${v.phone}`,
    `メールアドレス：${v.email}`,
    `所在地：${v.prefecture}${v.city}`,
    "",
    `仕事内容：\n${v.jobDescription}`,
    "",
    `求職者に確認したいこと：${v.questions ? `\n${v.questions}` : "（記入なし）"}`,
    `企業の面接可能日時：${v.availableTimes ? `\n${v.availableTimes}` : "（記入なし）"}`,
    "",
    `管理画面：${ADMIN_ORIGIN}/adofy-admin/doratech/interviews`,
    token ? `企業向けの受付状況ページ：${statusUrl(token)}` : "",
  ].join("\n");
  return sendMail({ to, subject: `【面接希望】${v.companyName} 様 → 求職者 No.${v.candidateNo}`, text, replyTo: v.email });
}

/** 企業への受付メール。求職者の氏名・連絡先は載せない */
async function notifyCompany(v: RequestValues, contracted: boolean, token: string): Promise<boolean> {
  const text = [
    `${v.companyName}\n${v.contactName} 様`,
    "",
    "ドラテク ドライバー採用サービスです。",
    `求職者 No.${v.candidateNo} への面接のご希望を受け付けました。`,
    "",
    contracted
      ? "ドラテクが求職者へ連絡し、会社名・仕事内容をお伝えして、面接の希望とご指定の確認事項をお聞きします。確認後にご連絡します。"
      : "担当者より、サービス内容と料金をご説明するためにご連絡します。ご契約のあと、ドラテクが求職者へ連絡し、面接の希望とご指定の確認事項をお聞きします。",
    "現時点では面接は確定していません。求職者のご意向や日程によっては、面接に進まない場合もあります。",
    "",
    "受付状況・面接日時は、次のページでご確認いただけます（このURLは他の方に共有しないでください）。",
    statusUrl(token),
  ].join("\n");
  return sendMail({ to: v.email, subject: `【ドラテク】面接のご希望を受け付けました（求職者 No.${v.candidateNo}）`, text, replyTo: adminAddress() });
}
