/** 職人の管理画面（/adofy-admin/shokunin）で共有する定義 */

export const SHOKUNIN_STATUSES = ["pending", "contacted", "interview", "paused", "hired", "withdrawn"] as const;
export type ShokuninStatus = (typeof SHOKUNIN_STATUSES)[number];

export const SHOKUNIN_STATUS_LABEL: Record<string, string> = {
  pending: "未対応",
  contacted: "連絡済み",
  interview: "面接調整中",
  paused: "保留",
  hired: "採用決定",
  withdrawn: "対応終了",
};

export const SHOKUNIN_STATUS_STYLE: Record<string, string> = {
  pending: "bg-rose-100 text-rose-700",
  contacted: "bg-sky-100 text-sky-700",
  interview: "bg-amber-100 text-amber-800",
  paused: "bg-slate-200 text-slate-700",
  hired: "bg-emerald-100 text-emerald-700",
  withdrawn: "bg-slate-100 text-slate-500",
};

export const MIGRATION_020_MESSAGE = "保存できませんでした。Supabase で migration 020 を実行してください。";

export type ShokuninRow = {
  id: string;
  status: string;
  motivation: string;
  desired_timing: string;
  experienced_trades: string[];
  experience_years: string;
  qualifications: string[];
  desired_trades: string[];
  employment_status: string;
  postal_code: string | null;
  current_prefecture: string;
  current_city: string | null;
  desired_area: string;
  desired_prefecture: string | null;
  top_priority: string;
  desired_salary: string;
  name: string;
  birth_year: number;
  phone: string;
  email: string | null;
  contact_time: string | null;
  comment: string | null;
  privacy_consent_at: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  fbclid: string | null;
  referrer: string | null;
  landing_url: string | null;
  admin_memo?: string | null;
  last_contacted_at?: string | null;
  created_at: string;
  updated_at: string;
};

export function ageOf(birthYear: number, now = new Date()): number {
  return now.getFullYear() - birthYear;
}
