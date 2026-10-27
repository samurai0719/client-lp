"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowUpRight, BarChart3, Megaphone, MonitorSmartphone, Palette, Truck, Users, type LucideIcon } from "lucide-react";
import { ARTICLES } from "@/components/adofy-corp/articles/content";
import "./home.css";

/**
 * adofy コーポレートサイトのトップページ（https://adofy-site.com/）。
 * 動きは GSAP（ScrollTrigger）と CSS。FVは写真（public/images/adofy-corp/hero-team.webp）＋HTMLの見出し。
 * 「動きを減らす」設定では、演出を止めて最初からすべて表示する。
 */

gsap.registerPlugin(ScrollTrigger);


const HERO_LINES = ["成果から逆算する、", "Webマーケティング。"];

const MARQUEE = ["Web広告運用", "LP制作", "ホームページ制作", "クリエイティブ制作", "採用支援", "ドライバー採用"];

type Service = { icon: LucideIcon; no: string; title: string; body: string; href?: string; linkLabel?: string };
const SERVICES: Service[] = [
  { icon: Megaphone, no: "01", title: "成果報酬型広告運用", body: "訴求・LP・クリエイティブまで改善しながら、広告費に対して成果が残る運用を目指します。" },
  { icon: MonitorSmartphone, no: "02", title: "LP・ホームページ制作", body: "広告から問い合わせ・応募までの導線を設計したLPと、信頼感を伝えるホームページを制作します。" },
  { icon: Palette, no: "03", title: "クリエイティブ制作", body: "バナー・動画広告・SNS画像など、見る人の行動につながるクリエイティブを企画・制作します。" },
  { icon: BarChart3, no: "04", title: "マーケティング支援", body: "数値分析・改善提案・導線設計まで、売上につながる施策を一貫して支援します。" },
  {
    icon: Users,
    no: "05",
    title: "採用支援「採用レスキュー」",
    body: "採用LPと広告クリエイティブをセットで制作し、応募が集まる導線を設計します。",
    href: "https://saiyo.adofy-site.com/",
    linkLabel: "採用レスキューを見る",
  },
  {
    icon: Truck,
    no: "06",
    title: "自社サービス「ドラテク」",
    body: "愛知県の運送会社様向けドライバー採用サービス。面接したい人を選ぶと、連絡と日程調整をドラテクが行います。",
    href: "https://scout.adofy-site.com/",
    linkLabel: "ドラテクを見る",
  },
];

const WORKS = [
  { img: "/images/adofy/case-01-takanaga.webp", tag: "建設・外構", title: "高長建設様", body: "コーポレートサイト制作・集客設計", href: "https://www.takanagakensetu.com/", external: true },
  { img: "/images/adofy/case-02-paintnet.webp", tag: "外壁塗装", title: "Paint Net様", body: "集客ページ制作・問い合わせ導線設計" },
  { img: "/images/adofy/ad-02-mynavi-pharmacist.webp", tag: "人材・薬剤師", title: "マイナビ薬剤師", body: "広告運用 × 診断LP制作", href: "/works/mynavi-pharmacist" },
  { img: "/images/adofy/ad-01-rizap-golf.webp", tag: "スクール", title: "RIZAP GOLF", body: "広告運用 × 記事LP制作", href: "/works/rizap-golf" },
];

const STATS = [
  { value: 100, unit: "社以上", label: "採用・集客の支援実績" },
  { value: 2000, unit: "人以上", label: "累計集客・応募者数" },
  { value: 6, unit: "ジャンル", label: "看護師・薬剤師・ドライバーなど" },
];

const STRENGTHS = [
  { title: "広告・LP・クリエイティブを一貫して改善", body: "広告を出して終わりにせず、訴求から導線までまとめて見直します。" },
  { title: "数字をもとにしたスピード感のある運用", body: "配信結果を見ながら、デザイン・構成・コピーを素早く改善します。" },
  { title: "岐阜から全国対応の柔軟な制作体制", body: "オンラインで打ち合わせから公開まで進め、全国のご相談に対応します。" },
];

