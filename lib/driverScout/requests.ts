/**
 * ドライバー採用サービス（scout）の面接希望（企業 → ドラテク への連絡・日程調整の依頼）。
 * 状態の名前・企業向けの説明・入力チェックを、フォーム・API・管理画面・受付状況ページで共有する。
 * ブラウザでも使うため、DBに触る処理はここに置かない（lib/driverScout/requestsDb.ts）。
 */
import { PREFECTURES } from "@/lib/types/driverCompanyInquiry";
import { normalizeEmail, normalizePhone } from "@/lib/types/driverScoutApply";
import { CANDIDATE_NO_PATTERN } from "@/lib/driverCandidates/candidateNo";

export const REQUEST_STATUSES = [
  "received",
  "contacting",
  "awaiting_answer",
  "scheduling",
  "confirmed",
  "declined",
  "unreachable",
  "withdrawn",
] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

/** 管理画面・受付状況ページの表示名 */
export const STATUS_LABEL: Record<RequestStatus, string> = {
  received: "受付",
  contacting: "連絡中",
  awaiting_answer: "回答待ち",
  scheduling: "日程調整中",
  confirmed: "面接確定",
  declined: "面接見送り",
  unreachable: "連絡がつかない",
  withdrawn: "依頼取り下げ",
};

/** 企業向けの受付状況ページに出す説明（面接の確定や連絡がつくことを保証しない） */
export const STATUS_MESSAGE: Record<RequestStatus, string> = {
  received: "面接の希望を受け付けました。ドラテクが求職者へ連絡し、確認後にご連絡します。現時点では面接は確定していません。",
  contacting: "ドラテクが求職者へ連絡しています。現時点では面接は確定していません。",
  awaiting_answer: "求職者に会社と仕事内容をお伝えし、面接の希望と確認事項への回答を待っています。現時点では面接は確定していません。",
  scheduling: "求職者が面接を希望しています。双方の希望日時をもとに、面接の日程を調整しています。",
  confirmed: "面接の日程が決まりました。面接日時をご確認ください。",
  declined: "求職者が、今回は面接を希望しませんでした。",
  unreachable: "求職者に連絡を試みましたが、連絡がつきませんでした。",
  withdrawn: "この依頼は取り下げられました。",
};

/** 企業にメールで知らせる状態（それ以外は受付状況ページで確認できる） */
export const NOTIFY_STATUSES: RequestStatus[] = ["scheduling", "confirmed", "declined", "unreachable"];

export const REQUEST_LIMITS = { jobDescription: 1000, questions: 1000, availableTimes: 500 } as const;

export type RequestInput = {
  candidateNo?: string;
  companyName?: string;
  contactName?: string;
  phone?: string;
  email?: string;
  prefecture?: string;
  city?: string;
  jobDescription?: string;
  questions?: string;
  availableTimes?: string;
  privacyAgreed?: boolean;
  websiteUrl?: string;
  elapsedMs?: number;
};

export type RequestValues = {
  candidateNo: string;
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  prefecture: string;
  city: string;
  jobDescription: string;
  questions: string | null;
  availableTimes: string | null;
};

export type RequestErrors = Partial<Record<keyof RequestValues | "privacyAgreed", string>>;

function str(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const cleaned = v.replace(/[\u0000-\u001F\u007F]/g, "").trim();
  return cleaned ? cleaned.slice(0, max) : null;
}

/** 複数行の自由記入。改行は残し、それ以外の制御文字を取り除く */
function text(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const cleaned = v.replace(/\r\n?/g, "\n").replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, "").trim();
  return cleaned ? cleaned.slice(0, max) : null;
}

export function validateRequest(body: RequestInput): { ok: true; values: RequestValues } | { ok: false; errors: RequestErrors } {
  const errors: RequestErrors = {};
  const candidateNo = typeof body.candidateNo === "string" ? body.candidateNo.toUpperCase() : "";
  const companyName = str(body.companyName, 200);
  const contactName = str(body.contactName, 100);
  const phoneRaw = str(body.phone, 40);
  const phone = normalizePhone(body.phone);
  const emailRaw = str(body.email, 200);
  const email = normalizeEmail(body.email);
  const prefecture = typeof body.prefecture === "string" && (PREFECTURES as readonly string[]).includes(body.prefecture) ? body.prefecture : null;
  const city = str(body.city, 200);
  const jobDescription = text(body.jobDescription, REQUEST_LIMITS.jobDescription);

  if (!CANDIDATE_NO_PATTERN.test(candidateNo)) errors.candidateNo = "求職者を選び直してください。";
  if (!companyName) errors.companyName = "会社名をご入力ください。";
  if (!contactName) errors.contactName = "担当者名をご入力ください。";
  if (!phoneRaw) errors.phone = "電話番号をご入力ください。";
  else if (!phone) errors.phone = "電話番号は市外局番から10〜11桁の数字でご入力ください。";
  if (!emailRaw) errors.email = "メールアドレスをご入力ください。";
  else if (!email) errors.email = "メールアドレスの形式をご確認ください。";
  if (!prefecture) errors.prefecture = "都道府県をお選びください。";
  if (!city) errors.city = "市区町村をご入力ください。";
  if (!jobDescription) errors.jobDescription = "求職者に伝える仕事内容をご入力ください。";
  if (body.privacyAgreed !== true) errors.privacyAgreed = "個人情報保護方針への同意が必要です。";

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    values: {
      candidateNo,
      companyName: companyName!,
      contactName: contactName!,
      phone: phone!,
      email: email!,
      prefecture: prefecture!,
      city: city!,
      jobDescription: jobDescription!,
      questions: text(body.questions, REQUEST_LIMITS.questions),
      availableTimes: text(body.availableTimes, REQUEST_LIMITS.availableTimes),
    },
  };
}
