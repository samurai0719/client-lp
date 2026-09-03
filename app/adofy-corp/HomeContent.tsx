"use client";

import React, { useId } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  ArrowUp,
  BarChart3,
  MonitorSmartphone,
  Palette,
  Megaphone,
  Sparkles,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import {
  DotGrid,
  WaveDivider,
  OrbitRings,
  TopographicLines,
  CornerSpark,
  HeroBackgroundArt,
} from "@/components/adofy-corp/decorations";
import { ScrollProgressBar, RevealText, MagneticButton, ScrollReveal } from "@/components/adofy-corp/animations";
import MockupScreen from "@/components/adofy-corp/visuals/MockupScreen";
import WorkCase from "@/components/adofy-corp/works/WorkCase";
import MascotFigure from "@/components/adofy-corp/visuals/MascotFigure";
import TopographicFlow from "@/components/adofy-corp/backgrounds/TopographicFlow";
import CircuitNetwork from "@/components/adofy-corp/backgrounds/CircuitNetwork";
import PerspectiveGrid from "@/components/adofy-corp/backgrounds/PerspectiveGrid";
import ColorfulShapes from "@/components/adofy-corp/backgrounds/ColorfulShapes";
import OrbitMetrics from "@/components/adofy-corp/backgrounds/OrbitMetrics";
import ConvergenceField from "@/components/adofy-corp/backgrounds/ConvergenceField";
import FooterHorizon from "@/components/adofy-corp/backgrounds/FooterHorizon";
import { useGsapContext } from "@/components/adofy-corp/hooks/useGsapContext";
import { useReducedMotion } from "@/components/adofy-corp/hooks/useReducedMotion";

const partners = [
  {
    name: "マイナビ薬剤師",
    href: "/works/mynavi-pharmacist",
  },
  {
    name: "ナース専科",
    href: "/works/nurse-senka",
  },
  {
    name: "RIZAP GOLF",
    href: "/works/rizap-golf",
  },
  {
    name: "レバレジーズグループ",
    href: "/works/leverages",
  },
];

const services = [
  {
    icon: Megaphone,
    title: "成果報酬型広告運用",
    lines: ["成果につながる訴求・LP・クリエイティブを設計し、", "広告費に対して利益が残る運用を目指します。"],
  },
  {
    icon: MonitorSmartphone,
    title: "LP・HP制作",
    lines: ["広告導線に最適化したLPから、", "企業の信頼感を高めるホームページまで制作します。"],
  },
  {
    icon: Palette,
    title: "クリエイティブ制作",
    lines: ["バナー・動画広告・SNS画像など、", "ユーザーの行動を促すクリエイティブを制作します。"],
  },
  {
    icon: BarChart3,
    title: "マーケティング支援",
    lines: ["数値分析・改善提案・導線設計まで、", "売上最大化に向けた施策を一貫して支援します。"],
  },
];

const strengths = [
  "広告・LP・クリエイティブを一貫して改善",
  "数字をもとにしたスピード感のある運用",
  "岐阜から全国対応できる柔軟な制作体制",
];

