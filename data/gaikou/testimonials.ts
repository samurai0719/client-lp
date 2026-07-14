// お客様の声セクションのデータ。
//
// ※現在は掲載イメージ（仮テキスト）。実際のお客様の声が揃ったら、
//   この配列を差し替えて isPlaceholder を false にするだけで表示が切り替わる。
//   isPlaceholder が true の間は、セクションに
//   「※現在は掲載イメージです。実際のお客様の声へ順次差し替え予定です。」が必ず表示される。

export type GaikouTestimonial = {
  /** 地域（例：岐阜県各務原市） */
  region: string;
  /** 年代・属性（例：40代男性） */
  profile: string;
  /** 工事内容の表示ラベル */
  workLabel: string;
  /** 本文 */
  quote: string;
  /** 星の数（1〜5） */
  rating: number;
};

/** true の間は「掲載イメージ」の注記を必ず表示する */
export const testimonialsArePlaceholder = true;

export const testimonialsDisclaimer =
  "※現在は掲載イメージです。実際のお客様の声へ順次差し替え予定です。";

export const gaikouTestimonials: GaikouTestimonial[] = [
  {
    region: "岐阜県各務原市",
    profile: "40代男性",
    workLabel: "駐車場コンクリート工事",
    quote:
      "複数社で見積もりを取りましたが、工事内容と費用の説明が一番分かりやすかったです。こちらの予算も考えながら提案してもらえました。",
    rating: 5,
  },
  {
    region: "愛知県一宮市",
    profile: "30代ご夫婦",
    workLabel: "庭リフォーム（コンクリート・人工芝）",
    quote:
      "雑草の手入れが大変だった庭を、コンクリートと人工芝に変更しました。完成後のイメージを事前に説明してもらえたので安心できました。",
    rating: 5,
  },
  {
    region: "岐阜県岐阜市",
    profile: "50代女性",
    workLabel: "庭撤去・駐車場拡張",
    quote:
      "庭を撤去して駐車場を広げてもらいました。現地調査から施工まで相談しやすく、進捗も写真で報告してもらえました。",
    rating: 5,
  },
];
