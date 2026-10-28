/**
 * ドラテク診断（求職者向けLP）の設問・選択肢・回答データの定義。
 *
 * 画面（DriverContent ほか）/ 送信API（/api/driver-register）/ DB保存（lib/driverCandidates/register.ts）/
 * 通知メール / 管理画面 で共有します。設問や選択肢を変えるときはここだけを直してください。
 *
 * 回答は質問番号ではなく安定したキー（DriverAnswers）で持ちます。
 * 1ステップに2問ある・複数選択がある、ため番号では表せないためです。
 */

/** 全ステップ数。最後のステップが連絡先入力（登録） */
export const TOTAL_STEPS = 6;

// ── 選択肢 ──────────────────────────────────────────────────

export const MOTIVATIONS = ['今すぐ転職したい', 'まずは情報収集したい'] as const;
export const DESIRED_TIMINGS = ['すぐに', '1か月以内', '3か月以内', '6か月以内', '良い会社があれば', 'まだ決めていない'] as const;
export const LICENSES = [
  '普通免許（AT）',
  '普通免許（MT）',
  '準中型5t限定',
  '準中型免許',
  '中型8t限定',
  '中型免許',
  '大型免許',
  'けん引免許',
  'フォークリフト',
  '第二種免許',
  'その他',
] as const;
export const DRIVER_EXPERIENCES = ['未経験', '1年未満', '1〜3年', '3〜5年', '5〜10年', '10年以上'] as const;
export const DESIRED_JOB_TYPES = [
  '軽貨物、宅配',
  '小型トラック',
  '中型トラック',
  '大型トラック',
  'トレーラー',
  'ルート配送',
  '地場配送',
  '長距離配送',
  'タクシー',
  'バス、送迎',
  '倉庫、物流関連',
  '特に決めていない',
] as const;
export const EMPLOYMENT_STATUSES = ['ドライバーとして在職中', '別の仕事で在職中', '離職中', 'アルバイト、派遣、学生', 'その他'] as const;
export const DESIRED_AREAS = [
  '現在の住所周辺',
  '北海道、東北',
  '関東',
  '中部、北陸',
  '関西',
  '中国、四国',
  '九州、沖縄',
  '相談して決めたい',
] as const;
export const PRIORITIES = [
  '給与を上げたい',
  '日勤で働きたい',
  '夜勤で働きたい',
  '毎日自宅に帰りたい',
  '長距離で稼ぎたい',
  '手積み、手降ろしを減らしたい',
  '休みを増やしたい',
  '人間関係を重視したい',
  '未経験から始めたい',
  '資格取得支援がほしい',
  '特に決めていない',
] as const;
export const DESIRED_SALARIES = ['300万円未満', '300〜400万円', '400〜500万円', '500〜600万円', '600万円以上', 'まだ決めていない'] as const;
export const CONTACT_TIMES = ['いつでも', '平日 午前（9〜12時）', '平日 午後（12〜17時）', '平日 夕方以降（17〜20時）', '土日・祝日'] as const;

/** 選ぶと他の選択を外す選択肢（複数選択の質問） */
export const EXCLUSIVE_CHOICES = {
  desiredJobTypes: '特に決めていない',
} as const;

export const PREFECTURES = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県',
  '岐阜県', '静岡県', '愛知県', '三重県',
  '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県',
  '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県',
  '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県',
] as const;

/** 希望勤務エリア（地域）→ その地域の都道府県。地域を選んだあとに都道府県を選べるようにする */
export const AREA_PREFECTURES: Record<string, readonly string[]> = {
  '北海道、東北': ['北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県'],
  関東: ['茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県'],
  '中部、北陸': ['新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県', '静岡県', '愛知県', '三重県'],
  関西: ['滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県'],
  '中国、四国': ['鳥取県', '島根県', '岡山県', '広島県', '山口県', '徳島県', '香川県', '愛媛県', '高知県'],
  '九州、沖縄': ['福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'],
};

// ── 回答データ ──────────────────────────────────────────────

export type DriverAnswers = {
  motivation: string;
  desiredTiming: string;
  licenses: string[];
  driverExperience: string;
  desiredJobTypes: string[];
  employmentStatus: string;
  postalCode: string;
  currentPrefecture: string;
  currentCity: string;
  desiredArea: string;
  desiredPrefecture: string;
  topPriority: string;
  desiredSalary: string;
};

export const EMPTY_ANSWERS: DriverAnswers = {
  motivation: '',
  desiredTiming: '',
  licenses: [],
  driverExperience: '',
  desiredJobTypes: [],
  employmentStatus: '',
  postalCode: '',
  currentPrefecture: '',
  currentCity: '',
  desiredArea: '',
  desiredPrefecture: '',
  topPriority: '',
  desiredSalary: '',
};

/** STEP7 の連絡先 */
export type DriverContact = {
  name: string;
  birthYear: string;
  phone: string;
  email: string;
  contactTime: string;
  comment: string;
};

export const EMPTY_CONTACT: DriverContact = { name: '', birthYear: '', phone: '', email: '', contactTime: '', comment: '' };

