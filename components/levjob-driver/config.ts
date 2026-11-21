/**
 * レバジョブ（ドライバー）を紹介するアンケート型の記事LP（/levjob-driver）の設定。
 *
 * ── 未確定（ユーザーから受け取ったら、ここだけ差し替える） ─────────────
 * ・CTA_URL：空にするとボタンを「準備中」にして、どこにも飛ばさない
 * ・FV_IMAGE：ファーストビューの画像。null の間は仮の背景を出す
 * ・豆知識の画像と赤丸の位置は TIPS（赤丸は画像に対する % 指定）
 * ・Meta Pixel は LEVJOB_DRIVER_PIXEL_ID だけ（共通Pixel 818 は app/layout.tsx で外している）。送るのは PageView のみ
 *
 * サービスの説明は、既存のレバジョブLP（public/sekou-kanri）で使っている範囲に留める。
 * 求人数・年収・内定実績などの数字は書かない。
 */

/** A8.net「転職サイト紹介様＿トラックLP用」のリンクと、同じ素材の表示計測用ビーコン */
export const CTA_URL = "https://px.a8.net/svt/ejp?a8mat=4B1HTK+EPVUPU+2JK4+5SLUXU";
export const A8_BEACON = "https://www19.a8.net/0.gif?a8mat=4B1HTK+EPVUPU+2JK4+5SLUXU";

export const LEVJOB_DRIVER_PIXEL_ID = "1186966720393058";

export const FV_IMAGE: { src: string; width: number; height: number; alt: string } | null = {
  src: "/images/levjob-driver/fv.webp",
  width: 960,
  height: 640,
  alt: "実際に使って良かった転職サイト！ 年収600万円・地場・土日休み。トラックの運転席でピースするドライバー",
};

export type Tip = {
  image: { src: string; width: number; height: number; alt: string };
  /** 赤丸の位置（画像の左上を 0,0 とした % 指定） */
  circle: { left: number; top: number; width: number; height: number; radius?: string };
  /** 本文の先頭で強調する語句 */
  em: string;
  text: string;
};

/** 豆知識。timing は2問目の下、area は3問目の下に出す。画像はレバジョブ登録画面のスクリーンショット */
export const TIPS = {
  timing: {
    image: {
      src: "/images/levjob-driver/tip-timing.webp",
      width: 705,
      height: 325,
      alt: "レバジョブの登録画面。「転職希望時期はいつですか？」の選択肢「なるべく早く」「1ヶ月以内」",
    },
    circle: { left: 49.3, top: 54, width: 50.2, height: 41 },
    em: "1ヶ月以内",
    text: "を選んでおくと優先的に良い求人が紹介してもらえます。なのでこちらを選んでおきましょう。",
  },
  area: {
    image: {
      src: "/images/levjob-driver/tip-area.webp",
      width: 735,
      height: 485,
      alt: "レバジョブの登録画面。希望職種の選択肢と、希望勤務地（都道府県・市区町村）の入力欄",
    },
    // 横に長い範囲なので楕円ではなく角丸の四角で囲む（楕円だと左上の「希望勤務地」に線がかかる）
    circle: { left: 1, top: 55, width: 98, height: 43, radius: "22px" },
    em: "希望勤務地はご自宅付近",
    text: "を選べばOK！決まっていたらそのまま希望勤務地を選びましょう！",
  },
} satisfies Record<string, Tip>;

export const TITLE = "【PR】ドライバーの転職｜簡単3問アンケートで好条件の求人を紹介してくれる転職サイト";
export const DESCRIPTION =
  "トラック・配送などドライバーの転職を考えている方へ。簡単3問のアンケートに答えていただいた方限定で、好条件の求人を紹介してくれる転職サイト「レバジョブ」をご紹介します。";

export const QUESTIONS = [
  { id: "q1", text: "今の会社から転職したいと感じますか？" },
  { id: "q2", text: "今の会社に不満を感じてますか？" },
  { id: "q3", text: "給料に不満を感じてますか？" },
] as const;

export type QuestionId = (typeof QUESTIONS)[number]["id"];
export type Answer = "yes" | "no";


export const CTA_LABEL = "好条件求人を紹介してもらう";
export const CTA_LIMITED = "アンケートを答えていただいた方限定、特別にご案内！";
export const CTA_SUB = "レバジョブ公式サイトへ（登録・相談は無料）";

export const FEATURES = [
  {
    title: "希望に合う求人を紹介してもらえる",
    body: "専任のキャリアアドバイザーが、勤務地・給料・休日などの希望を聞いたうえで、合う求人を探して紹介してくれます。",
  },
  {
    title: "書類づくりや面接対策も無料",
    body: "履歴書・職務経歴書の作成から面接対策まで、選考を無料でサポートしてもらえます。",
  },
  {
    title: "働きながらでも進めやすい",
    body: "求人探しや企業とのやりとりを任せられるので、今の仕事を続けながら転職活動を進められます。",
  },
] as const;

export const STEPS = [
  { title: "公式サイトから無料登録", body: "かんたんな入力で登録できます。転職時期は「1ヶ月以内」を選んでおきましょう。" },
  { title: "アドバイザーに希望を伝える", body: "勤務地・給料・休日・車種など、譲れない条件を伝えます。" },
  { title: "求人の紹介を受ける", body: "希望に合う求人の紹介と、書類・面接のサポートを受けられます。" },
] as const;

export const FAQS = [
  { q: "登録や相談にお金はかかりますか？", a: "かかりません。登録から求人紹介、書類・面接のサポートまで無料で利用できます。" },
  {
    q: "まだ転職するか決めていなくても大丈夫ですか？",
    a: "大丈夫です。まずはどんな求人があるかを聞いてみて、条件が合えば応募を考える、という使い方もできます。",
  },
] as const;

export const OPERATOR = {
  name: "塚本隼平",
  address: "岐阜県各務原市那加桐野外2か所大字入会地6-4",
  phone: "090-2342-7385",
  email: "info@tenshoku-gpt.com",
} as const;
