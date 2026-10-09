/**
 * ドラテク 企業向けLP（/company）の求人情報 登録フォームの型と、サーバー側バリデーション。
 * クライアントとサーバーで同じ定義を使い、選択肢のズレを防ぐ。
 *
 * 個人情報を含むため、エラーメッセージには入力値も内部情報も載せない。
 */

/** 募集職種。LP「対応するドライバー求人」セクションと同じ並び */
export const JOB_TYPE_VALUES = [
  "large_truck",
  "medium_truck",
  "small_truck",
  "light_delivery",
  "taxi",
  "bus",
  "route",
  "shuttle",
  "logistics",
  "other",
] as const;

export const JOB_TYPE_LABELS: Record<string, string> = {
  large_truck: "大型トラック",
  medium_truck: "中型トラック",
  small_truck: "小型・準中型トラック",
  light_delivery: "軽貨物・宅配",
  taxi: "タクシー",
  bus: "バス",
  route: "ルート配送",
  shuttle: "送迎ドライバー",
  logistics: "倉庫・運行管理関連",
  other: "その他",
};

export const HIRING_COUNT_VALUES = ["1", "2-3", "4-5", "6-10", "11+", "undecided"] as const;

export const HIRING_COUNT_LABELS: Record<string, string> = {
  "1": "1名",
  "2-3": "2〜3名",
  "4-5": "4〜5名",
  "6-10": "6〜10名",
  "11+": "11名以上",
  undecided: "未定",
};

export const PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県",
  "岐阜県", "静岡県", "愛知県", "三重県",
  "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
  "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県",
  "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
] as const;

export type DriverCompanyInquiryInput = {
  companyName?: string;
  contactName?: string;
  phone?: string;
  email?: string;
  prefecture?: string;
  jobTypes?: string[];
  jobTypeOther?: string;
  hiringCount?: string;
  fleetDescription?: string;
  message?: string;
  privacyAgreed?: boolean;
  /** ハニーポット。人間には見えない項目なので、値が入っていればボット */
  websiteUrl?: string;
  /** フォーム表示からの経過ミリ秒。極端に短い送信は自動化とみなす */
  elapsedMs?: number;
  utm?: Record<string, string | undefined>;
  referrer?: string;
  landingPage?: string;
};

/** driver_company_inquiries テーブルへそのまま insert できる形 */
export type DriverCompanyInquiryRow = {
  company_name: string;
  contact_name: string;
  phone: string;
  email: string;
  prefecture: string;
  job_types: string[];
  job_type_other: string | null;
  hiring_count: string | null;
  fleet_description: string | null;
  message: string | null;
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

export type ValidationResult =
  | { ok: true; row: DriverCompanyInquiryRow }
  | { ok: false; message: string };

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

/**
 * 受信データを検証して保存用の行に変換する。
 * 返すエラーメッセージは利用者向けの文言のみ。
 */
export function validateDriverCompanyInquiry(
  body: DriverCompanyInquiryInput
): ValidationResult {
  const companyName = str(body.companyName, MAX.medium);
  const contactName = str(body.contactName, MAX.short);
  const prefecture = pick(body.prefecture, PREFECTURES);
  const phone = normalizePhone(body.phone);
  const email = normalizeEmail(body.email);
  const jobTypes = pickMany(body.jobTypes, JOB_TYPE_VALUES);

  if (!companyName) return { ok: false, message: "会社名をご入力ください。" };
  if (!contactName) return { ok: false, message: "ご担当者名をご入力ください。" };
  if (!phone) {
    return { ok: false, message: "電話番号をご確認のうえ、ご入力ください。" };
  }
  if (!email) {
    return { ok: false, message: "メールアドレスをご確認のうえ、ご入力ください。" };
  }
  if (!prefecture) return { ok: false, message: "所在地（都道府県）をご選択ください。" };
  if (jobTypes.length === 0) {
    return { ok: false, message: "募集職種を1つ以上ご選択ください。" };
  }
  if (!body.privacyAgreed) {
    return { ok: false, message: "個人情報の取り扱いへの同意が必要です。" };
  }

  const utm = body.utm ?? {};

  return {
    ok: true,
    row: {
      company_name: companyName,
      contact_name: contactName,
      phone,
      email,
      prefecture,
      job_types: jobTypes,
      job_type_other: jobTypes.includes("other")
        ? str(body.jobTypeOther, MAX.medium)
        : null,
      hiring_count: pick(body.hiringCount, HIRING_COUNT_VALUES),
      fleet_description: str(body.fleetDescription, MAX.long),
      message: str(body.message, MAX.long),
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
