"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Noto_Sans_JP, Sora } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ARTICLES } from "@/components/adofy-corp/articles/content";
import "./home-editorial.css";

/**
 * adofy コーポレートサイトのトップページ（https://adofy-site.com/）。
 * FVの写真の切り欠きは下の clipPath（SVG）で作る。座標は 840×770 の枠が基準（PCのみ）。
 * 右上の固定ボタンとメニューは components/adofy-corp/chrome/SiteHeader.tsx。
 * 「動きを減らす」設定では、演出を止めて最初からすべて表示する。
 */

gsap.registerPlugin(ScrollTrigger);

const notoSans = Noto_Sans_JP({ subsets: ["latin"], weight: ["300", "400", "500"], preload: false, variable: "--ax-ff-ja" });
const sora = Sora({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--ax-ff-en" });

type Point = readonly [number, number];

// 多角形の角を丸めたSVGパスを作る（凸角・凹角どちらも同じ半径で丸まる）
function roundedPath(points: readonly Point[], radius: number): string {
  const n = points.length;
  return (
    points
      .map((p, i) => {
        const prev = points[(i + n - 1) % n];
        const next = points[(i + 1) % n];
        const toward = (q: Point) => {
          const len = Math.hypot(q[0] - p[0], q[1] - p[1]);
          const r = Math.min(radius, len / 2);
          return [p[0] + ((q[0] - p[0]) / len) * r, p[1] + ((q[1] - p[1]) / len) * r];
        };
        const a = toward(prev);
        const b = toward(next);
        return `${i === 0 ? "M" : "L"}${a[0]} ${a[1]}Q${p[0]} ${p[1]} ${b[0]} ${b[1]}`;
      })
      .join("") + "Z"
  );
}

const CLIP_PC = [[0, 0], [840, 0], [840, 640], [690, 640], [690, 770], [0, 770]] as const;

const HERO_NAV = [
  { href: "#about", label: "adofyについて" },
  { href: "#service", label: "サービス" },
  { href: "#works", label: "実績" },
  { href: "#strength", label: "強み" },
  { href: "#column", label: "コラム" },
];

const PHOTOS = [
  { src: "/images/adofy/photo-consulting.webp", alt: "オンラインで打ち合わせをする様子" },
  { src: "/images/adofy/photo-production.webp", alt: "ホームページを制作する様子" },
  { src: "/images/adofy/photo-planning.webp", alt: "打ち合わせで企画を練る様子" },
  { src: "/images/adofy-corp/hero-team.webp", alt: "ノートパソコンを囲んで打ち合わせをするチーム" },
];

const ABOUT_TEXT = [
  ["adofyは、岐阜を拠点に", "Webマーケティング支援を行う会社です。"],
  ["見た目の美しさだけでなく、", "広告効果・問い合わせ・応募・売上につながる", "設計を重視しています。"],
  ["制作して終わりにせず、", "改善まで伴走します。"],
];

const FLOW = [
  { title: "広告", body: "訴求を決めて配信する" },
  { title: "LP・ホームページ", body: "問い合わせ・応募までの導線をつくる" },
  { title: "数値分析", body: "配信結果とページの動きを見る" },
  { title: "改善", body: "デザイン・構成・コピーを見直す" },
];

const MARKETING_ITEMS = [
  { title: "成果報酬型広告運用", body: "訴求・LP・クリエイティブまで改善しながら、広告費に対して成果が残る運用を目指します。" },
  { title: "LP・ホームページ制作", body: "広告から問い合わせ・応募までの導線を設計したLPと、信頼感を伝えるホームページを制作します。" },
  { title: "クリエイティブ制作", body: "バナー・動画広告・SNS画像など、見る人の行動につながるクリエイティブを企画・制作します。" },
  { title: "マーケティング支援", body: "数値分析・改善提案・導線設計まで、売上につながる施策を一貫して支援します。" },
];

const HIRING_ITEMS = [
  {
    title: "採用支援「採用レスキュー」",
    body: "採用LPと広告クリエイティブをセットで制作し、応募が集まる導線を設計します。",
    href: "https://saiyo.adofy-site.com/",
    label: "採用レスキューを見る",
  },
  {
    title: "自社サービス「ドラテク」",
    body: "愛知県の運送会社様向けドライバー採用サービス。面接したい人を選ぶと、連絡と日程調整をドラテクが行います。",
    href: "https://scout.adofy-site.com/",
    label: "ドラテクを見る",
  },
];

type Work = { img: string; tag: string; title: string; body: string; href?: string; external?: boolean };
const WORKS: Work[] = [
  { img: "/images/adofy/case-01-takanaga.webp", tag: "建設・外構", title: "高長建設様", body: "コーポレートサイト制作・集客設計", href: "https://www.takanagakensetu.com/", external: true },
  { img: "/images/adofy/ad-02-mynavi-pharmacist.webp", tag: "人材・薬剤師", title: "マイナビ薬剤師", body: "広告運用 × 診断LP制作", href: "/works/mynavi-pharmacist" },
  { img: "/images/adofy/ad-01-rizap-golf.webp", tag: "スクール", title: "RIZAP GOLF", body: "広告運用 × 記事LP制作", href: "/works/rizap-golf" },
  { img: "/images/adofy/case-02-paintnet.webp", tag: "外壁塗装", title: "Paint Net様", body: "集客ページ制作・問い合わせ導線設計" },
];

const STATS = [
  { value: "100", unit: "社以上", label: "採用・集客の支援実績" },
  { value: "2,000", unit: "人以上", label: "累計集客・応募者数" },
  { value: "6", unit: "ジャンル", label: "看護師・薬剤師・ドライバーなど" },
];

const STRENGTHS = [
  { title: "広告・LP・クリエイティブを一貫して改善", body: "広告を出して終わりにせず、訴求から導線までまとめて見直します。" },
  { title: "数字をもとにしたスピード感のある運用", body: "配信結果を見ながら、デザイン・構成・コピーを素早く改善します。" },
  { title: "岐阜から全国対応の柔軟な制作体制", body: "オンラインで打ち合わせから公開まで進め、全国のご相談に対応します。" },
];

const FOOTER_GROUPS = [
  { ja: "サービス", links: [{ href: "#service", label: "集客支援" }, { href: "#service", label: "採用支援" }, { href: "#works", label: "実績" }] },
  { ja: "会社情報", links: [{ href: "/business", label: "事業内容・会社概要" }, { href: "/profile", label: "代表プロフィール" }] },
  { ja: "コラム", links: [{ href: "/articles", label: "ドライバー採用の記事" }] },
  { ja: "お問い合わせ", links: [{ href: "/contact", label: "無料で相談する" }] },
];

function SectionLabel({ en, ja }: { en: string; ja: string }) {
  return (
    <p className="ax-label">
      <span lang="en">{en}</span>
      {ja}
    </p>
  );
}

function ArrowLink({ href, children, light }: { href: string; children: React.ReactNode; light?: boolean }) {
  return (
    <Link href={href} className={`ax-textlink${light ? " is-light" : ""}`}>
      {children}
      <span aria-hidden="true">
        <ArrowRight />
      </span>
    </Link>
  );
}

function WorkLink({ work, className, children }: { work: Work; className: string; children: React.ReactNode }) {
  if (!work.href) return <div className={className}>{children}</div>;
  if (work.external) {
    return (
      <a href={work.href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={work.href} className={className}>
      {children}
    </Link>
  );
}

export default function HomeContent() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(".ax-hero__media img", { scale: 1.08, duration: 1.8, ease: "expo.out" });
      gsap.from(".ax-hero__title > span", { y: 28, opacity: 0, duration: 1.1, ease: "power3.out", stagger: 0.16, delay: 0.25 });
      gsap.from(".ax-hero__nav li", { x: -14, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.06, delay: 0.5 });

      gsap.utils.toArray<HTMLElement>("[data-fade]").forEach((n) => {
        gsap.from(n, { y: 28, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: n, start: "top 88%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>(".ax-block").forEach((b, i) => {
        gsap.to(b, { y: (i % 2 === 0 ? -1 : 1) * (70 + i * 16), ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 1 } });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className={`ax ${notoSans.variable} ${sora.variable}`}>
      <svg width="0" height="0" className="ax-defs" aria-hidden="true">
        <defs>
          <clipPath id="ax-clip-pc" clipPathUnits="objectBoundingBox">
            <path transform={`scale(${1 / 840} ${1 / 770})`} d={roundedPath(CLIP_PC, 14)} />
          </clipPath>
        </defs>
      </svg>

      <div className="ax-blocks" aria-hidden="true">
        {Array.from({ length: 4 }, (_, i) => (
          <span key={i} className={`ax-block ax-block--${i + 1}`} />
        ))}
      </div>

      <main>
        {/* ── FV ── */}
        <section className="ax-hero" id="hero" aria-labelledby="ax-hero-title">
          <div className="ax-hero__frame">
            <div className="ax-hero__copy">
              <Link href="/" className="ax-logo" aria-label="adofy トップへ">
                <b lang="en">adofy</b>
                <small>岐阜発・全国対応</small>
              </Link>
              <nav className="ax-hero__nav" aria-label="ページ内メニュー">
                <ul>
                  {HERO_NAV.map((n) => (
                    <li key={n.href}>
                      <a href={n.href}>{n.label}</a>
                    </li>
                  ))}
                </ul>
              </nav>
              <h1 className="ax-hero__title" id="ax-hero-title">
                <span>成果から逆算する、</span>
                <span>Webマーケティング。</span>
              </h1>
              <p className="ax-hero__lead">広告運用・LP制作・採用支援まで。数字を見ながら、問い合わせと応募につながる仕組みをつくります。</p>
              <a href="/contact" className="ax-btn">
                無料で相談する
                <span aria-hidden="true">
                  <ArrowRight />
                </span>
              </a>
            </div>

            <div className="ax-hero__visual">
              <div className="ax-hero__media">
                <picture>
                  <source media="(max-width: 639px)" srcSet="/images/adofy-corp/hero-team-sp.webp" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/adofy-corp/hero-team.webp" alt="ノートパソコンを囲んで打ち合わせをするチーム" fetchPriority="high" />
                </picture>
              </div>
              <p className="ax-hero__stat">
                <b lang="en">100</b>社以上
                <small>採用・集客の支援実績</small>
              </p>
            </div>
          </div>
        </section>

        {/* ── About ── */}
        <section className="ax-sec ax-about" id="about" aria-labelledby="ax-about-title">
          <div className="ax-wrap">
            <SectionLabel en="About" ja="adofyについて" />
            <div className="ax-about__grid">
              <h2 className="ax-h2 ax-h2--thin" id="ax-about-title" data-fade>
                成果から逆算する、
                <br />
                次世代のWebパートナー
              </h2>
              <div className="ax-about__body">
                {ABOUT_TEXT.map((lines) => (
                  <p key={lines[0]} data-fade>
                    {lines.map((l) => (
                      <span key={l}>{l}</span>
                    ))}
                  </p>
                ))}
                <Link href="/business" className="ax-btn" data-fade>
                  事業内容・会社概要
                  <span aria-hidden="true">
                    <ArrowRight />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── 写真 ── */}
        <div className="ax-wrap ax-photos">
          {PHOTOS.slice(0, 3).map((p) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={p.src} src={p.src} alt={p.alt} loading="lazy" data-fade />
          ))}
        </div>

        {/* ── Service ── */}
        <section className="ax-service" id="service" aria-labelledby="ax-service-title">
          <div className="ax-tab ax-tab--slate">
            <SectionLabel en="Service" ja="サービス" />
          </div>
          <div className="ax-service__inner">
            <div className="ax-wrap">
              <div className="ax-intro">
                <div data-fade>
                  <h2 className="ax-h2" id="ax-service-title">
                    集客も、採用も。
                    <br />
                    Webでまとめて伴走します
                  </h2>
                  <p>広告運用・LP制作・採用支援まで。数字を見ながら、問い合わせと応募につながる仕組みをつくります。</p>
                  <ArrowLink href="/business" light>
                    事業内容を見る
                  </ArrowLink>
                </div>
                <ol className="ax-flow" data-fade>
                  {FLOW.map((f, i) => (
                    <li key={f.title}>
                      <span lang="en">{String(i + 1).padStart(2, "0")}</span>
                      <div>
                        <h3>{f.title}</h3>
                        <p>{f.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <article className="ax-panel" data-fade>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/adofy/photo-production.webp" alt="ホームページを制作する様子" loading="lazy" />
                <div>
                  <span className="ax-pill" lang="en">Marketing</span>
                  <h3>集客を支援する</h3>
                  <ul className="ax-items">
                    {MARKETING_ITEMS.map((s) => (
                      <li key={s.title}>
                        <h4>{s.title}</h4>
                        <p>{s.body}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>

              <article className="ax-panel ax-panel--reverse" data-fade>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/adofy/photo-consulting.webp" alt="オンラインで打ち合わせをする様子" loading="lazy" />
                <div>
                  <span className="ax-pill" lang="en">Recruiting</span>
                  <h3>採用を支援する</h3>
                  <ul className="ax-items">
                    {HIRING_ITEMS.map((s) => (
                      <li key={s.title}>
                        <h4>{s.title}</h4>
                        <p>{s.body}</p>
                        <a href={s.href} target="_blank" rel="noopener noreferrer" className="ax-textlink is-light">
                          {s.label}
                          <span aria-hidden="true">
                            <ArrowUpRight />
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ── Works ── */}
        <section className="ax-works" id="works" aria-labelledby="ax-works-title">
          <div className="ax-tab ax-tab--aqua">
            <SectionLabel en="Works" ja="実績" />
          </div>
          <div className="ax-works__inner">
            <div className="ax-wrap">
              <h2 className="ax-h2" id="ax-works-title" data-fade>
                数字を追い続けた、
                <br />
                支援の実績
              </h2>
              <ul className="ax-works__grid">
                {WORKS.map((w) => (
                  <li key={w.title} data-fade>
                    <WorkLink work={w} className="ax-workcard">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={w.img} alt={`${w.title}の実績`} loading="lazy" />
                      <span className="ax-pill ax-pill--dark">{w.tag}</span>
                      <h3>
                        {w.title}
                        {w.href && <ArrowRight aria-hidden="true" />}
                      </h3>
                      <p>{w.body}</p>
                    </WorkLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── 強み ── */}
        <section className="ax-sec ax-strength" id="strength" aria-labelledby="ax-strength-title">
          <div className="ax-wrap">
            <SectionLabel en="Strength" ja="強み" />
            <div className="ax-strength__grid">
              <div>
                <h2 className="ax-h2" id="ax-strength-title" data-fade>
                  adofyが
                  <br />
                  選ばれる理由
                </h2>
                <ol className="ax-reasons">
                  {STRENGTHS.map((s, i) => (
                    <li key={s.title} data-fade>
                      <span lang="en">0{i + 1}</span>
                      <div>
                        <h3>{s.title}</h3>
                        <p>{s.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="ax-strength__photos">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/adofy/photo-planning.webp" alt="打ち合わせで企画を練る様子" loading="lazy" data-fade />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/adofy-corp/hero-team-sp.webp" alt="チームで打ち合わせをする様子" loading="lazy" data-fade />
              </div>
            </div>

            <ul className="ax-stats">
              {STATS.map((s) => (
                <li key={s.label} data-fade>
                  <p className="ax-stats__num">
                    <b lang="en">{s.value}</b>
                    {s.unit}
                  </p>
                  <p>{s.label}</p>
                </li>
              ))}
            </ul>
            <p className="ax-stats__note">※運営者がこれまでに行ってきた支援の実績です。</p>

            <div className="ax-links" data-fade>
              <ArrowLink href="/business">事業内容・会社概要</ArrowLink>
              <ArrowLink href="/profile">代表プロフィール</ArrowLink>
              <ArrowLink href="/articles">コラム一覧</ArrowLink>
            </div>
          </div>
        </section>

        {/* ── コラム ── */}
        <section className="ax-column" id="column" aria-labelledby="ax-column-title">
          <div className="ax-tab ax-tab--beige">
            <SectionLabel en="Column" ja="コラム" />
          </div>
          <div className="ax-column__inner">
            <div className="ax-wrap ax-column__grid">
              <div data-fade>
                <h2 className="ax-h2" id="ax-column-title">
                  運送会社のための
                  <br />
                  ドライバー採用コラム
                </h2>
                <Link href="/articles" className="ax-btn">
                  コラム一覧へ
                  <span aria-hidden="true">
                    <ArrowRight />
                  </span>
                </Link>
              </div>
              <ul className="ax-articles">
                {ARTICLES.filter((a) => a.audience === "company").slice(0, 4).map((a) => (
                  <li key={a.slug} data-fade>
                    <Link href={`/articles/${a.slug}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={a.image} alt="" loading="lazy" />
                      <div>
                        <p>
                          {a.category}・約{a.minutes}分
                        </p>
                        <h3>{a.title}</h3>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── お問い合わせ ── */}
        <section className="ax-sec ax-contact" id="contact" aria-labelledby="ax-contact-title">
          <div className="ax-wrap">
            <div className="ax-contact__head">
              <h2 className="ax-contact__title" id="ax-contact-title" lang="en" data-fade>
                Let&apos;s talk!
              </h2>
              <div data-fade>
                <p className="ax-contact__lead">Web集客・採用のご相談はこちら。</p>
                <p>広告運用、LP・HP制作、採用支援など、まずはお気軽にご相談ください。岐阜県内はもちろん、全国対応です。</p>
              </div>
            </div>
            <div className="ax-cta" data-fade>
              <a href="/contact" className="ax-cta__btn is-mint">
                無料で相談する
                <span aria-hidden="true">
                  <ArrowRight />
                </span>
              </a>
              <Link href="/business" className="ax-cta__btn is-navy">
                会社概要を見る
                <span aria-hidden="true">
                  <ArrowRight />
                </span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── フッター ── */}
      <footer className="ax-footer">
        <div className="ax-wrap">
          <div className="ax-footer__top">
            <p className="ax-footer__brand" lang="en">adofy</p>
            <p>岐阜発・全国対応のWebマーケティング会社。広告運用・LP制作・HP制作・クリエイティブ制作・採用支援を行っています。</p>
          </div>
          <nav className="ax-footer__nav" aria-label="フッターメニュー">
            {FOOTER_GROUPS.map((g) => (
              <div key={g.ja}>
                <p className="ax-footer__head">{g.ja}</p>
                <ul>
                  {g.links.map((l) => (
                    <li key={l.label}>
                      <a href={l.href}>{l.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          <p className="ax-footer__copy" lang="en">© 2026 adofy</p>
        </div>
      </footer>
    </div>
  );
}
