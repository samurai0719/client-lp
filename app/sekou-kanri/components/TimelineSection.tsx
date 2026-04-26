"use client";

import { useRef, useEffect, ReactNode } from "react";
import { CTA_HREF } from "../constants";

// ── Icons ─────────────────────────────────────────────────────────────────

const IconCheck = () => (
  <svg
    className="w-4 h-4 shrink-0 text-orange-400"
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

const IconAlert = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const IconTrendUp = () => (
  <svg
    className="w-6 h-6"
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

const IconSearch = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconUsers = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

// ── Timeline data ────────────────────────────────────────────────────────

const timelineItems = [
  {
    number: "01",
    icon: <IconAlert />,
    label: "現状の課題",
    title: "現在の年収に不満がある施工管理者へ",
    accent: "border-orange-500/40 bg-orange-500/5",
    iconBg: "bg-orange-500/15 text-orange-400",
    items: [
      "現場経験があるのに年収が伸びない",
      "残業や責任に対して給料が見合っていない",
      "今の会社だけで判断していると、条件の良い求人を見逃す可能性がある",
    ],
  },
  {
    number: "02",
    icon: <IconTrendUp />,
    label: "市場価値を知る",
    title: "施工管理経験者は市場価値を確認するべき",
    accent: "border-amber-500/40 bg-amber-500/5",
    iconBg: "bg-amber-500/15 text-amber-400",
    items: [
      "建築・土木・電気工事・機械設備などの経験は転職市場で評価されやすい",
      "年収・休日・残業・勤務地・出張の有無などを比較できる",
      "転職するかどうかは、求人を見てから決めればいい",
    ],
  },
  {
    number: "03",
    icon: <IconSearch />,
    label: "サービスの特徴",
    title: "建設・設備求人データベースの特徴",
    accent: "border-orange-400/40 bg-orange-400/5",
    iconBg: "bg-orange-400/15 text-orange-300",
    items: [
      "建設・設備・プラント系に特化した転職サービス",
      "施工管理・設備管理・設計などに対応",
      "業界に詳しいコンサルタントに相談できる",
      "非公開求人を含めて条件を確認できる",
      "求職者は無料で利用できる",
    ],
  },
  {
    number: "04",
    icon: <IconUsers />,
    label: "こんな人におすすめ",
    title: "こんな人におすすめ",
    accent: "border-amber-400/40 bg-amber-400/5",
    iconBg: "bg-amber-400/15 text-amber-300",
    items: [
      "年収800万円以下の施工管理経験者",
      "今より年収を上げたい",
      "今より休みや働き方を改善したい",
      "建築・土木・電気・設備の経験を活かしたい",
      "まずは求人だけ見て判断したい",
    ],
  },
] as const;

// ── Animated item ─────────────────────────────────────────────────────────

function TimelineItem({
  item,
  index,
}: {
  item: (typeof timelineItems)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const isEven = index % 2 === 0;

  return (
    <div className="relative flex gap-0 md:gap-8">
      {/* Timeline node */}
      <div className="flex flex-col items-center shrink-0 w-12 md:w-16">
        <div
          className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center z-10 border-2 border-slate-700 ${item.iconBg}`}
        >
          {item.icon}
        </div>
        {/* Connector line (not on last item) */}
        {index < timelineItems.length - 1 && (
          <div className="w-px flex-1 min-h-8 bg-gradient-to-b from-slate-600 to-slate-700/40 mt-2" />
        )}
      </div>

      {/* Card */}
      <div
        ref={ref}
        className="flex-1 mb-10 md:mb-14 pb-2"
        style={{
          opacity: 0,
          transform: "translateY(28px)",
          transition: `opacity 0.65s ease ${index * 0.08}s, transform 0.65s ease ${index * 0.08}s`,
        }}
      >
        {/* Label */}
        <p className="text-[11px] font-bold tracking-[0.18em] text-slate-500 uppercase mb-1.5 mt-1">
          {item.label}
        </p>

        {/* Number + title */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-3xl font-black text-slate-700 leading-none select-none">
            {item.number}
          </span>
          <h3 className="text-base md:text-lg font-black text-white leading-snug">
            {item.title}
          </h3>
        </div>

        {/* Content card */}
        <div
          className={`rounded-2xl border p-5 space-y-3 ${item.accent}`}
        >
          {item.items.map((text) => (
            <div key={text} className="flex gap-3 items-start">
              <span className="mt-0.5">
                <IconCheck />
              </span>
              <p className="text-slate-200 text-sm md:text-base leading-relaxed">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Mid CTA ─────────────────────────────────────────────────────────────

function MidCtaBanner() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="my-10 bg-gradient-to-r from-orange-950/60 to-slate-800/60 border border-orange-500/30 rounded-2xl p-6 text-center"
      style={{
        opacity: 0,
        transform: "translateY(24px)",
        transition: "opacity 0.65s ease, transform 0.65s ease",
      }}
    >
      <p className="text-slate-300 text-sm mb-4 leading-relaxed">
        年収アップの可能性があるかどうか、
        <br className="sm:hidden" />
        まず求人を見てから判断できます
      </p>
      <a
        href={CTA_HREF}
        className="cta-glow inline-flex flex-col items-center justify-center gap-0.5 w-full max-w-xs bg-orange-500 hover:bg-orange-600 active:bg-orange-700 active:scale-[0.98] text-white rounded-2xl py-4 px-6 shadow-xl transition-all duration-150 mx-auto"
      >
        <span className="text-orange-100 text-xs font-semibold tracking-widest">
          公式サイト
        </span>
        <span className="text-white text-lg font-extrabold leading-tight">
          非公開求人を見てみる
        </span>
      </a>
      <p className="text-slate-500 text-xs mt-2">※ 無料でご利用いただけます</p>
    </div>
  );
}

// ── Main export ──────────────────────────────────────────────────────────

export default function TimelineSection() {
  return (
    <section className="bg-slate-900 py-16 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-orange-400 text-xs font-bold tracking-[0.2em] uppercase mb-2">
            施工管理経験者の方へ
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            年収800万円以下なら、
            <br />
            今の会社だけで判断するのは
            <br />
            <span className="text-amber-400">もったいないかもしれません</span>
          </h2>
        </div>

        {/* Timeline */}
        <div>
          {timelineItems.map((item, i) => (
            <TimelineItem key={item.number} item={item} index={i} />
          ))}
        </div>

        {/* Mid-page CTA */}
        <MidCtaBanner />
      </div>
    </section>
  );
}
