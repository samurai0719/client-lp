import Image from "next/image";
import HeroSection from "./components/HeroSection";
import FadeInSection from "./components/FadeInSection";
import SekouFaqAccordion from "./components/SekouFaqAccordion";
import SekouStickyCtaBar from "./components/SekouStickyCtaBar";
import { CTA_HREF, IMAGES } from "./constants";

// ── Shared components (server) ───────────────────────────────────────────────

function CtaButton({ href, large = false }: { href: string; large?: boolean }) {
  return (
    <a
      href={href}
      rel="nofollow"
      className={`relative z-30 pointer-events-auto cta-glow flex flex-col items-center justify-center gap-0.5 w-full max-w-sm bg-orange-500 hover:bg-orange-600 active:bg-orange-700 active:scale-[0.98] text-white rounded-2xl shadow-lg transition-all duration-200 cursor-pointer touch-manipulation mx-auto ${
        large ? "py-5 px-8 min-h-[64px]" : "py-4 px-6 min-h-[56px]"
      }`}
    >
      <span className="text-orange-100 text-[11px] font-semibold tracking-[0.18em]">
        公式サイト
      </span>
      <span
        className={`text-white font-extrabold leading-tight ${
          large ? "text-xl" : "text-[1.05rem]"
        }`}
      >
        非公開求人を見てみる
      </span>
    </a>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-orange-500 text-xs font-bold tracking-[0.22em] uppercase mb-3">
      {children}
    </p>
  );
}