export default function HomeContent() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      el.classList.add("is-static");
      return;
    }
    el.classList.add("is-motion");

    const ctx = gsap.context(() => {
      // ── FV：写真 → 見出し（文字ごと） → 説明 → ボタン → 数字チップ
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from(".ah-hero__photo", { scale: 1.12, opacity: 0, duration: 1.6 })
        .from(".ah-hero__eyebrow", { y: 16, opacity: 0, duration: 0.7 }, 0.3)
        .from(".ah-hero__title .ah-ch", { yPercent: 110, opacity: 0, duration: 0.9, stagger: 0.035 }, 0.4)
        .from(".ah-hero__lead", { y: 20, opacity: 0, duration: 0.8 }, "-=0.5")
        .from(".ah-hero__ctas > *", { y: 20, opacity: 0, duration: 0.7, stagger: 0.1 }, "-=0.55")
        .from(".ah-chip", { y: 30, opacity: 0, scale: 0.9, duration: 0.8, stagger: 0.12 }, "-=0.5");

      // FVの写真はスクロールに合わせてゆっくり拡大・見出しは少し上へ（視差）
      gsap.to(".ah-hero__photo img", { scale: 1.12, yPercent: 6, ease: "none", scrollTrigger: { trigger: ".ah-hero", start: "top top", end: "bottom top", scrub: true } });
      gsap.to(".ah-hero__copy", { yPercent: -18, opacity: 0.2, ease: "none", scrollTrigger: { trigger: ".ah-hero", start: "top top", end: "bottom top", scrub: true } });

      // ── 見出し：行ごとに下から
      gsap.utils.toArray<HTMLElement>(".ah-reveal-lines").forEach((h) => {
        gsap.from(h.querySelectorAll(".ah-line > span"), { yPercent: 105, duration: 0.9, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: h, start: "top 85%" } });
      });
      // ── 説明・カード：少しずつずらして
      gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((wrap) => {
        gsap.from(wrap.children, { y: 40, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.1, scrollTrigger: { trigger: wrap, start: "top 82%" } });
      });
      gsap.utils.toArray<HTMLElement>("[data-fade]").forEach((n) => {
        gsap.from(n, { y: 24, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: n, start: "top 88%" } });
      });

      // ── About：写真の視差と、文章を1語ずつ濃くする
      gsap.to(".ah-about__img img", { yPercent: -12, ease: "none", scrollTrigger: { trigger: ".ah-about", start: "top bottom", end: "bottom top", scrub: true } });
      gsap.fromTo(".ah-about__text .ah-word", { opacity: 0.18 }, { opacity: 1, stagger: 0.05, ease: "none", scrollTrigger: { trigger: ".ah-about__text", start: "top 80%", end: "bottom 45%", scrub: true } });

      // ── 数字：一度だけ数え上げ
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((n) => {
        const target = Number(n.dataset.count);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: { trigger: n, start: "top 85%", once: true },
          onUpdate: () => (n.textContent = Math.round(obj.v).toLocaleString("ja-JP")),
        });
      });

      // ── 強みの線：スクロールに合わせて伸びる
      gsap.from(".ah-strength__bar", { scaleY: 0, transformOrigin: "top", ease: "none", scrollTrigger: { trigger: ".ah-strength__list", start: "top 70%", end: "bottom 60%", scrub: true } });

      // ── Works：PCは横スクロール（ピン留め）
      const mm = gsap.matchMedia();
      mm.add("(min-width: 900px)", () => {
        const track = el.querySelector<HTMLElement>(".ah-works__track");
        const pin = el.querySelector<HTMLElement>(".ah-works__pin");
        if (!track || !pin) return;
        const dist = () => track.scrollWidth - pin.clientWidth;
        gsap.to(track, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: { trigger: pin, start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true },
        });
      });
    }, el);

    // ── サービスカード：マウスの位置で少し傾き、光が追いかける（PCのみ）
    const cards = Array.from(el.querySelectorAll<HTMLElement>(".ah-card"));
    const hover = window.matchMedia("(hover: hover)").matches;
    const onMove = (e: PointerEvent) => {
      const c = e.currentTarget as HTMLElement;
      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      c.style.setProperty("--mx", `${x * 100}%`);
      c.style.setProperty("--my", `${y * 100}%`);
      c.style.setProperty("--rx", `${(0.5 - y) * 8}deg`);
      c.style.setProperty("--ry", `${(x - 0.5) * 10}deg`);
    };
    const onLeave = (e: PointerEvent) => {
      const c = e.currentTarget as HTMLElement;
      c.style.setProperty("--rx", "0deg");
      c.style.setProperty("--ry", "0deg");
    };
    if (hover) cards.forEach((c) => (c.addEventListener("pointermove", onMove), c.addEventListener("pointerleave", onLeave)));

    // ── ボタン：マウスに少し吸い寄せられる（PCのみ）
    const mags = Array.from(el.querySelectorAll<HTMLElement>("[data-magnetic]"));
    const magMove = (e: PointerEvent) => {
      const b = e.currentTarget as HTMLElement;
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.25}px)`;
    };
    const magLeave = (e: PointerEvent) => ((e.currentTarget as HTMLElement).style.transform = "");
    if (hover) mags.forEach((b) => (b.addEventListener("pointermove", magMove), b.addEventListener("pointerleave", magLeave)));

    // ── マウスについてくる光（PCのみ）
    const glow = el.querySelector<HTMLElement>(".ah-cursor");
    const onCursor = (e: PointerEvent) => glow && gsap.to(glow, { x: e.clientX, y: e.clientY, duration: 0.6, ease: "power3.out" });
    if (hover) window.addEventListener("pointermove", onCursor);

    return () => {
      ctx.revert();
      cards.forEach((c) => (c.removeEventListener("pointermove", onMove), c.removeEventListener("pointerleave", onLeave)));
      mags.forEach((b) => (b.removeEventListener("pointermove", magMove), b.removeEventListener("pointerleave", magLeave)));
      window.removeEventListener("pointermove", onCursor);
    };
  }, []);

  const aboutText =
    "adofyは、岐阜を拠点にWebマーケティング支援を行う会社です。見た目の美しさだけでなく、広告効果・問い合わせ・応募・売上につながる設計を重視し、制作から改善まで伴走します。";

  return (
    <div ref={root} className="ah">
      <div className="ah-cursor" aria-hidden="true" />

      <main>
        {/* ── FV ── */}
        <section className="ah-hero" id="hero" aria-labelledby="ah-hero-title">
          <div className="ah-hero__photo">
            <picture>
              <source media="(max-width: 767px)" srcSet="/images/adofy-corp/hero-team-sp.webp" />
              <img src="/images/adofy-corp/hero-team.webp" alt="ノートパソコンを囲んで打ち合わせをするチーム" fetchPriority="high" />
            </picture>
          </div>
          <div className="ah-hero__shade" aria-hidden="true" />
          <div className="ah-hero__blob ah-hero__blob--1" aria-hidden="true" />
          <div className="ah-hero__blob ah-hero__blob--2" aria-hidden="true" />

          <div className="ah-hero__copy">
            <p className="ah-hero__eyebrow">
              <span className="ah-dot" aria-hidden="true" />
              岐阜発・全国対応のWebマーケティング
            </p>
            <h1 className="ah-hero__title" id="ah-hero-title" aria-label={HERO_LINES.join("")}>
              {HERO_LINES.map((line, li) => (
                <span key={line} className={`ah-hero__line${li === 1 ? " is-accent" : ""}`} aria-hidden="true">
                  {Array.from(line).map((c, i) => (
                    <span key={i} className="ah-ch">
                      {c}
                    </span>
                  ))}
                </span>
              ))}
            </h1>
            <p className="ah-hero__lead">広告運用・LP制作・採用支援まで。数字を見ながら、問い合わせと応募につながる仕組みをつくります。</p>
            <div className="ah-hero__ctas">
              <a href="/contact" className="ah-btn ah-btn--primary" data-magnetic>
                <span>無料で相談する</span>
                <ArrowRight aria-hidden="true" />
              </a>
              <a href="#service" className="ah-btn ah-btn--ghost">
                <span>サービスを見る</span>
              </a>
            </div>
          </div>

          <ul className="ah-hero__chips" aria-label="実績">
            <li className="ah-chip">
              <b>100</b>
              <span>社以上の支援実績</span>
            </li>
            <li className="ah-chip">
              <b>2,000</b>
              <span>人以上の累計集客・応募</span>
            </li>
          </ul>

          <a href="#about" className="ah-scroll" aria-label="下へスクロール">
            <span>Scroll</span>
            <i aria-hidden="true" />
          </a>
        </section>

        {/* ── 流れる帯 ── */}
        <div className="ah-marquee" aria-hidden="true">
          <div className="ah-marquee__track">
            {[0, 1].map((k) => (
              <span key={k}>
                {MARQUEE.map((m) => (
                  <em key={m}>{m}</em>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* ── About ── */}
        <section className="ah-sec ah-about" id="about" aria-labelledby="ah-about-title">
          <div className="ah-wrap ah-about__grid">
            <div>
              <p className="ah-eyebrow">About adofy</p>
              <h2 className="ah-h2 ah-reveal-lines" id="ah-about-title">
                <span className="ah-line">
                  <span>成果から逆算する、</span>
                </span>
                <span className="ah-line">
                  <span>次世代のWebパートナー。</span>
                </span>
              </h2>
              <p className="ah-about__text">
                {aboutText.split(/(?<=、|。)/).map((w, i) => (
                  <span key={i} className="ah-word">
                    {w}
                  </span>
                ))}
              </p>
              <div className="ah-about__links" data-fade>
                <Link href="/business">
                  事業内容・会社概要 <ArrowRight aria-hidden="true" />
                </Link>
                <Link href="/profile">
                  代表プロフィール <ArrowRight aria-hidden="true" />
                </Link>
              </div>
            </div>
            <div className="ah-about__img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/adofy/photo-planning.webp" alt="打ち合わせで企画を練る様子" loading="lazy" />
            </div>
          </div>
        </section>

        {/* ── 数字 ── */}
        <section className="ah-stats" aria-label="実績の数字">
          <ul className="ah-wrap ah-stats__list" data-stagger>
            {STATS.map((s) => (
              <li key={s.label}>
                <p className="ah-stats__num">
                  <b data-count={s.value}>{s.value.toLocaleString("ja-JP")}</b>
                  <small>{s.unit}</small>
                </p>
                <p className="ah-stats__label">{s.label}</p>
              </li>
            ))}
          </ul>
          <p className="ah-wrap ah-stats__note">※運営者がこれまでに行ってきた支援の実績です。</p>
        </section>

        {/* ── Service ── */}
        <section className="ah-sec ah-service" id="service" aria-labelledby="ah-service-title">
          <div className="ah-wrap">
            <p className="ah-eyebrow">Service</p>
            <h2 className="ah-h2 ah-reveal-lines" id="ah-service-title">
              <span className="ah-line">
                <span>集客も、採用も。</span>
              </span>
              <span className="ah-line">
                <span>Webでまとめて伴走します。</span>
              </span>
            </h2>
            <ul className="ah-cards" data-stagger>
              {SERVICES.map((s) => {
                const Icon = s.icon;
                return (
                  <li key={s.title} className="ah-card">
                    <span className="ah-card__no">{s.no}</span>
                    <span className="ah-card__icon" aria-hidden="true">
                      <Icon />
                    </span>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                    {s.href && (
                      <a href={s.href} target="_blank" rel="noopener noreferrer" className="ah-card__link">
                        {s.linkLabel}
                        <ArrowUpRight aria-hidden="true" />
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* ── Works（PCは横スクロール） ── */}
        <section className="ah-works" id="works" aria-labelledby="ah-works-title">
          <div className="ah-works__pin">
            <div className="ah-wrap ah-works__head">
              <p className="ah-eyebrow">Works</p>
              <h2 className="ah-h2 ah-reveal-lines" id="ah-works-title">
                <span className="ah-line">
                  <span>数字を追い続けた、</span>
                </span>
                <span className="ah-line">
                  <span>支援の実績。</span>
                </span>
              </h2>
            </div>
            <ul className="ah-works__track">
              {WORKS.map((w) => {
                const inner = (
                  <>
                    <div className="ah-work__img">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={w.img} alt={`${w.title}の実績`} loading="lazy" />
                    </div>
                    <p className="ah-work__tag">{w.tag}</p>
                    <h3>{w.title}</h3>
                    <p className="ah-work__body">{w.body}</p>
                  </>
                );
                return (
                  <li key={w.title} className="ah-work">
                    {w.href && "external" in w ? (
                      <a href={w.href} target="_blank" rel="noopener noreferrer" className="ah-work__link">
                        {inner}
                      </a>
                    ) : w.href ? (
                      <Link href={w.href} className="ah-work__link">
                        {inner}
                      </Link>
                    ) : (
                      <div className="ah-work__link">{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* ── 強み ── */}
        <section className="ah-sec ah-strength" aria-labelledby="ah-strength-title">
          <div className="ah-wrap ah-strength__grid">
            <div>
              <p className="ah-eyebrow">Strength</p>
              <h2 className="ah-h2 ah-reveal-lines" id="ah-strength-title">
                <span className="ah-line">
                  <span>adofyが</span>
                </span>
                <span className="ah-line">
                  <span>選ばれる理由。</span>
                </span>
              </h2>
            </div>
            <ol className="ah-strength__list">
              <span className="ah-strength__bar" aria-hidden="true" />
              {STRENGTHS.map((s, i) => (
                <li key={s.title} data-fade>
                  <span className="ah-strength__no">0{i + 1}</span>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── 記事 ── */}
        <section className="ah-sec ah-articles" aria-labelledby="ah-articles-title">
          <div className="ah-wrap">
            <div className="ah-articles__head">
              <div>
                <p className="ah-eyebrow">Column</p>
                <h2 className="ah-h2 ah-reveal-lines" id="ah-articles-title">
                  <span className="ah-line">
                    <span>運送会社のための</span>
                  </span>
                  <span className="ah-line">
                    <span>ドライバー採用コラム。</span>
                  </span>
                </h2>
              </div>
              <Link href="/articles" className="ah-more" data-fade>
                コラム一覧へ <ArrowRight aria-hidden="true" />
              </Link>
            </div>
            <ul className="ah-columns" data-stagger>
              {ARTICLES.filter((a) => a.audience === "company").slice(0, 4).map((a, i) => (
                <li key={a.slug} className={i === 0 ? "is-feature" : undefined}>
                  <Link href={`/articles/${a.slug}`} className="ah-column">
                    <div className="ah-column__img">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={a.image} alt="" loading="lazy" />
                      <span className="ah-column__cat">{a.category}</span>
                    </div>
                    <div className="ah-column__body">
                      <p className="ah-column__meta">
                        COLUMN {String(i + 1).padStart(2, "0")}・約{a.minutes}分で読めます
                      </p>
                      <h3>{a.title}</h3>
                      <p className="ah-column__desc">{a.description}</p>
                      <span className="ah-column__more">
                        続きを読む <ArrowRight aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── お問い合わせ ── */}
        <section className="ah-contact" id="contact" aria-labelledby="ah-contact-title">
          <div className="ah-contact__bg" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="ah-wrap ah-contact__inner">
            <p className="ah-eyebrow is-light">Contact</p>
            <h2 className="ah-h2 is-light ah-reveal-lines" id="ah-contact-title">
              <span className="ah-line">
                <span>Web集客・採用の</span>
              </span>
              <span className="ah-line">
                <span>ご相談はこちら。</span>
              </span>
            </h2>
            <p className="ah-contact__lead" data-fade>
              広告運用、LP・HP制作、採用支援など、まずはお気軽にご相談ください。岐阜県内はもちろん、全国対応です。
            </p>
            <a href="/contact" className="ah-btn ah-btn--light" data-magnetic data-fade>
              <span>無料で相談する</span>
              <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </section>
      </main>

      {/* ── フッター ── */}
      <footer className="ah-footer">
        <div className="ah-wrap ah-footer__grid">
          <div>
            <p className="ah-footer__brand">adofy</p>
            <p className="ah-footer__desc">岐阜発・全国対応のWebマーケティング会社。広告運用・LP制作・HP制作・クリエイティブ制作・採用支援を行っています。</p>
          </div>
          <nav aria-label="フッターメニュー">
            <a href="#service">サービス</a>
            <a href="#works">実績</a>
            <Link href="/business">事業内容・会社概要</Link>
            <Link href="/articles">ドライバー採用の記事</Link>
            <Link href="/profile">代表プロフィール</Link>
            <a href="/contact">お問い合わせ</a>
          </nav>
        </div>
        <p className="ah-wrap ah-footer__copy">© 2026 adofy</p>
      </footer>
    </div>
  );
}
