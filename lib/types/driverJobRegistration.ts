/**
 * ドラテク 企業登録・求人登録（/company/register）の項目定義とサーバー側バリデーション。
 *
 * 入力項目が多いため、項目の定義をこのファイル1か所に集約し、
 * 入力フォーム・確認画面・DB保存・通知メールがすべて同じ定義を参照する。
 * ラベルや選択肢を足すときはここだけ直せば全体に反映される。
 *
 * column: true の項目は DB の独立カラムに保存する（求人の絞り込み・配信条件に使うため）。
 * それ以外は details(jsonb) にまとめて入れる。
 */

export type FieldType =
  | "text"
  | "textarea"
  | "select"
  | "multiselect"
  | "number"
  | "date"
  | "email"
  | "tel"
  | "postal"
  | "url";

export interface Field {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: readonly string[];
  placeholder?: string;
  /** 入力欄の下に出す補足説明 */
  help?: string;
  /** 文字数上限（text / textarea） */
  max?: number;
  /** 数値の単位（表示用） */
  unit?: string;
  /** true なら DB の独立カラムへ保存する */
  column?: boolean;
}

export interface Step {
  no: number;
  title: string;
  description?: string;
  fields: Field[];
}

/* ── 選択肢 ──────────────────────────────────────────────────────────── */

/** 対応できる求人（LPの「対応できる求人」と同じ並び） */
export const JOB_TYPES = [
  "大型トラックドライバー",
  "中型トラックドライバー",
  "小型・準中型トラックドライバー",
  "トレーラードライバー",
  "ダンプドライバー",
  "軽貨物・宅配ドライバー",
  "ルート配送",
  "長距離ドライバー",
  "地場配送",
  "タクシードライバー",
  "バスドライバー",
  "送迎ドライバー",
  "運行管理者",
  "倉庫・物流関連職",
] as const;

export const LICENSES = [
  "普通自動車免許（AT限定可）",
  "普通自動車免許（MT）",
  "準中型免許",
  "中型免許",
  "大型免許",
  "けん引免許",
  "大型特殊免許",
  "第二種免許（普通）",
  "第二種免許（中型・大型）",
  "フォークリフト運転技能講習",
  "危険物取扱者",
  "運行管理者資格",
  "不問",
] as const;

export const EMPLOYMENT_TYPES = [
  "正社員",
  "契約社員",
  "パート・アルバイト",
  "業務委託",
  "嘱託社員",
] as const;

export const SALARY_TYPES = ["月給", "日給", "日給月給", "時給", "年俸"] as const;

export const EMPLOYEE_COUNTS = [
  "1〜9名",
  "10〜29名",
  "30〜49名",
  "50〜99名",
  "100〜299名",
  "300名以上",
] as const;

export const YES_NO = ["あり", "なし"] as const;
export const RELOCATION = ["なし", "あり", "当面なし"] as const;
export const DISTANCE_TYPES = ["地場（日帰り）", "中距離", "長距離（泊まりあり）", "混在"] as const;
export const LOADING_WORK = ["なし", "あり", "一部あり"] as const;
export const INEXPERIENCED = ["未経験可", "経験者のみ", "要相談"] as const;
export const OVERTIME = ["なし", "あり", "ほとんどなし"] as const;
export const EXCESS_PAYMENT = ["超過分は全額支給", "該当なし"] as const;
export const INSURANCE = ["雇用保険", "労災保険", "健康保険", "厚生年金"] as const;

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

/* ── STEP定義 ────────────────────────────────────────────────────────── */

