/**
 * ドラテク管理画面（/adofy-admin/doratech）の求職者・企業・成約の型とラベル。
 * ブラウザ（編集フォーム）でも使うため、DBに触る処理は置かない。
 */
import { normalizeEmail, normalizePhone } from "@/lib/types/driverScoutApply";

export { SCOUT_JOB_TYPES as CANDIDATE_JOB_TYPES, SCOUT_LICENSES as CANDIDATE_LICENSES } from "@/lib/types/driverScoutApply";

// ── 求職者 ───────────────────────────────────────────────────

export const CANDIDATE_STATUSES = ["pending", "waiting", "paused", "hired", "withdrawn"] as const;
export type CandidateStatus = (typeof CANDIDATE_STATUSES)[number];

export const CANDIDATE_STATUS_LABEL: Record<CandidateStatus, string> = {
  pending: "確認待ち（非公開）",
  waiting: "公開中",
  paused: "一時停止",
  hired: "就職決定",
  withdrawn: "退会",
};

export const CANDIDATE_STATUS_STYLE: Record<CandidateStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  waiting: "bg-emerald-100 text-emerald-800",
  paused: "bg-slate-200 text-slate-700",
  hired: "bg-blue-100 text-blue-800",
  withdrawn: "bg-slate-100 text-slate-500",
};

export const AGE_BANDS = ["10代", "20代", "30代", "40代", "50代", "60代以上"] as const;
export const CHANGE_TIMINGS = ["すぐにでも", "1か月以内", "3か月以内", "半年以内", "良いところがあれば"] as const;

export const SOURCE_LABEL: Record<string, string> = {
  driver_lp: "求職者LP（/driver）",
  manual: "管理画面で登録",
};

export type CandidateRow = {
  id: string;
  status: CandidateStatus;
  age_band: string | null;
  desired_prefecture: string | null;
  desired_area: string | null;
  desired_salary_band: string | null;
  licenses: string[];
  experience: string | null;
  desired_job_types: string[];
  change_timing: string | null;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  current_employer: string | null;
  utm_source: string | null;
  utm_campaign: string | null;
  landing_page: string | null;
  is_test?: boolean;
  source?: string | null;
  answers?: Record<string, string> | null;
  comment?: string | null;
  staff_memo?: string | null;
  created_at: string;
  updated_at: string;
};

/** 管理画面の編集フォームの値 */
export type CandidateValues = {
  status: CandidateStatus;
  fullName: string;
  phone: string;
  email: string;
  currentEmployer: string;
  ageBand: string;
  desiredPrefecture: string;
  desiredArea: string;
  desiredSalaryBand: string;
  licenses: string[];
  experience: string;
  desiredJobTypes: string[];
  changeTiming: string;
  staffMemo: string;
};

export function candidateToValues(r: CandidateRow): CandidateValues {
  return {
    status: r.status,
    fullName: r.full_name ?? "",
    phone: r.phone ?? "",
    email: r.email ?? "",
    currentEmployer: r.current_employer ?? "",
    ageBand: r.age_band ?? "",
    desiredPrefecture: r.desired_prefecture ?? "",
    desiredArea: r.desired_area ?? "",
    desiredSalaryBand: r.desired_salary_band ?? "",
    licenses: r.licenses ?? [],
    experience: r.experience ?? "",
    desiredJobTypes: r.desired_job_types ?? [],
    changeTiming: r.change_timing ?? "",
    staffMemo: r.staff_memo ?? "",
  };
}

function text(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const s = v.replace(/\r\n?/g, "\n").replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, "").trim();
  return s ? s.slice(0, max) : null;
}

function list(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return Array.from(new Set(v.filter((x): x is string => typeof x === "string" && x.trim() !== "").map((x) => x.trim().slice(0, 40)))).slice(0, 20);
}

/**
 * 管理画面からの入力を driver_candidates の列に変換する（サーバー側で使う）。
 * 公開中（waiting）にするのは、企業に見せる匿名プロフィールが最低限そろっているときだけ。
 */
