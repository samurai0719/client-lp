/**
 * ドラテク 企業向け「無料オンライン相談」LP（/driver/company/consult）の
 * 質問の選択肢とサーバー側バリデーション。クライアントとサーバーで同じ定義を使う。
 *
 * 保存先は既存の driver_company_inquiries（inquiry_type = 'consultation'）。
 * 人数・時期・勤務地は既存の列（hiring_count / hiring_timing / prefecture / address_city）に、
 * 採用状況と気になる料金プランは message 列にまとめて入れる。
 * エラーメッセージには入力値も内部情報も載せない。
 */
import { PREFECTURES } from "./driverCompanyInquiry";
import { normalizeEmail, normalizePhone } from "./driverScoutApply";

export { PREFECTURES };

export const CONSULT_INQUIRY_TYPE = "consultation";

export const HIRING_STATUSES = ["すぐにドライバーを採用したい", "今後の採用に向けて情報収集したい"] as const;
export const HIRING_COUNTS = ["1人", "2〜3人", "4人以上", "まだ決めていない"] as const;
export const HIRING_TIMINGS = ["できるだけ早く", "1か月以内", "3か月以内", "良い人がいれば"] as const;
export const PLAN_INTERESTS = ["成果報酬プラン", "月額プラン", "相談して決めたい"] as const;

export type ConsultAnswers = {
  hiringStatus: string;
  hiringCount: string;
  hiringTiming: string;
  prefecture: string;
  city: string;
  plan: string;
};

export type ConsultContact = {
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
};

export type ConsultInput = Partial<ConsultAnswers & ConsultContact> & {
  privacyAgreed?: boolean;
  /** ハニーポット。人間には見えない項目なので、値が入っていればボット */
  websiteUrl?: string;
  /** ページ表示からの経過ミリ秒。極端に短い送信は自動化とみなす */
  elapsedMs?: number;
  utm?: Record<string, string | undefined>;
  referrer?: string;
  landingPage?: string;
};

export type ConsultValues = ConsultAnswers & ConsultContact;

export type ConsultErrors = Partial<Record<keyof ConsultValues | "privacyAgreed", string>>;

function str(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const cleaned = v.replace(/[\u0000-\u001F\u007F]/g, "").trim();
  return cleaned ? cleaned.slice(0, max) : null;
}

function pick(v: unknown, allowed: readonly string[]): string | null {
  return typeof v === "string" && allowed.includes(v) ? v : null;
}

/** 連絡先（STEP 6）だけの検証。クライアントの入力チェックにも使う */
export function validateContact(body: Partial<ConsultContact> & { privacyAgreed?: boolean }): ConsultErrors {
  const errors: ConsultErrors = {};
  if (!str(body.companyName, 200)) errors.companyName = "会社名をご入力ください。";
  if (!str(body.contactName, 100)) errors.contactName = "担当者名をご入力ください。";
  if (!str(body.phone, 40)) errors.phone = "電話番号をご入力ください。";
  else if (!normalizePhone(body.phone)) errors.phone = "電話番号は市外局番から10〜11桁の数字でご入力ください。";
  if (!str(body.email, 200)) errors.email = "メールアドレスをご入力ください。";
  else if (!normalizeEmail(body.email)) errors.email = "メールアドレスの形式をご確認ください。";
  if (body.privacyAgreed !== true) errors.privacyAgreed = "個人情報の取り扱いへの同意が必要です。";
  return errors;
}

/** 入力全体の検証。信用できるのはサーバー側の結果だけ */
export function validateConsult(
  body: ConsultInput,
): { ok: true; values: ConsultValues } | { ok: false; errors: ConsultErrors } {
  const errors: ConsultErrors = validateContact(body);
  const hiringStatus = pick(body.hiringStatus, HIRING_STATUSES);
  const hiringCount = pick(body.hiringCount, HIRING_COUNTS);
  const hiringTiming = pick(body.hiringTiming, HIRING_TIMINGS);
  const prefecture = pick(body.prefecture, PREFECTURES);
  const city = str(body.city, 200);
  const plan = pick(body.plan, PLAN_INTERESTS);

  if (!hiringStatus) errors.hiringStatus = "現在の採用状況をお選びください。";
  if (!hiringCount) errors.hiringCount = "採用したい人数をお選びください。";
  if (!hiringTiming) errors.hiringTiming = "採用したい時期をお選びください。";
  if (!prefecture) errors.prefecture = "都道府県をお選びください。";
  if (!city) errors.city = "市区町村をご入力ください。";
  if (!plan) errors.plan = "気になる料金プランをお選びください。";

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    values: {
      hiringStatus: hiringStatus!,
      hiringCount: hiringCount!,
      hiringTiming: hiringTiming!,
      prefecture: prefecture!,
      city: city!,
      plan: plan!,
      companyName: str(body.companyName, 200)!,
      contactName: str(body.contactName, 100)!,
      phone: normalizePhone(body.phone)!,
      email: normalizeEmail(body.email)!,
    },
  };
}
