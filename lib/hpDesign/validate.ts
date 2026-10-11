import {
  ASSET_CHOICES, ASSET_CHOICES_WITH_UPLOAD, COLORS, CONTENTS, INDUSTRIES, LIMITS,
  MAX_UPLOAD_FILES, PURPOSES, REFERENCE_CHOICES, STYLES, WEBSITE_CHOICES, type Option,
} from "./options";

/** チャットが送る申し込みデータ（クライアント・サーバー共通の形） */
export type HpDesignAnswers = {
  industry: string;
  industryOther: string;
  industryDetail: string;
  companyName: string;
  companyUndecided: boolean;
  purposes: string[];
  purposeOther: string;
  designStyle: string;
  mainColor: string;
  colorOther: string;
  contents: string[];
  contentOther: string;
  hasWebsite: string;
  websiteUrl: string;
  referenceChoice: string;
  referenceUrls: string[];
  assetsChoice: string;
  uploads: UploadedFile[];
  otherRequests: string;
  contactName: string;
  email: string;
  phone: string;
};

export type UploadedFile = { path: string; name: string; size: number; type: string };

export type HpDesignInput = HpDesignAnswers & {
  submissionId: string;
  privacyAgreed: boolean;
  /** ハニーポット（人間には見えない欄） */
  website2?: string;
  /** チャット開始から送信までの経過時間 */
  elapsedMs?: number;
  utm?: Record<string, string | undefined>;
};

export type HpDesignRow = {
  client_submission_id: string;
  industry: string;
  industry_other: string | null;
  industry_detail: string | null;
  company_name: string | null;
  company_undecided: boolean;
  purposes: string[];
  purpose_other: string | null;
  design_style: string;
  main_color: string;
  color_other: string | null;
  contents: string[];
  content_other: string | null;
  has_website: string;
  website_url: string | null;
  reference_choice: string;
  reference_urls: string[];
  assets_choice: string;
  uploaded_files: UploadedFile[];
  other_requests: string | null;
  contact_name: string;
  email: string;
  phone: string | null;
  consented_at: string;
  referrer: string | null;
  landing_page: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  device_type: string | null;
};

// 実用的な範囲のメール形式チェック（RFCの完全実装ではなく、入力ミスを弾く目的）
export const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

export function isValidEmail(v: string): boolean {
  return v.length <= 254 && EMAIL_RE.test(v);
}

/** 全角数字・ハイフンを半角にして、数字とハイフン以外を取り除く */
export function normalizePhone(v: string): string {
  return v
    .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/[ー－―‐−]/g, "-")
    .replace(/[^\d-]/g, "");
}

export function isValidPhone(v: string): boolean {
  const digits = v.replace(/-/g, "");
  return /^0\d{9,10}$/.test(digits);
}

/** http(s) のURLだけを受け付ける。スキーム省略は https を補う */
export function normalizeUrl(v: string): string | null {
  const s = v.trim();
  if (!s) return null;
  const withScheme = /^https?:\/\//i.test(s) ? s : `https://${s}`;
  try {
    const u = new URL(withScheme);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    if (!u.hostname.includes(".")) return null;
    return u.toString().slice(0, LIMITS.url);
  } catch {
    return null;
  }
}

const SUBMISSION_ID_RE = /^[0-9a-f-]{36}$/i;
export function isValidSubmissionId(v: unknown): v is string {
  return typeof v === "string" && SUBMISSION_ID_RE.test(v);
}

function str(v: unknown, max: number): string {
  return typeof v === "string" ? v.replace(/\u0000/g, "").trim().slice(0, max) : "";
}

function oneOf(list: readonly Option[], v: unknown): string | null {
  return typeof v === "string" && list.some((o) => o.id === v) ? v : null;
}

function manyOf(list: readonly Option[], v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return [...new Set(v.filter((x): x is string => typeof x === "string" && list.some((o) => o.id === x)))];
}

type Result = { ok: true; row: HpDesignRow } | { ok: false; message: string };

