import Link from "next/link";
import { editorialBasisText } from "@/config/nurse-ranking";

export default function RankingBasisSection() {
  return (
    <section className="bg-slate-50 px-4 py-12 sm:px-6 sm:py-16" aria-labelledby="basis-heading">
      <div className="mx-auto max-w-[820px]">
        <h2 id="basis-heading" className="text-lg font-bold text-slate-900 sm:text-xl">
          ランキングの根拠と広告表記
        </h2>

        <p className="mt-4 text-sm leading-relaxed text-slate-600">{editorialBasisText}</p>

        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          当サイトはアフィリエイト広告を利用しています。掲載サービスに登録・お申し込みいただいた場合、
          当サイトが広告主から成果報酬を受け取ることがあります。ただし、広告主から受け取る報酬の有無によって、
          サービス内容の説明を事実と異なるものにすることはありません。掲載されている会社名・サービス名・商標・
          ロゴ等の権利は各社に帰属します。
        </p>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link href="/nurse-ranking/ranking-policy" className="text-teal-700 underline underline-offset-2">
            ランキング・編集方針
          </Link>
          <Link href="/nurse-ranking/advertising-policy" className="text-teal-700 underline underline-offset-2">
            広告掲載ポリシー
          </Link>
          <Link href="/nurse-ranking/privacy" className="text-teal-700 underline underline-offset-2">
            プライバシーポリシー
          </Link>
          <Link href="/nurse-ranking/company" className="text-teal-700 underline underline-offset-2">
            運営者情報
          </Link>
        </div>
      </div>
    </section>
  );
}
