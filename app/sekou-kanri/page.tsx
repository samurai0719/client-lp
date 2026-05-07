import type { ReactNode } from "react";
import Image from "next/image";
import HeroSection from "./components/HeroSection";
import FadeInSection from "./components/FadeInSection";
import SekouFaqAccordion from "./components/SekouFaqAccordion";
import SekouStickyCtaBar from "./components/SekouStickyCtaBar";
import { CTA_HREF, IMAGES } from "./constants";

// ── Design tokens ─────────────────────────────────────────────────────────────
const ORANGE = "#f97316";
const ORANGE_DARK = "#c25a0a";

// ── CTA Button ────────────────────────────────────────────────────────────────
function CtaButton({ href, large = false }: { href: string; large?: boolean }) {
  return (
    <a
      href={href}
      rel="nofollow"
      className="sekou-cta-btn"
      style={{ maxWidth: large ? "22rem" : "20rem" }}
    >
      <span className="sekou-cta-shine" aria-hidden="true" />
      <span className="sekou-cta-btn-inner">
        <span
          className="block mb-0.5"
          style={{
            fontSize: 10,
            letterSpacing: "0.24em",
            color: "rgba(255,237,213,0.85)",
            fontWeight: 600,
          }}
        >
          公式サイト
        </span>
        <span
          className="block leading-tight"
          style={{
            fontSize: large ? "1.1rem" : "1rem",
            fontWeight: 800,
            color: "#fff",
            textShadow: "0 1px 4px rgba(130,35,0,0.28)",
          }}
        >
          非公開求人を見てみる
        </span>
      </span>
    </a>
  );
}

// ── Section Label ─────────────────────────────────────────────────────────────
function SectionLabel({
  children,
  light = false,
}: {
  children: string;
  light?: boolean;
}) {
  return (
    <p
      className="text-[10px] font-extrabold uppercase tracking-[0.26em] mb-3"
      style={{ color: light ? "rgba(251,146,60,0.9)" : ORANGE_DARK }}
    >
      {children}
    </p>
  );
}

// ── Orange underline for headings ─────────────────────────────────────────────
function OrangeLine({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        backgroundImage: `linear-gradient(to right, ${ORANGE} 0%, rgba(249,163,86,0.5) 100%)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 2.5px",
        backgroundPosition: "0 100%",
        paddingBottom: 4,
      }}
    >
      {children}
    </span>
  );
}

// ── Check Item ────────────────────────────────────────────────────────────────
function CheckItem({ children }: { children: string }) {
  return (
    <div className="flex gap-3 items-start">
      <svg
        className="w-5 h-5 shrink-0 mt-0.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke={ORANGE}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
      <p className="text-slate-700 leading-relaxed text-sm md:text-base">
        {children}
      </p>
    </div>
  );
}

// ── Step Badge ────────────────────────────────────────────────────────────────
function StepBadge({ n }: { n: string }) {
  return (
    <span
      className="flex items-center justify-center w-10 h-10 rounded-full text-sm font-extrabold text-white shrink-0"
      style={{
        background: `linear-gradient(135deg, #e55d0a 0%, ${ORANGE} 50%, #ff9a47 80%, #e55d0a 100%)`,
        boxShadow: "0 2px 10px rgba(249,115,22,0.42)",
      }}
    >
      {n}
    </span>
  );
}

