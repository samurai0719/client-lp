import Link from "next/link";
import { Noto_Sans_JP, Sora } from "next/font/google";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { WORKS_DATA, type WorkData } from "./data";
import WorkVideoCard from "./WorkVideoCard";
import "./works.css";

const noto = Noto_Sans_JP({ subsets: ["latin"], weight: ["400", "500", "700"], preload: false, variable: "--wk-ff-ja" });
const sora = Sora({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--wk-ff-en" });

const ORDER = ["rizap-golf", "mynavi-pharmacist", "nurse-senka", "leverages"];

/** 実績ページ共通の枠。取り組みの本文だけ children で各ページから渡す */
export default function WorkDetail({
  slug,
  children,
  storyTitle = "取り組み",
  storyKicker = "APPROACH",
}: {
  slug: keyof typeof WORKS_DATA;
  children?: React.ReactNode;
  storyTitle?: string;
  storyKicker?: string;
}) {
  const w: WorkData = WORKS_DATA[slug];
  const others = ORDER.filter((s) => s !== slug).map((s) => WORKS_DATA[s]);

  return (
    <main className={`wk ${noto.variable} ${sora.variable}`}>
      {/* ── 見出し ── */}
      <section className="wk-hero">
        <p className="wk-hero__ghost" lang="en" aria-hidden="true">
          {w.en}
        </p>
        <div className="wk-wrap wk-hero__grid">
          <div>
            <Link href="/#works" className="wk-back">
              <ArrowLeft aria-hidden="true" />
              実績一覧へ
            </Link>
            <p className="wk-eyebrow">
              <span lang="en">WORKS</span>
              {w.genre}
            </p>
            <h1 className="wk-hero__title">{w.client}</h1>
            <p className="wk-hero__lead">{w.lead}</p>
            <ul className="wk-chips" aria-label="担当範囲">
              {w.scope.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <dl className="wk-facts">
              <div>
                <dt lang="en">Video</dt>
                <dd>
                  <b lang="en">{w.videos.length}</b>本
                </dd>
              </div>
              {w.banners.length > 0 && (
                <div>
                  <dt lang="en">Banner</dt>
                  <dd>
                    <b lang="en">{w.banners.length}</b>点
                  </dd>
                </div>
              )}
              {w.lp && (
                <div>
                  <dt lang="en">LP</dt>
                  <dd>
                    <b lang="en">1</b>本
                  </dd>
                </div>
              )}
            </dl>
            <p className="wk-facts__note">※このページに掲載している制作物の数です。</p>
          </div>

          {w.lp ? (
            <figure className="wk-hero__visual">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={w.lp.src} alt={w.lp.alt} width={1448} height={1086} fetchPriority="high" />
              <figcaption>{w.lp.caption}</figcaption>
            </figure>
          ) : (
            <div className="wk-hero__stack" aria-hidden="true">
              {w.videos.slice(0, 3).map((v) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={v.id} src={`/images/works/${w.slug}/posters/${v.id}.jpg`} alt="" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── 動画広告 ── */}
      <section className="wk-sec wk-sec--dark" aria-labelledby="wk-video-title">
        <div className="wk-wrap">
          <div className="wk-head">
            <p className="wk-num" lang="en">01</p>
            <div>
              <p className="wk-kicker" lang="en">VIDEO ADS</p>
              <h2 id="wk-video-title">動画広告</h2>
            </div>
            <p className="wk-head__note">タップすると音声ありで再生します。</p>
          </div>
          <div className="wk-videos">
            {w.videos.map((v, i) => (
              <WorkVideoCard key={v.id} slug={w.slug} id={v.id} title={v.title} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── バナー ── */}
      {w.banners.length > 0 && (
        <section className="wk-sec" aria-labelledby="wk-banner-title">
          <div className="wk-wrap">
            <div className="wk-head">
              <p className="wk-num" lang="en">02</p>
              <div>
                <p className="wk-kicker" lang="en">BANNER ADS</p>
                <h2 id="wk-banner-title">バナー広告</h2>
              </div>
            </div>
            <ul className={`wk-banners wk-banners--${w.banners.length}`}>
              {w.banners.map((b) => (
                <li key={b.file} className={b.wide ? "is-wide" : undefined}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/images/works/${w.slug}/banners/${b.file}`} alt={b.alt} loading="lazy" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── 取り組み ── */}
      {children && (
        <section className="wk-sec wk-sec--paper" aria-labelledby="wk-story-title">
          <div className="wk-wrap">
            <div className="wk-head">
              <p className="wk-num" lang="en">{w.banners.length > 0 ? "03" : "02"}</p>
              <div>
                <p className="wk-kicker" lang="en">{storyKicker}</p>
                <h2 id="wk-story-title">{storyTitle}</h2>
              </div>
            </div>
            <div className="wk-story">{children}</div>
          </div>
        </section>
      )}

      {/* ── 相談・ほかの実績 ── */}
      <section className="wk-cta">
        <div className="wk-wrap">
          <p className="wk-cta__en" lang="en">
            Let&apos;s make it work.
          </p>
          <p className="wk-cta__lead">広告・LP・クリエイティブを、まとめて改善しませんか。</p>
          <a href="/contact" className="wk-cta__btn">
            このような広告運用を相談する
            <ArrowRight aria-hidden="true" />
          </a>

          <p className="wk-others__label" lang="en">OTHER WORKS</p>
          <ul className="wk-others">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/works/${o.slug}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/images/works/${o.slug}/posters/${o.videos[0].id}.jpg`} alt="" loading="lazy" />
                  <span>
                    <small>{o.genre}</small>
                    {o.client}
                  </span>
                  <ArrowRight aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
