/**
 * 相談データの表示用ラベル。
 * 一覧と詳細で同じ定義を使い、表記のズレを防ぐ。
 * 値の一覧は lib/types/consultation.ts の許可リストと対応している。
 */

export type Consultation = {
  id: string;
  business_type: string | null;
  company_name: string;
  contact_name: string;
  position: string | null;
  prefecture: string;
  city: string | null;
  industries: string[];
  industry_other: string | null;
  has_website: string | null;
  website_url: string | null;
  consultation_topics: string[];
  consultation_other: string | null;
  current_problems: string[];
  problem_other: string | null;
  selected_plan: string | null;
  desired_timing: string | null;
  phone: string | null;
  email: string | null;
  preferred_contact_method: string | null;
  preferred_contact_time: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  referrer: string | null;
  next_action: string | null;
  next_action_at: string | null;
  status: string;
  created_at: string;
};

export const STATUS_LABELS: Record<string, string> = {
  new: "新規",
  contacted: "連絡済み",
  in_progress: "商談中",
  won: "受注",
  lost: "失注",
  spam: "迷惑",
};

export const STATUS_STYLES: Record<string, string> = {
  new: "border-orange-300 bg-orange-100 text-orange-800",
  contacted: "border-blue-300 bg-blue-100 text-blue-800",
  in_progress: "border-violet-300 bg-violet-100 text-violet-800",
  won: "border-emerald-300 bg-emerald-100 text-emerald-800",
  lost: "border-slate-300 bg-slate-100 text-slate-600",
  spam: "border-rose-300 bg-rose-100 text-rose-800",
};

export const CONSULTATION_LABELS = {
  business: {
    corporation: "法人",
    sole: "個人事業主",
    planned: "開業予定",
    other: "その他",
  } as Record<string, string>,
  industry: {
    exterior: "外構・エクステリア", painting: "外壁塗装", roof: "屋根工事",
    demolition: "解体工事", reform: "リフォーム", electric: "電気工事",
    plumbing: "水道工事", interior: "内装工事", scaffold: "足場工事",
    civil: "造成・土木", builder: "工務店", other: "その他",
  } as Record<string, string>,
  website: {
    yes: "あり", no: "なし", building: "制作途中", unknown: "分からない",
  } as Record<string, string>,
  topic: {
    new: "新規制作", renewal: "リニューアル", inquiries: "問い合わせ増",
    direct: "直接受注", recruit: "採用", ads: "Web広告", seo: "SEO",
    unsure: "相談したい", other: "その他",
  } as Record<string, string>,
  problem: {
    subcontract: "下請け中心", lowprice: "受注単価が安い", noleads: "自社集客できない",
    referral: "紹介依存", nohpinquiry: "HPから問い合わせ無し", norecruit: "応募が来ない",
    nodiff: "差別化できない", noweb: "Webが分からない", other: "その他",
  } as Record<string, string>,
  plan: {
    standard: "集客HP(20万)",
    // 以下は3プラン時代の値（既存データの表示用）
    start: "スタート(30万)", growth: "集客強化(50万)",
    max: "MAX(70万)", consult: "相談して決めたい",
  } as Record<string, string>,
  timing: {
    asap: "できるだけ早く", "1month": "1ヶ月以内", "3months": "3ヶ月以内",
    "6months": "半年以内", undecided: "未定",
  } as Record<string, string>,
  method: { phone: "電話", email: "メール", any: "どちらでも" } as Record<string, string>,
  time: {
    "9-12": "9-12時", "12-15": "12-15時", "15-18": "15-18時",
    "18-": "18時以降", any: "いつでも",
  } as Record<string, string>,
};

/** 単一の値をラベルに変換する。未設定は「—」 */
export function mapOne(dict: Record<string, string>, v: string | null): string {
  return v ? dict[v] ?? v : "—";
}

/** 複数選択をラベルに変換する。「その他」は自由入力を括弧で添える */
export function mapAll(
  dict: Record<string, string>,
  arr: string[],
  other?: string | null
): string {
  const list = arr.map((v) => (v === "other" && other ? `その他（${other}）` : dict[v] ?? v));
  return list.join("、") || "—";
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
