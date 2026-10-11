import type { RequestForMail } from "./mail";

/** 管理画面で扱う申し込み1件（DBの列そのまま） */
export type HpDesignRequest = Omit<RequestForMail, "uploaded_files"> & {
  client_submission_id: string;
  uploaded_files: { path: string; name: string; size: number; type: string }[];
  consented_at: string;
  landing_page: string | null;
  utm_content: string | null;
  utm_term: string | null;
  device_type: string | null;
  status: string;
  admin_memo: string | null;
  preview_url: string | null;
  customer_ack_status: string;
  admin_notice_status: string;
  design_email_status: string;
  design_email_locked_at: string | null;
  design_email_sent_at: string | null;
  design_email_count: number;
  design_email_error: string | null;
  purchase_requested_at: string | null;
  purchase_message: string | null;
  updated_at: string;
};

export type HpDesignEmailLog = {
  id: string;
  kind: string;
  to_email: string;
  status: string;
  error: string | null;
  created_at: string;
};

export const STATUS_STYLES: Record<string, string> = {
  new: "border-orange-300 bg-orange-100 text-orange-800",
  in_production: "border-blue-300 bg-blue-100 text-blue-800",
  design_ready: "border-violet-300 bg-violet-100 text-violet-800",
  sent: "border-amber-300 bg-amber-100 text-amber-800",
  purchased: "border-emerald-300 bg-emerald-100 text-emerald-800",
  declined: "border-slate-300 bg-slate-100 text-slate-600",
};

export const EMAIL_KIND_LABELS: Record<string, string> = {
  ack: "受付確認（お客様）",
  admin_notice: "新規通知（管理者）",
  design: "デザイン送付（お客様）",
  purchase_notice: "購入希望通知（管理者）",
};

/** テーブル未作成（migration 013 未適用）かどうか */
export function isMissingTable(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  return error.code === "42P01" || error.code === "PGRST205" || /does not exist|Could not find the table/i.test(error.message ?? "");
}
