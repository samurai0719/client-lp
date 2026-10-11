/**
 * adofy 無料ホームページデザイン — 選択肢の定義。
 *
 * チャット画面・受付API・管理画面・メールのすべてがこのファイルを参照する。
 * 選択肢を増やす／文言を変えるときはここだけを触ればよい（id は保存値なので変えない）。
 */

export type Option = { id: string; label: string };

/** 業種。group は選択肢を見出しごとにまとめて表示するためのもの */
export const INDUSTRY_GROUPS = [
  { id: "build", label: "住まい・建設・不動産" },
  { id: "shop", label: "飲食・小売・宿泊" },
  { id: "health", label: "美容・健康・医療・福祉" },
  { id: "service", label: "教育・暮らしのサービス" },
  { id: "business", label: "企業・専門サービス" },
  { id: "industry", label: "製造・物流・その他の産業" },
] as const;

export const INDUSTRIES = [
  { id: "construction", label: "建設・工事", group: "build" },
  { id: "real_estate", label: "不動産", group: "build" },
  { id: "restaurant", label: "飲食店・カフェ", group: "shop" },
  { id: "retail", label: "小売・ショップ", group: "shop" },
  { id: "ec", label: "EC・通販", group: "shop" },
  { id: "hotel", label: "ホテル・旅館・民泊", group: "shop" },
  { id: "salon", label: "美容院・サロン", group: "health" },
  { id: "clinic", label: "医療・クリニック", group: "health" },
  { id: "dental", label: "歯科医院", group: "health" },
  { id: "bodycare", label: "整骨院・整体・鍼灸", group: "health" },
  { id: "fitness", label: "フィットネス・ジム", group: "health" },
  { id: "care", label: "介護・福祉", group: "health" },
  { id: "school", label: "教室・スクール・塾", group: "service" },
  { id: "childcare", label: "保育・幼児教育", group: "service" },
  { id: "wedding", label: "結婚式・葬儀", group: "service" },
  { id: "photo", label: "写真・映像", group: "service" },
  { id: "pet", label: "ペット関連", group: "service" },
  { id: "cleaning", label: "清掃・ハウスクリーニング", group: "service" },
  { id: "auto", label: "自動車販売・整備", group: "service" },
  { id: "travel", label: "観光・旅行・レジャー", group: "service" },
  { id: "professional", label: "士業（税理士・弁護士など）", group: "business" },
  { id: "consulting", label: "コンサルティング", group: "business" },
  { id: "it", label: "IT・Web・システム", group: "business" },
  { id: "creative", label: "広告・デザイン・制作", group: "business" },
  { id: "staffing", label: "人材・派遣", group: "business" },
  { id: "finance", label: "金融・保険", group: "business" },
  { id: "security", label: "警備", group: "business" },
  { id: "manufacturing", label: "製造業・工場", group: "industry" },
  { id: "logistics", label: "運送・物流", group: "industry" },
  { id: "wholesale", label: "卸売・商社", group: "industry" },
  { id: "agriculture", label: "農業・林業・漁業", group: "industry" },
  { id: "energy", label: "電気・ガス・エネルギー", group: "industry" },
  { id: "printing", label: "印刷", group: "industry" },
  { id: "organization", label: "NPO・団体・自治体", group: "industry" },
  { id: "other", label: "その他", group: "industry" },
] as const satisfies readonly (Option & { group: string })[];

/**
 * 業種ごとの詳しい種類（業種を選んだ後に表示する）。
 * 保存値は表示文言そのもの。末尾に自動で「その他」（自由入力）が付く。
 * 建設・工事は、よく選ばれる工事 → 建設業許可の29業種の順。
 */
