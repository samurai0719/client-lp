/**
 * adofy 無料相談フォームの型と、サーバー側バリデーション。
 * クライアントとサーバーで同じ定義を使い、選択肢のズレを防ぐ。
 */

export const BUSINESS_TYPES = ["corporation", "sole", "planned", "other"] as const;
export const INDUSTRY_VALUES = [
  "exterior", "painting", "roof", "demolition", "reform",
  "electric", "plumbing", "interior", "scaffold", "civil", "builder", "other",
] as const;
export const HAS_WEBSITE_VALUES = ["yes", "no", "building", "unknown"] as const;
export const TOPIC_VALUES = [
  "new", "renewal", "inquiries", "direct", "recruit", "ads", "seo", "unsure", "other",
] as const;
export const PROBLEM_VALUES = [
  "subcontract", "lowprice", "noleads", "referral", "nohpinquiry",
  "norecruit", "nodiff", "noweb", "other",
] as const;
export const PLAN_VALUES = ["start", "growth", "max", "consult"] as const;
export const TIMING_VALUES = ["asap", "1month", "3months", "6months", "undecided"] as const;
export const CONTACT_METHODS = ["phone", "email", "any"] as const;
export const CONTACT_TIMES = ["9-12", "12-15", "15-18", "18-", "any"] as const;

export type ConsultationInput = {
  businessType?: string;
  companyName?: string;
  contactName?: string;
  position?: string;
  prefecture?: string;
  city?: string;
  industries?: string[];
  industryOther?: string;
  hasWebsite?: string;
  websiteUrl?: string;
  consultationTopics?: string[];
  consultationOther?: string;
  currentProblems?: string[];
  problemOther?: string;
  selectedPlan?: string;
  desiredTiming?: string;
  phone?: string;
  email?: string;
  preferredContactMethod?: string;
  preferredContactTime?: string;
  privacyAgreed?: boolean;
  /** ハニーポット。人間は触らないので、値が入っていればボット */
  companyWebsite?: string;
  /** フォーム表示からの経過ミリ秒。極端に短い送信はボットとみなす */
  elapsedMs?: number;
  utm?: Record<string, string | undefined>;
  referrer?: string;
  landingPage?: string;
};

/* ── 正規化 ───────────────────────────────────────────────────────────────── */

const MAX = { short: 100, medium: 200, long: 1000, url: 500 } as const;

/**
 * 文字列の正規化。
 * 制御文字を除去し長さを打ち切る。HTMLエスケープはここでは行わない
 * （React が描画時にエスケープし、DBには生の値を保つのが正しいため）。
 */
function str(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const cleaned = v.replace(/[\u0000-\u001F\u007F]/g, "").trim();
  if (!cleaned) return null;
  return cleaned.slice(0, max);
}

/** 許可リストにある値だけを通す（想定外の値は捨てる） */
function pick(v: unknown, allowed: readonly string[]): string | null {
  return typeof v === "string" && allowed.includes(v) ? v : null;
}

/** 許可リストにある値だけの配列にする */
function pickMany(v: unknown, allowed: readonly string[]): string[] {
  if (!Array.isArray(v)) return [];
  const out = v.filter((x): x is string => typeof x === "string" && allowed.includes(x));
  return Array.from(new Set(out)).slice(0, allowed.length);
}

/** 全角数字・ハイフン等を吸収して数字のみにする */
function normalizePhone(v: unknown): string | null {
  const raw = str(v, 40);
  if (!raw) return null;
  const half = raw.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0));
  const digits = half.replace(/[^\d]/g, "");
  if (digits.length < 9 || digits.length > 11) return null;
  return digits;
}

function normalizeEmail(v: unknown): string | null {
  const raw = str(v, MAX.short);
  if (!raw) return null;
  const value = raw.toLowerCase();
  // 厳密すぎる検証は正当なアドレスを弾くため、実務的な形だけ確認する
  if (!/^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(value)) return null;
  return value;
}

/** http(s) のみ許可。javascript: などのスキームを排除する */
function normalizeUrl(v: unknown): string | null {
  const raw = str(v, MAX.url);
  if (!raw) return null;
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const u = new URL(withScheme);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.toString().slice(0, MAX.url);
  } catch {
    return null;
  }
}

export type ValidationResult =
  | { ok: true; row: ConsultationRow }
  | { ok: false; message: string };

/** consultations テーブルへそのまま insert できる形 */
export type ConsultationRow = {
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
  consented_at: string;
  referrer: string | null;
  landing_page: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  status: string;
};

/**
 * 受信データを検証して保存用の行に変換する。
 * 返すエラーメッセージは利用者向けの文言のみで、内部情報は含めない。
 */
export function validateConsultation(body: ConsultationInput): ValidationResult {
  // 必須
  const companyName = str(body.companyName, MAX.medium);
  const contactName = str(body.contactName, MAX.short);
  const prefecture = str(body.prefecture, MAX.short);

  if (!companyName) return { ok: false, message: "会社名・屋号をご入力ください。" };
  if (!contactName) return { ok: false, message: "ご担当者名をご入力ください。" };
  if (!prefecture) return { ok: false, message: "都道府県をご選択ください。" };
  if (!body.privacyAgreed) {
    return { ok: false, message: "プライバシーポリシーへの同意が必要です。" };
  }

  const method = pick(body.preferredContactMethod, CONTACT_METHODS);
  const phone = normalizePhone(body.phone);
  const email = normalizeEmail(body.email);

  // 電話・メールは最低どちらか一方。希望連絡方法に応じて必須を切り替える
  if (method === "phone" && !phone) {
    return { ok: false, message: "電話でのご連絡をご希望の場合は、電話番号をご入力ください。" };
  }
  if (method === "email" && !email) {
    return { ok: false, message: "メールでのご連絡をご希望の場合は、メールアドレスをご入力ください。" };
  }
  if (!phone && !email) {
    return { ok: false, message: "電話番号またはメールアドレスのいずれかをご入力ください。" };
  }

  const utm = body.utm ?? {};

  return {
    ok: true,
    row: {
      business_type: pick(body.businessType, BUSINESS_TYPES),
      company_name: companyName,
      contact_name: contactName,
      position: str(body.position, MAX.short),
      prefecture,
      city: str(body.city, MAX.short),
      industries: pickMany(body.industries, INDUSTRY_VALUES),
      industry_other: str(body.industryOther, MAX.medium),
      has_website: pick(body.hasWebsite, HAS_WEBSITE_VALUES),
      website_url: normalizeUrl(body.websiteUrl),
      consultation_topics: pickMany(body.consultationTopics, TOPIC_VALUES),
      consultation_other: str(body.consultationOther, MAX.medium),
      current_problems: pickMany(body.currentProblems, PROBLEM_VALUES),
      problem_other: str(body.problemOther, MAX.medium),
      selected_plan: pick(body.selectedPlan, PLAN_VALUES),
      desired_timing: pick(body.desiredTiming, TIMING_VALUES),
      phone,
      email,
      preferred_contact_method: method,
      preferred_contact_time: pick(body.preferredContactTime, CONTACT_TIMES),
      consented_at: new Date().toISOString(),
      referrer: str(body.referrer, MAX.url),
      landing_page: str(body.landingPage, MAX.url),
      utm_source: str(utm.utm_source, MAX.short),
      utm_medium: str(utm.utm_medium, MAX.short),
      utm_campaign: str(utm.utm_campaign, MAX.medium),
      utm_content: str(utm.utm_content, MAX.medium),
      utm_term: str(utm.utm_term, MAX.medium),
      status: "new",
    },
  };
}
