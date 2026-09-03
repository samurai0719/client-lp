import { LineGrid, CornerSpark } from "@/components/adofy-corp/decorations";
import Link from "next/link";
import WorkImage from "@/components/adofy-corp/visuals/WorkImage";
import { corpMetadata } from "@/components/adofy-corp/seo";
import { CorpStructuredData, worksBreadcrumb } from "@/components/adofy-corp/StructuredData";

export const metadata = corpMetadata("works/nurse-senka");

export default function NurseSenkaWorksPage() {
  return (
    <>
      <CorpStructuredData breadcrumb={worksBreadcrumb("works/nurse-senka")} />
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
              ナース専科
            </h1>

            <p className="mt-4 font-bold text-ink-soft">
              成果報酬型広告運用
            </p>

            <p className="mt-6 leading-8 text-ink-soft">
              看護師転職領域における広告運用・LP改善・クリエイティブ制作の実績を掲載予定です。
              後から制作したCR、広告バナー、LP、改善内容などをここに追加できます。
            </p>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              <WorkImage
                imageBase="/images/works/nurse-senka/creative"
                alt="ナース専科 広告クリエイティブ"
                placeholderLabel="CR画像・動画をここに配置"
              />
              <WorkImage
                imageBase="/images/works/nurse-senka/lp"
                alt="ナース専科 LPスクリーンショット"
                placeholderLabel="LPスクリーンショットをここに配置"
              />
            </div>

            <div className="mt-10">
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
