import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { LineGrid, CornerSpark } from "@/components/adofy-corp/decorations";
import WorkImage from "@/components/adofy-corp/visuals/WorkImage";
import { corpMetadata } from "@/components/adofy-corp/seo";
import { CorpStructuredData, worksBreadcrumb } from "@/components/adofy-corp/StructuredData";

export const metadata = corpMetadata("works/mynavi-pharmacist");

const workConcerns = [
  "残業を減らしたい",
  "できるだけ早く帰りたい",
  "休日をしっかり確保したい",
  "無理なく長く働ける職場を探したい",
];

export default function MynaviPharmacistWorksPage() {
  return (
    <>
      <CorpStructuredData breadcrumb={worksBreadcrumb("works/mynavi-pharmacist")} />
      <main className="relative min-h-screen overflow-hidden bg-mist-gray text-ink">
      <LineGrid className="absolute inset-0 text-ink" opacity={0.05} cell={64} />

      <section className="relative px-5 py-20 md:px-10">
        <div className="mx-auto max-w-5xl">
          <Link href="/" className="text-sm font-bold text-accent-blue">
            ← トップページへ戻る
          </Link>

          <div className="relative mt-10 overflow-hidden rounded-[2rem] border border-border-soft bg-white p-6 shadow-soft md:p-10">
            <CornerSpark
              variant="ring"
              className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 text-accent-blue"
              opacity={0.5}
            />

            <p className="text-sm font-black tracking-widest text-accent-blue">
              WORKS
            </p>

            <h1 className="mt-4 text-3xl font-black tracking-tight text-ink md:text-5xl">
              マイナビ薬剤師
            </h1>

            <p className="mt-4 font-bold text-ink-soft">
              成果報酬型広告運用
            </p>

            <p className="mt-6 leading-8 text-ink-soft">
              薬剤師転職領域における広告運用・LP改善・クリエイティブ制作の実績を掲載予定です。
              後から制作したCR、広告バナー、LP、改善内容などをここに追加できます。
            </p>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              <WorkImage
                imageBase="/images/works/mynavi-pharmacist/creative"
                alt="マイナビ薬剤師 広告クリエイティブ"
                placeholderLabel="CR画像・動画をここに配置"
              />
              <WorkImage
                imageBase="/images/works/mynavi-pharmacist/lp"
                alt="マイナビ薬剤師 LPスクリーンショット"
                placeholderLabel="LPスクリーンショットをここに配置"
              />
            </div>

            <div className="mt-16 max-w-[44rem] border-t border-border-soft pt-12">
              <h2 className="text-xl font-black leading-snug tracking-tight text-ink md:text-2xl">
                競合の多い薬剤師転職市場で、病院薬剤師に特化した集客戦略
              </h2>

              <p className="mt-6 leading-[1.9] text-ink-soft">
                マイナビ薬剤師の集客では、まず「競合サービスが多い中で、どのように選ばれるか」を第一に考えました。
              </p>
              <p className="mt-4 leading-[1.9] text-ink-soft">
                薬剤師転職の領域は、大手企業を含めて競合が多く、広告費を成果報酬額の範囲内に抑えなければ、成果が発生しても赤字になってしまいます。
              </p>
              <p className="mt-4 leading-[1.9] text-ink-soft">
                また、国内の薬剤師は<strong className="font-bold text-ink">約30万人</strong>と、一般的な転職市場と比べて対象となるユーザーが限られています。
              </p>
              <p className="mt-4 leading-[1.9] text-ink-soft">
                そのため、薬剤師全体に向けて同じ広告を配信するのではなく、誰に、どのような価値を届けるのかを明確にする必要がありました。
              </p>

              <h3 className="mt-10 text-base font-black text-accent-blue md:text-lg">
                病院薬剤師というターゲットに着目
              </h3>
              <p className="mt-4 leading-[1.9] text-ink-soft">
                さまざまな広告や訴求を試した中で、私たちは「病院薬剤師」に着目しました。
              </p>
              <p className="mt-4 leading-[1.9] text-ink-soft">
                病院薬剤師は、他の勤務先で働く薬剤師と比べて、必ずしも給与が高いとは限りません。
              </p>
              <p className="mt-4 leading-[1.9] text-ink-soft">
                一方で、勤務終了時間が比較的早く、残業が少ない職場や、休日を確保しやすい職場も多くあります。
              </p>
              <p className="mt-4 leading-[1.9] text-ink-soft">
                そこで、「転職して年収を上げたい方」を中心に集客するのではなく、
                <strong className="font-bold text-ink">仕事だけでなく、家族との時間や自分の時間も大切にしたい方</strong>
                に向けた訴求へと切り替えました。
              </p>

              <h3 className="mt-10 text-base font-black text-accent-blue md:text-lg">
                年収訴求から、ワークライフバランス訴求へ
              </h3>
              <p className="mt-4 leading-[1.9] text-ink-soft">
                広告やランディングページでは、給与の高さだけを強調するのではなく、以下のような悩みに寄り添う内容を中心に設計しました。
              </p>

              <ul className="mt-6 space-y-3">
                {workConcerns.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-accent-blue" />
                    <span className="leading-[1.7] text-ink">{item}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-6 leading-[1.9] text-ink-soft">
                病院薬剤師の求人が持つ「働きやすさ」という価値を明確に伝えたことで、
                年収アップだけを目的とした転職希望者とは異なる層へアプローチできるようになりました。
              </p>

              <h3 className="mt-10 text-base font-black text-accent-blue md:text-lg">
                ターゲットを絞ることで、効率的な集客を実現
              </h3>
              <p className="mt-4 leading-[1.9] text-ink-soft">
                市場全体を広く狙うのではなく、病院薬剤師という領域に絞り、ワークライフバランスを重視する方へ訴求を変更した結果、
                競合との差別化につながり、効率的な集客を実現できました。
              </p>

              <div className="mt-10 border-l-4 border-accent-blue pl-5">
                <p className="text-lg font-black leading-snug text-ink md:text-xl">
                  「どのような方に、どのような価値を届ければ選ばれるのか」
                </p>
                <p className="mt-3 leading-[1.9] text-ink-soft">
                  ターゲットと訴求内容を一致させることが、成果につながる重要なポイントとなりました。
                </p>
              </div>
            </div>

            <div className="mt-12">
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-accent-blue px-8 py-4 font-black text-white shadow-soft transition duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-hover"
              >
                このような広告運用を相談する
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}
