// 外構プラン無料診断の質問データ（質問2〜6）。
// 質問1（地域）はAreaSelector、質問7（連絡先）はDiagnosisContactFormで個別に扱う。

export type DiagnosisOption = {
  id: string;
  label: string;
  iconKey?: string;
};

export type DiagnosisQuestionDef = {
  step: 2 | 3 | 4 | 5 | 6;
  type: "multi" | "single";
  title: string;
  description?: string;
  options: DiagnosisOption[];
  allowOther?: boolean;
};

export const constructionTypeOptions: DiagnosisOption[] = [
  { id: "concrete", label: "砂利からコンクリートにしたい", iconKey: "layers" },
  { id: "expand-parking", label: "駐車場を広げたい", iconKey: "car-front" },
  { id: "garden-to-parking", label: "庭を駐車場に変えたい", iconKey: "trees" },
  { id: "carport", label: "カーポートを設置したい", iconKey: "warehouse" },
  { id: "weed-control", label: "雑草対策をしたい", iconKey: "sprout" },
  { id: "privacy-fence", label: "目隠しフェンスを設置したい", iconKey: "fence" },
  { id: "remove-trees-rocks", label: "庭木・庭石を撤去したい", iconKey: "tree-deciduous" },
  { id: "turf-tile-deck", label: "人工芝・タイルデッキを設置したい", iconKey: "grid-3x3" },
  { id: "full-renovation", label: "外構全体をリフォームしたい", iconKey: "home" },
  { id: "undecided", label: "まだ具体的に決まっていない", iconKey: "circle-help" },
];

export const worryOptions: DiagnosisOption[] = [
  { id: "gravel-scatter", label: "砂利が道路や玄関へ飛び散る", iconKey: "wind" },
  { id: "mud-puddle", label: "雨の日に泥や水たまりができる", iconKey: "cloud-rain" },
  { id: "weeding", label: "草むしりが大変", iconKey: "sprout" },
  { id: "parking-shortage", label: "車を停める場所が足りない", iconKey: "car-front" },
  { id: "privacy", label: "外からの視線が気になる", iconKey: "eye" },
  { id: "tree-rock-maintenance", label: "庭木や庭石の管理が大変", iconKey: "tree-deciduous" },
  { id: "outdated", label: "外構が古くなっている", iconKey: "construction" },
  { id: "price-unknown", label: "適正な工事価格が分からない", iconKey: "circle-help" },
  { id: "unsure-which-work", label: "どの工事が合うか分からない", iconKey: "compass" },
  { id: "other", label: "その他", iconKey: "ellipsis" },
];

export const sizeOptions: DiagnosisOption[] = [
  { id: "under-10", label: "10㎡未満" },
  { id: "10-20", label: "10〜20㎡程度" },
  { id: "20-30", label: "20〜30㎡程度" },
  { id: "30-50", label: "30〜50㎡程度" },
  { id: "over-50", label: "50㎡以上" },
  { id: "parking-1", label: "駐車場1台分" },
  { id: "parking-2", label: "駐車場2台分" },
  { id: "parking-3plus", label: "駐車場3台分以上" },
  { id: "unknown", label: "広さが分からない" },
];

export const timingOptions: DiagnosisOption[] = [
  { id: "asap", label: "できるだけ早く" },
  { id: "within-1m", label: "1か月以内" },
  { id: "within-3m", label: "3か月以内" },
  { id: "within-6m", label: "6か月以内" },
  { id: "within-1y", label: "1年以内" },
  { id: "undecided", label: "時期はまだ決めていない" },
  { id: "price-only", label: "まずは金額だけ知りたい" },
];

export const budgetOptions: DiagnosisOption[] = [
  { id: "under-30", label: "30万円未満" },
  { id: "30-50", label: "30〜50万円" },
  { id: "50-100", label: "50〜100万円" },
  { id: "100-200", label: "100〜200万円" },
  { id: "over-200", label: "200万円以上" },
  { id: "undecided", label: "まだ決めていない" },
];

export const paymentMethodOptions: DiagnosisOption[] = [
  { id: "cash", label: "現金・銀行振込" },
  { id: "loan", label: "銀行リフォームローンを検討" },
  { id: "consult", label: "相談して決めたい" },
];

export const diagnosisQuestions: DiagnosisQuestionDef[] = [
  {
    step: 2,
    type: "multi",
    title: "どのような工事をご希望ですか？",
    options: constructionTypeOptions,
  },
  {
    step: 3,
    type: "multi",
    title: "現在、どのようなことでお困りですか？",
    options: worryOptions,
    allowOther: true,
  },
  {
    step: 4,
    type: "single",
    title: "施工をご希望の広さを教えてください",
    options: sizeOptions,
  },
  {
    step: 5,
    type: "single",
    title: "いつ頃までに工事をご希望ですか？",
    options: timingOptions,
  },
  {
    step: 6,
    type: "single",
    title: "ご予算の目安を教えてください",
    options: budgetOptions,
  },
];
