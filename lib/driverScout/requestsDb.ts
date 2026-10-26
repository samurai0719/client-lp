import { randomBytes } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { SCOUT_PATHS } from "@/components/driver-scout/content";
import { SITE_URL } from "@/components/driver-scout/seo";
import type { RequestStatus, RequestValues } from "./requests";

/**
 * 面接希望（scout_interview_requests）のDB処理。サーバー専用（service role のクライアントを受け取る）。
 */

export type RequestRow = {
  id: string;
  public_token: string;
  candidate_id: string;
  candidate_no: string;
  company_inquiry_id: string | null;
  company_name: string;
  contact_name: string;
  phone: string;
  email: string;
  prefecture: string | null;
  city: string | null;
  job_description: string;
  questions: string | null;
  company_available_times: string | null;
  status: RequestStatus;
  candidate_answers: string | null;
  candidate_available_times: string | null;
  interview_at: string | null;
  interview_place: string | null;
  staff_memo: string | null;
  status_changed_at: string | null;
  company_notified_status: string | null;
  created_at: string;
  updated_at: string;
};

/** 表・列がまだ無い（migration 016 未適用）ときのエラーか */
export function isMissingSchema(code: string | undefined): boolean {
  return code === "42P01" || code === "PGRST205" || code === "42703" || code === "PGRST204";
}

/**
 * テスト用の求職者を出してよいか（ローカル開発で DRIVER_SHOW_TEST_CANDIDATES=1 のときだけ）。
 * テスト用の求職者は is_test = true・status = 'paused' で登録しておく（本番の一覧・待機人数には出ない）。
 */
export function showTestCandidates(): boolean {
  return process.env.NODE_ENV !== "production" && process.env.DRIVER_SHOW_TEST_CANDIDATES === "1";
}

/** 受付状況ページのURL（企業へのメールに載せる） */
export function statusUrl(token: string): string {
  return `${SITE_URL}${SCOUT_PATHS.requests}/${token}`;
}

export function newToken(): string {
  return randomBytes(24).toString("hex");
}

/**
 * 候補者番号（uuid の先頭6文字）から、いま公開中（waiting）の求職者を探す。
 * 非公開・取り下げ・テスト用（本番）は見つからない扱いにする。2人以上当たったら安全側で見つからない扱い。
 */
export async function findPublicCandidate(db: SupabaseClient, no: string): Promise<{ id: string } | null> {
  const lo = `${no.toLowerCase()}00-0000-0000-0000-000000000000`;
  const hi = `${no.toLowerCase()}ff-ffff-ffff-ffff-ffffffffffff`;
  let q = db.from("driver_candidates").select("id, is_test").gte("id", lo).lte("id", hi).limit(2);
  // ローカルの動作確認では、テスト用の求職者（is_test・一時停止中）も対象にする。本番では公開中（waiting）の実在の人だけ
  q = showTestCandidates() ? q.or("status.eq.waiting,and(is_test.eq.true,status.eq.paused)") : q.eq("status", "waiting").eq("is_test", false);
  const { data, error } = await q;
  if (error) {
    console.error("[scout-request] candidate lookup failed:", error.code, error.message);
    return null;
  }
  if (!data || data.length !== 1) return null;
  return { id: (data[0] as { id: string }).id };
}

/** 同じメールアドレスで登録済みの企業（いちばん新しいもの）。契約済みかどうかも返す */
export async function findCompanyByEmail(
  db: SupabaseClient,
  email: string,
): Promise<{ id: string; contracted: boolean } | null> {
  const { data, error } = await db
    .from("driver_company_inquiries")
    .select("id, contracted_at")
    .ilike("email", email)
    .order("created_at", { ascending: false })
    .limit(1);
  if (error) {
    // contracted_at 列が未作成（migration 016 未適用）の場合は、契約状態なしで探し直す
    if (isMissingSchema(error.code)) {
      const retry = await db.from("driver_company_inquiries").select("id").ilike("email", email).order("created_at", { ascending: false }).limit(1);
      const row = retry.data?.[0] as { id: string } | undefined;
      return row ? { id: row.id, contracted: false } : null;
    }
    console.error("[scout-request] company lookup failed:", error.code, error.message);
    return null;
  }
  const row = data?.[0] as { id: string; contracted_at: string | null } | undefined;
  return row ? { id: row.id, contracted: Boolean(row.contracted_at) } : null;
}

/** はじめての企業なら、企業の登録（driver_company_inquiries）を作る */
export async function createCompany(db: SupabaseClient, v: RequestValues): Promise<string | null> {
  const { data, error } = await db
    .from("driver_company_inquiries")
    .insert({
      company_name: v.companyName,
      contact_name: v.contactName,
      phone: v.phone,
      email: v.email,
      prefecture: v.prefecture,
      address_city: v.city,
      inquiry_type: "interview_request",
      consented_at: new Date().toISOString(),
      status: "new",
      message: "【面接希望から登録】",
    })
    .select("id")
    .single();
  if (error) {
    console.error("[scout-request] company insert failed:", error.code, error.message);
    return null;
  }
  return (data as { id: string }).id;
}
