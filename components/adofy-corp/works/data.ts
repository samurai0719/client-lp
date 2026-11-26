/**
 * 実績ページ（/works/*）とトップページの動画広告で使う素材の一覧。
 * 動画:   public/videos/works/<slug>/<id>.mp4（本編・音声あり）と <id>-loop.mp4（最初の6秒・無音）
 * 表紙:   public/images/works/<slug>/posters/<id>.jpg
 * バナー: public/images/works/<slug>/banners/<file>
 * 成果の数値は確認できたものだけを載せる。ここに推測の数字は書かない。
 */

export type WorkVideo = { id: string; title: string };
export type WorkBanner = { file: string; alt: string; wide?: boolean };

export type WorkData = {
  slug: string;
  client: string;
  en: string;
  genre: string;
  lead: string;
  scope: string[];
  videos: WorkVideo[];
  banners: WorkBanner[];
  lp?: { src: string; alt: string; caption: string };
};

export const WORKS_DATA: Record<string, WorkData> = {
  "rizap-golf": {
    slug: "rizap-golf",
    client: "RIZAP GOLF",
    en: "RIZAP GOLF",
    genre: "ゴルフスクール",
    lead: "体験レッスン付きゴルフ力診断への予約を目的に、動画広告・バナー・記事LPをまとめて制作し、配信結果を見ながら改善しました。",
    scope: ["成果報酬型広告運用", "動画広告制作", "バナー制作", "記事LP制作"],
    videos: [
      { id: "slice", title: "スライス改善の体験談" },
      { id: "driver", title: "ドライバー上達訴求（ショート）" },
      { id: "driver-long", title: "ドライバー上達訴求（ロング）" },
    ],
    banners: [
      { file: "commit.webp", alt: "RIZAP GOLF バナー広告「たった2ヶ月でこんなに変わったの？」", wide: true },
      { file: "lesson.webp", alt: "RIZAP GOLF バナー広告「上手い人ほど実はレッスンに通っていたりする。」" },
    ],
    lp: {
      src: "/images/works/rizap-golf/creative.jpg",
      alt: "RIZAP GOLF 記事LPのPC・スマホ表示",
      caption: "広告から体験レッスンの予約までをつなぐ記事LP",
    },
  },
  "mynavi-pharmacist": {
    slug: "mynavi-pharmacist",
    client: "マイナビ薬剤師",
    en: "MYNAVI PHARMACIST",
    genre: "人材・薬剤師",
    lead: "病院薬剤師とワークライフバランスに絞った訴求で、動画広告・バナー・診断LPを制作しました。",
    scope: ["成果報酬型広告運用", "動画広告制作", "バナー制作", "診断LP制作"],
    videos: [
      { id: "worklife", title: "土日祝休みの薬剤師" },
      { id: "hospital", title: "病院薬剤師訴求" },
      { id: "first", title: "初めての転職訴求" },
    ],
    banners: [
      { file: "teiji.webp", alt: "マイナビ薬剤師 バナー広告「18時定時の職場で働きませんか？」" },
      { file: "donichi.webp", alt: "マイナビ薬剤師 バナー広告「土日祝休みの職場で働きませんか？」" },
      { file: "hospital.webp", alt: "マイナビ薬剤師 バナー広告「病院薬剤師として働きませんか？」" },
      { file: "line.webp", alt: "マイナビ薬剤師 バナー広告「LINEでの相談OK」" },
    ],
    lp: {
      src: "/images/works/mynavi-pharmacist/creative.jpg",
      alt: "マイナビ薬剤師 診断LPのPC・スマホ表示",
      caption: "質問に答えて求人を探せる診断LP",
    },
  },
  "nurse-senka": {
    slug: "nurse-senka",
    client: "ナース専科",
    en: "NURSE SENKA",
    genre: "人材・看護師",
    lead: "週休3日・初めての転職・訪問看護など、働き方ごとに訴求を分けた動画広告とバナー、LPを制作しました。",
    scope: ["成果報酬型広告運用", "動画広告制作", "バナー制作", "LP制作"],
    videos: [
      { id: "first", title: "初めての転職に成功した看護師" },
      { id: "shukyu3", title: "週休3日制で働く看護師" },
      { id: "homon", title: "施設訪問看護で働くメリット" },
    ],
    banners: [
      { file: "shukyu3.webp", alt: "ナース専科 バナー広告「週休3日で働きませんか？」" },
      { file: "shukyu3-b.webp", alt: "ナース専科 バナー広告「看護師もう頑張れないかも 週休3日」" },
      { file: "ranking.webp", alt: "ナース専科 バナー広告「初めての転職に強い看護師転職サイトランキング」" },
    ],
    lp: {
      src: "/images/works/nurse-senka/creative.jpg",
      alt: "ナース専科 LPのPC・スマホ表示",
      caption: "看護師向けのランキングLP",
    },
  },
  leverages: {
    slug: "leverages",
    client: "レバレジーズグループ",
    en: "LEVERAGES",
    genre: "人材・看護師／施工管理／ドライバー",
    lead: "レバウェル看護・レバジョブの広告で、職種と働き方ごとに動画広告を制作しました。",
    scope: ["成果報酬型広告運用", "動画広告制作"],
    videos: [
      { id: "levwell-14", title: "レバウェル看護｜14時出勤の看護師" },
      { id: "levwell-yakin", title: "レバウェル看護｜夜勤専従訴求" },
      { id: "levwell-jokin", title: "レバウェル看護｜年間休日130日" },
      { id: "levjob-sekou", title: "レバジョブ｜施工管理" },
      { id: "levjob-taxi", title: "レバジョブ｜タクシードライバー" },
    ],
    banners: [],
  },
};

/** トップページの動画広告（6秒の無音ループ）。リンク先は各実績ページ */
export const SHOWREEL: { slug: string; id: string; client: string; title: string }[] = [
  { slug: "rizap-golf", id: "slice", client: "RIZAP GOLF", title: "スライス改善の体験談" },
  { slug: "mynavi-pharmacist", id: "hospital", client: "マイナビ薬剤師", title: "病院薬剤師訴求" },
  { slug: "nurse-senka", id: "shukyu3", client: "ナース専科", title: "週休3日制で働く看護師" },
  { slug: "leverages", id: "levwell-jokin", client: "レバウェル看護", title: "年間休日130日" },
  { slug: "rizap-golf", id: "driver", client: "RIZAP GOLF", title: "ドライバー上達訴求" },
  { slug: "mynavi-pharmacist", id: "worklife", client: "マイナビ薬剤師", title: "土日祝休みの薬剤師" },
  { slug: "nurse-senka", id: "first", client: "ナース専科", title: "初めての転職" },
  { slug: "leverages", id: "levjob-sekou", client: "レバジョブ", title: "施工管理" },
];