export const INDUSTRY_SUBS: Record<string, readonly string[]> = {
  construction: [
    "工務店・注文住宅", "リフォーム・リノベーション", "外壁・屋根塗装", "外構・エクステリア",
    "土木工事", "解体工事", "電気工事", "水道・空調・設備工事", "内装工事", "屋根工事",
    "建築一式工事", "大工工事", "左官工事", "とび・土工・コンクリート工事", "石工事",
    "タイル・れんが・ブロック工事", "鋼構造物工事", "鉄筋工事", "舗装工事", "しゅんせつ工事",
    "板金工事", "ガラス工事", "防水工事", "機械器具設置工事", "熱絶縁工事", "電気通信工事",
    "造園工事", "さく井工事", "建具工事", "水道施設工事", "消防施設工事", "清掃施設工事",
  ],
  real_estate: ["売買仲介", "賃貸仲介", "賃貸管理", "不動産買取・再販", "土地活用・開発", "マンション管理"],
  restaurant: ["居酒屋", "和食・寿司", "焼肉・ステーキ", "ラーメン・中華", "イタリアン・フレンチ", "カフェ・喫茶", "バー", "パン・スイーツ", "テイクアウト・弁当・キッチンカー"],
  retail: ["衣料品・アパレル", "雑貨・インテリア", "食品・酒", "家電・携帯", "家具", "花屋", "書店・文具", "メガネ・時計・宝飾"],
  ec: ["ファッション", "食品・お取り寄せ", "化粧品・健康食品", "雑貨・インテリア", "デジタルコンテンツ", "定期便・サブスク"],
  hotel: ["ホテル", "旅館", "民泊・ゲストハウス", "グランピング・キャンプ場", "貸別荘"],
  salon: ["美容院・ヘアサロン", "理容室", "ネイルサロン", "まつげ・アイブロウ", "エステサロン", "脱毛サロン", "リラクゼーション・マッサージ"],
  clinic: ["内科", "皮膚科・美容皮膚科", "美容外科", "整形外科", "小児科", "眼科", "耳鼻咽喉科", "産婦人科", "心療内科・精神科", "動物病院"],
  dental: ["一般歯科", "矯正歯科", "審美・インプラント", "小児歯科"],
  bodycare: ["整骨院・接骨院", "整体院", "鍼灸院", "カイロプラクティック", "訪問マッサージ"],
  fitness: ["パーソナルジム", "フィットネスクラブ", "ヨガ・ピラティス", "ダンススタジオ", "キックボクシング・格闘技"],
  care: ["訪問介護", "デイサービス", "有料老人ホーム", "グループホーム", "障がい福祉サービス", "訪問看護"],
  school: ["学習塾・予備校", "英会話・語学", "プログラミング教室", "音楽教室", "習い事・カルチャー", "資格・職業訓練", "自動車教習所"],
  childcare: ["保育園", "幼稚園", "認可外保育・ベビーシッター", "放課後等デイサービス", "学童保育"],
  wedding: ["結婚式場", "フォトウェディング", "結婚相談所", "葬儀社", "仏壇・墓石"],
  photo: ["写真スタジオ", "出張撮影", "映像・動画制作", "ドローン撮影"],
  pet: ["トリミングサロン", "ペットホテル", "ドッグトレーニング", "ペットショップ", "ペットシッター"],
  cleaning: ["ハウスクリーニング", "エアコンクリーニング", "ビルメンテナンス", "遺品整理・不用品回収", "害虫駆除"],
  auto: ["新車・中古車販売", "車検・整備", "板金・塗装", "カーコーティング", "レンタカー", "バイク販売・整備"],
  travel: ["旅行代理店", "観光施設", "アクティビティ・体験", "レジャー施設"],
  professional: ["税理士・会計士", "弁護士", "司法書士", "行政書士", "社会保険労務士", "土地家屋調査士", "弁理士"],
  consulting: ["経営コンサル", "IT・DXコンサル", "人事・組織コンサル", "マーケティング支援", "補助金・資金調達支援"],
  it: ["システム開発", "Web制作", "アプリ開発", "SaaS・自社サービス", "ITサポート・保守", "ネットワーク・インフラ"],
  creative: ["広告代理店", "デザイン事務所", "印刷・販促物制作", "映像制作", "SNS運用代行"],
  staffing: ["人材紹介", "人材派遣", "求人メディア", "業務委託・BPO"],
  finance: ["保険代理店", "ファイナンシャルプランナー", "金融機関", "投資・資産運用", "リース"],
  security: ["施設警備", "交通誘導", "イベント警備", "ホームセキュリティ"],
  manufacturing: ["金属加工", "食品製造", "機械・部品製造", "化学・樹脂", "繊維・アパレル製造", "木材・家具製造", "電子部品"],
  logistics: ["一般貨物運送", "軽貨物配送", "倉庫・物流センター", "引越し", "タクシー・ハイヤー", "バス"],
  wholesale: ["食品卸", "建材・資材卸", "機械・工具卸", "医薬品・化粧品卸", "衣料・雑貨卸"],
  agriculture: ["農業・農園", "畜産", "林業", "漁業・水産", "農産物直売"],
  energy: ["太陽光・蓄電池", "電力・ガス小売", "ガソリンスタンド", "再生可能エネルギー"],
  printing: ["商業印刷", "名刺・チラシ印刷", "シール・ラベル印刷", "看板・サイン"],
  organization: ["NPO法人", "一般社団法人", "協同組合", "自治体・公共団体", "学校法人"],
};

/** 業種の表示（詳しい種類があれば括弧で添える） */
export function industryText(id: string, other?: string | null, detail?: string | null): string {
  const base = id === "other" && other ? `その他（${other}）` : labelOf(INDUSTRIES, id);
  return detail ? `${base}（${detail}）` : base;
}

export const PURPOSES = [
  { id: "customers", label: "新しいお客様を増やしたい" },
  { id: "trust", label: "会社の信頼性を高めたい" },
  { id: "recruit", label: "求人・採用を強化したい" },
  { id: "products", label: "商品やサービスを紹介したい" },
  { id: "stylish", label: "おしゃれなホームページが欲しい" },
  { id: "other", label: "その他" },
] as const satisfies readonly Option[];

