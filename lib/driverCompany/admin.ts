/**
 * ドラテク 企業登録・求人登録の管理画面（/adofy-admin/doratech）用の型とラベル。
 * データは /company/register から保存される driver_companies / driver_job_postings（migration 008）。
 */

export const POSTING_STATUS_LABEL: Record<string, string> = {
  pending_verification: "メール認証待ち",
  published: "掲載中",
  stopped: "停止中",
  expired: "掲載終了",
  rejected: "非掲載",
};

export const POSTING_STATUS_STYLE: Record<string, string> = {
  pending_verification: "bg-amber-100 text-amber-800",
  published: "bg-emerald-100 text-emerald-800",
  stopped: "bg-slate-200 text-slate-700",
  expired: "bg-slate-200 text-slate-600",
  rejected: "bg-rose-100 text-rose-700",
};

export type CompanyRow = {
  id: string;
  company_name: string;
  contact_name: string;
  notification_email: string;
  phone: string;
  address_prefecture: string;
  address: string;
  website_url: string | null;
  email_verified_at: string | null;
  status: string;
  created_at: string;
  [key: string]: unknown;
};

export type PostingRow = {
  id: string;
  company_id: string;
  job_title: string;
  job_types: string[];
  hiring_count: string;
  work_prefecture: string;
  work_address: string;
  salary_type: string;
  salary_min: number;
  salary_max: number;
  required_licenses: string[];
  status: string;
  published_at: string | null;
  utm_source: string | null;
  referrer: string | null;
  created_at: string;
  details: Record<string, unknown>;
  consents: Record<string, unknown>;
  driver_companies: CompanyRow | null;
  [key: string]: unknown;
};

export function formatSalary(p: Pick<PostingRow, "salary_type" | "salary_min" | "salary_max">): string {
  const yen = (n: number) => `${n.toLocaleString("ja-JP")}円`;
  if (p.salary_min === p.salary_max) return `${p.salary_type} ${yen(p.salary_min)}`;
  return `${p.salary_type} ${yen(p.salary_min)}〜${yen(p.salary_max)}`;
}

export const MISSING_TABLE_MESSAGE =
  "データを読み込めませんでした。Supabase に driver_companies / driver_job_postings テーブル（supabase/migrations/008_driver_company_accounts.sql）が作成されているか確認してください。";
