"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Noto_Sans_JP, Sora } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowUpRight, Pause, Play } from "lucide-react";
import { ARTICLES } from "@/components/adofy-corp/articles/content";
import "./home-editorial.css";

/**
 * adofy コーポレートサイトのトップページ（https://adofy-site.com/）。
 * FVの階段状の切り抜きは下の clipPath（SVG）で作る。座標は PC=1400×770 / SP=350×530 の枠が基準。
 * 右上の固定ボタンとメニューは components/adofy-corp/chrome/SiteHeader.tsx。
 * 「動きを減らす」設定または「モーション停止」では、演出を止めて最初からすべて表示する。
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

const CLIP_PC = [
  [430, 0], [1220, 0], [1220, 145], [1400, 145], [1400, 530], [1320, 530], [1320, 610], [1240, 610],
  [1240, 690], [1160, 690], [1160, 770], [80, 770], [80, 690], [0, 690], [0, 322], [160, 322],
  [160, 160], [240, 160], [240, 80], [430, 80],
] as const;
const CLIP_PC_TILE = [[1240, 690], [1320, 690], [1320, 770], [1240, 770]] as const;
const CLIP_SP = [
  [0, 142], [64, 142], [64, 76], [350, 76], [350, 500], [320, 500], [320, 530], [0, 530],
] as const;

const HERO_NAV = [
  { href: "#about", label: "私たちについて" },
  { href: "#service", label: "サービスを知る" },
  { href: "#works", label: "実績を知る" },
  { href: "#strength", label: "強みを知る" },
  { href: "#column", label: "コラムを読む" },
];

const PHOTOS = [
  { src: "/images/adofy/photo-consulting.webp", alt: "オンラインで打ち合わせをする様子", wide: true },
  { src: "/images/adofy/photo-production.webp", alt: "ホームページを制作する様子", wide: false },
  { src: "/images/adofy/photo-planning.webp", alt: "打ち合わせで企画を練る様子", wide: true },
  { src: "/images/adofy-corp/hero-team.webp", alt: "ノートパソコンを囲んで打ち合わせをするチーム", wide: false },
];

const ABOUT_TEXT = [
  ["adofyは、岐阜を拠点に", "Webマーケティング支援を行う会社です。"],
  ["見た目の美しさだけでなく、", "広告効果・問い合わせ・応募・売上につながる", "設計を重視しています。"],
  ["制作して終わりにせず、", "改善まで伴走します。"],
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
  { en: "SERVICE", ja: "サービス", links: [{ href: "#service", label: "集客支援" }, { href: "#service", label: "採用支援" }, { href: "#works", label: "実績" }] },
  { en: "COMPANY", ja: "会社を知る", links: [{ href: "/business", label: "事業内容・会社概要" }, { href: "/profile", label: "代表プロフィール" }] },
  { en: "COLUMN", ja: "コラム", links: [{ href: "/articles", label: "ドライバー採用の記事" }] },
  { en: "CONTACT", ja: "お問い合わせ", links: [{ href: "/contact", label: "無料で相談する" }] },
];

function SectionLabel({ en, ja }: { en: string; ja: string }) {
  return (
    <p className="ax-label">
      <span lang="en">{en}</span>
      <i aria-hidden="true">/</i>
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
  const [motionOff, setMotionOff] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || motionOff) {
      el.classList.add("is-static");
      return () => el.classList.remove("is-static");
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
  }, [motionOff]);

  return (
    <div ref={root} className={`ax ${notoSans.variable} ${sora.variable}${motionOff ? " is-paused" : ""}`}>
      <svg width="0" height="0" className="ax-defs" aria-hidden="true">
        <defs>
          <clipPath id="ax-clip-pc" clipPathUnits="objectBoundingBox">
            <path transform={`scale(${1 / 1400} ${1 / 770})`} d={roundedPath(CLIP_PC, 12) + roundedPath(CLIP_PC_TILE, 12)} />
          </clipPath>
          <clipPath id="ax-clip-sp" clipPathUnits="objectBoundingBox">
            <path transform={`scale(${1 / 350} ${1 / 530})`} d={roundedPath(CLIP_SP, 9)} />
          </clipPath>
        </defs>
      </svg>

      <div className="ax-blocks" aria-hidden="true">
        {Array.from({ length: 7 }, (_, i) => (
          <span key={i} className={`ax-block ax-block--${i + 1}`} />
        ))}
      </div>

      <main>
        {/* ── FV ── */}
        <section className="ax-hero" id="hero" aria-labelledby="ax-hero-title">
          <div className="ax-hero__frame">
            <div className="ax-hero__media">
              <picture>
                <source media="(max-width: 639px)" srcSet="/images/adofy-corp/hero-team-sp.webp" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/adofy-corp/hero-team.webp" alt="ノートパソコンを囲んで打ち合わせをするチーム" fetchPriority="high" />
              </picture>
              <h1 className="ax-hero__title" id="ax-hero-title">
                <span>成果から逆算する、</span>
                <span>Webマーケティング。</span>
              </h1>
            </div>

            <Link href="/" className="ax-logo" aria-label="adofy トップへ">
              <b lang="en">adofy</b>
              <small>岐阜発・全国対応</small>
            </Link>
            <button type="button" className="ax-motion" aria-pressed={motionOff} onClick={() => setMotionOff((v) => !v)}>
              モーション{motionOff ? "再生" : "停止"}
              {motionOff ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
            </button>
            <nav className="ax-hero__nav" aria-label="ページ内メニュー">
              <ul>
                {HERO_NAV.map((n) => (
                  <li key={n.href}>
                    <a href={n.href}>{n.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </section>

        {/* ── About ── */}
        <section className="ax-sec ax-about" id="about" aria-labelledby="ax-about-title">
          <div className="ax-wrap">
            <SectionLabel en="ABOUT US" ja="私たちについて" />
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

        {/* ── 写真の帯 ── */}
        <div className="ax-photos" aria-hidden="true">
          <div className="ax-photos__track">
            {[0, 1].map((k) => (
              <div key={k}>
                {PHOTOS.map((p) => (
                  <img key={p.src} src={p.src} alt="" loading="lazy" className={p.wide ? "is-wide" : undefined} />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ── Service ── */}
        <section className="ax-service" id="service" aria-labelledby="ax-service-title">
          <div className="ax-tab ax-tab--slate">
            <SectionLabel en="SERVICE" ja="サービスを知る" />
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
                <div className="ax-orbs" aria-hidden="true" data-fade>
                  <svg viewBox="0 0 600 400" fill="none">
                    <ellipse cx="300" cy="200" rx="285" ry="135" transform="rotate(-20 300 200)" stroke="currentColor" />
                  </svg>
                  <span className="ax-orb ax-orb--a">集客</span>
                  <span className="ax-orb ax-orb--b">採用</span>
                </div>
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
            <SectionLabel en="WORKS" ja="実績を知る" />
          </div>
          <div className="ax-works__inner">
            <div className="ax-wrap">
              <h2 className="ax-visually-hidden" id="ax-works-title">
                支援の実績
              </h2>
              <div className="ax-works__grid">
                <WorkLink work={WORKS[0]} className="ax-feature">
                  <p className="ax-feature__en" lang="en" aria-hidden="true">Selected Works</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={WORKS[0].img} alt={`${WORKS[0].title}の実績`} loading="lazy" data-fade />
                  <span className="ax-pill ax-pill--dark">{WORKS[0].tag}</span>
                  <h3>
                    {WORKS[0].title}｜{WORKS[0].body}
                    <ArrowRight aria-hidden="true" />
                  </h3>
                </WorkLink>
                <ul className="ax-worklist">
                  {WORKS.slice(1).map((w) => (
                    <li key={w.title} data-fade>
                      <WorkLink work={w} className="ax-workitem">
                        <span className="ax-workitem__side" lang="en" aria-hidden="true">( Case )</span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={w.img} alt={`${w.title}の実績`} loading="lazy" />
                        <div>
                          <span className="ax-pill ax-pill--dark">{w.tag}</span>
                          <h3>
                            {w.title}
                            {w.href && <ArrowRight aria-hidden="true" />}
                          </h3>
                          <p>{w.body}</p>
                        </div>
                      </WorkLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── 強み ── */}
        <section className="ax-sec ax-strength" id="strength" aria-labelledby="ax-strength-title">
          <div className="ax-wrap">
            <SectionLabel en="STRENGTH" ja="強みを知る" />
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
            <SectionLabel en="COLUMN" ja="コラムを読む" />
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
              <div key={g.en}>
                <p className="ax-footer__head">
                  <span lang="en">{g.en}</span>
                  <i aria-hidden="true">/</i>
                  {g.ja}
                </p>
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
