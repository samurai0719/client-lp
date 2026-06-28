export type LeadStatus =
  | "new"
  | "uncontacted"
  | "contacted"
  | "site_visit_scheduled"
  | "site_visit_completed"
  | "estimating"
  | "estimate_sent"
  | "considering"
  | "contracted"
  | "under_construction"
  | "completed"
  | "lost"
  | "no_action";

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "新規問い合わせ",
  uncontacted: "未対応",
  contacted: "連絡済み",
  site_visit_scheduled: "現地調査予定",
  site_visit_completed: "現地調査完了",
  estimating: "見積もり作成中",
  estimate_sent: "見積もり提出済み",
  considering: "検討中",
  contracted: "成約",
  under_construction: "施工中",
  completed: "施工完了",
  lost: "失注",
  no_action: "対応不要",
};

export const LEAD_STATUSES = Object.keys(LEAD_STATUS_LABELS) as LeadStatus[];

export type ActivityType =
  | "inquiry_received"
  | "call"
  | "email"
  | "note"
  | "status_changed"
  | "site_visit"
  | "estimate"
  | "contract"
  | "construction"
  | "other";

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  inquiry_received: "問い合わせ受付",
  call: "電話",
  email: "メール",
  note: "メモ",
  status_changed: "ステータス変更",
  site_visit: "現地調査",
  estimate: "見積もり",
  contract: "成約",
  construction: "施工",
  other: "その他",
};

export type ImageType = "original" | "generated" | "estimate" | "construction" | "completion" | "other";

export const IMAGE_TYPE_LABELS: Record<ImageType, string> = {
  original: "元画像",
  generated: "AI生成画像",
  estimate: "見積書",
  construction: "施工中",
  completion: "施工完了",
  other: "その他",
};

export type AdPlatform = "meta" | "google" | "tiktok" | "other";

export const AD_PLATFORM_LABELS: Record<AdPlatform, string> = {
  meta: "Meta（Facebook/Instagram）",
  google: "Google",
  tiktok: "TikTok",
  other: "その他",
};

export const LOST_REASON_OPTIONS = [
  "価格",
  "競合他社",
  "連絡不通",
  "時期未定",
  "対象地域外",
  "予算不足",
  "その他",
];

export interface Customer {
  id: string;
  name: string;
  phone: string;
  phone_normalized: string;
  email: string | null;
  postal_code: string | null;
  prefecture: string | null;
  city: string | null;
  address: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  customer_id: string;
  status: LeadStatus;
  work_types: string[];
  design_style: string | null;
  inquiry_message: string | null;
  estimated_amount: number | null;
  quoted_amount: number | null;
  contract_amount: number | null;
  next_action_at: string | null;
  site_visit_at: string | null;
  assigned_user_id: string | null;
  source: string | null;
  lost_reason: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  customer?: Customer;
  attribution?: LeadAttribution;
}

export interface LeadWithCustomer extends Lead {
  customer: Customer;
  attribution?: LeadAttribution;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  activity_type: ActivityType;
  content: string;
  created_by: string | null;
  created_at: string;
  profile?: { display_name: string | null };
}

export interface LeadNote {
  id: string;
  lead_id: string;
  content: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadImage {
  id: string;
  lead_id: string;
  image_type: ImageType;
  storage_path: string;
  original_filename: string | null;
  mime_type: string | null;
  file_size: number | null;
  created_at: string;
  signed_url?: string;
}

export interface LeadAttribution {
  id: string;
  lead_id: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  fbclid: string | null;
  gclid: string | null;
  ttclid: string | null;
  landing_page: string | null;
  referrer: string | null;
  device_type: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface AdExpense {
  id: string;
  date: string;
  platform: AdPlatform;
  campaign_name: string | null;
  amount: number;
  memo: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  display_name: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface PushSubscription {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  user_agent: string | null;
  device_name: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