export const STEPS: Step[] = [
  {
    no: 1,
    title: "企業情報",
    description: "求人を掲載する会社の情報です。応募通知はここで登録したメールアドレスへ届きます。",
    fields: [
      { key: "companyName", label: "会社名", type: "text", required: true, column: true, max: 200, placeholder: "例）株式会社ドラテク運輸" },
      { key: "companyNameKana", label: "会社名ふりがな", type: "text", required: true, column: true, max: 200, placeholder: "例）かぶしきがいしゃどらてくうんゆ" },
      { key: "corporateNumber", label: "法人番号", type: "text", max: 13, column: true, help: "13桁。個人事業主の場合は空欄で構いません。" },
      { key: "representativeName", label: "代表者名", type: "text", required: true, column: true, max: 100 },
      { key: "postalCode", label: "本社郵便番号", type: "postal", required: true, column: true, placeholder: "例）5000000" },
      { key: "addressPrefecture", label: "本社所在地（都道府県）", type: "select", required: true, column: true, options: PREFECTURES },
      { key: "address", label: "本社所在地（市区町村以下）", type: "text", required: true, column: true, max: 200 },
      { key: "websiteUrl", label: "会社ホームページURL", type: "url", column: true, max: 500 },
      { key: "contactName", label: "採用担当者名", type: "text", required: true, column: true, max: 100 },
      { key: "notificationEmail", label: "応募通知先メールアドレス", type: "email", required: true, column: true, max: 200, help: "求人登録の確認メールと、応募者情報の自動送信先になります。" },
      { key: "notificationEmailConfirm", label: "メールアドレス（確認入力）", type: "email", required: true, max: 200 },
      { key: "phone", label: "会社電話番号", type: "tel", required: true, column: true, help: "ドラテクから営業電話はいたしません。求人情報の記載内容としてお預かりします。" },
      { key: "businessDescription", label: "事業内容", type: "textarea", required: true, column: true, max: 1000, placeholder: "例）一般貨物自動車運送事業／食品のルート配送" },
      { key: "employeeCount", label: "従業員数", type: "select", column: true, options: EMPLOYEE_COUNTS },
      { key: "vehicleCount", label: "保有車両数", type: "text", column: true, max: 100, placeholder: "例）4t車10台／10t車5台" },
    ],
  },
  {
    no: 2,
    title: "求人基本情報",
    description: "求職者に表示される求人の基本情報です。",
    fields: [
      { key: "jobTitle", label: "求人タイトル", type: "text", required: true, column: true, max: 100, placeholder: "例）【中型ドライバー】食品ルート配送／年間休日115日" },
      { key: "jobTypes", label: "募集職種", type: "multiselect", required: true, column: true, options: JOB_TYPES },
      { key: "jobDescription", label: "仕事内容", type: "textarea", required: true, column: true, max: 3000 },
      { key: "hiringCount", label: "募集人数", type: "text", required: true, column: true, max: 50, placeholder: "例）2名" },
      { key: "employmentType", label: "雇用形態", type: "select", required: true, column: true, options: EMPLOYMENT_TYPES },
      { key: "contractPeriod", label: "契約期間", type: "text", max: 200, placeholder: "例）期間の定めなし" },
      { key: "contractRenewal", label: "契約更新の有無と基準", type: "textarea", max: 500 },
      { key: "trialPeriod", label: "試用期間", type: "text", max: 200, placeholder: "例）3か月" },
      { key: "trialConditions", label: "試用期間中の条件", type: "textarea", max: 500, help: "試用期間中に労働条件が変わる場合は必ずご記入ください。" },
      { key: "workPostalCode", label: "勤務地郵便番号", type: "postal", required: true, column: true },
      { key: "workPrefecture", label: "勤務地（都道府県）", type: "select", required: true, column: true, options: PREFECTURES },
      { key: "workAddress", label: "勤務地住所（市区町村以下）", type: "text", required: true, column: true, max: 200 },
      { key: "relocation", label: "転勤の有無", type: "select", required: true, column: true, options: RELOCATION },
      { key: "changeScope", label: "就業場所・業務の変更の範囲", type: "textarea", required: true, max: 500, help: "労働条件明示のルールで必要な項目です。変更の可能性がない場合は「変更なし」とご記入ください。" },
    ],
  },
  {
    no: 3,
    title: "勤務条件",
    description: "労働条件は求職者が応募を判断する最重要項目です。実際の条件を正確にご記入ください。",
    fields: [
      { key: "workingHours", label: "就業時間", type: "text", required: true, column: true, max: 200, placeholder: "例）8:00〜17:00" },
      { key: "breakTime", label: "休憩時間", type: "text", max: 100, placeholder: "例）60分" },
      { key: "overtime", label: "残業の有無", type: "select", required: true, options: OVERTIME },
      { key: "avgOvertimeHours", label: "月平均残業時間", type: "text", max: 50, placeholder: "例）20時間" },
      { key: "holidays", label: "休日", type: "text", required: true, column: true, max: 200, placeholder: "例）日曜・祝日＋土曜隔週" },
      { key: "leave", label: "休暇", type: "textarea", max: 500, placeholder: "例）年次有給休暇、夏季休暇、年末年始" },
      { key: "annualHolidays", label: "年間休日数", type: "text", max: 50, placeholder: "例）115日" },
      { key: "salaryType", label: "給与形態", type: "select", required: true, column: true, options: SALARY_TYPES },
      { key: "salaryMin", label: "給与下限", type: "number", required: true, column: true, unit: "円" },
      { key: "salaryMax", label: "給与上限", type: "number", required: true, column: true, unit: "円" },
      { key: "fixedOvertime", label: "固定残業代の有無", type: "select", required: true, options: YES_NO },
      { key: "fixedOvertimeAmount", label: "固定残業代の金額", type: "text", max: 100, help: "固定残業代が「あり」の場合は必ずご記入ください。" },
      { key: "fixedOvertimeHours", label: "固定残業代の対象時間", type: "text", max: 100, placeholder: "例）月20時間分" },
      { key: "excessPayment", label: "超過分の追加支給", type: "select", options: EXCESS_PAYMENT },
      { key: "raise", label: "昇給", type: "text", max: 200, placeholder: "例）年1回" },
      { key: "bonus", label: "賞与", type: "text", max: 200, placeholder: "例）年2回" },
      { key: "allowances", label: "各種手当", type: "textarea", max: 500, placeholder: "例）無事故手当、家族手当" },
      { key: "commuteAllowance", label: "交通費", type: "text", max: 200, placeholder: "例）規定支給（上限月2万円）" },
      { key: "insurance", label: "社会保険", type: "multiselect", options: INSURANCE },
      { key: "benefits", label: "福利厚生", type: "textarea", max: 500 },
      { key: "smokingPolicy", label: "受動喫煙防止措置", type: "text", required: true, max: 200, placeholder: "例）屋内禁煙（屋外に喫煙所あり）", help: "求人票への記載が法令で義務付けられている項目です。" },
    ],
  },
  {
    no: 4,
    title: "ドライバー求人詳細",
    description: "免許や業務内容は、求人メールの配信条件にも使われます。",
    fields: [
      { key: "requiredLicenses", label: "必要な免許", type: "multiselect", required: true, column: true, options: LICENSES },
      { key: "preferredLicenses", label: "歓迎する免許", type: "multiselect", column: true, options: LICENSES },
      { key: "requiredExperience", label: "必要な経験", type: "text", max: 200, placeholder: "例）中型車での配送経験1年以上" },
      { key: "inexperiencedOk", label: "未経験応募の可否", type: "select", required: true, column: true, options: INEXPERIENCED },
      { key: "vehicles", label: "使用する車両", type: "text", max: 200, placeholder: "例）4t平ボディ" },
      { key: "deliveryArea", label: "配送エリア", type: "text", max: 200, placeholder: "例）岐阜県内および愛知県西部" },
      { key: "cargo", label: "配送する荷物", type: "text", max: 200, placeholder: "例）常温食品（1個あたり10kg程度）" },
      { key: "dailyDistance", label: "1日の走行距離", type: "text", max: 100, placeholder: "例）150km前後" },
      { key: "distanceType", label: "長距離・中距離・地場", type: "select", column: true, options: DISTANCE_TYPES },
      { key: "loadingWork", label: "手積み・手降ろしの有無", type: "select", options: LOADING_WORK },
      { key: "vehicleEquipment", label: "車両設備", type: "text", max: 200, placeholder: "例）AT車、バックモニター、ドラレコ" },
      { key: "training", label: "研修制度", type: "textarea", max: 500 },
      { key: "licenseSupport", label: "資格取得支援", type: "textarea", max: 500 },
      { key: "selectionMethod", label: "選考方法", type: "text", max: 200, placeholder: "例）書類選考→面接1回" },
      { key: "imageUrl", label: "求人画像URL", type: "url", max: 500, help: "車両や職場の写真URL。お持ちでなければ空欄で構いません（画像アップロードは今後対応予定）。" },
      { key: "listingEndDate", label: "掲載終了日", type: "date", column: true, help: "募集終了時はこの日に自動で配信を停止します。未定の場合は空欄で構いません。" },
      { key: "notes", label: "その他の特記事項", type: "textarea", max: 1000 },
    ],
  },
];

