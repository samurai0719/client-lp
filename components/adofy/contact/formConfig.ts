/**
 * 相談フォームの質問定義。
 * 選択肢の value は lib/types/consultation.ts の許可リストと一致させること
 * （サーバー側で許可リスト検証を行うため、ズレると値が捨てられる）。
 */

export type Choice = { value: string; label: string; note?: string };

export const BUSINESS_TYPE_CHOICES: Choice[] = [
  { value: "corporation", label: "法人" },
  { value: "sole", label: "個人事業主" },
  { value: "planned", label: "開業予定" },
  { value: "other", label: "その他" },
];

export const INDUSTRY_CHOICES: Choice[] = [
  { value: "exterior", label: "外構・エクステリア" },
  { value: "painting", label: "外壁塗装" },
  { value: "roof", label: "屋根工事" },
  { value: "demolition", label: "解体工事" },
  { value: "reform", label: "リフォーム" },
  { value: "electric", label: "電気工事" },
  { value: "plumbing", label: "水道工事" },
  { value: "interior", label: "内装工事" },
  { value: "scaffold", label: "足場工事" },
  { value: "civil", label: "造成・土木工事" },
  { value: "builder", label: "工務店" },
  { value: "other", label: "その他" },
];

export const HAS_WEBSITE_CHOICES: Choice[] = [
  { value: "yes", label: "ある" },
  { value: "no", label: "ない" },
  { value: "building", label: "制作途中" },
  { value: "unknown", label: "分からない" },
];

export const TOPIC_CHOICES: Choice[] = [
  { value: "new", label: "新しいホームページを作りたい" },
  { value: "renewal", label: "既存ホームページをリニューアルしたい" },
  { value: "inquiries", label: "ホームページから問い合わせを増やしたい" },
  { value: "direct", label: "元請け・一般のお客様から直接受注したい" },
  { value: "recruit", label: "従業員や職人を採用したい" },
  { value: "ads", label: "Web広告も依頼したい" },
  { value: "seo", label: "SEO・Google検索対策をしたい" },
  { value: "unsure", label: "何をすればよいか分からないので相談したい" },
  { value: "other", label: "その他" },
];

export const PROBLEM_CHOICES: Choice[] = [
  { value: "subcontract", label: "下請け仕事が中心で利益が残らない" },
  { value: "lowprice", label: "元請けからの受注金額が安い" },
  { value: "noleads", label: "自社でお客様を集められていない" },
  { value: "referral", label: "紹介だけに依存している" },
  { value: "nohpinquiry", label: "ホームページから問い合わせが来ない" },
  { value: "norecruit", label: "求人を出しても応募が来ない" },
  { value: "nodiff", label: "競合他社との差別化ができていない" },
  { value: "noweb", label: "Webのことが分からない" },
  { value: "other", label: "その他" },
];

export const PLAN_CHOICES: Choice[] = [
  {
    value: "standard",
    label: "20万円｜集客ホームページ制作・条件付き全額返金保証",
    note: "全額返金保証には適用条件があります。詳細はご契約前に書面でご案内します。",
  },
  { value: "consult", label: "相談して決めたい" },
];

export const TIMING_CHOICES: Choice[] = [
  { value: "asap", label: "できるだけ早く" },
  { value: "1month", label: "1ヶ月以内" },
  { value: "3months", label: "3ヶ月以内" },
  { value: "6months", label: "半年以内" },
  { value: "undecided", label: "まだ決まっていない" },
];

export const CONTACT_METHOD_CHOICES: Choice[] = [
  { value: "phone", label: "電話" },
  { value: "email", label: "メール" },
  { value: "any", label: "どちらでもよい" },
];

export const CONTACT_TIME_CHOICES: Choice[] = [
  { value: "9-12", label: "9時〜12時" },
  { value: "12-15", label: "12時〜15時" },
  { value: "15-18", label: "15時〜18時" },
  { value: "18-", label: "18時以降" },
  { value: "any", label: "いつでもよい" },
];

export const PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県",
  "岐阜県", "静岡県", "愛知県", "三重県",
  "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
  "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県",
  "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
] as const;

