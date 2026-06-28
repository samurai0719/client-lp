// ─────────────────────────────────────────────────────────────────────────────
// 対応工事カテゴリーデータ
// visible: false にすると、対応していない工事を非表示にできます。
// ─────────────────────────────────────────────────────────────────────────────

export type ServiceItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
  image?: string;
  slug?: string; // 将来的に詳細ページを作る場合
  visible: boolean;
};

export const services: ServiceItem[] = [
  {
    id: "parking",
    title: "駐車場・土間コンクリート",
    description:
      "砂利やぬかるみの駐車場をコンクリートに。排水勾配を計算した施工で、雨の日でも快適に使えます。",
    icon: "car",
    image: "/images/gaikou/services/service-parking.png",
    visible: true,
  },
  {
    id: "carport",
    title: "カーポート・ガレージ",
    description:
      "雨の日の乗り降りをラクに。メーカー品からお客様のご要望に合ったカーポートを提案します。",
    icon: "warehouse",
    visible: true,
  },
  {
    id: "fence",
    title: "フェンス・目隠し",
    description:
      "道路や隣家からの視線を遮る目隠しフェンスの設置に対応しています。",
    icon: "fence",
    image: "/images/gaikou/services/service-exterior.png",
    visible: true,
  },
  {
    id: "gate",
    title: "門柱・門扉",
    description:
      "古くなった門まわりの交換・リフォームに対応。宅配ボックスの設置もご相談ください。",
    icon: "door-open",
    visible: true,
  },
  {
    id: "approach",
    title: "玄関アプローチ",
    description:
      "滑りにくく、見た目もきれいな玄関アプローチへのリフォームに対応しています。",
    icon: "footprints",
    visible: true,
  },
  {
    id: "grass",
    title: "人工芝・防草対策",
    description:
      "毎年の草むしりをなくしたい方に。防草シート・人工芝・砂利敷きで手入れのいらないお庭に。",
    icon: "sprout",
    image: "/images/gaikou/services/service-garden.png",
    visible: true,
  },
  {
    id: "deck",
    title: "ウッドデッキ・テラス",
    description:
      "お庭でくつろぐスペースをつくりたい方に。ウッドデッキやタイルテラスの施工に対応しています。",
    icon: "layout-dashboard",
    visible: true,
  },
  {
    id: "garden",
    title: "庭リフォーム",
    description:
      "使いにくくなった庭の全面リフォーム。庭木や庭石の撤去から新しいレイアウトまで対応します。",
    icon: "flower",
    visible: true,
  },
  {
    id: "gravel",
    title: "砂利敷き",
    description:
      "防犯や防草を目的とした砂利敷きに対応。防草シートとの組み合わせもご相談いただけます。",
    icon: "circle-dot",
    visible: true,
  },
  {
    id: "drainage",
    title: "排水・水たまり対策",
    description:
      "雨の後に水たまりができる、排水が悪い場所の改善工事に対応しています。",
    icon: "droplets",
    visible: true,
  },
  {
    id: "full",
    title: "外構全体のリフォーム",
    description:
      "門まわりから駐車場・庭まで、外構全体を一括してリフォームする工事に対応しています。",
    icon: "home",
    visible: true,
  },
];

export const visibleServices = services.filter((s) => s.visible);