/* ── STEP5: 同意項目（すべて必須） ───────────────────────────────────── */

export interface Consent {
  key: string;
  label: string;
  /** 規約ページへのリンクを出す場合 */
  href?: string;
  linkLabel?: string;
}

export const CONSENTS: Consent[] = [
  { key: "accuracy", label: "入力した求人情報が正確かつ最新であることを確認しました" },
  { key: "updatePromptly", label: "求人内容に変更があった場合は速やかに更新します" },
  { key: "stopWhenClosed", label: "募集終了時は求人を停止します" },
  { key: "successFee", label: "採用成果報酬1名25万円に同意します" },
  {
    key: "refundTerms",
    label: "早期退職時の返金条件を確認しました",
    href: "/driver/company/refund-policy",
    linkLabel: "早期退職時返金規程",
  },
  {
    key: "terms",
    label: "利用規約に同意します",
    href: "/driver/company/terms",
    linkLabel: "企業向け利用規約",
  },
  {
    key: "privacy",
    label: "プライバシーポリシーに同意します",
    href: "/driver/company/privacy",
    linkLabel: "プライバシーポリシー",
  },
];

/* ── 正規化 ──────────────────────────────────────────────────────────── */

export type RegistrationInput = Record<string, unknown>;

/** 制御文字を除去し長さを打ち切る。HTMLエスケープはしない（Reactが描画時に行う） */
function str(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const cleaned = v.replace(/[\u0000-\u001F\u007F]/g, "").trim();
  if (!cleaned) return null;
  return cleaned.slice(0, max);
}

