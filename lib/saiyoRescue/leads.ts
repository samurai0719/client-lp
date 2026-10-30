/**
 * 採用レスキュー 問い合わせ（saiyo_rescue_leads）の共通定義。
 * フォームAPI・管理画面・CSV出力で同じ定義を使う。
 */

export const LEADS_TABLE = "saiyo_rescue_leads";

/* ── ステータス ─────────────────────────────────────────── */

export const LEAD_STATUSES = [
  "new",
  "untouched",
  "called",
  "meeting_scheduled",
  "met",
  "quoted",
  "won",
  "lost",
  "hold",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const STATUS_LABEL: Record<LeadStatus, string> = {
  new: "新規",
  untouched: "未対応",
  called: "電話済み",
  meeting_scheduled: "商談予定",
  met: "商談済み",
  quoted: "見積提出",
  won: "契約",
  lost: "失注",
  hold: "保留",
};

/** バッジの配色（Tailwind クラス）。新規＝青 / 商談予定＝黄 / 契約＝緑 / 失注＝グレー */
export const STATUS_STYLE: Record<LeadStatus, string> = {
  new: "bg-blue-600 text-white",
  untouched: "bg-rose-100 text-rose-700 ring-1 ring-rose-300",
  called: "bg-sky-100 text-sky-800 ring-1 ring-sky-300",
  meeting_scheduled: "bg-amber-300 text-amber-950",
  met: "bg-indigo-100 text-indigo-800 ring-1 ring-indigo-300",
  quoted: "bg-violet-100 text-violet-800 ring-1 ring-violet-300",
  won: "bg-emerald-600 text-white",
  lost: "bg-slate-200 text-slate-600",
  hold: "bg-orange-100 text-orange-800 ring-1 ring-orange-300",
};

export function isLeadStatus(v: unknown): v is LeadStatus {
  return typeof v === "string" && (LEAD_STATUSES as readonly string[]).includes(v);
}

/* ── 行の型 ─────────────────────────────────────────────── */

export type LeadRow = {
  id: string;
  created_at: string;
  updated_at: string;
  company_name: string;
  contact_name: string;
  phone: string;
  email: string;
  prefecture: string;
  job_type: string;
  current_employees: string | null;
  desired_hires: string | null;
  current_job_media: string | null;
  monthly_recruitment_budget: string | null;
  website_url: string | null;
  job_page_url: string | null;
  message: string | null;
  desired_plan: string | null;
  status: LeadStatus;
  assigned_to: string | null;
  memo: string | null;
  next_contact_at: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  landing_page: string | null;
  referrer: string | null;
  device_type: "pc" | "smartphone" | "tablet" | null;
};

export type LeadInsert = Omit<LeadRow, "id" | "created_at" | "updated_at" | "status" | "assigned_to" | "memo" | "next_contact_at">;

/* ── 選択肢 ─────────────────────────────────────────────── */

export const PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
  "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
  "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
  "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
] as const;

export const PLAN_LABEL: Record<string, string> = {
  undecided: "未定（相談して決めたい）",
  light: "ライト（150,000円・税込）",
  standard: "スタンダード（250,000円・税込）",
  premium: "プレミアム（350,000円・税込・返金保証付き）",
  /** 建設業向けLP（/kensetsu）からの問い合わせ。フォームが自動で付与する（プラン選択ではなく流入LPの識別） */
  kensetsu: "建設業LP経由（初期費用89,800円・月額0円・成果報酬 想定年収の10%）",
  /** 職人採用エージェントLP（/shokunin-agent）からの問い合わせ。フォームが自動で付与する */
  shokunin: "職人採用エージェント経由（初期費用89,800円・月額0円・採用成功時 想定年収の10%）",
};

/** 建設業向けLP経由の問い合わせか */
export function isKensetsuLead(r: { desired_plan: string | null }): boolean {
  return r.desired_plan === "kensetsu";
}

