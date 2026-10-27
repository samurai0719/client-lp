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
            <p className="mt-5 text-base leading-8 text-ink-soft">運送会社の経営者・採用担当者の方と、ドライバーとして働きたい方に向けたコラムです。</p>
            {([
              ["company", "運送会社の方へ", "採用・求人・定着など、ドライバー採用のノウハウ"],
              ["seeker", "ドライバーの方へ", "免許・求人の見方・働き方など、仕事探しに役立つ情報"],
            ] as const).map(([aud, label, lead]) => (
              <section key={aud} className="mt-14" aria-labelledby={`col-${aud}`}>
                <h2 id={`col-${aud}`} className="text-2xl font-black text-ink md:text-3xl">{label}</h2>
                <p className="mt-2 text-base text-ink-soft">{lead}</p>
                <ul className="mt-6 grid gap-8 md:grid-cols-2">
              {ARTICLES.filter((a) => a.audience === aud).map((a) => (
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
                      <h3 className="mt-2 text-xl font-black leading-snug text-ink">{a.title}</h3>
                      <p className="mt-3 text-base leading-7 text-ink-soft">{a.description}</p>
                      <p className="mt-4 font-black text-accent-blue">続きを読む →</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
              </section>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