export default function HomeContent() {
  const rawClipId = useId().replace(/:/g, "");
  const heroClipId = `hero-clip-${rawClipId}`;
  const reducedMotion = useReducedMotion();

  const headerRef = useGsapContext<HTMLElement>(({ scope }) => {
    const el = scope.current;
    if (!el) return;

    if (reducedMotion) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(el, { opacity: 0, y: -16 });
    gsap.to(el, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });

    ScrollTrigger.create({
      start: "top -80",
      end: 99999,
      toggleClass: { targets: el, className: "is-scrolled" },
    });
  }, [reducedMotion]);

  const heroContentRef = useGsapContext<HTMLDivElement>(({ scope }) => {
    const el = scope.current;
    if (!el) return;

    const badge = el.querySelector('[data-hero="badge"]');
    const desc = el.querySelector('[data-hero="desc"]');
    const cta = el.querySelector('[data-hero="cta"]');
    const targets = [badge, desc, cta].filter(Boolean);
    if (!targets.length) return;

    if (reducedMotion) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(targets, { opacity: 0, y: 16 });
    gsap.to(badge, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out", delay: 0.1 });
    gsap.to(desc, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.95 });
    gsap.to(cta, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", delay: 1.25 });
  }, [reducedMotion]);

  /** Very small desktop-only parallax on the hero video — never enough to hide the robot. */
  const heroSectionRef = useGsapContext<HTMLElement>(({ scope }) => {
    const section = scope.current;
    if (!section || reducedMotion) return;

    gsap.matchMedia().add("(min-width: 1024px)", () => {
      const video = section.querySelector("#hero-desktop-video");
      if (!video) return;

      gsap.fromTo(
        video,
        { y: -14 },
        {
          y: 14,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    });
  }, [reducedMotion]);

  /** ABOUT card ring: a quiet 16° turn tied directly to scroll, not a free-spinning loop. */
  const aboutSectionRef = useGsapContext<HTMLElement>(({ scope }) => {
    const section = scope.current;
    if (!section || reducedMotion) return;

    const ring = section.querySelector('[data-about-ring]');
    if (!ring) return;

    gsap.to(ring, {
      rotation: 16,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }, [reducedMotion]);

  /** Each service card's corner square draws itself in once the card has scrolled into view. */
  const serviceSectionRef = useGsapContext<HTMLElement>(({ scope }) => {
    const section = scope.current;
    if (!section) return;

    const squares = Array.from(section.querySelectorAll<SVGRectElement>("[data-draw]"));
    if (!squares.length) return;

    if (reducedMotion) {
      squares.forEach((square) => {
        square.style.strokeDashoffset = "0";
      });
      return;
    }

    squares.forEach((square) => {
      const length = square.getTotalLength();
      square.style.strokeDasharray = `${length}`;
      square.style.strokeDashoffset = `${length}`;
    });

    gsap.to(squares, {
      strokeDashoffset: 0,
      duration: 1.1,
      stagger: 0.1,
      delay: 0.3,
      ease: "power2.out",
      scrollTrigger: {
        trigger: section,
        start: "top 70%",
        toggleActions: "play none none none",
      },
    });
  }, [reducedMotion]);

  /** Back-to-top button: its ring fills as a quiet readout of overall scroll progress. */
  const backToTopRingRef = useGsapContext<SVGSVGElement>(({ scope }) => {
    const svg = scope.current;
    if (!svg) return;
    const ring = svg.querySelector<SVGCircleElement>("[data-progress-ring]");
    if (!ring) return;

    const circumference = 2 * Math.PI * 19;
    gsap.set(ring, { strokeDasharray: circumference, strokeDashoffset: circumference });

    if (reducedMotion) return;

    ScrollTrigger.create({
      start: 0,
      end: () => Math.max(document.documentElement.scrollHeight - window.innerHeight, 1),
      onUpdate: (self) => gsap.set(ring, { strokeDashoffset: circumference * (1 - self.progress) }),
    });
  }, [reducedMotion]);

  return (
    <main className="min-h-screen overflow-hidden bg-surface text-ink">
      <ScrollProgressBar />

      {/* ヘッダー：ページ全体で persist し、スクロールに応じて状態変化する */}
      <header
        ref={headerRef}
        className="header-bar fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-border-soft bg-white/60 px-5 py-5 backdrop-blur-md md:px-10"
      >
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border-soft bg-white/80 shadow-sm backdrop-blur">
            <Sparkles className="h-5 w-5 text-accent-blue" />
          </div>

          <div>
            <p className="text-lg font-bold tracking-wide text-ink">adofy</p>
            <p className="text-xs text-ink-soft">Creative Marketing Company</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-ink-soft md:flex">
          <a href="#service" className="group relative py-1 transition hover:text-accent-blue">
            Service
            <span className="absolute inset-x-0 -bottom-0.5 h-[1.5px] origin-left scale-x-0 bg-accent-blue transition-transform duration-300 group-hover:scale-x-100" />
          </a>
          <a href="#works" className="group relative py-1 transition hover:text-accent-blue">
            Works
            <span className="absolute inset-x-0 -bottom-0.5 h-[1.5px] origin-left scale-x-0 bg-accent-blue transition-transform duration-300 group-hover:scale-x-100" />
          </a>
          <a href="/profile" className="group relative py-1 transition hover:text-accent-blue">
            Profile
            <span className="absolute inset-x-0 -bottom-0.5 h-[1.5px] origin-left scale-x-0 bg-accent-blue transition-transform duration-300 group-hover:scale-x-100" />
          </a>
          <a href="/contact" className="group relative py-1 transition hover:text-accent-blue">
            Contact
            <span className="absolute inset-x-0 -bottom-0.5 h-[1.5px] origin-left scale-x-0 bg-accent-blue transition-transform duration-300 group-hover:scale-x-100" />
          </a>
        </nav>
      </header>

      {/* ファーストビュー */}
      <section
        id="hero"
        ref={heroSectionRef}
        className="relative isolate flex min-h-screen items-center overflow-hidden bg-gradient-to-b from-white via-white to-mist-blue pb-20 pt-28 md:pt-24"
      >
        {/* モバイル/タブレット：ロボット動画を背景レイヤーとして使用 */}
        <div className="absolute inset-0 lg:hidden">
          <video
            className="h-full w-full object-cover"
            style={{ objectPosition: "80% 38%", transform: "scale(1.06)" }}
            src="/fv-robot.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(100deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.86) 38%, rgba(242,247,255,0.6) 68%, rgba(242,247,255,0.4) 100%), linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 26%, rgba(242,247,255,0.5) 100%)",
            }}
          />
        </div>

        <HeroBackgroundArt waveColor="#ffffff" />

        {/* ファーストビュー本文 */}
        <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-5 md:px-10 lg:grid-cols-2">
          <div ref={heroContentRef} className="max-w-xl">
            <div
              data-hero="badge"
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/70 px-4 py-2 text-sm text-ink-soft backdrop-blur"
            >
              <MapPin className="h-4 w-4 text-accent-blue" />
              岐阜発・全国対応のITマーケティング企業
            </div>

            <h1 className="text-4xl font-black leading-tight tracking-tight text-ink md:text-6xl lg:text-7xl">
              <RevealText
                trigger="mount"
                delay={0.35}
                duration={0.85}
                stagger={0.12}
                lines={[
                  "未来を創造する",
                  <span
                    key="line2"
                    className="bg-gradient-to-r from-blue-600 via-cyan-500 to-amber-500 bg-clip-text text-transparent"
                  >
                    岐阜のIT企業
                  </span>,
                ]}
              />
            </h1>

            <p
              data-hero="desc"
              className="mt-7 max-w-2xl text-base leading-relaxed text-ink-soft md:text-xl"
            >
              成果報酬型広告運用・LP制作・HP制作・クリエイティブ制作を通じて、
              企業の魅力を引き出し、売上最大化を支援します。
            </p>

            <div data-hero="cta" className="relative mt-9 flex flex-col gap-4 sm:flex-row">
              <MagneticButton strength={8}>
                <a
                  href="/contact"
                  className="group inline-flex items-center justify-center rounded-full bg-accent-blue px-7 py-4 font-bold text-white shadow-xl shadow-blue-600/20 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-600/30"
                >
                  お問い合わせはこちら
                  <ArrowRight className="ml-2 h-5 w-5 transition group-hover:translate-x-1" />
                </a>
              </MagneticButton>

              <a
                href="#service"
                className="inline-flex items-center justify-center rounded-full border border-border-soft bg-white px-7 py-4 font-bold text-ink backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-border-soft-hover hover:bg-mist-blue"
              >
                事業内容を見る
              </a>

              <CornerSpark
                variant="spark"
                className="absolute -top-6 right-2 hidden h-6 w-6 text-accent-amber sm:block"
                opacity={0.7}
                fade
              />

              <MascotFigure
                src="/images/mascots/cat-girl-jump.png"
                alt="adofyのマスコットキャラクター"
                trigger="mount"
                delay={1.6}
                className="absolute -top-14 right-0 h-16 w-auto drop-shadow-lg lg:hidden"
              />
            </div>
          </div>

          {/* 右側：既存ビジュアル（背景動画）を曲線フレームに収める。モバイル/タブレットでは動画を背景レイヤーとして使うため非表示 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="relative mx-auto hidden w-full max-w-md lg:block lg:max-w-none"
          >
            <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
              <defs>
                <clipPath id={heroClipId} clipPathUnits="objectBoundingBox">
                  <path d="M0.06,0.16 C0.02,0.04 0.18,0 0.34,0.02 L0.86,0.02 C0.95,0.02 1,0.09 1,0.18 L1,0.78 C1,0.91 0.9,0.98 0.78,0.98 L0.2,0.98 C0.08,0.98 0,0.87 0,0.73 L0,0.3 Z" />
                </clipPath>
              </defs>
            </svg>

            <OrbitRings
              className="pointer-events-none absolute -inset-10 -z-10 text-accent-blue"
              opacity={0.18}
              rings={3}
              accentColor="#f59e0b"
            />

            <div
              className="relative aspect-[4/5] w-full overflow-hidden bg-mist-blue shadow-2xl shadow-blue-900/10"
              style={{ clipPath: `url(#${heroClipId})` }}
            >
              <video
                id="hero-desktop-video"
                className="h-full w-full object-cover"
                src="/fv-robot.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
              />
            </div>

            <div className="relative mt-4 w-full rounded-[1.75rem] border border-blue-100 bg-white/90 p-5 shadow-xl shadow-blue-900/5 backdrop-blur lg:absolute lg:-bottom-8 lg:-left-6 lg:mt-0 lg:w-56">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-accent-blue/30" />
                <span className="h-2.5 w-2.5 rounded-full bg-accent-amber/40" />
                <span className="h-2.5 w-2.5 rounded-full bg-accent-blue/30" />
              </div>

              <div className="rounded-2xl bg-mist-blue px-4 py-3 text-center text-sm font-bold text-ink">
                AI × Creative × Marketing
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-mist-ivory px-3 py-3">
                  <p className="text-2xl font-black text-ink">LP</p>
                  <p className="text-xs text-ink-soft">導線設計</p>
                </div>

                <div className="rounded-xl bg-mist-blue px-3 py-3">
                  <p className="text-2xl font-black text-ink">AD</p>
                  <p className="text-xs text-ink-soft">広告運用</p>
                </div>
              </div>
            </div>

            {/* マスコット：ロボット動画フレームの右下から少し覗く、welcomeアクセント */}
            <MascotFigure
              src="/images/mascots/cat-girl-jump.png"
              alt="adofyのマスコットキャラクター"
              trigger="mount"
              delay={1.7}
              className="absolute -bottom-6 -right-4 hidden h-28 w-auto drop-shadow-xl lg:block lg:h-32"
            />
          </motion.div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" ref={aboutSectionRef} className="relative overflow-hidden bg-white px-5 py-24 md:px-10">
        <TopographicFlow className="opacity-90" />
        <DotGrid
          className="absolute left-0 top-0 hidden h-full w-[38%] text-accent-blue sm:block"
          opacity={0.08}
        />

        <div className="relative mx-auto grid max-w-7xl items-start gap-x-10 gap-y-10 lg:grid-cols-[1fr_1fr] xl:grid-cols-[1.5fr_1fr_0.6fr] xl:items-center">
          <div className="relative min-w-0">
            <p className="mb-[clamp(16px,2.5vw,20px)] text-sm font-black uppercase tracking-[0.14em] text-accent-blue">
              About adofy
            </p>
            <h2 className="text-[28px] font-black leading-[1.4] tracking-[-0.03em] text-ink md:text-5xl md:leading-[1.15] lg:text-[36px] lg:leading-[1.18] xl:text-[2.75rem] xl:leading-[1.2]">
              <RevealText lines={["成果から逆算する、", "次世代のWebパートナー。"]} />
            </h2>

            <MascotFigure
              src="/images/mascots/cat-girl-thinking.png"
              alt="考え込むadofyのマスコットキャラクター"
              trigger="scroll"
              delay={0.3}
              className="mt-6 h-20 w-auto drop-shadow-lg sm:h-28 lg:h-32"
            />
          </div>

          {/* xl以上ではこのラッパーを display:contents にし、子要素を外側gridの2/3列目へ直接配置する（flexの最小幅衝突による右端見切れを回避） */}
          <div className="grid min-w-0 gap-6 xl:contents">
            <ScrollReveal y={20} scale={0.98} duration={0.8} className="relative z-10 min-w-0 w-full mx-auto">
              <div className="relative overflow-hidden rounded-[24px] border border-[rgba(59,96,180,0.10)] bg-gradient-to-br from-[rgba(255,255,255,0.92)] to-[rgba(247,250,255,0.86)] p-[clamp(24px,4vw,36px)] shadow-[0_8px_24px_rgba(23,32,51,0.04)]">
                <div data-about-ring className="absolute -right-6 -top-6 h-20 w-20">
                  <OrbitRings
                    className="pointer-events-none h-full w-full text-accent-blue"
                    opacity={0.08}
                    rings={3}
                    accentColor="#f59e0b"
                    animated={false}
                  />
                </div>
                <p className="relative text-[clamp(1rem,2vw,1.2rem)] leading-[1.85] tracking-[0.01em] text-ink-soft">
                  株式会社adofyは、岐阜を拠点にWebマーケティング支援を行うIT企業です。
                  見た目の美しさだけではなく、広告効果・問い合わせ・売上につながる設計を重視し、
                  制作から改善まで伴走します。
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal y={28} delay={0.15} duration={0.8} className="min-w-0 w-full mx-auto xl:mt-16">
              <MockupScreen
                variant="analytics"
                label="adofy Team"
                imageBase="/images/about/performance"
                alt="株式会社adofyのメンバーがミーティングをしている様子"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* SERVICE */}
      <section id="service" ref={serviceSectionRef} className="relative overflow-hidden bg-mist-blue px-5 py-24 md:px-10">
        <CircuitNetwork />
        <TopographicLines
          className="absolute -bottom-16 -right-10 hidden w-72 text-accent-blue md:block"
          opacity={0.1}
        />
        <ColorfulShapes
          shapes={[
            { type: "circle", x: 70, y: 90, size: 100, color: "#2563eb", opacity: 0.3 },
            { type: "ring", x: 130, y: 460, size: 140, color: "#2563eb", opacity: 0.32 },
            { type: "blob", x: 930, y: 130, size: 160, color: "#f59e0b", opacity: 0.28 },
            { type: "square", x: 900, y: 480, size: 60, color: "#0891b2", opacity: 0.34, rotate: 18 },
            { type: "circle", x: 480, y: 40, size: 38, color: "#f59e0b", opacity: 0.4 },
            { type: "ring", x: 600, y: 560, size: 80, color: "#0891b2", opacity: 0.3 },
          ]}
          mobileShapes={[
            { type: "circle", x: 60, y: 60, size: 80, color: "#2563eb", opacity: 0.3 },
            { type: "blob", x: 440, y: 110, size: 120, color: "#f59e0b", opacity: 0.26 },
            { type: "ring", x: 40, y: 420, size: 100, color: "#0891b2", opacity: 0.3 },
            { type: "square", x: 460, y: 480, size: 44, color: "#0891b2", opacity: 0.3, rotate: 16 },
            { type: "circle", x: 420, y: 700, size: 36, color: "#f59e0b", opacity: 0.36 },
            { type: "ring", x: 60, y: 800, size: 90, color: "#2563eb", opacity: 0.26 },
          ]}
        />

        <div className="relative mx-auto max-w-7xl">
          <MascotFigure
            src="/images/mascots/cat-boy-thumbsup.png"
            alt="サムズアップするadofyのマスコットキャラクター"
            trigger="scroll"
            delay={0.2}
            className="absolute -top-2 right-0 h-16 w-auto drop-shadow-lg sm:h-20 lg:h-28"
          />

          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-[clamp(16px,2.5vw,20px)] text-sm font-black tracking-widest text-accent-blue">
              SERVICE
            </p>
            <h2 className="mb-[clamp(24px,4vw,32px)] text-3xl font-black tracking-tight text-ink md:text-5xl">
              <RevealText lines={["事業内容"]} className="mx-auto" />
            </h2>
            <p className="text-[13px] leading-7 tracking-tight text-ink-soft md:text-base md:leading-8 md:tracking-normal">
              <span className="block">広告運用から制作まで、</span>
              <span className="block">成果を出すために必要な領域を一気通貫で支援します。</span>
            </p>
          </div>

          <div
            className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-3 lg:grid-rows-2 lg:[grid-template-areas:'a_b_b'_'a_c_d']"
          >
            {services.map((service, index) => {
              const Icon = service.icon;
              const areaClass = ["lg:[grid-area:a]", "lg:[grid-area:b]", "lg:[grid-area:c]", "lg:[grid-area:d]"][index];
              const isFeatured = index === 0;

              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 24, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                  className={`group relative flex flex-col overflow-hidden rounded-[2rem] border border-border-soft bg-white shadow-soft transition duration-300 hover:-translate-y-1.5 hover:border-border-soft-hover hover:shadow-hover ${areaClass} ${
                    isFeatured ? "p-7 lg:p-9" : "p-6"
                  }`}
                >
                  <svg
                    viewBox="0 0 60 60"
                    className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 text-accent-blue opacity-50 transition group-hover:opacity-80"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <rect
                      data-draw
                      x="2"
                      y="2"
                      width="56"
                      height="56"
                      rx="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>

                  <div className="flex items-start justify-between">
                    <div
                      className={`flex items-center justify-center rounded-2xl bg-accent-blue text-white transition duration-300 group-hover:scale-105 ${
                        isFeatured ? "h-16 w-16" : "h-14 w-14"
                      }`}
                    >
                      <Icon className={isFeatured ? "h-7 w-7" : "h-6 w-6"} />
                    </div>
                    <span className="text-right text-xs font-black uppercase tracking-widest text-accent-blue/40">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className={`leading-snug text-ink ${isFeatured ? "mt-8 text-2xl lg:text-3xl" : "mt-6 text-xl"} font-black`}>
                    {service.title}
                  </h3>

                  <p
                    className={`leading-6 tracking-tight text-ink-soft ${
                      isFeatured ? "mt-4 max-w-sm text-sm lg:text-base lg:leading-7" : "mt-4 text-xs"
                    }`}
                  >
                    {service.lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WORKS */}
      <section
        id="works"
        className="relative overflow-hidden bg-white px-5 py-24 md:px-10"
      >
        <PerspectiveGrid />
        <ColorfulShapes
          className="h-[640px] md:h-[760px]"
          shapes={[
            { type: "blob", x: 60, y: 60, size: 140, color: "#f59e0b", opacity: 0.24 },
            { type: "circle", x: 950, y: 200, size: 70, color: "#f59e0b", opacity: 0.32 },
            { type: "ring", x: 900, y: 480, size: 120, color: "#2563eb", opacity: 0.3 },
            { type: "square", x: 50, y: 540, size: 54, color: "#0891b2", opacity: 0.34, rotate: -12 },
            { type: "circle", x: 500, y: 30, size: 30, color: "#2563eb", opacity: 0.36 },
          ]}
          mobileShapes={[
            { type: "blob", x: 60, y: 50, size: 110, color: "#f59e0b", opacity: 0.24 },
            { type: "circle", x: 440, y: 70, size: 46, color: "#2563eb", opacity: 0.34 },
            { type: "ring", x: 30, y: 360, size: 90, color: "#0891b2", opacity: 0.28 },
            { type: "square", x: 450, y: 420, size: 40, color: "#0891b2", opacity: 0.3, rotate: -10 },
            { type: "circle", x: 420, y: 600, size: 32, color: "#f59e0b", opacity: 0.36 },
          ]}
        />

        <div className="relative mx-auto max-w-7xl">
          <MascotFigure
            src="/images/mascots/cat-girl-yay.png"
            alt="喜ぶadofyのマスコットキャラクター"
            trigger="scroll"
            delay={0.2}
            className="absolute -top-4 right-0 h-16 w-auto drop-shadow-lg sm:h-20 md:h-28"
          />

          <div className="max-w-3xl">
            <p className="mb-[clamp(16px,2.5vw,20px)] text-sm font-black uppercase tracking-[0.14em] text-accent-blue">
              Works / Partner
            </p>

            <h2 className="mb-[clamp(24px,4vw,32px)] text-3xl font-black leading-tight tracking-tight text-ink md:text-5xl">
              <RevealText lines={["大手サービス領域での広告運用実績"]} />
            </h2>

            <p className="max-w-[44rem] text-[clamp(1rem,2vw,1.2rem)] leading-[1.85] tracking-[0.01em] text-ink-soft">
              転職・教育・ライフスタイル領域など、複数ジャンルの案件で
              成果報酬型広告運用・LP改善・クリエイティブ制作を行っています。
            </p>

            <p className="mt-[clamp(16px,2.5vw,20px)] max-w-[44rem] text-[clamp(0.85rem,1.5vw,1rem)] leading-[1.8] text-ink-soft/[0.82]">
              ※掲載名は取扱実績・関連サービス名のテキスト表示です。
              公式ロゴの無断使用は避け、必要に応じて掲載許可を取得してください。
            </p>
          </div>

          <div className="mt-16 flex flex-col gap-16 lg:gap-24">
            {partners.map((partner, index) => (
              <WorkCase
                key={partner.name}
                index={`0${index + 1}`}
                title={partner.name}
                description="成果報酬型広告運用"
                imageBase={`/images${partner.href}/creative`}
                imageAlt={`${partner.name} 広告クリエイティブ`}
                href={partner.href}
                reverse={index % 2 === 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* PARTNER marquee：実績企業名を帯で流す、サービス/実績セクションの区切り */}
      <section className="relative overflow-hidden border-y border-border-soft bg-mist-gray py-6">
        <div className="flex overflow-hidden" aria-hidden="true">
          <div className="partner-marquee-track flex shrink-0 items-center gap-16 pr-16">
            {[...partners, ...partners].map((partner, i) => (
              <span key={i} className="flex items-center gap-3 whitespace-nowrap">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-blue/40" />
                <span className="text-xl font-black tracking-tight text-ink-soft/70 md:text-2xl">
                  {partner.name}
                </span>
              </span>
            ))}
          </div>
        </div>
        <p className="sr-only">支援実績：{partners.map((p) => p.name).join("、")}</p>
      </section>

      {/* STRENGTH */}
      <section
        id="strength"
        className="relative overflow-hidden bg-mist-ivory px-5 py-24 md:px-10"
      >
        <OrbitMetrics itemCount={strengths.length} />
        <WaveDivider className="absolute top-0 left-0 text-white" flip />
        <WaveDivider className="absolute bottom-0 left-0 text-[#eaf2ff]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-[clamp(16px,2.5vw,20px)] text-sm font-black tracking-widest text-accent-blue">
              STRENGTH
            </p>

            <h2 className="mb-[clamp(32px,5vw,40px)] text-3xl font-black leading-tight tracking-tight text-ink md:text-5xl">
              <RevealText lines={["adofyが選ばれる理由"]} />
            </h2>

            <p className="max-w-[44rem] text-[clamp(1rem,2vw,1.2rem)] leading-[1.85] tracking-[0.01em] text-ink-soft">
              制作して終わりではなく、広告の数字を見ながら改善し続けることで、
              成果につながるWeb施策を実現します。
            </p>
          </div>

          <div className="relative space-y-10 border-l-2 border-accent-blue/15 pl-8 md:pl-10">
            <MascotFigure
              src="/images/mascots/cat-boy-cheer.png"
              alt="ガッツポーズするadofyのマスコットキャラクター"
              trigger="scroll"
              delay={0.2}
              className="absolute -top-6 right-0 h-16 w-auto drop-shadow-lg sm:h-20 lg:h-28"
            />
            {strengths.map((item, index) => (
              <div
                key={item}
                data-strength-item={index}
                className="group relative py-1"
              >
                <span
                  aria-hidden="true"
                  className="absolute -left-[42px] top-1 h-3 w-3 rounded-full border-2 border-accent-blue bg-mist-ivory md:-left-[50px]"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-2 -top-8 text-[96px] font-black leading-none text-accent-blue/[0.07] transition duration-300 group-hover:text-accent-blue/[0.13] md:text-[120px]"
                >
                  0{index + 1}
                </span>
                <div className="relative flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-6 w-6 flex-none text-accent-blue" />
                  <p className="text-lg font-bold leading-7 text-ink md:text-xl">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="cta-gradient relative overflow-hidden px-5 py-24 text-ink md:px-10"
      >
        <ConvergenceField />
        <WaveDivider className="absolute bottom-0 left-0 text-footer" />

        <div className="relative mx-auto max-w-5xl text-center">
          <p className="mb-[clamp(16px,2.5vw,20px)] text-sm font-black tracking-widest text-accent-blue">
            CONTACT
          </p>

          <h2 className="mb-[clamp(20px,3vw,28px)] text-3xl font-black tracking-tight text-ink md:text-5xl">
            <RevealText lines={["Web集客・制作のご相談はこちら"]} className="mx-auto" />
          </h2>

          <p className="leading-8 text-ink-soft">
            広告運用、LP制作、HP制作、クリエイティブ制作など、
            まずはお気軽にご相談ください。岐阜県内はもちろん、全国対応可能です。
          </p>

          <div className="relative mt-9 inline-flex flex-col items-center sm:flex-row sm:justify-center">
            <MascotFigure
              src="/images/mascots/cat-boy-pointing.png"
              alt="adofyのマスコットキャラクターがCTAボタンを指している"
              trigger="scroll"
              delay={0.15}
              className="h-16 w-auto -rotate-3 drop-shadow-xl sm:mr-[-8px] sm:h-24 md:h-28"
            />
            <MagneticButton className="inline-block w-full sm:w-auto" strength={8}>
              <a
                href="/contact"
                className="group relative inline-flex min-h-[62px] w-full items-center justify-center rounded-full bg-accent-blue px-[clamp(28px,5vw,52px)] font-black text-white shadow-xl shadow-blue-600/20 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-600/30 sm:w-auto"
              >
                お問い合わせする
                <ArrowRight className="ml-2 h-5 w-5 transition group-hover:translate-x-1" />
              </a>
            </MagneticButton>
            <MascotFigure
              src="/images/mascots/cat-girl-wave.png"
              alt="手を振るadofyのマスコットキャラクター"
              trigger="scroll"
              delay={0.25}
              wrapperClassName="-scale-x-100 rotate-3 sm:ml-[-8px]"
              className="h-16 w-auto drop-shadow-xl sm:h-24 md:h-28"
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative overflow-hidden bg-footer px-5 py-12 text-ink-soft md:px-10">
        <FooterHorizon />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-12 text-center md:grid-cols-[1.3fr_0.8fr_0.8fr] md:text-left">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border-soft bg-white">
                  <Sparkles className="h-4 w-4 text-accent-blue" />
                </div>
                <div>
                  <p className="text-sm font-bold text-ink">adofy</p>
                  <p className="text-xs text-ink-soft">Creative Marketing Company</p>
                </div>
              </div>
              <p className="mt-5 max-w-xs text-sm leading-7 text-ink-soft">
                岐阜発・全国対応のITマーケティング企業。
                成果報酬型広告運用・LP制作・HP制作・クリエイティブ制作を通じて、
                企業の魅力を引き出し、売上最大化を支援します。
              </p>
              <MascotFigure
                src="/images/mascots/cat-boy-peace-sitting.png"
                alt="くつろぐadofyのマスコットキャラクター"
                trigger="scroll"
                delay={0.2}
                className="mt-4 h-24 w-auto drop-shadow-lg"
              />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-widest text-accent-blue/60">Service</p>
              <nav className="mt-4 flex flex-col items-center gap-3 text-sm font-medium md:items-start">
                <a href="#service" className="group relative transition hover:text-accent-blue">
                  事業内容
                  <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-accent-blue transition-transform duration-300 group-hover:scale-x-100" />
                </a>
                <a href="#works" className="group relative transition hover:text-accent-blue">
                  実績紹介
                  <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-accent-blue transition-transform duration-300 group-hover:scale-x-100" />
                </a>
                <a href="#strength" className="group relative transition hover:text-accent-blue">
                  選ばれる理由
                  <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-accent-blue transition-transform duration-300 group-hover:scale-x-100" />
                </a>
              </nav>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-widest text-accent-blue/60">Company</p>
              <nav className="mt-4 flex flex-col items-center gap-3 text-sm font-medium md:items-start">
                <a href="/profile" className="group relative transition hover:text-accent-blue">
                  代表紹介
                  <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-accent-blue transition-transform duration-300 group-hover:scale-x-100" />
                </a>
                <a href="/contact" className="group relative transition hover:text-accent-blue">
                  お問い合わせ
                  <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-accent-blue transition-transform duration-300 group-hover:scale-x-100" />
                </a>
              </nav>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border-soft pt-6 text-center md:flex-row md:text-left">
            <p className="text-xs text-ink-soft">© 2026 adofy</p>
            <a
              href="#hero"
              aria-label="ページ上部へ戻る"
              className="relative flex h-11 w-11 flex-none items-center justify-center rounded-full border border-border-soft bg-white text-accent-blue shadow-soft transition duration-300 hover:-translate-y-0.5 hover:border-border-soft-hover hover:shadow-hover"
            >
              <svg
                ref={backToTopRingRef as React.RefObject<SVGSVGElement>}
                viewBox="0 0 44 44"
                aria-hidden="true"
                focusable="false"
                className="pointer-events-none absolute inset-0 -rotate-90 text-accent-blue"
              >
                <circle
                  data-progress-ring
                  cx="22"
                  cy="22"
                  r="19"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  opacity="0.5"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <ArrowUp className="relative h-4 w-4" />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