/** 職人採用エージェントLP経由の問い合わせか */
export function isShokuninLead(r: { desired_plan: string | null }): boolean {
  return r.desired_plan === "shokunin";
}

/** 都道府県を聞かないフォーム（職人採用エージェント）の prefecture に入れる値（NOT NULL 列のため） */
export const PREFECTURE_UNANSWERED = "未回答";

export const DEVICE_LABEL: Record<string, string> = {
  pc: "PC",
  smartphone: "スマホ",
  tablet: "タブレット",
};

/* ── 流入元の判定 ───────────────────────────────────────── */

export type SourceKey = "meta" | "instagram" | "google" | "yahoo" | "line" | "tiktok" | "x" | "organic" | "referral" | "direct" | "other";

export const SOURCE_LABEL: Record<SourceKey, string> = {
  meta: "Meta",
  instagram: "Instagram",
  google: "Google",
  yahoo: "Yahoo!",
  line: "LINE",
  tiktok: "TikTok",
  x: "X",
  organic: "Organic",
  referral: "参照サイト",
  direct: "Direct",
  other: "その他",
};

export const SOURCE_STYLE: Record<SourceKey, string> = {
  meta: "bg-blue-50 text-blue-700 ring-blue-200",
  instagram: "bg-pink-50 text-pink-700 ring-pink-200",
  google: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  yahoo: "bg-red-50 text-red-700 ring-red-200",
  line: "bg-green-50 text-green-700 ring-green-200",
  tiktok: "bg-slate-100 text-slate-800 ring-slate-300",
  x: "bg-slate-100 text-slate-800 ring-slate-300",
  organic: "bg-teal-50 text-teal-700 ring-teal-200",
  referral: "bg-amber-50 text-amber-800 ring-amber-200",
  direct: "bg-slate-50 text-slate-600 ring-slate-200",
  other: "bg-slate-50 text-slate-600 ring-slate-200",
};

/**
 * utm_source → 広告クリックID → referrer の順で流入元を判定する。
 * 例: utm_source=facebook / fb / meta / ig → Meta または Instagram
 */
export function classifySource(r: Pick<LeadRow, "utm_source" | "referrer" | "landing_page">): SourceKey {
  const src = (r.utm_source ?? "").toLowerCase();
  if (src) {
    if (/insta|^ig$/.test(src)) return "instagram";
    if (/facebook|^fb$|meta/.test(src)) return "meta";
    if (/google|adwords|^gads$/.test(src)) return "google";
    if (/yahoo/.test(src)) return "yahoo";
    if (/line/.test(src)) return "line";
    if (/tiktok/.test(src)) return "tiktok";
    if (/twitter|^x$/.test(src)) return "x";
    return "other";
  }
  const lp = (r.landing_page ?? "").toLowerCase();
  if (lp.includes("fbclid=")) return "meta";
  if (lp.includes("gclid=")) return "google";

  const ref = (r.referrer ?? "").toLowerCase();
  if (!ref) return "direct";
  if (ref.includes("instagram.")) return "instagram";
  if (ref.includes("facebook.") || ref.includes("fb.")) return "meta";
  if (/google\.|bing\.|yahoo\.|duckduckgo\./.test(ref)) return "organic";
  return "referral";
}

/* ── 入力検証（サーバー側） ─────────────────────────────── */

const LIMIT = {
  short: 100,
  name: 60,
  phone: 30,
  email: 200,
  url: 500,
  message: 3000,
  meta: 500,
};

function str(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function opt(v: unknown, max: number): string | null {
  const s = str(v, max);
  return s.length > 0 ? s : null;
}

/** http(s) のURLだけ受け付ける（javascript: 等を保存しない） */
function optUrl(v: unknown): string | null {
  const s = str(v, LIMIT.url);
  if (!s) return null;
  const withScheme = /^https?:\/\//i.test(s) ? s : `https://${s}`;
  try {
    const u = new URL(withScheme);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.toString();
  } catch {
    return null;
  }
}

export function normalizePhone(phone: string): string {
  return phone.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0)).replace(/[ー－‐―]/g, "-");
}

