import type React from "react";
import Header from "./components/Header";
import FaqAccordion from "./components/FaqAccordion";

// ── Data ────────────────────────────────────────────────────────────────────

const REASONS = [
  {
    no: "01",
    title: "見た目だけで終わらない、成果設計まで行う",
    body: "見た目の良さだけでなく、問い合わせや応募、売上につながる導線設計を重視しています。",
  },
  {
    no: "02",
    title: "LP・広告・改善まで一気通貫で支援",
    body: "サイト制作だけでなく、集客施策や改善提案まで含めて伴走します。",
  },
  {
    no: "03",
    title: "スピード感のある対応",
    body: "事業の機会損失を防ぐため、修正や改善にもスピード感を持って対応します。",
  },
  {
    no: "04",
    title: "地域密着業種にも対応",
    body: "外壁塗装をはじめ、地域密着型のサービス業や中小企業の集客支援にも対応しています。",
  },
];

const SERVICES = [
  {
    icon: "Globe",
    title: "ホームページ制作",
    body: "企業サイト・サービスサイト・コーポレートサイトなど、信頼感とデザイン性を両立したWebサイトを制作します。",
  },
  {
    icon: "Layout",
    title: "LP制作",
    body: "広告運用や集客を前提に、訴求力の高いランディングページを制作します。",
  },
  {
    icon: "TrendingUp",
    title: "Web集客支援",
    body: "広告導線や訴求設計、改善提案など、成果につながる集客支援を行います。",
  },
  {
    icon: "Home",
    title: "外壁塗装関連事業支援",
    body: "外壁塗装会社向けのLP・HP制作、集客導線設計、問い合わせ導線の最適化に対応。地域密着型の訴求設計を重視します。",
  },
  {
    icon: "Image",
    title: "クリエイティブ制作",
    body: "広告バナー、訴求画像、Web掲載用のクリエイティブ制作にも対応します。",
  },
];

const RESULTS = [
  {
    client: "RIZAP GOLF",
    category: "ライフスタイル系",
    categoryEn: "LIFESTYLE",
    color: "emerald",
    services: ["広告運用", "LP改善", "クリエイティブ制作", "訴求設計"],
  },
  {
    client: "ナース専科",
    category: "人材系",
    categoryEn: "HUMAN RESOURCES",
    color: "blue",
    services: ["広告運用", "LP改善", "導線改善"],
  },
  {
    client: "レバレジーズグループ",
    category: "人材系",
    categoryEn: "HUMAN RESOURCES",
    color: "blue",
    services: ["広告運用", "クリエイティブ制作", "訴求設計", "導線改善"],
  },
  {
    client: "マイナビ薬剤師",
    category: "人材系",
    categoryEn: "HUMAN RESOURCES",
    color: "blue",
    services: ["広告運用", "LP改善", "クリエイティブ制作"],
  },
];

const STEPS = [
  {
    step: "01",
    title: "ヒアリング",
    body: "課題や目的、現状の集客状況を確認します。",
  },
  {
    step: "02",
    title: "ご提案",
    body: "サイト構成や導線、必要な施策を整理してご提案します。",
  },
  {
    step: "03",
    title: "制作・構築",
    body: "デザイン・実装・必要な調整を進めます。",
  },
  {
    step: "04",
    title: "公開・改善",
    body: "公開後も必要に応じて改善や追加提案を行います。",
  },
];

const COMPANY_INFO = [
  { label: "会社名", value: "株式会社adofy（アドフィー）" },
  {
    label: "事業内容",
    value:
      "ホームページ制作 / LP制作 / Web集客支援 / 外壁塗装関連事業支援 / クリエイティブ制作",
  },
  { label: "所在地", value: "岐阜県" },
  { label: "対応エリア", value: "全国対応" },
  { label: "お問い合わせ", value: "フォームよりご連絡ください" },
];

// ── Icons ────────────────────────────────────────────────────────────────────

const ArrowRight = ({ cls = "w-4 h-4" }: { cls?: string }) => (
  <svg
    className={cls}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const IconGlobe = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const IconLayout = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M9 21V9" />
  </svg>
);