/** 全角英数字・記号を半角に寄せる */
function toHalfWidth(v: string): string {
  return v.replace(/[０-９Ａ-Ｚａ-ｚ]/g, (c) =>
    String.fromCharCode(c.charCodeAt(0) - 0xfee0)
  );
}

export function normalizePhone(v: unknown): string | null {
  const raw = str(v, 40);
  if (!raw) return null;
  const digits = toHalfWidth(raw).replace(/[^\d]/g, "");
  if (digits.length < 9 || digits.length > 11) return null;
  return digits;
}

export function normalizePostal(v: unknown): string | null {
  const raw = str(v, 20);
  if (!raw) return null;
  const digits = toHalfWidth(raw).replace(/[^\d]/g, "");
  if (digits.length !== 7) return null;
  return digits;
}

export function normalizeEmail(v: unknown): string | null {
  const raw = str(v, 200);
  if (!raw) return null;
  const value = toHalfWidth(raw).toLowerCase();
  // 厳密すぎる検証は正当なアドレスを弾くため、実務的な形だけ確認する
  if (!/^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(value)) return null;
  return value;
}

/** http(s) のみ許可。javascript: などのスキームを排除する */
export function normalizeUrl(v: unknown): string | null {
  const raw = str(v, 500);
  if (!raw) return null;
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const u = new URL(withScheme);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.toString().slice(0, 500);
  } catch {
    return null;
  }
}

