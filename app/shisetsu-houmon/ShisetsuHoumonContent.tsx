'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import type { ReactNode } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  MapPin,
  Users,
  Shield,
  CalendarDays,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const CTA_HREF = 'https://px.a8.net/svt/ejp?a8mat=3ZLWB9+5U62V6+9MO+3Z7TKH';
const CTA_REL = 'nofollow sponsored';
const PROMO_HREF = 'https://px.a8.net/svt/ejp?a8mat=3ZLWB9+5U62V6+9MO+3YWW1T';

const GREEN = '#16a34a';
const GREEN_DARK = '#15803d';
const GREEN_BG = '#f0fdf4';
const GREEN_BORDER = '#86efac';
const TEAL = '#0d9488';
const TEAL_BG = '#f0fdfa';
const TEAL_BORDER = '#99f6e4';
const BLUE = '#1a7bb8';
const BLUE_BG = '#e8f4fc';
const BLUE_BORDER = '#b3d9ee';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
type FaqItem = { q: string; a: string };
type MeritItem = { icon: ReactNode; title: string; body: string };

// ─────────────────────────────────────────────────────────────────────────────
// Animations
// ─────────────────────────────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};
const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────
const PAIN_POINTS: string[] = [
  '夜勤で生活リズムが崩れる',
  '急変対応で常に気が張る',
  '病棟の人間関係に疲れる',
  'でも看護師の仕事自体は嫌いではない',
];

const MERITS: MeritItem[] = [
  {
    icon: <MapPin size={20} />,
    title: '移動の負担が比較的少ない',
    body: '施設内・近隣施設への訪問が中心の求人なら、個人宅を何件も回るより移動負担を抑えやすい。',
  },
  {
    icon: <Shield size={20} />,
    title: '急変対応が比較的少ない求人も',
    body: '病棟のように常に急性期対応に追われる働き方とは違い、落ち着いた環境で働ける求人もある。',
  },
  {
    icon: <Users size={20} />,
    title: 'チームで働ける安心感',
    body: '施設スタッフや他職種と連携しながら働けるため、完全に一人で抱え込む不安を減らしやすい。',
  },
  {
    icon: <CalendarDays size={20} />,
    title: 'スケジュールが安定しやすい',
    body: '日勤中心・夜勤なし・残業少なめなど、生活リズムを整えやすい求人もある。',
  },
];

const RECOMMENDED: string[] = [
  '夜勤を減らしたい',
  '病棟のバタバタ感に疲れた',
  '急性期より、落ち着いた看護がしたい',
  '施設看護や在宅系に興味がある',
  'でも一人で訪問するのは少し不安',
];

