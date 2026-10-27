import Link from "next/link";
import { corpMetadata } from "@/components/adofy-corp/seo";
import { CorpStructuredData, worksBreadcrumb } from "@/components/adofy-corp/StructuredData";
import { ARTICLES } from "@/components/adofy-corp/articles/content";

export const metadata = corpMetadata("articles");

/** ドライバー採用の記事一覧（https://adofy-site.com/articles） */
export default function ArticlesPage() {
  return (
    <>
      <CorpStructuredData breadcrumb={worksBreadcrumb("articles")} />
      <main className="relative min-h-screen bg-surface text-ink">
        <section className="px-5 py-20 md:px-10">
          <div className="mx-auto max-w-5xl">
            <Link href="/" className="text-sm font-bold text-accent-blue">
              ← トップページへ戻る
            </Link>
            <p className="mt-10 text-sm font-black tracking-widest text-accent-blue">ARTICLES</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-ink md:text-5xl">ドライバー採用コラム</h1>
            <p className="mt-5 text-base leading-8 text-ink-soft">運送会社の経営者・採用担当者の方に向けて、ドライバー採用の考え方と進め方をまとめています。</p>
            <ul className="mt-10 grid gap-8 md:grid-cols-2">
              {ARTICLES.map((a) => (
                <li key={a.slug}>
                  <Link href={`/articles/${a.slug}`} className="group block overflow-hidden rounded-3xl border border-border-soft bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-hover">
                    <div className="aspect-video overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={a.image} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                    </div>
                    <div className="p-6">
                      <p className="text-sm font-bold text-accent-blue">
                        {a.category}
                        <span className="ml-3 font-normal text-ink-soft">
                          {a.date.replaceAll("-", ".")}・約{a.minutes}分
                        </span>
                      </p>
                      <h2 className="mt-2 text-xl font-black leading-snug text-ink">{a.title}</h2>
                      <p className="mt-3 text-base leading-7 text-ink-soft">{a.description}</p>
                      <p className="mt-4 font-black text-accent-blue">続きを読む →</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </>
  );
}
