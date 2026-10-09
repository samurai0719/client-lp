/**
 * ドラテク 企業向けLP／企業登録・求人登録の設定値。
 *
 * 公開URL … driver.taxidriver-beginner.com/company
 *          driver.taxidriver-beginner.com/company/register
 * 物理ルート … app/driver/company, app/driver/company/register
 *   （/company は adofy コーポレートサイトが既に使っているため、
 *     next.config.ts のホスト条件付き rewrite で公開URLを合わせている）
 *
 * ── サービスの形（変更しないこと） ──────────────────────────────────
 * ドラテクはドライバー求人に特化した募集情報等提供サービス。人材紹介ではない。
 * 企業が会社情報と求人情報を自分で入力 → 求人を掲載 → 登録条件に一致する
 * 登録ドライバーへ自動メール配信 → 求職者が自分で応募 → 応募者情報を企業の
 * 登録メールアドレスへ自動送信。応募後は企業と応募者が直接やり取りする。
 * 運営者は営業電話・求職者への電話・求人や人材の推薦・候補者の選別・
 * 面接調整・給与交渉・採否判断を一切行わない。
 *
 * ── 事業者情報について ──────────────────────────────────────────────
 * 事業者名・屋号・所在地・電話番号・メールアドレス・特定募集情報等提供事業の
 * 届出受理番号は、確定した値が無いうちは必ず空文字のままにすること。
 * 空の項目はフッターにも本文にも表示されない（未確定の情報を出さないため）。
 * 値が決まったら、この定数を直接書き換えるか NEXT_PUBLIC_DORATECH_* を設定する。
 * ─────────────────────────────────────────────────────────────────
 */

/** 未設定（空白のみ）を空文字に寄せる */
function value(v: string | undefined): string {
  return (v ?? "").trim();
}

export const SERVICE = {
  name: "ドラテク",
  /** 企業向けLPの公開URL（canonical / OGP に使う） */
  url: "https://driver.taxidriver-beginner.com/company",
  registerUrl: "https://driver.taxidriver-beginner.com/company/register",
  siteUrl: "https://driver.taxidriver-beginner.com",
  /** 求職者向けページ（既存LP） */
  jobSeekerUrl: "https://driver.taxidriver-beginner.com/",
  logo: "/images/driver/logo.png",
  logoMark: "/images/driver/logo-mark.png",
} as const;

/** LP内のリンク先。CTAはすべて求人登録フォームへ送る（相談・問い合わせ導線は作らない） */
export const PATHS = {
  lp: "/driver/company",
  register: "/driver/company/register",
  terms: "/driver/company/terms",
  refundPolicy: "/driver/company/refund-policy",
  privacy: "/driver/company/privacy",
} as const;

/**
 * 消費税の取扱い。
 * 契約条件が確定していない間は "unspecified" のままにし、金額は「25万円」とだけ表示する。
 * 確定したら "included"（税込）/ "excluded"（税別）に切り替えると、
 * 金額表示の後ろに注記が付く。勝手に断定しないための設定値。
 */
export type TaxTreatment = "unspecified" | "included" | "excluded";

const TAX_TREATMENT = (value(process.env.NEXT_PUBLIC_DORATECH_TAX_TREATMENT) ||
  "unspecified") as TaxTreatment;

const TAX_SUFFIX: Record<TaxTreatment, string> = {
  unspecified: "",
  included: "（税込）",
  excluded: "（税別）",
};

export const PRICING = {
  /** 成果報酬の金額（表示用） */
  successFee: "25万円",
  /** 数値。構造化データと返金額の計算に使う */
  successFeeValue: 250000,
  successFeeUnit: "採用1名",
  /** 税の取扱いが確定している場合だけ付く注記。未確定なら空文字 */
  taxNote: TAX_SUFFIX[TAX_TREATMENT],
  taxTreatment: TAX_TREATMENT,
  /** 料金が発生する条件。文言を1箇所にまとめ、ページ内で表記がぶれないようにする */
  condition:
    "求人を掲載しただけ、メールを配信しただけ、応募が届いただけでは費用は発生しません。ドラテク経由で応募した求職者が実際に入社した場合にのみ、成果報酬が発生します。",
  /** 課金日は「採用決定」「内定」ではなく実際の入社日 */
  billingTrigger: "実際の入社日を料金発生日とします。採用決定や内定の時点では課金しません。",
} as const;