const IconTrend = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const IconHome = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
);

const IconImage = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const IconCheck = () => (
  <svg
    className="w-3.5 h-3.5"
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
);

const SERVICE_ICONS: Record<string, () => React.ReactNode> = {
  Globe: IconGlobe,
  Layout: IconLayout,
  TrendingUp: IconTrend,
  Home: IconHome,
  Image: IconImage,
};

// ── Shared Components ─────────────────────────────────────────────────────────

function SectionWrap({
  id,
  className = "bg-white",
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`${className} py-24 sm:py-32`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">{children}</div>
    </section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold tracking-[0.2em] text-slate-400 uppercase mb-4">
      {children}
    </p>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-[1.2]">
      {children}
    </h2>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE
// ══════════════════════════════════════════════════════════════════════════════

export default function CompanyPage() {
  return (
    <div className="bg-white text-slate-900 antialiased">
      <Header />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center pt-20 pb-24 overflow-hidden">
        {/* Dot grid background */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            opacity: 0.35,
          }}
        />
        {/* Gradient overlay */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-white via-white/70 to-white"
        />
        {/* Soft glow */}
        <div
          aria-hidden
          className="absolute top-1/4 right-[15%] w-[500px] h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(148,163,184,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="absolute bottom-1/4 left-[10%] w-[360px] h-[360px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0" />
            <span className="text-[12px] font-medium text-slate-600 tracking-wider">
              株式会社adofy（アドフィー）
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-[4.5rem] font-black text-slate-900 tracking-[-0.03em] leading-[1.1] mb-8">
            成果につながる
            <br />
            Web戦略を
            <span className="text-slate-300">、</span>
            <br />
            美しく設計する。
          </h1>

          {/* Sub copy */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-500 leading-[1.9] mb-12">
            ホームページ制作・LP制作・広告導線の設計・集客改善まで一貫対応。
            <br className="hidden sm:block" />
            見た目の美しさだけでなく、事業成長につながる
            <br className="hidden sm:block" />
            導線設計まで考えたWeb支援を行います。
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <a
              href="#contact"
              className="inline-flex items-center gap-3 bg-slate-900 hover:bg-slate-700 active:scale-[0.98] text-white font-semibold px-8 py-4 rounded-xl text-[15px] transition-all shadow-lg hover:shadow-xl"
            >
              相談する
              <ArrowRight />
            </a>
            <a
              href="#results"
              className="inline-flex items-center gap-3 bg-white hover:bg-slate-50 active:scale-[0.98] border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold px-8 py-4 rounded-xl text-[15px] transition-all shadow-sm"
            >
              実績を見る
              <ArrowRight />
            </a>
          </div>

          {/* Feature mini-cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              {
                icon: (
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                ),
                text: "集客導線まで設計",
              },
              {
                icon: (
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                ),
                text: "制作から改善まで対応",
              },
              {
                icon: (
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                ),
                text: "地域事業者の支援にも強い",
              },
            ].map(({ icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl px-5 py-4 shadow-sm"
              >
                <span className="shrink-0 w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                  {icon}
                </span>
                <span className="text-sm font-semibold text-slate-700 text-left leading-tight">
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REASONS ───────────────────────────────────────────────────────── */}
      <SectionWrap id="reasons" className="bg-slate-50">
        <div className="mb-14">
          <SectionLabel>WHY CHOOSE US</SectionLabel>
          <SectionTitle>選ばれる理由</SectionTitle>
          <p className="mt-4 text-slate-500 text-base leading-relaxed max-w-xl">
            制作会社らしいセンスと、事業成果につながる思考を両立。
            <br className="hidden sm:block" />
            だから、ご依頼いただいた企業様に選ばれ続けています。
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {REASONS.map(({ no, title, body }) => (
            <div
              key={no}
              className="group bg-white rounded-2xl p-8 border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-300"
            >
              <p className="text-[2.5rem] font-black text-slate-100 tracking-tighter leading-none mb-4 group-hover:text-slate-200 transition-colors">
                {no}
              </p>
              <h3 className="text-base font-bold text-slate-900 mb-3 leading-snug">
                {title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </SectionWrap>

      {/* ── SERVICES ──────────────────────────────────────────────────────── */}
      <SectionWrap id="services" className="bg-white">
        <div className="mb-14">
          <SectionLabel>SERVICES</SectionLabel>
          <SectionTitle>事業内容</SectionTitle>
          <p className="mt-4 text-slate-500 text-base leading-relaxed max-w-xl">
            Web制作から集客支援まで、事業成長に必要なWebの力を一社で対応します。
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map(({ icon, title, body }) => {
            const Icon = SERVICE_ICONS[icon];
            return (
              <div
                key={title}
                className="group relative bg-white rounded-2xl p-7 border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                <div
                  aria-hidden
                  className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(148,163,184,0.07) 0%, transparent 70%)",
                    transform: "translate(30%, -30%)",
                  }}
                />
                <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-slate-100 text-slate-600 mb-5">
                  <Icon />
                </span>
                <h3 className="text-base font-bold text-slate-900 mb-3 leading-snug">
                  {title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
              </div>
            );
          })}
        </div>
      </SectionWrap>

      {/* ── RESULTS ───────────────────────────────────────────────────────── */}
      <SectionWrap id="results" className="bg-slate-50">
        <div className="mb-14">
          <SectionLabel>WORKS</SectionLabel>
          <SectionTitle>
            支援内容が伝わる実績設計で、
            <br className="hidden sm:block" />
            信頼感を可視化する
          </SectionTitle>
          <p className="mt-5 text-slate-500 text-base leading-relaxed max-w-2xl">
            転職・教育・ライフスタイル領域など、複数ジャンルの案件において、
            成果報酬型広告運用・LP改善・クリエイティブ制作を行ってきました。
          </p>
        </div>

        {/* Client cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {RESULTS.map(({ client, category, categoryEn, color, services }) => {
            const tagBase =
              color === "emerald"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-blue-50 text-blue-700 border-blue-200";
            const dotColor =
              color === "emerald" ? "bg-emerald-400" : "bg-blue-400";

            return (
              <div
                key={client}
                className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Top accent line */}
                <div
                  className={`h-[3px] ${
                    color === "emerald"
                      ? "bg-gradient-to-r from-emerald-400 to-teal-300"
                      : "bg-gradient-to-r from-slate-400 to-slate-300"
                  }`}
                />

                <div className="p-8">
                  {/* Category tag */}
                  <div className="flex items-center gap-2 mb-6">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-full border ${tagBase}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                      {categoryEn}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {category}
                    </span>
                  </div>

                  {/* Client name — primary visual */}
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mb-6 leading-none group-hover:text-slate-700 transition-colors">
                    {client}
                  </h3>

                  {/* Divider */}
                  <div className="h-px bg-slate-100 mb-5" />

                  {/* Service tags */}
                  <div>
                    <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase mb-3">
                      支援内容
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {services.map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors"
                        >
                          <IconCheck />
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom: support info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Support services */}
          <div className="bg-white rounded-2xl border border-slate-200 p-7">
            <p className="text-[10px] font-bold tracking-[0.18em] text-slate-400 uppercase mb-5">
              主な支援内容
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "広告運用",
                "LP改善",
                "クリエイティブ制作",
                "訴求設計",
                "導線改善",
              ].map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-slate-700 border border-slate-200 px-3.5 py-2 rounded-xl"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Domains */}
          <div className="bg-white rounded-2xl border border-slate-200 p-7">
            <p className="text-[10px] font-bold tracking-[0.18em] text-slate-400 uppercase mb-5">
              対応領域
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "人材系",
                "教育系",
                "ライフスタイル系",
                "地域サービス業",
                "外壁塗装関連",
              ].map((d) => (
                <span
                  key={d}
                  className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-slate-700 border border-slate-200 px-3.5 py-2 rounded-xl"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>
      </SectionWrap>

      {/* ── PROCESS ───────────────────────────────────────────────────────── */}
      <SectionWrap id="process" className="bg-white">
        <div className="mb-14">
          <SectionLabel>HOW IT WORKS</SectionLabel>
          <SectionTitle>制作・支援の流れ</SectionTitle>
          <p className="mt-4 text-slate-500 text-base leading-relaxed max-w-xl">
            ヒアリングから公開・改善まで、一貫してサポートします。
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map(({ step, title, body }, i) => (
            <div key={step} className="relative">
              {/* Connector line (desktop) */}
              {i < STEPS.length - 1 && (
                <div
                  aria-hidden
                  className="hidden lg:block absolute top-8 left-full w-5 h-px bg-slate-200 z-10"
                  style={{ transform: "translateX(-50%)" }}
                />
              )}

              <div className="bg-white rounded-2xl border border-slate-200 p-7 h-full hover:border-slate-300 hover:shadow-sm transition-all">
                <div className="flex items-start gap-3 mb-4">
                  <span className="shrink-0 w-10 h-10 rounded-xl bg-slate-900 text-white font-black text-sm flex items-center justify-center tracking-tight">
                    {step}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-3 leading-snug">
                  {title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionWrap>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <SectionWrap id="faq" className="bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <SectionLabel>FAQ</SectionLabel>
            <SectionTitle>よくある質問</SectionTitle>
          </div>
          <FaqAccordion />
        </div>
      </SectionWrap>

      {/* ── COMPANY ───────────────────────────────────────────────────────── */}
      <SectionWrap id="company" className="bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <SectionLabel>COMPANY</SectionLabel>
            <SectionTitle>会社概要</SectionTitle>
          </div>

          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            {COMPANY_INFO.map(({ label, value }, i) => (
              <div
                key={label}
                className={`flex flex-col sm:flex-row ${
                  i % 2 === 0 ? "bg-white" : "bg-slate-50"
                } border-b border-slate-100 last:border-0`}
              >
                <dt className="sm:w-44 shrink-0 px-7 py-5 text-[12px] font-bold tracking-widest text-slate-400 uppercase sm:border-r border-slate-100">
                  {label}
                </dt>
                <dd className="flex-1 px-7 py-5 text-sm text-slate-700 leading-relaxed font-medium">
                  {value}
                </dd>
              </div>
            ))}
          </div>
        </div>
      </SectionWrap>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section id="contact" className="bg-slate-900 py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-[11px] font-bold tracking-[0.2em] text-slate-500 uppercase mb-6">
              CONTACT
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.2] mb-6">
              Web制作・集客の
              <br />
              ご相談はこちら
            </h2>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed mb-12 max-w-xl mx-auto">
              ホームページ制作、LP制作、導線改善、外壁塗装関連の集客相談まで
              <br className="hidden sm:block" />
              お気軽にご相談ください。
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:info@adofy.co.jp"
                className="inline-flex items-center gap-3 bg-white hover:bg-slate-100 active:scale-[0.98] text-slate-900 font-bold px-10 py-5 rounded-xl text-base transition-all shadow-lg hover:shadow-xl"
              >
                お問い合わせする
                <ArrowRight />
              </a>
            </div>

            <p className="mt-6 text-[12px] text-slate-600">
              まずは相談だけでも歓迎しています。お気軽にどうぞ。
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="bg-[#0a0a0a] border-t border-white/5 py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 mb-10">
            {/* Logo */}
            <div>
              <p className="text-xl font-black tracking-[-0.04em] text-white mb-1">
                adofy
              </p>
              <p className="text-[11px] text-slate-500 tracking-wider">
                株式会社adofy（アドフィー）
              </p>
            </div>

            {/* Nav */}
            <nav className="flex flex-wrap gap-x-8 gap-y-3">
              {[
                { href: "#reasons", label: "選ばれる理由" },
                { href: "#services", label: "事業内容" },
                { href: "#results", label: "実績" },
                { href: "#company", label: "会社概要" },
                { href: "#contact", label: "お問い合わせ" },
              ].map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="text-[12px] text-slate-500 hover:text-slate-300 transition-colors font-medium tracking-wide"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>

          <div className="h-px bg-white/5 mb-8" />

          <p className="text-[11px] text-slate-600 text-center tracking-wide">
            © {new Date().getFullYear()} 株式会社adofy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