export type ValidationResult = { ok: true; row: LeadInsert } | { ok: false; message: string };

export function validateLead(body: Record<string, unknown>): ValidationResult {
  const company_name = str(body.company, LIMIT.short);
  const contact_name = str(body.name, LIMIT.name);
  const phone = normalizePhone(str(body.phone, LIMIT.phone));
  const email = str(body.email, LIMIT.email);
  const job_type = str(body.jobType, LIMIT.short);
  const isShokunin = str(body.plan, 20) === "shokunin";
  const prefecture = isShokunin ? PREFECTURE_UNANSWERED : str(body.prefecture, 10);

  if (isShokunin && body.privacyConsent !== "on") {
    return { ok: false, message: "個人情報保護方針への同意が必要です" };
  }
  if (!company_name || !contact_name || !phone || !email || !job_type || !prefecture) {
    return { ok: false, message: "必須項目が入力されていません" };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: "メールアドレスの形式が正しくありません" };
  }
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 11) {
    return { ok: false, message: "電話番号を正しく入力してください" };
  }
  if (!isShokunin && !(PREFECTURES as readonly string[]).includes(prefecture)) {
    return { ok: false, message: "都道府県を選択してください" };
  }

  const plan = str(body.plan, 20);
  const device = str(body.deviceType, 20);

  // 建設業LPの「採用エリア」は専用カラムが無いため、相談内容の先頭にまとめて保存する
  const recruitArea = str(body.recruitArea, LIMIT.short);
  const rawMessage = str(body.message, LIMIT.message);
  const message = recruitArea ? `【採用エリア】${recruitArea}${rawMessage ? `\n\n${rawMessage}` : ""}` : rawMessage;

  return {
    ok: true,
    row: {
      company_name,
      contact_name,
      phone,
      email,
      prefecture,
      job_type,
      current_employees: opt(body.currentEmployees, LIMIT.short),
      desired_hires: opt(body.desiredHires, LIMIT.short),
      current_job_media: opt(body.currentJobMedia, LIMIT.short),
      monthly_recruitment_budget: opt(body.monthlyBudget, LIMIT.short),
      website_url: optUrl(body.websiteUrl),
      job_page_url: optUrl(body.jobPageUrl),
      message: message || null,
      desired_plan: plan in PLAN_LABEL ? plan : null,
      utm_source: opt(body.utm_source, LIMIT.short),
      utm_medium: opt(body.utm_medium, LIMIT.short),
      utm_campaign: opt(body.utm_campaign, LIMIT.short),
      utm_content: opt(body.utm_content, LIMIT.short),
      utm_term: opt(body.utm_term, LIMIT.short),
      landing_page: opt(body.landing_page, LIMIT.meta),
      referrer: opt(body.referrer, LIMIT.meta),
      device_type: device === "pc" || device === "smartphone" || device === "tablet" ? device : null,
    },
  };
}

/* ── 日時（JST） ────────────────────────────────────────── */

const JST = "Asia/Tokyo";

export function formatJst(iso: string | null, withTime = true): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString("ja-JP", {
    timeZone: JST,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

/** JSTでの日付キー（YYYY-MM-DD） */
export function jstDateKey(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("sv-SE", { timeZone: JST });
}

/** JSTでの月キー（YYYY-MM） */
export function jstMonthKey(d: Date | string): string {
  return jstDateKey(d).slice(0, 7);
}

/** <input type="datetime-local"> の値（JST）⇔ ISO 文字列 */
export function isoToJstInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const jst = new Date(d.getTime() + 9 * 3600 * 1000);
  return jst.toISOString().slice(0, 16);
}

export function jstInputToIso(v: string): string | null {
  if (!v) return null;
  const d = new Date(`${v}:00+09:00`);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}