export const STYLES = [
  { id: "simple", label: "シンプル・清潔感" },
  { id: "luxury", label: "高級感のあるデザイン" },
  { id: "cool", label: "かっこいい・スタイリッシュ" },
  { id: "friendly", label: "親しみやすい・明るい" },
  { id: "natural", label: "ナチュラル・おしゃれ" },
  { id: "omakase", label: "おまかせ" },
] as const satisfies readonly Option[];

/** swatch は色ボタンの表示色。null は「その他／おまかせ」用の特別表示 */
export const COLORS = [
  { id: "blue", label: "青", swatch: "#2563eb" },
  { id: "black", label: "黒", swatch: "#111827" },
  { id: "white", label: "白", swatch: "#ffffff" },
  { id: "green", label: "緑", swatch: "#16a34a" },
  { id: "red", label: "赤", swatch: "#dc2626" },
  { id: "yellow", label: "黄色", swatch: "#facc15" },
  { id: "other", label: "その他", swatch: null },
  { id: "omakase", label: "おまかせ", swatch: null },
] as const satisfies readonly (Option & { swatch: string | null })[];

export const CONTENTS = [
  { id: "company", label: "会社紹介" },
  { id: "services", label: "サービス・事業内容" },
  { id: "works", label: "施工事例・実績" },
  { id: "pricing", label: "商品・料金" },
  { id: "voices", label: "お客様の声" },
  { id: "recruit", label: "求人情報" },
  { id: "staff", label: "スタッフ紹介" },
  { id: "contact", label: "お問い合わせ" },
  { id: "other", label: "その他" },
  { id: "omakase", label: "おまかせ" },
] as const satisfies readonly Option[];

export const WEBSITE_CHOICES = [
  { id: "yes", label: "ある" },
  { id: "no", label: "ない" },
] as const satisfies readonly Option[];

export const REFERENCE_CHOICES = [
  { id: "yes", label: "ある" },
  { id: "no", label: "ない" },
  { id: "omakase", label: "おまかせ" },
] as const satisfies readonly Option[];

export const ASSET_CHOICES = [
  { id: "both", label: "写真もロゴもある" },
  { id: "photos", label: "写真だけある" },
  { id: "logo", label: "ロゴだけある" },
  { id: "none", label: "どちらもない" },
  { id: "later", label: "後から送りたい" },
] as const satisfies readonly Option[];

/** アップロード欄を出す選択肢（どちらもない／後から送りたい はアップロードを省略する） */
export const ASSET_CHOICES_WITH_UPLOAD = ["both", "photos", "logo"] as const;

export const STATUSES = [
  { id: "new", label: "新規申し込み" },
  { id: "in_production", label: "制作中" },
  { id: "design_ready", label: "デザイン完成" },
  { id: "sent", label: "送付済み" },
  { id: "purchased", label: "購入済み" },
  { id: "declined", label: "見送り" },
] as const satisfies readonly Option[];

export type StatusId = (typeof STATUSES)[number]["id"];

/* ── アップロード制限（クライアント・サーバー共通） ──────────────────── */

export const UPLOAD_BUCKET = "hp-design-uploads";
export const MAX_UPLOAD_FILES = 10;
export const MAX_UPLOAD_SIZE = 10 * 1024 * 1024; // 10MB（バケット側の制限と合わせる）
export const ALLOWED_UPLOAD_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/heif": "heif",
};

/* ── 入力の上限 ────────────────────────────────────────────────────── */

export const LIMITS = {
  short: 100,
  url: 500,
  text: 2000,
  referenceUrls: 5,
} as const;

/* ── 表示ヘルパー ──────────────────────────────────────────────────── */

export function labelOf(list: readonly Option[], id: string | null | undefined): string {
  if (!id) return "";
  return list.find((o) => o.id === id)?.label ?? id;
}

/** 複数選択の表示。「その他」は自由入力の内容に置き換える */
export function labelsOf(
  list: readonly Option[],
  ids: readonly string[] | null | undefined,
  other?: string | null
): string {
  return (ids ?? [])
    .map((id) => (id === "other" && other ? `その他（${other}）` : labelOf(list, id)))
    .join("、");
}

export function colorText(id: string, other?: string | null): string {
  return id === "other" && other ? `その他（${other}）` : labelOf(COLORS, id);
}

/** このページ下部のフッター（components/adofy/free-design/FreeDesignFooter.tsx）を指す */
export const PRIVACY_POLICY_HREF = "#privacy";

/** チャットの同意欄とメールで同じ文言を使う */
export const PURPOSE_OF_USE =
  "ご入力いただいた情報は、ホームページのデザイン案の制作、完成したデザインのご案内、本サービスに関するご連絡のために利用します。法令に基づく場合を除き、ご本人の同意なく第三者へ提供することはありません。";