const FAQ_ITEMS: FaqItem[] = [
  {
    q: '施設訪問看護は未経験でも応募できますか？',
    a: '未経験可の求人もありますが、必要な経験や研修体制は求人によって異なります。',
  },
  {
    q: '夜勤なしで働けますか？',
    a: '日勤中心の求人もあります。ただしオンコールの有無は求人により異なります。',
  },
  {
    q: '病院勤務より楽ですか？',
    a: '楽とは言い切れませんが、夜勤・急変対応・病棟特有の忙しさが合わない方には、働き方の選択肢になります。',
  },
  {
    q: 'まず相談だけでも大丈夫ですか？',
    a: 'はい。転職するか決めていない段階でも、求人条件を確認する目的で利用できます。',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Utility components
// ─────────────────────────────────────────────────────────────────────────────

type BgType = 'white' | 'gray' | 'green' | 'teal' | 'blue';

function SectionWrap({
  id,
  children,
  bg = 'white',
}: {
  id?: string;
  children: ReactNode;
  bg?: BgType;
}) {
  const bgMap: Record<BgType, string> = {
    white: '#ffffff',
    gray: '#f8fafc',
    green: '#f0fdf4',
    teal: '#f0fdfa',
    blue: '#e8f4fc',
  };
  return (
    <motion.section
      id={id}
      className="px-5 py-14"
      style={{ background: bgMap[bg] }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={fadeUp}
    >
      <div className="max-w-xl mx-auto">{children}</div>
    </motion.section>
  );
}

function SectionLabel({
  children,
  color = 'green',
}: {
  children: string;
  color?: 'green' | 'teal' | 'blue';
}) {
  const colorMap = { green: GREEN_DARK, teal: TEAL, blue: BLUE };
  return (
    <p
      className="text-[10px] font-extrabold uppercase tracking-[0.26em] mb-3"
      style={{ color: colorMap[color] }}
    >
      {children}
    </p>
  );
}

function CtaButton({
  label = 'ナース専科で求人を見てみる',
  href = CTA_HREF,
  target,
  rel = CTA_REL,
}: {
  label?: string;
  href?: string;
  target?: string;
  rel?: string;
}) {
  return (
    <a
      href={href}
      rel={rel}
      target={target}
      className="shisetsu-cta-btn"
    >
      <span className="shisetsu-cta-shine" aria-hidden="true" />
      <span className="shisetsu-cta-btn-inner">
        <span className="block text-[15px] font-extrabold leading-tight tracking-wide">{label}</span>
        <span className="block mt-1 font-normal" style={{ fontSize: 11, opacity: 0.88 }}>
          ▼ ナース専科 転職（無料）
        </span>
      </span>
    </a>
  );
}

function CtaNotes() {
  return (
    <p className="text-center mt-3 leading-relaxed" style={{ fontSize: 11, color: '#94a3b8' }}>
      ※ナース専科 転職は無料で利用できます
      <br />
      ※求人により条件は異なります
    </p>
  );
}

/**
 * 画像プレースホルダー
 * ── 差し替え方法 ──────────────────────────────────────────────
 * この div ブロックをそのまま削除し、以下のように置き換えてください。
 * <Image
 *   src="/images/xxx.jpg"
 *   alt="代替テキスト"
 *   width={600}
 *   height={450}
 *   className="w-full rounded-3xl object-cover"
 *   style={{ aspectRatio: '12 / 9' }}
 * />
 * data-image-slot 属性が差し替え箇所の目印です。
 * ─────────────────────────────────────────────────────────────
 */
function ImagePlaceholder({ label }: { label: string }) {
  return (
    <div
      data-image-slot={label}
      className="w-full rounded-3xl flex flex-col items-center justify-center gap-3 select-none"
      style={{
        aspectRatio: '12 / 9',
        background: 'rgba(245, 253, 250, 0.85)',
        border: '2px dashed #99e6cc',
      }}
    >
      <div
        className="flex items-center justify-center w-12 h-12 rounded-2xl"
        style={{ background: 'rgba(209, 250, 229, 0.7)' }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6ee7b7"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="3" ry="3" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </div>
      <div className="text-center space-y-1">
        <p className="text-[11px] font-bold" style={{ color: '#5eead4' }}>
          画像挿入予定
        </p>
        <p style={{ fontSize: 10, color: '#a7f3d0' }}>{label}</p>
      </div>
    </div>
  );
}

function SectionImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl"
      style={{
        height: 'clamp(200px, 42vw, 360px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid rgba(0,0,0,0.06)',
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 100vw, 640px"
      />
    </div>
  );
}

function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="rounded-2xl border overflow-hidden"
          style={{
            borderColor: open === i ? GREEN_BORDER : '#e2e8f0',
            background: open === i ? GREEN_BG : '#fff',
            transition: 'border-color 0.2s, background 0.2s',
          }}
        >
          <button
            className="w-full flex items-start gap-3 px-5 py-4 text-left"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
          >
            <span
              className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full font-extrabold mt-0.5"
              style={{
                fontSize: 11,
                background:
                  open === i
                    ? `linear-gradient(135deg, ${GREEN}, #4ade80)`
                    : '#f1f5f9',
                color: open === i ? '#fff' : '#94a3b8',
              }}
            >
              Q
            </span>
            <span className="flex-1 font-bold text-sm text-gray-800 leading-snug">{item.q}</span>
            <motion.div
              animate={{ rotate: open === i ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="shrink-0 mt-0.5"
            >
              <ChevronDown size={16} style={{ color: GREEN }} />
            </motion.div>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                key={`faq-answer-${i}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div
                  className="px-5 pb-5 pt-1 flex gap-3 text-sm text-gray-600 leading-relaxed border-t"
                  style={{ borderColor: GREEN_BORDER }}
                >
                  <span
                    className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full font-extrabold mt-0.5"
                    style={{ fontSize: 11, background: TEAL_BG, color: TEAL }}
                  >
                    A
                  </span>
                  <p className="flex-1">{item.a}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section components
// ─────────────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section
      className="relative px-5 pt-8 pb-14 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #d1fae5 0%, #f0fdf4 40%, #ffffff 80%)',
      }}
    >
      {/* PR badge */}
      <div className="flex items-center gap-2 mb-5">
        <span
          className="font-bold border border-gray-300 text-gray-400 px-2 py-0.5 rounded-sm shrink-0"
          style={{ fontSize: 9, letterSpacing: '0.18em' }}
        >
          PR
        </span>
        <span
          className="font-extrabold"
          style={{ fontSize: 10, letterSpacing: '0.28em', color: GREEN_DARK }}
        >
          ナース専科 転職
        </span>
      </div>

      <motion.div initial="hidden" animate="visible" variants={stagger}>
        {/* タイトル */}
        <motion.h1
          variants={fadeUp}
          className="text-[1.65rem] sm:text-3xl font-extrabold text-gray-900 leading-snug mb-3"
          style={{ letterSpacing: '-0.01em' }}
        >
          病院勤務に疲れた
          <br />
          <span
            style={{
              backgroundImage: `linear-gradient(135deg, ${GREEN_DARK} 0%, ${GREEN} 50%, #4ade80 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            看護師さんへ
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-base font-bold text-gray-700 leading-relaxed mb-5"
        >
          施設訪問看護という働き方、
          <br />
          知っていますか？
        </motion.p>

        {/* ── IMAGE SLOT 1: ファーストビュー ── */}
        <motion.div variants={fadeUp} className="mb-7">
          <div className="mx-auto w-full max-w-[820px] overflow-hidden rounded-2xl shadow-lg" style={{ background: 'rgba(240,253,244,0.7)' }}>
            <div className="relative aspect-[12/9] w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://static.wixstatic.com/media/5ebda9_7cdafac75d1f4384b7f81909fea21a1e~mv2.jpg"
                alt="施設訪問看護で働く看護師のイメージ"
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </motion.div>

        {/* サブコピー */}
        <motion.div
          variants={fadeUp}
          className="text-sm text-gray-600 leading-relaxed mb-7 rounded-xl p-4"
          style={{
            background: 'rgba(255,255,255,0.85)',
            border: `1px solid ${GREEN_BORDER}`,
            borderLeft: `3px solid ${GREEN}`,
          }}
        >
          移動負担が少なめ・チームで働ける・スケジュールが安定しやすい求人も。
          <br />
          <span className="text-gray-500" style={{ fontSize: 13 }}>
            今の働き方がつらいなら、まずは条件だけ確認してみませんか？
          </span>
        </motion.div>

        {/* CTA → 注釈 */}
        <motion.div variants={fadeUp}>
          <CtaButton />
          <p className="text-center mt-3 leading-relaxed" style={{ fontSize: 11, color: '#94a3b8' }}>
            ※求人内容・勤務条件は施設や事業所により異なります。
          </p>
        </motion.div>
      </motion.div>

      {/* 装飾サークル */}
      <div
        className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(34,197,94,0.10) 0%, transparent 70%)`,
          transform: 'translate(30%, -30%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-48 h-48 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(13,148,136,0.08) 0%, transparent 70%)`,
          transform: 'translate(-30%, 30%)',
        }}
      />
    </section>
  );
}

function EmpathySection() {
  return (
    <SectionWrap bg="gray">
      <SectionLabel color="teal">あなたの気持ちに寄り添う</SectionLabel>
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-5 leading-snug">
        夜勤・急変対応・人間関係…
        <br />
        <span style={{ color: TEAL }}>病院勤務、正直しんどくないですか？</span>
      </h2>

      {/* ── IMAGE SLOT 2: 共感ブロック ── */}
      <div className="mb-7">
        <SectionImage
          src="https://static.wixstatic.com/media/5ebda9_99488e48beaa4a33884eacb004025715~mv2.jpg"
          alt="働き方に悩む看護師のイメージ"
        />
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="space-y-3 mb-7"
      >
        {PAIN_POINTS.map((point, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            className="flex items-start gap-3 p-3.5 rounded-xl border"
            style={{ borderColor: '#e2e8f0', background: '#fff' }}
          >
            <span
              className="shrink-0 mt-0.5 flex items-center justify-center w-5 h-5 rounded-full"
              style={{ background: '#fee2e2', color: '#ef4444', fontSize: 10, fontWeight: 800 }}
            >
              …
            </span>
            <p className="text-sm text-gray-700 leading-snug font-medium">{point}</p>
          </motion.div>
        ))}
      </motion.div>

      <div
        className="p-5 rounded-2xl text-sm leading-relaxed"
        style={{ background: GREEN_BG, border: `1px solid ${GREEN_BORDER}` }}
      >
        <p className="font-bold text-gray-800 mb-2">
          看護師を辞めるのではなく、
        </p>
        <p className="text-gray-600">
          <strong className="text-gray-800">働く場所を変えるという選択肢</strong>があります。
          <br />
          施設訪問看護という働き方を、一緒に見てみませんか？
        </p>
      </div>
    </SectionWrap>
  );
}

function WhatIsSection() {
  return (
    <SectionWrap bg="white">
      <SectionLabel color="green">施設訪問看護とは？</SectionLabel>
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-5 leading-snug">
        施設訪問看護とは？
      </h2>

      {/* ── IMAGE SLOT 3: 施設訪問看護とは？ ── */}
      <div className="mb-7">
        <SectionImage
          src="https://static.wixstatic.com/media/5ebda9_c61b70e67b1f4955b2a0739139c90e0f~mv2.jpg"
          alt="施設訪問看護の仕事内容のイメージ"
        />
      </div>

      <p className="text-sm text-gray-600 leading-relaxed mb-5">
        施設訪問看護は、訪問看護ステーションなどに所属し、有料老人ホームや高齢者施設などを訪問して看護を行う働き方です。個人宅への訪問と違い、同じ施設内で複数名を担当するケースもあり、移動負担や孤独感が少ない求人もあります。
      </p>

      <div
        className="p-4 rounded-xl border text-sm text-gray-500 leading-relaxed"
        style={{ borderColor: GREEN_BORDER, background: GREEN_BG }}
      >
        ※訪問先・業務内容・オンコールの有無は求人により異なります。
      </div>
    </SectionWrap>
  );
}

function MeritsSection() {
  return (
    <SectionWrap bg="green">
      <SectionLabel color="green">施設訪問看護で働くメリット</SectionLabel>
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-5 leading-snug">
        施設訪問看護で働く
        <br />
        <span style={{ color: GREEN }}>メリット4選</span>
      </h2>

      {/* ── IMAGE SLOT 4: メリット4選 ── */}
      <div className="mb-7">
        <SectionImage
          src="https://static.wixstatic.com/media/5ebda9_43c7bc286f114a5f8e51c761951a4180~mv2.jpg"
          alt="一般的な訪問看護との違いを説明するイメージ"
        />
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="space-y-4"
      >
        {MERITS.map((merit, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            className="p-5 rounded-2xl border bg-white"
            style={{
              borderColor: i % 2 === 0 ? GREEN_BORDER : TEAL_BORDER,
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0"
                style={{
                  background: i % 2 === 0 ? GREEN_BG : TEAL_BG,
                  color: i % 2 === 0 ? GREEN : TEAL,
                }}
              >
                {merit.icon}
              </div>
              <div
                className="text-[10px] font-extrabold px-2 py-0.5 rounded-full"
                style={{
                  background: i % 2 === 0 ? GREEN_BG : TEAL_BG,
                  color: i % 2 === 0 ? GREEN_DARK : TEAL,
                }}
              >
                MERIT {i + 1}
              </div>
            </div>
            <p className="font-extrabold text-sm text-gray-900 mb-2 leading-snug">
              {merit.title}
            </p>
            <p className="text-gray-500 leading-relaxed" style={{ fontSize: 12 }}>
              {merit.body}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrap>
  );
}

function RecommendedSection() {
  return (
    <SectionWrap bg="white">
      <SectionLabel color="teal">こんな看護師さんにおすすめ</SectionLabel>
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-7 leading-snug">
        こんな看護師さんに
        <br />
        <span style={{ color: TEAL }}>向いています</span>
      </h2>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="space-y-3"
      >
        {RECOMMENDED.map((item, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            className="flex items-start gap-3 p-4 rounded-xl border bg-white"
            style={{
              borderColor: i === RECOMMENDED.length - 1 ? TEAL_BORDER : GREEN_BORDER,
              boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
            }}
          >
            <CheckCircle2
              size={18}
              className="shrink-0 mt-0.5"
              style={{ color: i === RECOMMENDED.length - 1 ? TEAL : GREEN }}
            />
            <p className="text-sm text-gray-700 leading-snug font-medium">{item}</p>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrap>
  );
}

function NurseSenkaPromoSection() {
  return (
    <SectionWrap bg="white">
      <SectionLabel color="green">施設訪問看護の求人を探すなら</SectionLabel>
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-5 leading-snug">
        ナース専科 転職も
        <br />
        <span style={{ color: GREEN_DARK }}>おすすめです</span>
      </h2>

      <p className="text-sm text-gray-600 leading-relaxed mb-6">
        施設訪問看護の求人は、施設形態や勤務時間、オンコールの有無、夜勤の有無などによって働き方が大きく変わります。
        だからこそ、求人票だけで判断せず、複数の求人を比較しながら自分に合う職場を探すことが大切です。
      </p>

      {/* 実績バッジ */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="grid grid-cols-3 gap-3 mb-7"
      >
        {[
          { num: '20万件\n以上', label: '掲載求人数' },
          { num: '第1位', label: '2026年\nオリコン顧客満足度®' },
          { num: '4年連続\nNo.1', label: '2023年〜2026年\n総合評価' },
        ].map((badge, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            className="flex flex-col items-center justify-center text-center rounded-2xl border py-4 px-2"
            style={{
              background: i === 1
                ? `linear-gradient(160deg, ${GREEN_DARK} 0%, ${GREEN} 100%)`
                : GREEN_BG,
              borderColor: i === 1 ? GREEN_DARK : GREEN_BORDER,
              boxShadow: i === 1
                ? '0 4px 16px rgba(21,128,61,0.22)'
                : '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <p
              className="font-extrabold leading-tight mb-1 whitespace-pre-line"
              style={{
                fontSize: 15,
                color: i === 1 ? '#fff' : GREEN_DARK,
              }}
            >
              {badge.num}
            </p>
            <p
              className="leading-tight whitespace-pre-line"
              style={{
                fontSize: 9,
                color: i === 1 ? 'rgba(255,255,255,0.82)' : '#64748b',
              }}
            >
              {badge.label}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* 本文 */}
      <div
        className="p-5 rounded-2xl text-sm leading-relaxed mb-7"
        style={{ background: GREEN_BG, border: `1px solid ${GREEN_BORDER}` }}
      >
        <p className="text-gray-700 mb-3">
          ナース専科 転職は、看護師向けの転職支援サービスです。
          20万件以上の豊富な求人を扱っており、病院・クリニック・訪問看護・施設など、幅広い選択肢から求人を探せます。
        </p>
        <p className="text-gray-700 mb-3">
          また、2026年 オリコン顧客満足度®調査 看護師転職で第1位を獲得しており、
          2023年〜2026年で4年連続 総合No.1に選ばれています。
        </p>
        <p className="text-gray-700">
          施設訪問看護に興味がある方や、今の働き方を見直したい方は、
          まずはどんな求人があるのか確認してみるのがおすすめです。
        </p>
      </div>

      {/* 特徴リスト */}
      <div className="space-y-2.5 mb-8">
        {[
          '病院・クリニック・訪問看護・施設など、幅広い看護師求人を探せる',
          '施設訪問看護のように、条件や働き方を比較したい人にもおすすめ',
          '求人票だけでは分かりにくい職場の雰囲気や働き方も相談しやすい',
        ].map((feat, i) => (
          <div key={i} className="flex items-start gap-3">
            <CheckCircle2 size={16} className="shrink-0 mt-0.5" style={{ color: TEAL }} />
            <p className="text-sm text-gray-700 leading-snug">{feat}</p>
          </div>
        ))}
      </div>

      {/* A8バナー */}
      <div className="flex flex-col items-center mb-7 gap-3">
        <a
          href={PROMO_HREF}
          rel="nofollow"
          className="block"
          style={{ maxWidth: 300, width: '100%' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            style={{ border: 0, maxWidth: 300, width: '100%', height: 'auto', display: 'block', margin: '0 auto' }}
            width={300}
            height={250}
            alt="ナース専科 転職"
            src="https://www22.a8.net/svt/bgt?aid=241206741353&wid=003&eno=01&mid=s00000001248024004000&mc=1"
          />
        </a>
        {/* A8計測用1px画像 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          style={{ border: 0, display: 'block' }}
          width={1}
          height={1}
          src="https://www14.a8.net/0.gif?a8mat=3ZLWB9+5U62V6+9MO+3YWW1T"
          alt=""
        />
      </div>

      {/* CTAボタン */}
      <CtaButton
        label="ナース専科 転職の公式サイトを見る"
        href={PROMO_HREF}
        target="_self"
        rel="nofollow sponsored"
      />

      {/* 注釈 */}
      <p className="text-center mt-4 leading-relaxed" style={{ fontSize: 11, color: '#94a3b8' }}>
        ※求人数や求人内容は時期・地域により変動します。
        <br />
        ※2026年 オリコン顧客満足度®調査 看護師転職 第1位。
        <br />
        ※2023年〜2026年 オリコン顧客満足度®調査 看護師転職 総合No.1。
      </p>
    </SectionWrap>
  );
}

function LeadSection() {
  return (
    <SectionWrap bg="teal">
      <SectionLabel color="teal">ナース専科への導線</SectionLabel>
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-5 leading-snug">
        施設訪問看護の求人は、
        <br />
        <span style={{ color: TEAL }}>条件確認がかなり重要です</span>
      </h2>

      <p className="text-sm text-gray-600 leading-relaxed mb-7">
        施設訪問看護といっても、求人によって働き方は大きく変わります。オンコールの有無、訪問先、残業、給与、休日数、チーム体制などは事前に確認しておくのがおすすめです。
      </p>

      <CtaButton label="ナース専科で条件に合う求人を確認する" />
      <CtaNotes />
    </SectionWrap>
  );
}

function FaqSection() {
  return (
    <SectionWrap bg="gray">
      <SectionLabel color="green">よくある質問</SectionLabel>
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-7 leading-snug">FAQ</h2>
      <FaqAccordion items={FAQ_ITEMS} />
    </SectionWrap>
  );
}

function FinalCtaSection() {
  return (
    <section
      className="px-5 py-16 relative overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #052e16 0%, #166534 60%, #0f4c28 100%)',
      }}
    >
      {/* グロー装飾 */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(13,148,136,0.12) 0%, transparent 70%)',
          transform: 'translate(20%, -20%)',
        }}
      />

      <div className="max-w-xl mx-auto relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={stagger}
        >
          <motion.p
            variants={fadeUp}
            className="font-extrabold mb-4 text-center"
            style={{ fontSize: 10, letterSpacing: '0.32em', color: '#86efac' }}
          >
            ナース専科 転職
          </motion.p>

          <motion.h2
            variants={fadeUp}
            className="text-xl sm:text-2xl font-extrabold text-white text-center leading-snug mb-5"
          >
            今の働き方がつらいなら、
            <br />
            求人だけでも見てみませんか？
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-sm text-center leading-relaxed mb-8"
            style={{ color: 'rgba(255,255,255,0.72)' }}
          >
            転職するかどうかはまだ決めなくて大丈夫。
            <br />
            まずは条件を確認してみることから始めてみませんか？
          </motion.p>

          <motion.div variants={fadeUp}>
            <CtaButton label="ナース専科で求人を見てみる" />
            <p
              className="text-center mt-4 leading-relaxed"
              style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}
            >
              ※ナース専科 転職は無料で利用できます
              <br />
              ※求人により条件は異なります
              <br />
              ※転職活動の強要は一切ありません
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function ShisetsuHoumonContent() {
  return (
    <>
      {/* Meta Pixel noscript */}
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src="https://www.facebook.com/tr?id=2308931502947268&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>

      <main className="min-h-screen bg-white overflow-x-hidden">
        <HeroSection />
        <EmpathySection />
        <WhatIsSection />
        <MeritsSection />
        <RecommendedSection />
        <NurseSenkaPromoSection />
        <LeadSection />
        <FaqSection />

        {/* ── IMAGE SLOT 5: 最終CTA直前 ── */}
        <section className="px-5 py-10" style={{ background: '#f8fafc' }}>
          <div className="max-w-xl mx-auto">
            <SectionImage
              src="https://static.wixstatic.com/media/5ebda9_0698b8df08864cf5926f10641bcdf150~mv2.jpg"
              alt="施設訪問看護で働くメリットのイメージ"
            />
          </div>
        </section>

        <FinalCtaSection />
      </main>
    </>
  );
}
