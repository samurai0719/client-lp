import { AREA_PREFECTURES as DRIVER_AREA_PREFECTURES, PREFECTURES, normalizePostalCode } from "@/components/driver/questions";

/**
 * 建設職人の無料登録（/shokunin-entry）の設問・選択肢・回答データの定義。
 * 画面 / 送信API（/api/shokunin-entry）/ DB保存（lib/shokuninCandidates/save.ts）で共有する。
 * ドラテクとは回答データも保存先も分けている。流用するのは都道府県・郵便番号などの共通処理だけ。
 */

export const TOTAL_STEPS = 6;

export const MOTIVATIONS = ["今すぐ転職したい", "まずは情報収集したい"] as const;
export const DESIRED_TIMINGS = ["すぐに", "1か月以内", "3か月以内", "6か月以内", "良い会社があれば", "まだ決めていない"] as const;

const TRADES = [
  "鳶", "足場", "土木", "型枠", "大工", "塗装", "防水", "左官", "溶接・鉄骨",
  "解体", "外構・エクステリア", "電気工事", "設備・配管", "屋根・板金", "内装",
  "重機オペレーター", "施工管理", "その他",
] as const;
export const NO_EXPERIENCE = "建設業は未経験";
export const NO_PREFERENCE = "特に決めていない";
export const EXPERIENCED_TRADES = [...TRADES, NO_EXPERIENCE] as const;
export const DESIRED_TRADES = [...TRADES, NO_PREFERENCE] as const;

export const EXPERIENCE_YEARS = ["未経験", "1年未満", "1〜3年", "3〜5年", "5〜10年", "10年以上"] as const;
export const EMPLOYMENT_STATUSES = [
  "建設職人として在職中", "建設会社で別の仕事をしている", "別業種で在職中", "一人親方・フリーランス",
  "離職中", "アルバイト・派遣・学生", "その他",
] as const;

export const NEAR_HOME = "現在の住所周辺";
export const UNDECIDED_AREA = "相談して決めたい";
export const AREA_PREFECTURES: Record<string, readonly string[]> = {
  "北海道・東北": DRIVER_AREA_PREFECTURES["北海道、東北"],
  関東: DRIVER_AREA_PREFECTURES["関東"],
  "中部・北陸": DRIVER_AREA_PREFECTURES["中部、北陸"],
  関西: DRIVER_AREA_PREFECTURES["関西"],
  "中国・四国": DRIVER_AREA_PREFECTURES["中国、四国"],
  "九州・沖縄": DRIVER_AREA_PREFECTURES["九州、沖縄"],
};
export const DESIRED_AREAS = [NEAR_HOME, ...Object.keys(AREA_PREFECTURES), UNDECIDED_AREA];

export const PRIORITIES = [
  "給与を上げたい", "休日を増やしたい", "残業を減らしたい", "自宅から近い現場で働きたい",
  "人間関係の良い会社で働きたい", "安定した会社で働きたい", "資格取得を支援してほしい",
  "経験や技術を正当に評価してほしい", "未経験から技術を身につけたい", "寮・社宅のある会社を探したい",
  NO_PREFERENCE,
] as const;
export const DESIRED_SALARIES = [
  "300万円未満", "300万円以上", "350万円以上", "400万円以上", "450万円以上", "500万円以上", "600万円以上", "まだ決めていない",
] as const;
export const CONTACT_TIMES = ["いつでも", "平日午前", "平日午後", "平日17時以降", "土日・祝日"] as const;

export type EntryAnswers = {
  motivation: string;
  desiredTiming: string;
  experiencedTrades: string[];
  experienceYears: string;
  desiredTrades: string[];
  employmentStatus: string;
  postalCode: string;
  currentPrefecture: string;
  currentCity: string;
  desiredArea: string;
  desiredPrefecture: string;
  topPriority: string;
  desiredSalary: string;
};

