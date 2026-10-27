import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Lightbulb } from "lucide-react";
import { CORP_SITE } from "@/components/adofy-corp/seo";
import { CorpStructuredData } from "@/components/adofy-corp/StructuredData";
import { ARTICLES, findArticle } from "@/components/adofy-corp/articles/content";
import { COMPANY } from "@/components/adofy-corp/business";

/** ドライバー採用の記事（https://adofy-site.com/articles/<slug>） */

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = findArticle(slug);
  if (!a) return {};
  const path = `/articles/${a.slug}`;
  return {
    metadataBase: new URL(CORP_SITE.url),
    title: a.title,
    description: a.description,
    keywords: a.keywords,
    alternates: { canonical: path },
    openGraph: { images: [a.image], type: "article", locale: CORP_SITE.locale, siteName: CORP_SITE.name, title: a.title, description: a.description, url: `${CORP_SITE.url}${path}`, publishedTime: a.date },
    robots: { index: true, follow: true },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = findArticle(slug);
  if (!a) notFound();
  const others = ARTICLES.filter((x) => x.slug !== a.slug && x.audience === a.audience).slice(0, 4);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    datePublished: a.date,
    author: { "@type": "Person", name: COMPANY.representative },
    publisher: { "@id": `${CORP_SITE.url}/#organization` },
    mainEntityOfPage: `${CORP_SITE.url}/articles/${a.slug}`,
  };

  return (
    <>
      <CorpStructuredData breadcrumb={[{ name: "ドライバー採用のお役立ち記事", path: "/articles" }, { name: a.title, path: `/articles/${a.slug}` }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="relative min-h-screen bg-surface text-ink">
        <article className="px-5 py-16 md:px-10 md:py-20">
          <div className="mx-auto max-w-3xl">
            <Link href="/articles" className="text-sm font-bold text-accent-blue">
              ← 記事一覧へ
            </Link>
            <p className="mt-8 text-sm font-bold text-accent-blue">
              {a.audience === "company" ? "運送会社の方へ" : "ドライバーの方へ"}・{a.category}
              <span className="ml-3 font-normal text-ink-soft">{a.date.replaceAll("-", ".")}</span>
            </p>
            <h1 className="mt-3 text-2xl font-black leading-snug tracking-tight text-ink md:text-4xl">{a.title}</h1>
            <p className="mt-3 text-sm text-ink-soft">
              文：{COMPANY.name} 代表 {COMPANY.representative}・約{a.minutes}分で読めます
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={a.image} alt="" className="mt-6 aspect-video w-full rounded-3xl object-cover shadow-soft" />

            <div className="mt-8 rounded-2xl border border-border-soft bg-mist-blue p-5">
              <p className="font-black text-ink">この記事のポイント</p>
              <ul className="mt-3 space-y-2">
                {a.summary.map((s) => (
                  <li key={s} className="flex gap-2 text-base leading-7 text-ink">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-none text-accent-blue" aria-hidden="true" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 space-y-5">
              {a.blocks.map((b, i) => {
                if (b.type === "h2") return <h2 key={i} className="pt-6 text-xl font-black text-ink md:text-2xl">{b.text}</h2>;
                if (b.type === "p") return <p key={i} className="text-base leading-8 text-ink md:text-[17px]">{b.text}</p>;
                if (b.type === "h3") return <h3 key={i} className="pt-2 text-lg font-black text-ink md:text-xl">{b.text}</h3>;
                if (b.type === "example")
                  return (
                    <div key={i} className="rounded-2xl border border-border-soft bg-mist-blue p-5">
                      <p className="text-sm font-black text-accent-blue">{b.title}</p>
                      <div className="mt-2 space-y-1 text-base leading-7 text-ink">
                        {b.lines.map((l) => (
                          <p key={l}>{l}</p>
                        ))}
                      </div>
                    </div>
                  );
                if (b.type === "table")
                  return (
                    <div key={i} className="overflow-hidden rounded-2xl border border-border-soft bg-white">
                      <table className="w-full text-left text-[15px] leading-7">
                        <thead className="bg-ink text-white">
                          <tr>
                            {b.rows[0].map((c, j) => (
                              <th key={j} className="px-4 py-2 font-bold">{c}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {b.rows.slice(1).map((r, k) => (
                            <tr key={k} className="border-t border-border-soft">
                              {r.map((c, j) => (
                                <td key={j} className={`px-4 py-3 align-top text-ink ${j === 0 ? "font-bold" : ""}`}>{c}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                if (b.type === "list")
                  return (
                    <ul key={i} className="list-disc space-y-1 pl-6 text-base leading-8 text-ink">
                      {b.items.map((t) => <li key={t}>{t}</li>)}
                    </ul>
                  );
                if (b.type === "check")
                  return (
                    <ul key={i} className="space-y-2 rounded-2xl border border-border-soft bg-white p-5">
                      {b.items.map((t) => (
                        <li key={t} className="flex gap-2 text-base leading-7 text-ink">
                          <CheckCircle2 className="mt-1 h-5 w-5 flex-none text-emerald-600" aria-hidden="true" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  );
                return (
                  <p key={i} className="flex gap-3 rounded-2xl bg-mist-ivory p-5 text-base font-bold leading-8 text-ink">
                    <Lightbulb className="mt-1.5 h-5 w-5 flex-none text-accent-amber" aria-hidden="true" />
                    {b.text}
                  </p>
                );
              })}
            </div>

            {a.sources && (
              <div className="mt-10 border-t border-border-soft pt-5 text-sm text-ink-soft">
                <p className="font-bold">出典</p>
                <ul className="mt-2 space-y-1">
                  {a.sources.map((s) => (
                    <li key={s.url}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline">{s.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {a.audience === "company" ? (
              <aside className="mt-12 rounded-3xl border border-border-soft bg-white p-6 shadow-soft">
                <p className="text-sm font-black text-accent-blue">adofy が運営するサービス</p>
                <p className="mt-2 text-lg font-black text-ink">ドライバー採用サービス「ドラテク」</p>
                <p className="mt-2 text-base leading-7 text-ink-soft">
                  愛知県の運送会社様向け。求職者の情報を見て面接したい人を選ぶと、求職者への連絡と面接の日程調整をドラテクが行います。
                </p>
                <a href="https://scout.adofy-site.com/" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex rounded-full bg-accent-blue px-6 py-3 font-black text-white">
                  ドラテクを見る
                </a>
              </aside>
            ) : (
              <aside className="mt-12 rounded-3xl border border-border-soft bg-white p-6 shadow-soft">
                <p className="text-sm font-black text-accent-blue">ドライバーの仕事探しに</p>
                <p className="mt-2 text-lg font-black text-ink">ドライバー転職支援「ドラテク」</p>
                <p className="mt-2 text-base leading-7 text-ink-soft">トラックドライバーを目指す方・転職を考えている方の仕事探しを支援しています。</p>
                <a href="https://driver.taxidriver-beginner.com/" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex rounded-full bg-accent-blue px-6 py-3 font-black text-white">
                  ドラテクで仕事を探す
                </a>
              </aside>
            )}

            <div className="mt-12">
              <p className="font-black text-ink">あわせて読みたい</p>
              <ul className="mt-3 space-y-3">
                {others.map((o) => (
                  <li key={o.slug}>
                    <Link href={`/articles/${o.slug}`} className="font-bold text-accent-blue underline-offset-4 hover:underline">{o.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