export function validateHpDesign(body: HpDesignInput): Result {
  const fail = (message: string): Result => ({ ok: false, message });

  if (!isValidSubmissionId(body.submissionId)) return fail("送信内容を確認できませんでした。ページを再読み込みしてお試しください。");

  const industry = oneOf(INDUSTRIES, body.industry);
  if (!industry) return fail("業種を選択してください。");
  const industryOther = industry === "other" ? str(body.industryOther, LIMITS.short) : "";
  if (industry === "other" && !industryOther) return fail("業種を入力してください。");
  // 詳しい種類（一覧から選ぶか「その他」で自由入力）。「その他」の業種では聞かない
  const industryDetail = industry === "other" ? "" : str(body.industryDetail, LIMITS.short);
  if (industry !== "other" && !industryDetail) return fail("業種の詳しい種類を選択してください。");

  const companyUndecided = body.companyUndecided === true;
  const companyName = companyUndecided ? "" : str(body.companyName, LIMITS.short);
  if (!companyUndecided && !companyName) return fail("会社名・店舗名を入力するか「未定」を選んでください。");

  const purposes = manyOf(PURPOSES, body.purposes);
  if (purposes.length === 0) return fail("ホームページの目的を1つ以上選択してください。");
  const purposeOther = purposes.includes("other") ? str(body.purposeOther, LIMITS.short) : "";

  const designStyle = oneOf(STYLES, body.designStyle);
  if (!designStyle) return fail("デザインの雰囲気を選択してください。");

  const mainColor = oneOf(COLORS, body.mainColor);
  if (!mainColor) return fail("メインカラーを選択してください。");
  const colorOther = mainColor === "other" ? str(body.colorOther, LIMITS.short) : "";

  const contents = manyOf(CONTENTS, body.contents);
  if (contents.length === 0) return fail("掲載したい内容を1つ以上選択してください。");
  const contentOther = contents.includes("other") ? str(body.contentOther, LIMITS.short) : "";

  const hasWebsite = oneOf(WEBSITE_CHOICES, body.hasWebsite);
  if (!hasWebsite) return fail("現在のホームページの有無を選択してください。");
  let websiteUrl: string | null = null;
  if (hasWebsite === "yes" && str(body.websiteUrl, LIMITS.url)) {
    websiteUrl = normalizeUrl(str(body.websiteUrl, LIMITS.url));
    if (!websiteUrl) return fail("現在のホームページのURLを正しく入力してください。");
  }

  const referenceChoice = oneOf(REFERENCE_CHOICES, body.referenceChoice);
  if (!referenceChoice) return fail("参考にしたいホームページの有無を選択してください。");
  const referenceUrls: string[] = [];
  if (referenceChoice === "yes" && Array.isArray(body.referenceUrls)) {
    for (const raw of body.referenceUrls.slice(0, LIMITS.referenceUrls)) {
      const s = str(raw, LIMITS.url);
      if (!s) continue;
      const u = normalizeUrl(s);
      if (!u) return fail("参考にしたいホームページのURLを正しく入力してください。");
      referenceUrls.push(u);
    }
  }

  const assetsChoice = oneOf(ASSET_CHOICES, body.assetsChoice);
  if (!assetsChoice) return fail("写真やロゴの有無を選択してください。");
  // アップロードの実在確認は API 側で行う。ここでは形と件数だけ見る
  const uploads: UploadedFile[] = [];
  if ((ASSET_CHOICES_WITH_UPLOAD as readonly string[]).includes(assetsChoice) && Array.isArray(body.uploads)) {
    for (const f of body.uploads.slice(0, MAX_UPLOAD_FILES)) {
      if (!f || typeof f.path !== "string") continue;
      uploads.push({
        path: f.path,
        name: str(f.name, 200) || "file",
        size: typeof f.size === "number" ? f.size : 0,
        type: str(f.type, 50),
      });
    }
  }

  const otherRequests = str(body.otherRequests, LIMITS.text);

  const contactName = str(body.contactName, LIMITS.short);
  if (!contactName) return fail("ご担当者名を入力してください。");

  const email = str(body.email, 254).toLowerCase();
  if (!email) return fail("メールアドレスを入力してください。");
  if (!isValidEmail(email)) return fail("メールアドレスの形式が正しくありません。");

  let phone: string | null = null;
  const rawPhone = str(body.phone, 30);
  if (rawPhone) {
    phone = normalizePhone(rawPhone);
    if (!isValidPhone(phone)) return fail("電話番号の形式が正しくありません（任意項目のため空欄でも送信できます）。");
  }

  if (body.privacyAgreed !== true) return fail("個人情報の取り扱いへの同意が必要です。");

  const utm = body.utm && typeof body.utm === "object" ? body.utm : {};
  const u = (k: string, max = 200) => str(utm[k], max) || null;

  return {
    ok: true,
    row: {
      client_submission_id: body.submissionId.toLowerCase(),
      industry,
      industry_other: industryOther || null,
      industry_detail: industryDetail || null,
      company_name: companyName || null,
      company_undecided: companyUndecided,
      purposes,
      purpose_other: purposeOther || null,
      design_style: designStyle,
      main_color: mainColor,
      color_other: colorOther || null,
      contents,
      content_other: contentOther || null,
      has_website: hasWebsite,
      website_url: websiteUrl,
      reference_choice: referenceChoice,
      reference_urls: referenceUrls,
      assets_choice: assetsChoice,
      uploaded_files: uploads,
      other_requests: otherRequests || null,
      contact_name: contactName,
      email,
      phone,
      consented_at: new Date().toISOString(),
      referrer: u("referrer", 500),
      landing_page: u("landing_page", 500),
      utm_source: u("utm_source"),
      utm_medium: u("utm_medium"),
      utm_campaign: u("utm_campaign"),
      utm_content: u("utm_content"),
      utm_term: u("utm_term"),
      device_type: u("device_type", 20),
    },
  };
}