export const EMPTY_ANSWERS: EntryAnswers = {
  motivation: "",
  desiredTiming: "",
  experiencedTrades: [],
  experienceYears: "",
  desiredTrades: [],
  employmentStatus: "",
  postalCode: "",
  currentPrefecture: "",
  currentCity: "",
  desiredArea: "",
  desiredPrefecture: "",
  topPriority: "",
  desiredSalary: "",
};

export type EntryContact = {
  name: string;
  birthYear: string;
  phone: string;
  email: string;
  contactTime: string;
  comment: string;
  privacyConsent: boolean;
};

export const EMPTY_CONTACT: EntryContact = { name: "", birthYear: "", phone: "", email: "", contactTime: "", comment: "", privacyConsent: false };

export const ANSWER_LABELS: Record<keyof EntryAnswers, string> = {
  motivation: "今のお気持ち",
  desiredTiming: "転職希望時期",
  experiencedTrades: "経験職種",
  experienceYears: "建設業の経験",
  desiredTrades: "希望する仕事",
  employmentStatus: "現在の状況",
  postalCode: "郵便番号",
  currentPrefecture: "お住まいの都道府県",
  currentCity: "お住まいの市区町村",
  desiredArea: "希望勤務エリア",
  desiredPrefecture: "希望勤務地（都道府県）",
  topPriority: "転職先で最も重視すること",
  desiredSalary: "希望年収",
};

/** 各ステップの回答が揃っているか（次へ進めるか） */
export function isStepComplete(step: number, a: EntryAnswers): boolean {
  switch (step) {
    case 1:
      return Boolean(a.motivation && a.desiredTiming);
    case 2:
      return a.experiencedTrades.length > 0 && Boolean(a.experienceYears);
    case 3:
      return a.desiredTrades.length > 0 && Boolean(a.employmentStatus);
    case 4:
      return Boolean(a.currentPrefecture && a.desiredArea);
    case 5:
      return Boolean(a.topPriority && a.desiredSalary);
    default:
      return true;
  }
}

/** 排他の選択肢が他と一緒に来たら、排他の選択肢だけにする */
function exclusive(values: string[], only: string): string[] {
  return values.includes(only) ? [only] : values;
}

/** サーバー側の入力検証。一覧に無い値は捨てる（改ざんされた回答を保存しない） */
export function sanitizeAnswers(raw: unknown): EntryAnswers {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const one = (v: unknown, list: readonly string[]) => (typeof v === "string" && list.includes(v) ? v : "");
  const many = (v: unknown, list: readonly string[]) =>
    Array.isArray(v) ? [...new Set(v.filter((x): x is string => typeof x === "string" && list.includes(x)))] : [];
  const desiredArea = one(r.desiredArea, DESIRED_AREAS);
  const postal = typeof r.postalCode === "string" ? normalizePostalCode(r.postalCode) : "";
  return {
    motivation: one(r.motivation, MOTIVATIONS),
    desiredTiming: one(r.desiredTiming, DESIRED_TIMINGS),
    experiencedTrades: exclusive(many(r.experiencedTrades, EXPERIENCED_TRADES), NO_EXPERIENCE),
    experienceYears: one(r.experienceYears, EXPERIENCE_YEARS),
    desiredTrades: exclusive(many(r.desiredTrades, DESIRED_TRADES), NO_PREFERENCE),
    employmentStatus: one(r.employmentStatus, EMPLOYMENT_STATUSES),
    postalCode: postal.length === 7 ? postal : "",
    currentPrefecture: one(r.currentPrefecture, PREFECTURES),
    currentCity: typeof r.currentCity === "string" ? r.currentCity.trim().slice(0, 60) : "",
    desiredArea,
    desiredPrefecture: one(r.desiredPrefecture, AREA_PREFECTURES[desiredArea] ?? []),
    topPriority: one(r.topPriority, PRIORITIES),
    desiredSalary: one(r.desiredSalary, DESIRED_SALARIES),
  };
}