/** 生まれ年の選択肢（18歳〜75歳）。年は呼び出し時点で計算する */
export function birthYearOptions(now = new Date()): number[] {
  const y = now.getFullYear();
  return Array.from({ length: 58 }, (_, i) => y - 18 - i);
}

/** 回答の表示名（確認表示・通知メール・DBの answers・管理画面で共通） */
export const ANSWER_LABELS: Record<keyof DriverAnswers, string> = {
  motivation: '今のお気持ち',
  desiredTiming: '転職希望時期',
  licenses: 'お持ちの免許',
  driverExperience: 'ドライバー経験',
  desiredJobTypes: '希望する仕事',
  employmentStatus: '現在の状況',
  postalCode: '郵便番号',
  currentPrefecture: 'お住まいの都道府県',
  currentCity: 'お住まいの市区町村',
  desiredArea: '希望勤務エリア',
  desiredPrefecture: '希望勤務地（都道府県）',
  topPriority: '転職先で最も重視すること',
  desiredSalary: '希望年収',
};

/**
 * 管理画面で answers を表示する順番。DB（jsonb）はキーの順番を保たないため、表示側で並べ直す。
 * ここに無い項目名（旧LPの回答など）は後ろに元の順で出す。
 */
export const ANSWER_DISPLAY_ORDER: string[] = [
  ...Object.values(ANSWER_LABELS).slice(0, 6),
  '生まれ年',
  ...Object.values(ANSWER_LABELS).slice(6),
  '連絡希望時間帯',
  // 以前の診断（2026-10-28 まで）にあった質問。過去の登録者の表示用
  '運転経験のある車両',
  '希望する雇用形態',
  '転職先で重視すること',
];

/** 回答を「表示名 → 文字列」に並べる（未回答は省く。複数選択は「、」区切りではなく「／」区切り） */
export function answersToLabeled(a: DriverAnswers): [string, string][] {
  return (Object.keys(ANSWER_LABELS) as (keyof DriverAnswers)[])
    .map((k): [string, string] => {
      const v = a[k];
      return [ANSWER_LABELS[k], Array.isArray(v) ? v.join(' ／ ') : v];
    })
    .filter(([, v]) => v !== '');
}

// ── 入力チェック ─────────────────────────────────────────────

/** 郵便番号（ハイフン・全角は除いて7桁） */
export function normalizePostalCode(v: string): string {
  return v.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0)).replace(/[^\d]/g, '');
}

/** 電話番号（全角・ハイフン・空白を除いて 0 始まり 10〜11 桁） */
export function normalizeDriverPhone(v: string): string | null {
  const d = v.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0)).replace(/[^\d]/g, '');
  return /^0\d{9,10}$/.test(d) ? d : null;
}

export function isValidEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(v.trim());
}

/** 各ステップの回答が揃っているか（次へ進めるか） */
export function isStepComplete(step: number, a: DriverAnswers): boolean {
  switch (step) {
    case 1:
      return Boolean(a.motivation && a.desiredTiming);
    case 2:
      return a.licenses.length > 0 && Boolean(a.driverExperience);
    case 3:
      return a.desiredJobTypes.length > 0 && Boolean(a.employmentStatus);
    case 4:
      return Boolean(a.currentPrefecture) && Boolean(a.desiredArea);
    case 5:
      return Boolean(a.topPriority && a.desiredSalary);
    default:
      return true;
  }
}

/**
 * 送信された回答を、選択肢にある値だけに絞って取り込む（サーバー側）。
 * 旧形式（質問番号キー）は受け付けない。
 */
export function sanitizeAnswers(raw: unknown): DriverAnswers {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const one = (v: unknown, allowed: readonly string[]) => (typeof v === 'string' && allowed.includes(v) ? v : '');
  const many = (v: unknown, allowed: readonly string[]) =>
    Array.isArray(v) ? Array.from(new Set(v.filter((x): x is string => typeof x === 'string' && allowed.includes(x)))) : [];
  const text = (v: unknown, max: number) => (typeof v === 'string' ? v.replace(/[\u0000-\u001F\u007F]/g, '').trim().slice(0, max) : '');

  const desiredArea = one(r.desiredArea, DESIRED_AREAS);
  return {
    motivation: one(r.motivation, MOTIVATIONS),
    desiredTiming: one(r.desiredTiming, DESIRED_TIMINGS),
    licenses: many(r.licenses, LICENSES),
    driverExperience: one(r.driverExperience, DRIVER_EXPERIENCES),
    desiredJobTypes: many(r.desiredJobTypes, DESIRED_JOB_TYPES),
    employmentStatus: one(r.employmentStatus, EMPLOYMENT_STATUSES),
    postalCode: (() => {
      const p = normalizePostalCode(text(r.postalCode, 10));
      return p.length === 7 ? p : '';
    })(),
    currentPrefecture: one(r.currentPrefecture, PREFECTURES),
    currentCity: text(r.currentCity, 60),
    desiredArea,
    desiredPrefecture: one(r.desiredPrefecture, AREA_PREFECTURES[desiredArea] ?? []),
    topPriority: one(r.topPriority, PRIORITIES),
    desiredSalary: one(r.desiredSalary, DESIRED_SALARIES),
  };
}