// ── Section 1: Pain Points ────────────────────────────────────────────────────
function PainPointsSection() {
  const pains = [
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
      text: "現場経験があるのに、年収がなかなか上がらない",
    },
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      text: "残業や責任の重さに対して、給料が見合っていない",
    },
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      text: "同期や同業種の人が転職して年収が上がったと聞いた",
    },
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      text: "転職したいが、何から始めればいいかわからない",
    },
  ];

  return (
    <section className="py-20 px-5" style={{ background: "#f8f8f6" }} aria-labelledby="pain-heading">
      <div className="max-w-5xl mx-auto">
        <FadeInSection>
          <div className="text-center mb-12">
            <SectionLabel>こんな悩みありませんか？</SectionLabel>
            <h2
              id="pain-heading"
              className="font-black leading-tight text-slate-900"
              style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)" }}
            >
              {/* Mobile: 2行に分けて各行にアンダーライン */}
              <span className="md:hidden">
                <span className="block"><OrangeLine>今の年収に、本当に</OrangeLine></span>
                <span className="block"><OrangeLine>満足していますか？</OrangeLine></span>
              </span>
              {/* Desktop: 1行でアンダーライン */}
              <span className="hidden md:inline">
                <OrangeLine>今の年収に、本当に満足していますか？</OrangeLine>
              </span>
            </h2>
          </div>
        </FadeInSection>

        <div className="flex flex-col md:flex-row gap-10 items-center">
          {/* Image */}
          <FadeInSection className="md:w-2/5 flex justify-center" delay={0.1}>
            <div
              className="relative w-full max-w-xs md:max-w-none rounded-2xl overflow-hidden"
              style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)" }}
            >
              <Image
                src={IMAGES.worry}
                alt="悩む施工管理者"
                width={440}
                height={520}
                className="w-full h-auto object-contain"
                loading="lazy"
              />
            </div>
          </FadeInSection>

          {/* Pain cards */}
          <div className="md:w-3/5 space-y-3">
            {pains.map((pain, i) => (
              <FadeInSection key={i} delay={i * 0.08}>
                <div
                  className="bg-white rounded-2xl p-5 flex gap-4 items-start"
                  style={{
                    border: "1px solid #f1f5f9",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
                  }}
                >
                  <span
                    className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(249,115,22,0.10)", color: ORANGE }}
                  >
                    {pain.icon}
                  </span>
                  <p className="text-slate-800 font-medium leading-relaxed text-sm md:text-base pt-1.5">
                    {pain.text}
                  </p>
                </div>
              </FadeInSection>
            ))}

            <FadeInSection delay={pains.length * 0.08}>
              <div
                className="rounded-2xl p-5 mt-2"
                style={{
                  background: "rgba(249,115,22,0.06)",
                  border: "1px solid rgba(249,115,22,0.20)",
                }}
              >
                <p className="text-orange-900 text-sm font-medium leading-relaxed">
                  今の会社だけで判断していると、<strong>条件の良い求人を見逃している可能性</strong>があります。
                </p>
              </div>
            </FadeInSection>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Section 2: Market Value ──────────────────────────────────────────────────