export function candidateValuesToRow(
  body: Partial<Record<keyof CandidateValues, unknown>>,
): { ok: true; row: Record<string, unknown> } | { ok: false; error: string } {
  const status = body.status;
  if (typeof status !== "string" || !(CANDIDATE_STATUSES as readonly string[]).includes(status)) {
    return { ok: false, error: "状態が正しくありません" };
  }
  const rawPhone = text(body.phone, 40);
  const phone = rawPhone ? normalizePhone(rawPhone) : null;
  if (rawPhone && !phone) return { ok: false, error: "電話番号の形式が正しくありません" };
  const rawEmail = text(body.email, 200);
  const email = rawEmail ? normalizeEmail(rawEmail) : null;
  if (rawEmail && !email) return { ok: false, error: "メールアドレスの形式が正しくありません" };

  const row = {
    status,
    full_name: text(body.fullName, 100),
    phone,
    email,
    current_employer: text(body.currentEmployer, 200),
    age_band: text(body.ageBand, 20),
    desired_prefecture: text(body.desiredPrefecture, 10),
    desired_area: text(body.desiredArea, 100),
    desired_salary_band: text(body.desiredSalaryBand, 50),
    licenses: list(body.licenses),
    experience: text(body.experience, 200),
    desired_job_types: list(body.desiredJobTypes),
    change_timing: text(body.changeTiming, 50),
    staff_memo: text(body.staffMemo, 5000),
  };

  if (!row.full_name && !row.phone && !row.email) {
    return { ok: false, error: "氏名・電話番号・メールのどれかを入力してください" };
  }
  if (status === "waiting") {
    const missing = [
      !row.age_band && "年代",
      !row.desired_prefecture && "希望勤務地（都道府県）",
      row.licenses.length === 0 && "免許",
      !row.experience && "経験",
    ].filter(Boolean);
    if (missing.length > 0) return { ok: false, error: `公開するには ${missing.join("・")} を入力してください` };
  }
  return { ok: true, row };
}

// ── 企業（申込み・問い合わせ） ─────────────────────────────────

export const COMPANY_STATUSES = ["new", "contacted", "in_progress", "listed", "won", "lost", "spam"] as const;
export type CompanyStatus = (typeof COMPANY_STATUSES)[number];

export const COMPANY_STATUS_LABEL: Record<CompanyStatus, string> = {
  new: "新規",
  contacted: "連絡済み",
  in_progress: "対応中",
  listed: "利用中",
  won: "採用決定あり",
  lost: "見送り",
  spam: "いたずら・対象外",
};

export const COMPANY_STATUS_STYLE: Record<CompanyStatus, string> = {
  new: "bg-amber-100 text-amber-800",
  contacted: "bg-blue-100 text-blue-800",
  in_progress: "bg-indigo-100 text-indigo-800",
  listed: "bg-emerald-100 text-emerald-800",
  won: "bg-teal-100 text-teal-800",
  lost: "bg-slate-200 text-slate-700",
  spam: "bg-slate-100 text-slate-500",
};

export const INQUIRY_TYPE_LABEL: Record<string, string> = {
  profile_search: "求職者検索の申込み",
  job_posting: "求人掲載の問い合わせ",
  interview_request: "面接希望から登録",
};

export type CompanyInquiryRow = {
  id: string;
  inquiry_type?: string | null;
  company_name: string;
  contact_name: string;
  phone: string;
  email: string;
  prefecture: string;
  address_city?: string | null;
  job_types: string[];
  job_type_other: string | null;
  licenses?: string[] | null;
  hiring_count: string | null;
  hiring_timing?: string | null;
  fleet_description: string | null;
  message: string | null;
  utm_source: string | null;
  utm_campaign: string | null;
  landing_page: string | null;
  status: CompanyStatus;
  contracted_at?: string | null;
  staff_memo?: string | null;
  created_at: string;
};

// ── 採用結果・成功報酬 ────────────────────────────────────────

/** 成功報酬の料率（scout LP の「採用決定時 想定年収の10%」） */
export const FEE_RATE = 0.1;

export const OUTCOME_LABEL: Record<string, string> = {
  hired: "採用決定",
  not_hired: "不採用・辞退",
};

export type BillingState = "none" | "unbilled" | "invoiced" | "paid";

export const BILLING_LABEL: Record<BillingState, string> = {
  none: "—",
  unbilled: "未請求",
  invoiced: "入金待ち",
  paid: "入金済み",
};

export const BILLING_STYLE: Record<BillingState, string> = {
  none: "bg-slate-100 text-slate-500",
  unbilled: "bg-rose-100 text-rose-800",
  invoiced: "bg-amber-100 text-amber-800",
  paid: "bg-emerald-100 text-emerald-800",
};

export function billingState(r: { outcome?: string | null; invoiced_at?: string | null; paid_at?: string | null }): BillingState {
  if (r.outcome !== "hired") return "none";
  if (r.paid_at) return "paid";
  if (r.invoiced_at) return "invoiced";
  return "unbilled";
}

export function yen(n: number | null | undefined): string {
  return typeof n === "number" ? `${n.toLocaleString("ja-JP")}円` : "—";
}

/** 表・列がまだ無い（migration 未適用）ときのエラーか */
export function isMissingColumn(code: string | undefined): boolean {
  return code === "42703" || code === "PGRST204" || code === "42P01" || code === "PGRST205";
}

export const MIGRATION_017_MESSAGE =
  "管理用の列がまだありません。Supabase の SQL Editor で supabase/migrations/017_doratech_admin.sql を実行してください。";