/**
 * 早期退職時の返金率。
 * 入社日から退職日までの日数で決まる。LP・利用規約・管理画面の返金計算で
 * この1か所だけを参照し、表記と計算がずれないようにする。
 */
export const REFUND_TIERS = [
  { maxDays: 30, rate: 100, label: "入社日から30日以内の退職", refund: "成果報酬の100％返金" },
  { maxDays: 60, rate: 50, label: "入社日から31〜60日以内の退職", refund: "成果報酬の50％返金" },
  { maxDays: 90, rate: 20, label: "入社日から61〜90日以内の退職", refund: "成果報酬の20％返金" },
  { maxDays: null, rate: 0, label: "入社日から91日以降の退職", refund: "返金なし" },
] as const;

/**
 * 入社日と退職日から返金率(%)を求める。
 * 返金額は「企業が実際に支払った成果報酬額」が上限になるため、
 * 金額の確定は呼び出し側で min(支払額 * rate, 支払額) として扱う。
 */
export function refundRate(hiredOn: Date, resignedOn: Date): number {
  const days = Math.floor((resignedOn.getTime() - hiredOn.getTime()) / 86_400_000);
  if (days < 0) return 0;
  for (const tier of REFUND_TIERS) {
    if (tier.maxDays === null || days <= tier.maxDays) return tier.rate;
  }
  return 0;
}

/** 返金対象・対象外。LPと利用規約で同じ文言を使う */
export const REFUND_ELIGIBLE = [
  "応募者本人の都合による自己都合退職",
  "応募者の責めに帰すべき事由による解雇",
  "入社後の無断欠勤など、応募者側の理由による就業継続不能",
] as const;

export const REFUND_INELIGIBLE = [
  "会社都合による解雇",
  "求人情報と実際の労働条件が異なっていた場合",
  "賃金未払い",
  "違法な長時間労働",
  "ハラスメント",
  "労働関係法令への違反",
  "企業が応募者へ虚偽の説明をしていた場合",
  "企業が退職を勧奨した場合",
  "企業または関連会社で引き続き雇用している場合",
  "業務委託などへ契約形態を変更して就業を継続している場合",
  "退職後6か月以内に再雇用した場合",
  "成果報酬が未払いの場合",
  "退職日から14日以内に返金申請が行われなかった場合",
  "退職を確認できる書類が提出されない場合",
] as const;

export const REFUND_PROCESS = [
  "企業管理画面から返金申請",
  "対象応募者と退職日を入力",
  "退職を確認できる書類を提出",
  "申請内容を確認",
  "返金対象額を確定",
  "確定後30日以内に登録口座へ返金",
] as const;

/** 事業者情報。空文字の項目は一切表示されない */
export const OPERATOR = {
  /** 事業者名 */
  name: value(process.env.NEXT_PUBLIC_DORATECH_OPERATOR_NAME),
  /** 屋号 */
  tradeName: value(process.env.NEXT_PUBLIC_DORATECH_TRADE_NAME),
  /** 所在地 */
  address: value(process.env.NEXT_PUBLIC_DORATECH_ADDRESS),
  /** 電話番号（フッターの事業者情報にのみ表示。LPに電話CTAは置かない） */
  phone: value(process.env.NEXT_PUBLIC_DORATECH_PHONE),
  /** 問い合わせ用メールアドレス（登録完了メールに記載する） */
  email: value(process.env.NEXT_PUBLIC_DORATECH_EMAIL),
  /**
   * 特定募集情報等提供事業届出受理番号（例: 51-募-000000）。
   * 届出が正式に受理されるまでは絶対に値を入れないこと。
   * 空の間はフッターの行ごと非表示になる。
   */
  noticeNumber: value(process.env.NEXT_PUBLIC_DORATECH_NOTICE_NUMBER),
} as const;

/** 受理番号を表示してよいか（値が入っているときだけ true） */
export const SHOW_NOTICE_NUMBER = OPERATOR.noticeNumber.length > 0;