function MarketValueSection() {
  const points = [
    "建築・土木・電気工事・機械設備などの経験は、転職市場で評価されやすい",
    "年収・休日・残業・勤務地・出張の有無を比較できる",
    "転職するかどうかは、求人を見てから決めれば大丈夫",
  ];

  return (
    <section className="bg-white py-20 px-5" aria-labelledby="market-heading">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row-reverse gap-10 items-center">
          {/* Image */}
          <FadeInSection className="md:w-2/5 flex justify-center" delay={0.1}>
            <div
              className="w-full max-w-xs md:max-w-none rounded-2xl overflow-hidden"
              style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)" }}
            >
              <Image
                src={IMAGES.lookUp}
                alt="上を向く施工管理者"
                width={440}
                height={520}
                className="w-full h-auto object-contain"
                loading="lazy"
              />
            </div>
          </FadeInSection>

          {/* Text */}
          <div className="md:w-3/5">
            <FadeInSection>
              <SectionLabel>市場価値の確認</SectionLabel>
              <h2
                id="market-heading"
                className="font-black leading-tight text-slate-900 mb-6"
                style={{ fontSize: "clamp(1.4rem, 3.8vw, 2.1rem)" }}
              >
                施工管理経験者は、
                <br className="hidden sm:block" />
                <OrangeLine>転職市場で評価されやすい</OrangeLine>
              </h2>
            </FadeInSection>

            <div className="space-y-4 mb-8">
              {points.map((pt, i) => (
                <FadeInSection key={i} delay={0.1 + i * 0.08}>
                  <CheckItem>{pt}</CheckItem>
                </FadeInSection>
              ))}
            </div>

            <FadeInSection delay={0.35}>
              <div
                className="rounded-2xl p-5"
                style={{
                  background: "#f8f8f6",
                  border: "1px solid #e8e4da",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <p className="text-slate-700 text-sm leading-relaxed">
                  まず非公開求人を確認して、<strong>今より良い条件があるか</strong>だけ確かめてみる。
                  転職を決めるのは、それからでも遅くありません。
                </p>
              </div>
            </FadeInSection>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Section 3: Service Features (dark) ──────────────────────────────────────
function ServiceSection() {
  const features = [
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
      title: "建設・設備・プラント系に特化",
      desc: "一般の転職サービスではなく、建設・設備・プラント業界に絞った専門サービス",
    },
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      title: "業界専門のコンサルタント",
      desc: "施工管理・設備管理・設計など、業界に詳しいプロが転職をサポート",
    },
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
      title: "非公開求人を確認できる",
      desc: "一般に公開されていない非公開求人を含めて、条件を比較できる",
    },
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
      title: "多様な職種に対応",
      desc: "建築・土木・電気工事・機械設備・プラントなど、幅広い施工管理職に対応",
    },
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      title: "求職者は完全無料",
      desc: "登録から相談・紹介まで、求職者の方は一切費用がかかりません",
    },
  ];

  return (
    <section
      className="py-20 px-5 relative overflow-hidden"
      style={{ background: "#0b1120" }}
      aria-labelledby="service-heading"
    >
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 65%)" }}
        aria-hidden
      />

      <div className="max-w-5xl mx-auto relative">
        <FadeInSection>
          <div className="text-center mb-12">
            <SectionLabel light>サービスの特徴</SectionLabel>
            <h2
              id="service-heading"
              className="font-black leading-tight text-white"
              style={{ fontSize: "clamp(1.4rem, 3.8vw, 2.1rem)" }}
            >
              建設・設備求人データベースとは
            </h2>
            <p
              className="mt-3 text-sm leading-relaxed max-w-xl mx-auto"
              style={{ color: "rgba(148,163,184,0.85)" }}
            >
              株式会社クイックが運営する、建設・設備・プラント系に特化した転職サービスです。
            </p>
          </div>
        </FadeInSection>

        <div className="flex flex-col lg:flex-row gap-10 items-center">
          {/* Image */}
          <FadeInSection className="w-full lg:w-2/5 flex justify-center" delay={0.1}>
            <div
              className="w-full max-w-sm lg:max-w-none rounded-2xl overflow-hidden"
              style={{
                boxShadow: "0 8px 40px rgba(0,0,0,0.30)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <Image
                src={IMAGES.team}
                alt="図面を確認するチーム"
                width={500}
                height={400}
                className="w-full h-auto object-contain"
                loading="lazy"
              />
            </div>
          </FadeInSection>

          {/* Feature cards */}
          <div className="lg:w-3/5 space-y-3">
            {features.map((f, i) => (
              <FadeInSection key={i} delay={i * 0.07}>
                <div
                  className="rounded-2xl p-5 flex gap-4 items-start"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
                  }}
                >
                  <span
                    className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(249,115,22,0.15)", color: "#fb923c" }}
                  >
                    {f.icon}
                  </span>
                  <div>
                    <h3 className="text-white font-bold text-sm md:text-base mb-1">
                      {f.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(148,163,184,0.85)" }}>
                      {f.desc}
                    </p>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>

        {/* CTA in dark section */}
        <FadeInSection delay={0.3}>
          <div className="mt-12 text-center flex flex-col items-center gap-3">
            <CtaButton href={CTA_HREF} />
            <p className="text-xs" style={{ color: "rgba(100,116,139,0.8)" }}>
              ※ 求職者は完全無料でご利用いただけます
            </p>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}

// ── Section 4: Steps ─────────────────────────────────────────────────────────
function StepsSection() {
  const steps = [
    {
      num: "01",
      title: "公式サイトで無料登録",
      desc: "まずは公式サイトから無料で登録。簡単な経歴・希望条件を入力するだけです。",
    },
    {
      num: "02",
      title: "非公開求人を含めた求人を確認",
      desc: "業界専門のコンサルタントが、非公開求人を含めてあなたに合った求人を紹介します。",
    },
    {
      num: "03",
      title: "転職するかどうかを判断",
      desc: "条件を比較して、今より良い求人があれば検討。なければ今の会社を続ければ大丈夫です。",
    },
  ];

  return (
    <section className="bg-white py-20 px-5" aria-labelledby="steps-heading">
      <div className="max-w-4xl mx-auto">
        <FadeInSection>
          <div className="text-center mb-12">
            <SectionLabel>ご利用の流れ</SectionLabel>
            <h2
              id="steps-heading"
              className="font-black leading-tight text-slate-900"
              style={{ fontSize: "clamp(1.4rem, 3.8vw, 2.1rem)" }}
            >
              3ステップで
              <OrangeLine>無料確認</OrangeLine>
            </h2>
          </div>
        </FadeInSection>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step, i) => (
            <FadeInSection key={i} delay={i * 0.12}>
              <div
                className="relative rounded-2xl p-6 h-full flex flex-col"
                style={{
                  background: "#f8f8f6",
                  border: "1px solid rgba(249,115,22,0.18)",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                {/* Connector arrow (desktop) */}
                {i < steps.length - 1 && (
                  <div
                    className="hidden md:block absolute top-8 -right-5 z-10"
                    style={{ color: "rgba(249,115,22,0.4)" }}
                    aria-hidden
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <StepBadge n={step.num} />
                  <h3 className="text-slate-900 font-bold text-sm md:text-base leading-snug">
                    {step.title}
                  </h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section 5: Mid CTA Banner ────────────────────────────────────────────────
function MidCtaBanner() {
  return (
    <section
      className="py-16 px-5 relative overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(249,115,22,0.10) 0%, transparent 70%)" }}
        aria-hidden
      />

      <FadeInSection>
        <div className="max-w-xl mx-auto text-center flex flex-col items-center gap-5 relative">
          <SectionLabel light>まずは一歩から</SectionLabel>
          <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
            年収800万円以下なら、
            <br />
            まず非公開求人を確認してみる
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.62)" }}>
            転職するかどうかは後で決めればOK。
            <br className="sm:hidden" />
            まずは求人を見るだけでも大丈夫です。
          </p>
          <CtaButton href={CTA_HREF} large />
          <p className="text-xs" style={{ color: "rgba(100,116,139,0.75)" }}>
            ※ 無料でご利用いただけます
          </p>
        </div>
      </FadeInSection>
    </section>
  );
}

// ── Section 6: Target Audience ───────────────────────────────────────────────
function TargetSection() {
  const targets = [
    { text: "年収800万円以下の施工管理経験者" },
    { text: "建築・土木・電気工事・機械設備のいずれかの経験者" },
    { text: "今の給料や働き方に不満がある" },
    { text: "転職するか迷っているが、求人だけ見てみたい" },
    { text: "今より年収・休日・働き方を改善したい" },
    { text: "まずは情報収集だけしたい" },
  ];

  return (
    <section
      className="py-20 px-5"
      style={{ background: "#f8f8f6" }}
      aria-labelledby="target-heading"
    >
      <div className="max-w-4xl mx-auto">
        <FadeInSection>
          <div className="text-center mb-12">
            <SectionLabel>こんな方におすすめ</SectionLabel>
            <h2
              id="target-heading"
              className="font-black leading-tight text-slate-900"
              style={{ fontSize: "clamp(1.4rem, 3.8vw, 2.1rem)" }}
            >
              あなたは当てはまりますか？
            </h2>
          </div>
        </FadeInSection>

        <div className="grid sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
          {targets.map((t, i) => (
            <FadeInSection key={i} delay={i * 0.06}>
              <div
                className="bg-white rounded-2xl p-4 flex gap-3 items-center"
                style={{
                  border: "1px solid #eeebe4",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)",
                }}
              >
                <span
                  className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(249,115,22,0.12)" }}
                >
                  <svg
                    className="w-3.5 h-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={ORANGE}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <p className="text-slate-800 text-sm font-medium leading-snug">
                  {t.text}
                </p>
              </div>
            </FadeInSection>
          ))}
        </div>

        <FadeInSection delay={0.4}>
          <p className="text-center text-slate-500 text-sm mt-8 max-w-md mx-auto leading-relaxed">
            1つでも当てはまる方は、非公開求人を確認してみる価値があります。
          </p>
        </FadeInSection>
      </div>
    </section>
  );
}

// ── Section 7: Consultation CTA ──────────────────────────────────────────────
function ConsultSection() {
  return (
    <section className="bg-white py-20 px-5" aria-labelledby="consult-heading">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-10 items-center">
          {/* Image */}
          <FadeInSection className="md:w-2/5 flex justify-center" delay={0.1}>
            <div
              className="w-full max-w-xs md:max-w-none rounded-2xl overflow-hidden"
              style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)" }}
            >
              <Image
                src={IMAGES.consult}
                alt="コンサルタントとの相談"
                width={440}
                height={520}
                className="w-full h-auto object-contain"
                loading="lazy"
              />
            </div>
          </FadeInSection>

          {/* Text + CTA */}
          <div className="md:w-3/5">
            <FadeInSection>
              <SectionLabel>業界専門のコンサルタント</SectionLabel>
              <h2
                id="consult-heading"
                className="font-black leading-tight text-slate-900 mb-5"
                style={{ fontSize: "clamp(1.4rem, 3.8vw, 2.1rem)" }}
              >
                転職するか迷っていても、
                <br className="hidden sm:block" />
                <OrangeLine>まず相談だけでも大丈夫</OrangeLine>
              </h2>
            </FadeInSection>

            <FadeInSection delay={0.1}>
              <div className="space-y-3 mb-8">
                <CheckItem>建設・設備業界に詳しいコンサルタントが対応</CheckItem>
                <CheckItem>「まず求人だけ見たい」という相談も歓迎</CheckItem>
                <CheckItem>転職を急かすことはありません</CheckItem>
                <CheckItem>在職中のまま、プライバシーを守って利用できる</CheckItem>
              </div>
            </FadeInSection>

            <FadeInSection delay={0.2}>
              <div className="flex flex-col gap-2">
                <CtaButton href={CTA_HREF} />
                <p className="text-slate-400 text-xs text-center">
                  ※ 求職者は完全無料でご利用いただけます
                </p>
              </div>
            </FadeInSection>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Section 8: Final CTA ─────────────────────────────────────────────────────
function FinalCtaSection() {
  const benefits = [
    "建設・設備・プラント系の非公開求人を確認できる",
    "業界専門のコンサルタントに無料相談できる",
    "年収・休日・働き方を比較できる",
    "転職しなくてもOK、まず見るだけでも大丈夫",
  ];

  return (
    <section
      className="py-20 px-5 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0f172a 0%, #1e1b4b 40%, #0a0a08 100%)" }}
      aria-labelledby="final-cta-heading"
    >
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(249,115,22,0.09) 0%, transparent 70%)" }}
        aria-hidden
      />

      <div className="max-w-xl mx-auto relative">
        <FadeInSection>
          <div className="text-center mb-8">
            <SectionLabel light>最後の確認</SectionLabel>
            <h2
              id="final-cta-heading"
              className="font-black leading-tight text-white mb-5"
              style={{ fontSize: "clamp(1.5rem, 4vw, 2.1rem)" }}
            >
              年収800万円以下なら、
              <br />
              まずは非公開求人を確認
            </h2>
            <p className="leading-relaxed text-sm md:text-base" style={{ color: "rgba(148,163,184,0.85)" }}>
              転職するかどうかは、求人を見てから決めれば大丈夫です。
              <br className="hidden sm:block" />
              今の会社より良い条件があるか、公式サイトで確認してみてください。
            </p>
          </div>
        </FadeInSection>

        <FadeInSection delay={0.1}>
          <div
            className="rounded-2xl p-6 mb-8 space-y-3"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 2px 16px rgba(0,0,0,0.20)",
            }}
          >
            {benefits.map((b) => (
              <div key={b} className="flex gap-3 items-start">
                <svg
                  className="w-4 h-4 shrink-0 mt-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fb923c"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(203,213,225,0.9)" }}>
                  {b}
                </p>
              </div>
            ))}
          </div>
        </FadeInSection>

        <FadeInSection delay={0.2}>
          <div className="flex flex-col items-center gap-3">
            <CtaButton href={CTA_HREF} large />
            <p className="text-xs" style={{ color: "rgba(100,116,139,0.75)" }}>
              ※ 求職者は完全無料でご利用いただけます
            </p>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}

// ── Section 9: FAQ ────────────────────────────────────────────────────────────
function FaqSection() {
  return (
    <section
      className="py-20 px-5"
      style={{ background: "#f8f8f6" }}
      aria-labelledby="faq-heading"
    >
      <div className="max-w-2xl mx-auto">
        <FadeInSection>
          <div className="text-center mb-10">
            <SectionLabel>FAQ</SectionLabel>
            <h2
              id="faq-heading"
              className="font-black text-slate-900"
              style={{ fontSize: "clamp(1.4rem, 3.8vw, 2.1rem)" }}
            >
              よくある質問
            </h2>
          </div>
        </FadeInSection>
        <FadeInSection delay={0.1}>
          <SekouFaqAccordion />
        </FadeInSection>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      className="py-10 px-5"
      style={{ background: "#0b1120", borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="max-w-2xl mx-auto text-center space-y-3">
        <p className="text-xs leading-relaxed" style={{ color: "rgba(100,116,139,0.75)" }}>
          本ページはアフィリエイト広告を含みます。
        </p>
        <p className="text-xs leading-relaxed" style={{ color: "rgba(71,85,105,0.65)" }}>
          掲載情報は変更になる場合があります。最新情報は公式サイトでご確認ください。
        </p>
        <p style={{ fontSize: 10, color: "rgba(51,65,85,0.55)" }}>
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function SekouKanriPage() {
  return (
    <main className="bg-white">
      <HeroSection />
      <PainPointsSection />
      <MarketValueSection />
      <ServiceSection />
      <StepsSection />
      <MidCtaBanner />
      <TargetSection />
      <ConsultSection />
      <FinalCtaSection />
      <FaqSection />
      <Footer />
      <SekouStickyCtaBar />
      {/* Bottom padding for sticky CTA bar on mobile */}
      <div className="h-20 sm:hidden" aria-hidden />
      {/* A8 conversion tracking pixel */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        width={1}
        height={1}
        src="https://www12.a8.net/0.gif?a8mat=4AV1SK+740GG2+5T42+60WN6"
        alt=""
        style={{ display: "none" }}
      />
    </main>
  );
}
