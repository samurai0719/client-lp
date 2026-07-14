// 外構プラン無料診断の選択肢データ。
// 診断は4ステップ構成（STEP1: 地域 / STEP2: 工事種別＋工事内容 /
// STEP3: 広さ＋希望時期（任意） / STEP4: 概算表示＋連絡先）。
// worryOptions・budgetOptions・paymentMethodOptions は旧フォーマットの
// 送信データをAPI側で日本語ラベルに変換するために残している。

export type DiagnosisOption = {
  id: string;
  label: string;
  iconKey?: string;
};

// 工事種別（新築外構 / 外構リフォーム）。送信データ・管理画面・CRMにもこのラベルで保存する
export const workTypeOptions: DiagnosisOption[] = [
  { id: "new-construction", label: "新築外構", iconKey: "new-exterior" },
  { id: "renovation", label: "外構リフォーム", iconKey: "renovation" },
];

// 希望する工事内容（旧「希望工事」と「現在のお悩み」を統合した1つの質問）
// ※外構リフォーム選択時の選択肢。新築外構は newConstructionTypeOptions を表示する
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

// 新築外構を選んだ場合の工事内容（/new-exterior 診断と同じ内容。IDは nc- 接頭辞で区別する）
export const newConstructionTypeOptions: DiagnosisOption[] = [
  { id: "nc-parking-concrete", label: "駐車場コンクリート", iconKey: "layers" },
  { id: "nc-carport", label: "カーポート", iconKey: "warehouse" },
  { id: "nc-gate-post", label: "門柱・ポスト", iconKey: "mailbox" },
  { id: "nc-approach", label: "アプローチ", iconKey: "footprints" },
  { id: "nc-fence", label: "フェンス・目隠し", iconKey: "fence" },
  { id: "nc-garden", label: "庭・人工芝", iconKey: "sprout" },
  { id: "nc-full-set", label: "外構一式", iconKey: "home" },
  { id: "nc-undecided", label: "まだ決まっていない", iconKey: "circle-help" },
];

/** 工事種別に応じた工事内容の選択肢を返す */
export function constructionOptionsForWorkType(workType: string | null): DiagnosisOption[] {
  return workType === "new-construction" ? newConstructionTypeOptions : constructionTypeOptions;
}

export const sizeOptions: DiagnosisOption[] = [
  { id: "under-10", label: "10㎡未満", iconKey: "land-plot" },
  { id: "10-20", label: "10〜20㎡程度", iconKey: "land-plot" },
  { id: "20-30", label: "20〜30㎡程度", iconKey: "land-plot" },
  { id: "30-50", label: "30〜50㎡程度", iconKey: "land-plot" },
  { id: "over-50", label: "50㎡以上", iconKey: "land-plot" },
  { id: "parking-1", label: "駐車場1台分", iconKey: "car-front" },
  { id: "parking-2", label: "駐車場2台分", iconKey: "car-front" },
  { id: "parking-3plus", label: "駐車場3台分以上", iconKey: "car-front" },
  { id: "unknown", label: "広さが分からない", iconKey: "circle-help" },
];

export const timingOptions: DiagnosisOption[] = [
  { id: "asap", label: "できるだけ早く", iconKey: "zap" },
  { id: "within-1m", label: "1か月以内", iconKey: "calendar-clock" },
  { id: "within-3m", label: "3か月以内", iconKey: "calendar-days" },
  { id: "within-6m", label: "6か月以内", iconKey: "calendar-days" },
  { id: "within-1y", label: "1年以内", iconKey: "calendar-range" },
  { id: "undecided", label: "時期はまだ決めていない", iconKey: "circle-help" },
  { id: "price-only", label: "まずは金額だけ知りたい", iconKey: "calculator" },
];

// ── 以下は旧フォーマット互換用（API側のラベル変換で使用。診断UIでは未使用） ──

export const worryOptions: DiagnosisOption[] = [
  { id: "gravel-scatter", label: "砂利が道路や玄関へ飛び散る" },
  { id: "mud-puddle", label: "雨の日に泥や水たまりができる" },
  { id: "weeding", label: "草むしりが大変" },
  { id: "parking-shortage", label: "車を停める場所が足りない" },
  { id: "privacy", label: "外からの視線が気になる" },
  { id: "tree-rock-maintenance", label: "庭木や庭石の管理が大変" },
  { id: "outdated", label: "外構が古くなっている" },
  { id: "price-unknown", label: "適正な工事価格が分からない" },
  { id: "unsure-which-work", label: "どの工事が合うか分からない" },
  { id: "other", label: "その他" },
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