function normalizeNumber(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return Math.trunc(v);
  const raw = str(v, 20);
  if (!raw) return null;
  const digits = toHalfWidth(raw).replace(/[^\d]/g, "");
  if (!digits) return null;
  const n = Number(digits);
  return Number.isFinite(n) ? n : null;
}

function normalizeDate(v: unknown): string | null {
  const raw = str(v, 20);
  if (!raw) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null;
  const d = new Date(`${raw}T00:00:00+09:00`);
  return Number.isNaN(d.getTime()) ? null : raw;
}

function pickMany(v: unknown, allowed: readonly string[]): string[] {
  if (!Array.isArray(v)) return [];
  const out = v.filter((x): x is string => typeof x === "string" && allowed.includes(x));
  return Array.from(new Set(out)).slice(0, allowed.length);
}

export const ALL_FIELDS: Field[] = STEPS.flatMap((s) => s.fields);

/** 1項目を検証して正規化値を返す。null は未入力扱い */
export function normalizeField(field: Field, raw: unknown): { value: unknown; error?: string } {
  switch (field.type) {
    case "email": {
      const v = normalizeEmail(raw);
      if (!v && str(raw, 200)) return { value: null, error: `${field.label}の形式をご確認ください。` };
      return { value: v };
    }
    case "tel": {
      const v = normalizePhone(raw);
      if (!v && str(raw, 40)) return { value: null, error: `${field.label}の桁数をご確認ください。` };
      return { value: v };
    }
    case "postal": {
      const v = normalizePostal(raw);
      if (!v && str(raw, 20)) return { value: null, error: `${field.label}は7桁でご入力ください。` };
      return { value: v };
    }
    case "url": {
      const v = normalizeUrl(raw);
      if (!v && str(raw, 500)) return { value: null, error: `${field.label}の形式をご確認ください。` };
      return { value: v };
    }
    case "number": {
      const v = normalizeNumber(raw);
      if (v === null && str(raw, 20)) return { value: null, error: `${field.label}は数字でご入力ください。` };
      return { value: v };
    }
    case "date":
      return { value: normalizeDate(raw) };
    case "select": {
      const v = str(raw, 200);
      if (v && field.options && !field.options.includes(v)) {
        return { value: null, error: `${field.label}をご確認ください。` };
      }
      return { value: v };
    }
    case "multiselect":
      return { value: pickMany(raw, field.options ?? []) };
    default:
      return { value: str(raw, field.max ?? 200) };
  }
}

function isEmpty(v: unknown): boolean {
  if (v === null || v === undefined) return true;
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === "string") return v.trim() === "";
  return false;
}

export type ValidationResult =
  | { ok: true; values: Record<string, unknown>; consents: Record<string, boolean> }
  | { ok: false; errors: Record<string, string>; message: string };

/**
 * 受信データ全体を検証する。
 * エラーメッセージは利用者向けの文言のみで、内部情報は含めない。
 */