/** フォームの回答データ */
export type FormData = {
  businessType: string;
  companyName: string;
  contactName: string;
  position: string;
  prefecture: string;
  city: string;
  industries: string[];
  industryOther: string;
  hasWebsite: string;
  websiteUrl: string;
  consultationTopics: string[];
  consultationOther: string;
  currentProblems: string[];
  problemOther: string;
  selectedPlan: string;
  desiredTiming: string;
  phone: string;
  email: string;
  preferredContactMethod: string;
  preferredContactTime: string;
};

export const EMPTY_FORM: FormData = {
  businessType: "",
  companyName: "",
  contactName: "",
  position: "",
  prefecture: "",
  city: "",
  industries: [],
  industryOther: "",
  hasWebsite: "",
  websiteUrl: "",
  consultationTopics: [],
  consultationOther: "",
  currentProblems: [],
  problemOther: "",
  selectedPlan: "",
  desiredTiming: "",
  phone: "",
  email: "",
  preferredContactMethod: "",
  preferredContactTime: "",
};

/**
 * ステップの見出し（進捗表示と確認画面の見出しに使う）。
 *
 * 入力完了まで約1分に収めるため、質問は4問に絞っている。
 * 外した質問（事業形態・役職・市区町村・現在のHP・現在のお悩み・希望プラン・希望時期）は
 * DBの列もサーバー側の許可リストもそのまま残してあるので、
 * 復活させる場合は STEP_TITLES と validateStep、ConsultationForm の該当ブロックを戻すだけでよい。
 *
 * 希望プランだけは、料金表のCTA（/contact?plan=xxx）から自動で引き継ぐため質問しない。
 */
export const STEP_TITLES = [
  "主な事業内容",
  "ご相談内容",
  "会社情報",
  "ご連絡先",
  "入力内容の確認",
] as const;

export const TOTAL_STEPS = STEP_TITLES.length;

/** 料金プランのCTA（?plan=xxx）で渡ってくる値を検証する */
export function normalizePlanParam(value: string | null): string {
  if (!value) return "";
  return PLAN_CHOICES.some((c) => c.value === value) ? value : "";
}

/** 各ステップの入力が完了しているか（未入力なら次へ進めない） */
export function validateStep(step: number, data: FormData): string | null {
  switch (step) {
    case 0:
      if (data.industries.length === 0) return "主な事業内容をご選択ください。";
      if (data.industries.includes("other") && !data.industryOther.trim()) {
        return "その他の事業内容をご入力ください。";
      }
      return null;
    case 1:
      if (data.consultationTopics.length === 0) return "ご相談したい内容をご選択ください。";
      if (data.consultationTopics.includes("other") && !data.consultationOther.trim()) {
        return "その他の相談内容をご入力ください。";
      }
      return null;
    case 2:
      if (!data.companyName.trim()) return "会社名・屋号をご入力ください。";
      if (!data.contactName.trim()) return "ご担当者名をご入力ください。";
      if (!data.prefecture) return "都道府県をご選択ください。";
      return null;
    case 3: {
      const hasPhone = data.phone.trim().length > 0;
      const hasEmail = data.email.trim().length > 0;
      if (!hasPhone && !hasEmail) {
        return "電話番号またはメールアドレスのいずれかをご入力ください。";
      }
      if (hasEmail && !/^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(data.email.trim())) {
        return "メールアドレスの形式をご確認ください。";
      }
      if (hasPhone) {
        const digits = data.phone
          .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
          .replace(/[^\d]/g, "");
        if (digits.length < 9 || digits.length > 11) {
          return "電話番号の桁数をご確認ください。";
        }
      }
      if (!data.preferredContactTime) return "連絡しやすい時間帯をご選択ください。";
      return null;
    }
    default:
      return null;
  }
}

/** 最初の不足ステップを返す（確認画面での送信前チェック用） */
export function firstIncompleteStep(data: FormData): number | null {
  for (let i = 0; i < TOTAL_STEPS - 1; i += 1) {
    if (validateStep(i, data)) return i;
  }
  return null;
}
