/**
 * ドライバー採用サービス（候補者プロフィール検索）の企業向けLP（/driver/scout）
 * 利用申込みフォームの項目定義とサーバー側バリデーション。
 * クライアントとサーバーで同じ定義を使い、選択肢のズレを防ぐ。
 *
 * 保存先は既存の driver_company_inquiries（migration 007）。
 * 所在地の市区町村・免許・採用希望時期・申込み種別は migration 014 で追加する列に入れる。
 * エラーメッセージには入力値も内部情報も載せない。
 */
import { PREFECTURES } from "./driverCompanyInquiry";
import { CANDIDATE_NO_PATTERN } from "@/lib/driverCandidates/candidateNo";

export { PREFECTURES };

/** 申込み種別。driver_company_inquiries の他フォーム（求人掲載）と区別する */
/** 「求職者に聞いてほしいこと」の最大文字数 */
export const QUESTIONS_MAX = 1000;

export const SCOUT_INQUIRY_TYPE = "profile_search";

export const SCOUT_JOB_TYPES = [
  "大型トラック",
  "中型トラック",
  "4t",
  "2t・小型",
  "トレーラー",
  "ダンプ",
  "ルート配送",
  "長距離",
  "地場配送",
  "軽貨物・宅配",
  "その他",
] as const;

export const SCOUT_LICENSES = [
  "普通（AT限定可）",
  "普通（MT）",
  "準中型",
  "中型",
  "大型",
  "けん引",
  "フォークリフト",
  "不問",
] as const;

export const SCOUT_HIRING_COUNTS = ["1名", "2〜3名", "4〜5名", "6名以上", "未定"] as const;

export const SCOUT_HIRING_TIMINGS = ["すぐにでも", "1か月以内", "3か月以内", "半年以内", "時期は未定"] as const;

export type ScoutApplyInput = {
  companyName?: string;
  contactName?: string;
  phone?: string;
  email?: string;
  prefecture?: string;
  city?: string;
  jobTypes?: string[];
  licenses?: string[];
  hiringCount?: string;
  hiringTiming?: string;
  privacyAgreed?: boolean;
  /** 匿名プロフィールから来たときの候補者番号（任意） */
  candidateNo?: string;
  /** 求職者に聞いてほしいこと（任意） */
  questions?: string;
  /** ハニーポット。人間には見えない項目なので、値が入っていればボット */
  websiteUrl?: string;
  /** フォーム表示からの経過ミリ秒。極端に短い送信は自動化とみなす */
  elapsedMs?: number;
  utm?: Record<string, string | undefined>;
  referrer?: string;
  landingPage?: string;
};

export type ScoutApplyValues = {
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  prefecture: string;
  city: string;
  jobTypes: string[];
  licenses: string[];
  hiringCount: string;
  hiringTiming: string;
  /** 連絡先の開示を依頼された候補者番号。一覧から来ていなければ null */
  candidateNo: string | null;
  /** 求職者に聞いてほしいこと（任意。未入力なら null） */
  questions: string | null;
};

/** 項目キー → エラーメッセージ */
export type ScoutApplyErrors = Partial<Record<keyof ScoutApplyValues | "privacyAgreed", string>>;

function str(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const cleaned = v.replace(/[\u0000-\u001F\u007F]/g, "").trim();
  return cleaned ? cleaned.slice(0, max) : null;
}

/** 複数行の自由記入。改行は残し、それ以外の制御文字を取り除く */
function strMultiline(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const cleaned = v.replace(/\r\n?/g, "\n").replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, "").trim();
  return cleaned ? cleaned.slice(0, max) : null;
}

function toHalfWidth(v: string): string {
  return v.replace(/[０-９Ａ-Ｚａ-ｚ＠．－]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0));
}

export function normalizePhone(v: unknown): string | null {
  const raw = str(v, 40);
  if (!raw) return null;
  const digits = toHalfWidth(raw).replace(/[^\d]/g, "");
  return digits.length >= 10 && digits.length <= 11 && digits.startsWith("0") ? digits : null;
}

export function normalizeEmail(v: unknown): string | null {
  const raw = str(v, 200);
  if (!raw) return null;
  const value = toHalfWidth(raw).toLowerCase();
  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(value) ? value : null;
}

function pick(v: unknown, allowed: readonly string[]): string | null {
  return typeof v === "string" && allowed.includes(v) ? v : null;
}

function pickMany(v: unknown, allowed: readonly string[]): string[] {
  if (!Array.isArray(v)) return [];
  return Array.from(new Set(v.filter((x): x is string => typeof x === "string" && allowed.includes(x))));
}

/**
 * 入力全体を検証する。クライアント（表示用）とサーバー（受付判定）の両方で使う。
 * 信用できるのはサーバー側の結果だけ。
 */
export function validateScoutApply(
  body: ScoutApplyInput,
): { ok: true; values: ScoutApplyValues } | { ok: false; errors: ScoutApplyErrors } {
  const errors: ScoutApplyErrors = {};

  const companyName = str(body.companyName, 200);
  const contactName = str(body.contactName, 100);
  const phoneRaw = str(body.phone, 40);
  const phone = normalizePhone(body.phone);
  const emailRaw = str(body.email, 200);
  const email = normalizeEmail(body.email);
  const prefecture = pick(body.prefecture, PREFECTURES);
  const city = str(body.city, 200);
  const jobTypes = pickMany(body.jobTypes, SCOUT_JOB_TYPES);
  const licenses = pickMany(body.licenses, SCOUT_LICENSES);
  const hiringCount = pick(body.hiringCount, SCOUT_HIRING_COUNTS);
  const hiringTiming = pick(body.hiringTiming, SCOUT_HIRING_TIMINGS);

  if (!companyName) errors.companyName = "会社名をご入力ください。";
  if (!contactName) errors.contactName = "担当者名をご入力ください。";
  if (!phoneRaw) errors.phone = "電話番号をご入力ください。";
  else if (!phone) errors.phone = "電話番号は市外局番から10〜11桁の数字でご入力ください。";
  if (!emailRaw) errors.email = "メールアドレスをご入力ください。";
  else if (!email) errors.email = "メールアドレスの形式をご確認ください。";
  if (!prefecture) errors.prefecture = "都道府県をお選びください。";
  if (!city) errors.city = "市区町村をご入力ください。";
  if (jobTypes.length === 0) errors.jobTypes = "採用したい職種を1つ以上お選びください。";
  if (licenses.length === 0) errors.licenses = "求める免許を1つ以上お選びください。";
  if (!hiringCount) errors.hiringCount = "採用予定人数をお選びください。";
  if (!hiringTiming) errors.hiringTiming = "採用希望時期をお選びください。";
  if (body.privacyAgreed !== true) errors.privacyAgreed = "個人情報保護方針への同意が必要です。";

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    values: {
      companyName: companyName!,
      contactName: contactName!,
      phone: phone!,
      email: email!,
      prefecture: prefecture!,
      city: city!,
      jobTypes,
      licenses,
      hiringCount: hiringCount!,
      hiringTiming: hiringTiming!,
      candidateNo: typeof body.candidateNo === "string" && CANDIDATE_NO_PATTERN.test(body.candidateNo) ? body.candidateNo : null,
      questions: strMultiline(body.questions, QUESTIONS_MAX),
    },
  };
}
