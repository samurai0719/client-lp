// 新築外構 無料診断の質問データ。
// 質問1（地域）〜質問6（時期）をここで管理し、質問7（連絡先）は
// DiagnosisContactForm で個別に扱う。文言を変えるときはこのファイルだけ修正する。

export type DiagnosisOption = {
  id: string;
  label: string;
  iconKey?: string;
};

export type DiagnosisQuestionDef = {
  step: 1 | 2 | 3 | 4 | 5 | 6;
  type: "multi" | "single";
  title: string;
  description?: string;
  options: DiagnosisOption[];
};

export const regionOptions: DiagnosisOption[] = [
  { id: "gifu", label: "岐阜県" },
  { id: "aichi", label: "愛知県" },
  { id: "mie", label: "三重県" },
  { id: "other", label: "その他" },
];

export const statusOptions: DiagnosisOption[] = [
  { id: "planning", label: "これから新築予定", iconKey: "home" },
  { id: "building", label: "現在建築中", iconKey: "construction" },
  { id: "pre-handover", label: "引き渡し前", iconKey: "calendar-clock" },
  { id: "handed-over", label: "引き渡し済み", iconKey: "key-round" },
  { id: "has-hm-quote", label: "ハウスメーカーから外構見積もりをもらっている", iconKey: "file-text" },
];

export const constructionTypeOptions: DiagnosisOption[] = [
  { id: "parking-concrete", label: "駐車場コンクリート", iconKey: "layers" },
  { id: "carport", label: "カーポート", iconKey: "warehouse" },
  { id: "gate-post", label: "門柱・ポスト", iconKey: "mailbox" },
  { id: "approach", label: "アプローチ", iconKey: "footprints" },
  { id: "fence", label: "フェンス・目隠し", iconKey: "fence" },
  { id: "garden", label: "庭・人工芝", iconKey: "sprout" },
  { id: "full-set", label: "外構一式", iconKey: "home" },
  { id: "undecided", label: "まだ決まっていない", iconKey: "circle-help" },
];

export const parkingCountOptions: DiagnosisOption[] = [
  { id: "one", label: "1台" },
  { id: "two", label: "2台" },
  { id: "three-plus", label: "3台以上" },
  { id: "unknown", label: "まだ分からない" },
];

export const budgetOptions: DiagnosisOption[] = [
  { id: "under-50", label: "50万円未満" },
  { id: "50-100", label: "50万〜100万円" },
  { id: "100-150", label: "100万〜150万円" },
  { id: "150-200", label: "150万〜200万円" },
  { id: "over-200", label: "200万円以上" },
  { id: "undecided", label: "まだ分からない" },
];

export const timingOptions: DiagnosisOption[] = [
  { id: "asap", label: "すぐに相談したい" },
  { id: "within-1m", label: "1ヶ月以内" },
  { id: "within-3m", label: "3ヶ月以内" },
  { id: "within-6m", label: "半年以内" },
  { id: "undecided", label: "未定" },
];

export const diagnosisQuestions: DiagnosisQuestionDef[] = [
  {
    step: 1,
    type: "single",
    title: "お住まい（新築地）の地域を教えてください",
    description: "現在は東海3県を中心に対応しています",
    options: regionOptions,
  },
  {
    step: 2,
    type: "single",
    title: "現在の状況を教えてください",
    description: "建築中・引き渡し前でもご相談いただけます",
    options: statusOptions,
  },
  {
    step: 3,
    type: "multi",
    title: "希望する工事内容を教えてください",
    description: "複数選択できます",
    options: constructionTypeOptions,
  },
  {
    step: 4,
    type: "single",
    title: "駐車場の希望台数を教えてください",
    options: parkingCountOptions,
  },
  {
    step: 5,
    type: "single",
    title: "ご希望の予算を教えてください",
    options: budgetOptions,
  },
  {
    step: 6,
    type: "single",
    title: "工事のご希望時期を教えてください",
    options: timingOptions,
  },
];
