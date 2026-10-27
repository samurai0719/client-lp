import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DotGrid } from "@/components/adofy-corp/decorations";
import { corpMetadata } from "@/components/adofy-corp/seo";
import { CorpStructuredData, worksBreadcrumb } from "@/components/adofy-corp/StructuredData";
import { BUSINESSES, COMPANY } from "@/components/adofy-corp/business";

export const metadata = corpMetadata("business");

/** 事業内容・会社概要（https://adofy-site.com/business） */
export default function BusinessPage() {
  const groups = ["マーケティング", "採用支援", "自社サービス"] as const;
  return (
    <>
      <CorpStructuredData breadcrumb={worksBreadcrumb("business")} />
      <main className="relative min-h-screen overflow-hidden bg-surface text-ink">
        <DotGrid className="absolute right-0 top-0 hidden h-[50%] w-[26rem] text-accent-blue sm:block" opacity={0.1} />
        <section className="relative px-5 py-20 md:px-10">
          <div className="mx-auto max-w-5xl">
            <Link href="/" className="text-sm font-bold text-accent-blue">
              ← トップページへ戻る
            </Link>
            <p className="mt-10 text-sm font-black tracking-widest text-accent-blue">BUSINESS</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-ink md:text-5xl">事業内容</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-ink-soft">
              adofyは、Web広告運用とLP・ホームページ制作を軸に、採用支援と自社のドライバー採用サービスを運営しています。
            </p>

            {groups.map((g) => (
              <div key={g} className="mt-12">
                <h2 className="text-xl font-black text-ink md:text-2xl">{g}</h2>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  {BUSINESSES.filter((b) => b.category === g).map((b) => (
                    <article key={b.title} className="rounded-3xl border border-border-soft bg-white p-6 shadow-soft">
                      <h3 className="text-lg font-black text-ink">{b.title}</h3>
                      <p className="mt-3 text-base leading-8 text-ink-soft">{b.body}</p>
                      {b.link && (
                        <a href={b.link.href} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1 font-bold text-accent-blue">
                          {b.link.label}
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-16 rounded-[2rem] border border-border-soft bg-white p-6 shadow-soft md:p-8">
              <h2 className="text-xl font-black text-ink md:text-2xl">会社概要</h2>
              <dl className="mt-5 divide-y divide-border-soft">
                {[
                  ["名称", COMPANY.name],
                  ["代表", COMPANY.representative],
                  ["拠点", COMPANY.area],
                  ["事業内容", "Web広告運用、LP・ホームページ制作、広告クリエイティブ制作、採用支援、ドライバー採用サービス「ドラテク」の運営"],
                ].map(([k, v]) => (
                  <div key={k} className="grid gap-1 py-4 sm:grid-cols-[8em_1fr] sm:gap-4">
                    <dt className="font-bold text-ink-soft">{k}</dt>
                    <dd className="leading-7 text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 flex flex-wrap gap-4 text-sm font-bold">
                <Link href="/profile" className="text-accent-blue">代表プロフィール →</Link>
                <Link href="/articles" className="text-accent-blue">採用のお役立ち記事 →</Link>
                <a href="/contact" className="text-accent-blue">お問い合わせ →</a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