export function validateRegistration(body: RegistrationInput): ValidationResult {
  const errors: Record<string, string> = {};
  const values: Record<string, unknown> = {};

  for (const field of ALL_FIELDS) {
    const { value, error } = normalizeField(field, body[field.key]);
    if (error) {
      errors[field.key] = error;
      continue;
    }
    if (field.required && isEmpty(value)) {
      errors[field.key] = `${field.label}をご入力ください。`;
      continue;
    }
    values[field.key] = value;
  }

  // メールアドレスの確認入力の一致
  if (
    !errors.notificationEmail &&
    !errors.notificationEmailConfirm &&
    values.notificationEmail !== values.notificationEmailConfirm
  ) {
    errors.notificationEmailConfirm = "メールアドレスが一致しません。";
  }

  // 給与の下限・上限の整合
  const min = values.salaryMin as number | null;
  const max = values.salaryMax as number | null;
  if (typeof min === "number" && typeof max === "number" && min > max) {
    errors.salaryMax = "給与上限は下限以上の金額をご入力ください。";
  }

  // 固定残業代「あり」なら金額は必須（労働条件の明示に必要）
  if (values.fixedOvertime === "あり" && isEmpty(values.fixedOvertimeAmount)) {
    errors.fixedOvertimeAmount = "固定残業代の金額をご入力ください。";
  }

  // 掲載終了日は未来日のみ
  if (typeof values.listingEndDate === "string") {
    const end = new Date(`${values.listingEndDate}T23:59:59+09:00`);
    if (end.getTime() < Date.now()) {
      errors.listingEndDate = "掲載終了日は今日以降の日付をご指定ください。";
    }
  }

  // 同意項目はすべて必須
  const consents: Record<string, boolean> = {};
  const rawConsents = (body.consents ?? {}) as Record<string, unknown>;
  for (const c of CONSENTS) {
    const agreed = rawConsents[c.key] === true;
    consents[c.key] = agreed;
    if (!agreed) errors[`consent.${c.key}`] = "同意が必要です。";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors, message: "入力内容をご確認ください。" };
  }
  return { ok: true, values, consents };
}

/* ── DB行への変換 ────────────────────────────────────────────────────── */

const snake = (s: string) => s.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);

const COMPANY_KEYS = new Set(STEPS[0].fields.map((f) => f.key));

/** 企業テーブルへ入れる行。確認用の再入力メールは保存しない */
export function toCompanyRow(values: Record<string, unknown>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  for (const field of STEPS[0].fields) {
    if (field.key === "notificationEmailConfirm") continue;
    if (!field.column) continue;
    row[snake(field.key)] = values[field.key] ?? null;
  }
  return row;
}

/** 求人テーブルへ入れる行。column:true は独立カラム、それ以外は details にまとめる */
export function toJobRow(values: Record<string, unknown>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  const details: Record<string, unknown> = {};

  for (const field of ALL_FIELDS) {
    if (COMPANY_KEYS.has(field.key)) continue;
    const v = values[field.key];
    if (field.column) {
      row[snake(field.key)] = v ?? null;
    } else if (!isEmpty(v)) {
      details[field.key] = v;
    }
  }
  row.details = details;
  return row;
}

/**
 * DB の企業行・求人行から入力値（フォームと同じキー）を組み立て直す。
 * 管理画面で toDisplayRows に渡し、登録内容を入力時と同じ並び・ラベルで表示するために使う。
 */
export function fromRows(
  company: Record<string, unknown>,
  job: Record<string, unknown>
): Record<string, unknown> {
  const details = (job.details ?? {}) as Record<string, unknown>;
  const values: Record<string, unknown> = {};
  for (const field of ALL_FIELDS) {
    if (field.key === "notificationEmailConfirm") continue;
    if (COMPANY_KEYS.has(field.key)) values[field.key] = company[snake(field.key)];
    else if (field.column) values[field.key] = job[snake(field.key)];
    else values[field.key] = details[field.key];
  }
  return values;
}

/** 確認画面・通知メール用に「ラベル: 値」の一覧を作る */
export function toDisplayRows(
  values: Record<string, unknown>
): { step: string; rows: { label: string; value: string }[] }[] {
  return STEPS.map((step) => ({
    step: `STEP${step.no} ${step.title}`,
    rows: step.fields
      .filter((f) => f.key !== "notificationEmailConfirm")
      .map((f) => {
        const v = values[f.key];
        let text: string;
        if (isEmpty(v)) text = "未入力";
        else if (Array.isArray(v)) text = v.join("、");
        else if (typeof v === "number") text = `${v.toLocaleString("ja-JP")}${f.unit ?? ""}`;
        else text = String(v);
        return { label: f.label, value: text };
      }),
  }));
}