function CheckItem({ children }: { children: string }) {
  return (
    <div className="flex gap-3 items-start">
      <svg
        className="w-5 h-5 shrink-0 text-orange-500 mt-0.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
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
    <section className="bg-slate-50 py-20 px-6" aria-labelledby="pain-heading">
      <div className="max-w-5xl mx-auto">
        <FadeInSection>
          <div className="text-center mb-12">
            <SectionLabel>こんな悩みありませんか？</SectionLabel>
            <h2
              id="pain-heading"
              className="font-black leading-tight text-slate-900"
              style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)" }}
            >
              <span className="sparkle-text-subtle">
                今の年収に、本当に満足していますか？
              </span>
            </h2>
          </div>
        </FadeInSection>

        <div className="flex flex-col md:flex-row gap-10 items-center">
          {/* Image */}
          <FadeInSection className="md:w-2/5 flex justify-center" delay={0.1}>
            <div className="relative w-full max-w-xs md:max-w-none">
              <Image
                src={IMAGES.worry}
                alt="悩む施工管理者"
                width={440}
                height={520}
                className="w-full h-auto object-contain rounded-2xl"
                loading="lazy"
              />
            </div>
          </FadeInSection>

          {/* Pain cards */}
          <div className="md:w-3/5 space-y-3">
            {pains.map((pain, i) => (
              <FadeInSection key={i} delay={i * 0.08}>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex gap-4 items-start cursor-default">
                  <span className="shrink-0 w-9 h-9 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                    {pain.icon}
                  </span>
                  <p className="text-slate-800 font-medium leading-relaxed text-sm md:text-base pt-1.5">
                    {pain.text}
                  </p>
                </div>
              </FadeInSection>
            ))}

            <FadeInSection delay={pains.length * 0.08}>
              <div className="bg-orange-50 rounded-2xl border border-orange-200/60 p-5 mt-2">
                <p className="text-orange-800 text-sm font-medium leading-relaxed">
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
    <section className="bg-white py-20 px-6" aria-labelledby="market-heading">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row-reverse gap-10 items-center">
          {/* Image */}
          <FadeInSection className="md:w-2/5 flex justify-center" delay={0.1}>
            <Image
              src={IMAGES.lookUp}
              alt="上を向く施工管理者"
              width={440}
              height={520}
              className="w-full max-w-xs md:max-w-none h-auto object-contain"
              loading="lazy"
            />
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
                <span className="sparkle-text-subtle">
                  施工管理経験者は、
                  <br className="hidden sm:block" />
                  転職市場で評価されやすい
                </span>
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
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
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
    <section className="bg-slate-950 py-20 px-6" aria-labelledby="service-heading">
      <div className="max-w-5xl mx-auto">
        <FadeInSection>
          <div className="text-center mb-12">
            <p className="text-orange-400 text-xs font-bold tracking-[0.22em] uppercase mb-3">
              サービスの特徴
            </p>
            <h2
              id="service-heading"
              className="font-black leading-tight text-white"
              style={{ fontSize: "clamp(1.4rem, 3.8vw, 2.1rem)" }}
            >
              建設・設備求人データベースとは
            </h2>
            <p className="text-slate-400 mt-3 text-sm leading-relaxed max-w-xl mx-auto">
              株式会社クイックが運営する、建設・設備・プラント系に特化した転職サービスです。
            </p>
          </div>
        </FadeInSection>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Image */}
          <FadeInSection className="lg:w-2/5 flex justify-center" delay={0.1}>
            <Image
              src={IMAGES.team}
              alt="図面を確認するチーム"
              width={500}
              height={400}
              className="w-full max-w-sm lg:max-w-none h-auto object-contain rounded-2xl"
              loading="lazy"
            />
          </FadeInSection>

          {/* Feature cards */}
          <div className="lg:w-3/5 space-y-3">
            {features.map((f, i) => (
              <FadeInSection key={i} delay={i * 0.07}>
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 flex gap-4 items-start">
                  <span className="shrink-0 w-9 h-9 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center">
                    {f.icon}
                  </span>
                  <div>
                    <h3 className="text-white font-bold text-sm md:text-base mb-1">
                      {f.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
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
            <p className="text-slate-500 text-xs">
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
    <section className="bg-white py-20 px-6" aria-labelledby="steps-heading">
      <div className="max-w-4xl mx-auto">
        <FadeInSection>
          <div className="text-center mb-12">
            <SectionLabel>ご利用の流れ</SectionLabel>
            <h2
              id="steps-heading"
              className="font-black leading-tight text-slate-900"
              style={{ fontSize: "clamp(1.4rem, 3.8vw, 2.1rem)" }}
            >
              <span className="sparkle-text-subtle">
                3ステップで無料確認
              </span>
            </h2>
          </div>
        </FadeInSection>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step, i) => (
            <FadeInSection key={i} delay={i * 0.12}>
              <div className="relative bg-slate-50 rounded-2xl border border-slate-100 p-6 h-full">
                {/* Connector arrow (desktop) */}
                {i < steps.length - 1 && (
                  <div
                    className="hidden md:block absolute top-8 -right-5 z-10 text-orange-300"
                    aria-hidden
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                )}
                <span className="block text-4xl font-black text-orange-500/20 mb-3 leading-none select-none">
                  {step.num}
                </span>
                <h3 className="text-slate-900 font-bold text-base mb-2">
                  {step.title}
                </h3>
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
    <section className="py-14 px-6 bg-gradient-to-br from-orange-500 to-orange-600">
      <FadeInSection>
        <div className="max-w-xl mx-auto text-center flex flex-col items-center gap-5">
          <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
            年収800万円以下なら、
            <br />
            まず非公開求人を確認してみる
          </h2>
          <p className="text-orange-100 text-sm leading-relaxed">
            転職するかどうかは後で決めればOK。
            <br className="sm:hidden" />
            まずは求人を見るだけでも大丈夫です。
          </p>
          <a
            href={CTA_HREF}
            rel="nofollow"
            className="relative z-30 pointer-events-auto flex flex-col items-center justify-center gap-0.5 w-full max-w-xs min-h-[56px] bg-white hover:bg-slate-50 active:scale-[0.98] text-orange-500 rounded-2xl py-4 px-6 shadow-lg transition-all duration-200 cursor-pointer touch-manipulation font-bold"
          >
            <span className="text-orange-400 text-[11px] font-semibold tracking-[0.18em]">
              公式サイト
            </span>
            <span className="text-orange-500 text-[1.05rem] font-extrabold leading-tight">
              非公開求人を見てみる
            </span>
          </a>
          <p className="text-orange-200 text-xs">※ 無料でご利用いただけます</p>
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
    <section className="bg-slate-50 py-20 px-6" aria-labelledby="target-heading">
      <div className="max-w-4xl mx-auto">
        <FadeInSection>
          <div className="text-center mb-12">
            <SectionLabel>こんな方におすすめ</SectionLabel>
            <h2
              id="target-heading"
              className="font-black leading-tight text-slate-900"
              style={{ fontSize: "clamp(1.4rem, 3.8vw, 2.1rem)" }}
            >
              <span className="sparkle-text-subtle">
                あなたは当てはまりますか？
              </span>
            </h2>
          </div>
        </FadeInSection>

        <div className="grid sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
          {targets.map((t, i) => (
            <FadeInSection key={i} delay={i * 0.06}>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex gap-3 items-center">
                <span className="shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
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
    <section className="bg-white py-20 px-6" aria-labelledby="consult-heading">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-10 items-center">
          {/* Image */}
          <FadeInSection className="md:w-2/5 flex justify-center" delay={0.1}>
            <Image
              src={IMAGES.consult}
              alt="コンサルタントとの相談"
              width={440}
              height={520}
              className="w-full max-w-xs md:max-w-none h-auto object-contain"
              loading="lazy"
            />
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
                <span className="sparkle-text-subtle">
                  転職するか迷っていても、
                  <br className="hidden sm:block" />
                  まず相談だけでも大丈夫
                </span>
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
              <div className="flex flex-col gap-2 max-w-sm">
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
    <section className="bg-slate-950 py-20 px-6" aria-labelledby="final-cta-heading">
      <div className="max-w-xl mx-auto">
        <FadeInSection>
          <div className="text-center mb-8">
            <p className="text-orange-400 text-xs font-bold tracking-[0.22em] uppercase mb-3">
              最後の確認
            </p>
            <h2
              id="final-cta-heading"
              className="font-black leading-tight text-white mb-5"
              style={{ fontSize: "clamp(1.5rem, 4vw, 2.1rem)" }}
            >
              年収800万円以下なら、
              <br />
              まずは非公開求人を確認
            </h2>
            <p className="text-slate-400 leading-relaxed text-sm md:text-base">
              転職するかどうかは、求人を見てから決めれば大丈夫です。
              <br className="hidden sm:block" />
              今の会社より良い条件があるか、公式サイトで確認してみてください。
            </p>
          </div>
        </FadeInSection>

        <FadeInSection delay={0.1}>
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 mb-8 space-y-3">
            {benefits.map((b) => (
              <div key={b} className="flex gap-3 items-start">
                <svg
                  className="w-4 h-4 shrink-0 text-amber-400 mt-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <p className="text-slate-300 text-sm leading-relaxed">{b}</p>
              </div>
            ))}
          </div>
        </FadeInSection>

        <FadeInSection delay={0.2}>
          <div className="flex flex-col items-center gap-3">
            <CtaButton href={CTA_HREF} large />
            <p className="text-slate-500 text-xs">
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
    <section className="bg-slate-50 py-20 px-6" aria-labelledby="faq-heading">
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
    <footer className="bg-slate-900 border-t border-slate-800 py-10 px-6">
      <div className="max-w-2xl mx-auto text-center space-y-3">
        <p className="text-slate-500 text-xs leading-relaxed">
          本ページはアフィリエイト広告を含みます。
        </p>
        <p className="text-slate-600 text-xs leading-relaxed">
          掲載情報は変更になる場合があります。最新情報は公式サイトでご確認ください。
        </p>
        <p className="text-slate-700 text-[10px]">
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
      <img border={0} width={1} height={1} src="https://www12.a8.net/0.gif?a8mat=4AV1SK+740GG2+5T42+60WN6" alt="" />
    </main>
  );
}
