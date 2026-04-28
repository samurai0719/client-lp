'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import type { ReactNode } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  MapPin,
  Users,
  Shield,
  Heart,
  CalendarDays,
  AlertTriangle,
  X,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const CTA_HREF = 'https://px.a8.net/svt/ejp?a8mat=3ZLWB9+5U62V6+9MO+3Z7TKH';

const BLUE = '#1a7bb8';
const BLUE_DARK = '#1258a0';
const BLUE_BG = '#e8f4fc';
const BLUE_BORDER = '#b3d9ee';
const MINT = '#2a9d8f';
const MINT_BG = '#e8f7f5';
const MINT_BORDER = '#a8ddd6';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
type FaqItem = { q: string; a: string };
type MeritItem = { icon: ReactNode; title: string; body: string };
type CompareRow = { label: string; general: string; shisetsu: string };
type CautionItem = { title: string; body: string };

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
  '夜勤明けの疲労が抜けきらず、体力の限界に近い',
  '急変対応が続き、精神的にも消耗している',
  '人間関係や職場の雰囲気が辛い',
  'プライベートな時間がほとんど取れない',
  '「このまま続けていていいのか」と思い始めた',
];

const MERITS: MeritItem[] = [
  {
    icon: <MapPin size={20} />,
    title: '移動の負担が少ない',
    body: '施設内や近隣施設が主な活動場所のため、個人宅を一軒ずつ移動する一般訪問看護と比べて、移動にかかる体力・時間の負担が少ない傾向があります。天候にも左右されにくいです。',
  },
  {
    icon: <Users size={20} />,
    title: 'チームで働ける安心感',
    body: '施設の介護スタッフや相談員と連携しながら働けるため、一人で抱え込みにくい環境が整っている場合があります。孤独感が少ないと感じる人もいます。',
  },
  {
    icon: <Shield size={20} />,
    title: '急変対応が比較的少ない',
    body: '施設スタッフが一次対応できるケースもあり、急変リスクは職場により異なります。「比較的落ち着いた環境で働けた」と感じる看護師もいます。ただし医療的判断は引き続き必要です。',
  },
  {
    icon: <CalendarDays size={20} />,
    title: 'スケジュールが安定しやすい',
    body: '担当施設・利用者が決まっているため、業務の見通しが立てやすい傾向があります。求人によっては日勤中心の働き方も相談できる可能性があります（職場によって異なります）。',
  },
  {
    icon: <Heart size={20} />,
    title: 'プライベートが充実しやすい',
    body: '勤務時間の見通しが立てやすいことから、プライベートの計画を立てやすいと感じる人もいます。ただしオンコール対応のある求人もあるため、応募前に確認することが大切です。',
  },
];

const COMPARE_ROWS: CompareRow[] = [
  { label: '活動場所', general: '個人宅を複数箇所移動', shisetsu: '施設内・近隣施設が中心' },
  { label: '移動の手間', general: '天候・交通状況に左右される', shisetsu: '比較的安定している' },
  { label: 'チーム体制', general: '単独訪問が基本', shisetsu: '施設スタッフと連携できる' },
  { label: '急変時', general: '一人で初期対応することも', shisetsu: '施設スタッフと連携して対応' },
  { label: 'スケジュール', general: '変動しやすい', shisetsu: '見通しが立てやすい' },
];

const CAUTIONS: CautionItem[] = [
  {
    title: 'オンコール・夜勤の有無は求人による',
    body: '「夜勤なし」「オンコールなし」の求人もありますが、施設の種別によっては対応が求められる場合もあります。必ず求人票や面接で確認しましょう。',
  },
  {
    title: '医療処置・判断は引き続き必要',
    body: '急変が少ない環境でも、バイタル測定・点滴管理・処置計画など看護ケアは必要です。「病棟より絶対に楽」とは言い切れません。',
  },
  {
    title: '施設の種別で環境は大きく異なる',
    body: '特養・老健・有料老人ホーム・グループホームなど、施設の種別や規模によって利用者の重症度・業務内容が異なります。事前に確認するのがおすすめです。',
  },
  {
    title: '雇用形態（常勤・非常勤）を確認する',
    body: '常勤・パート・非常勤など雇用形態もさまざまです。希望する働き方に合った求人かどうか、登録時にアドバイザーへ相談してみましょう。',
  },
];

const NURSE_SENKA_FEATURES: string[] = [
  '看護師・保健師・助産師専門の転職サポートサービス',
  '施設訪問看護・夜勤なし・日勤中心など条件で絞り込み可能',
  '専任のキャリアアドバイザーが希望条件を一緒に整理',
  '求人票に載っていない情報も確認できる場合あり',
  '登録・利用は完全無料',
];

const FAQ_ITEMS: FaqItem[] = [
  {
    q: '施設訪問看護は未経験でも応募できますか？',
    a: '求人によっては未経験相談可能な職場もあります。経験や希望条件に合わせて確認するのがおすすめです。',
  },
  {
    q: '夜勤なしで働けますか？',
    a: '日勤中心の求人もありますが、職場によりオンコールや夜勤の有無は異なります。応募前に確認しましょう。',
  },
  {
    q: '病棟より楽ですか？',
    a: '楽とは言い切れません。施設訪問看護にも医療的判断や利用者対応はあります。ただし、移動負担やスケジュール面で働きやすさを感じる人もいます。',
  },
  {
    q: '登録したら必ず転職しないといけませんか？',
    a: 'まずは求人確認や相談だけでも利用できます。',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Utility components
// ─────────────────────────────────────────────────────────────────────────────

type BgType = 'white' | 'gray' | 'blue' | 'mint' | 'warm';

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
    blue: '#e8f4fc',
    mint: '#edf7f5',
    warm: '#fef9ec',
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

function SectionLabel({ children, color = 'blue' }: { children: string; color?: 'blue' | 'mint' | 'warm' }) {
  const colorMap = { blue: BLUE_DARK, mint: MINT, warm: '#b45309' };
  return (
    <p
      className="text-[10px] font-extrabold uppercase tracking-[0.26em] mb-3"
      style={{ color: colorMap[color] }}
    >
      {children}
    </p>
  );
}

function CtaButton({ label = '公式サイトで求人を見てみる' }: { label?: string }) {
  return (
    <a href={CTA_HREF} target="_blank" rel="noopener noreferrer" className="nurse-cta-btn">
      <span className="nurse-cta-shine" aria-hidden="true" />
      <span className="nurse-cta-btn-inner">
        <span className="block text-[15px] font-extrabold leading-tight tracking-wide">{label}</span>
        <span className="block mt-1 font-normal" style={{ fontSize: 11, opacity: 0.88 }}>
          ▼ ナース専科 転職（無料）
        </span>
      </span>
    </a>
  );
}

function ImagePlaceholder({ label, heightClass = 'h-40 sm:h-56' }: { label: string; heightClass?: string }) {
  return (
    <div
      className={`w-full rounded-2xl flex flex-col items-center justify-center gap-2.5 select-none ${heightClass}`}
      style={{
        background: 'rgba(240, 247, 255, 0.7)',
        border: '2px dashed #93c5fd',
      }}
    >
      <div
        className="flex items-center justify-center w-11 h-11 rounded-full"
        style={{ background: '#dbeafe' }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-xs font-extrabold" style={{ color: '#60a5fa' }}>
          {label}
        </p>
        <p style={{ fontSize: 10, color: '#93c5fd', marginTop: 2 }}>画像挿入予定</p>
      </div>
    </div>
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

function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="rounded-2xl border overflow-hidden"
          style={{
            borderColor: open === i ? BLUE_BORDER : '#e2e8f0',
            background: open === i ? BLUE_BG : '#fff',
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
                background: open === i ? `linear-gradient(135deg, ${BLUE}, #40b3e8)` : '#f1f5f9',
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
              <ChevronDown size={16} style={{ color: BLUE }} />
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
                <div className="px-5 pb-5 pt-1 flex gap-3 text-sm text-gray-600 leading-relaxed border-t border-blue-100">
                  <span
                    className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full font-extrabold mt-0.5"
                    style={{ fontSize: 11, background: MINT_BG, color: MINT }}
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
      style={{ background: 'linear-gradient(180deg, #daeefa 0%, #f0f9ff 40%, #ffffff 80%)' }}
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
          style={{ fontSize: 10, letterSpacing: '0.28em', color: BLUE_DARK }}
        >
          ナース専科 転職
        </span>
      </div>

      <motion.div initial="hidden" animate="visible" variants={stagger}>
        <motion.h1
          variants={fadeUp}
          className="text-[1.65rem] sm:text-3xl font-extrabold text-gray-900 leading-snug mb-5"
          style={{ letterSpacing: '-0.01em' }}
        >
          夜勤・急変対応に疲れた
          <br />
          <span
            style={{
              backgroundImage: `linear-gradient(135deg, ${BLUE_DARK} 0%, ${BLUE} 50%, #40b3e8 100%)`,
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
          className="text-base font-bold text-gray-700 leading-relaxed mb-4"
        >
          施設訪問看護という働き方を
          <br />
          一度チェックしてみませんか？
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="text-sm text-gray-600 leading-relaxed mb-8 rounded-xl p-4"
          style={{
            background: 'rgba(255,255,255,0.85)',
            border: `1px solid ${BLUE_BORDER}`,
            borderLeft: `3px solid ${BLUE}`,
          }}
        >
          移動少なめ・日勤中心・施設内勤務など
          <br />
          <span className="text-gray-500" style={{ fontSize: 13 }}>
            今より働きやすい求人が見つかる可能性があります
          </span>
        </motion.div>

        <motion.div variants={fadeUp}>
          <CtaButton />
          <CtaNotes />
        </motion.div>

        {/* ファーストビュー用画像 */}
        <motion.div variants={fadeUp} className="mt-8">
          <ImagePlaceholder label="ファーストビュー用画像" heightClass="h-48 sm:h-64" />
        </motion.div>
      </motion.div>

      {/* 装飾サークル */}
      <div
        className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(26,123,184,0.08) 0%, transparent 70%)`,
          transform: 'translate(30%, -30%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-48 h-48 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(42,157,143,0.07) 0%, transparent 70%)`,
          transform: 'translate(-30%, 30%)',
        }}
      />
    </section>
  );
}

function EmpathySection() {
  return (
    <SectionWrap bg="gray">
      <SectionLabel>あなたの気持ちに寄り添う</SectionLabel>
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-6 leading-snug">
        「病棟での仕事、
        <br />
        このまま続けていていいの？」
      </h2>

      <p className="text-sm text-gray-600 leading-relaxed mb-6">
        一生懸命働いているのに、なぜかいつも疲弊している。
        <br />
        そんな自分に、こんな気持ちが浮かんでいませんか？
      </p>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="space-y-3"
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
        className="mt-8 p-5 rounded-2xl text-sm leading-relaxed"
        style={{ background: BLUE_BG, border: `1px solid ${BLUE_BORDER}` }}
      >
        <p className="font-bold text-gray-800 mb-2">
          そのつらさは、あなたのせいではありません。
        </p>
        <p className="text-gray-600">
          働き方そのものを変えることで、今より少し楽になれる可能性があります。
          <br />
          「施設訪問看護」という選択肢を、一緒に見てみませんか？
        </p>
      </div>

      {/* 共感ブロック用画像 */}
      <div className="mt-8">
        <ImagePlaceholder label="共感ブロック用画像" />
      </div>
    </SectionWrap>
  );
}

function WhatIsSection() {
  return (
    <SectionWrap bg="white">
      <SectionLabel>施設訪問看護とは？</SectionLabel>
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-6 leading-snug">
        施設に通い、入居者へ
        <br />
        <span style={{ color: BLUE }}>看護ケアを届ける働き方</span>
      </h2>

      <p className="text-sm text-gray-600 leading-relaxed mb-6">
        施設訪問看護とは、訪問看護ステーションが契約する{' '}
        <strong className="text-gray-800">老人ホーム・グループホームなどの入居型施設</strong>{' '}
        に定期的に訪問し、入居者の看護ケアを提供する働き方です。
      </p>

      <div className="space-y-3">
        {[
          {
            title: '主な活動の場',
            body: '特別養護老人ホーム・介護老人保健施設・有料老人ホーム・グループホームなど',
          },
          {
            title: '業務のイメージ',
            body: 'バイタル測定・服薬管理・点滴・傷の処置・施設スタッフへの医療的アドバイスなど',
          },
          {
            title: '一般訪問看護との最大の違い',
            body: '活動の場が「複数の個人宅」ではなく「施設内・近隣施設」に集中しているため、移動が少ない傾向がある',
          },
        ].map((item, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border"
            style={{ borderColor: BLUE_BORDER, background: BLUE_BG }}
          >
            <p className="text-xs font-extrabold mb-1" style={{ color: BLUE_DARK }}>
              {item.title}
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">{item.body}</p>
          </div>
        ))}
      </div>

      {/* 施設訪問看護とは？用画像 */}
      <div className="mt-8">
        <ImagePlaceholder label="施設訪問看護とは？用画像" />
      </div>
    </SectionWrap>
  );
}

function ComparisonSection() {
  return (
    <SectionWrap bg="blue">
      <SectionLabel>比較</SectionLabel>
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-7 leading-snug">
        一般的な訪問看護と
        <br />施設訪問看護の違い
      </h2>

      {/* ヘッダー行 */}
      <div className="grid grid-cols-2 gap-2 mb-3 text-center">
        <div
          className="py-2.5 rounded-xl font-bold text-gray-400"
          style={{ fontSize: 12, background: '#e2e8f0', border: '1px solid #cbd5e1' }}
        >
          一般的な訪問看護
        </div>
        <div
          className="py-2.5 rounded-xl font-bold"
          style={{
            fontSize: 12,
            background: `linear-gradient(135deg, ${BLUE_DARK}, ${BLUE})`,
            color: '#fff',
          }}
        >
          施設訪問看護
        </div>
      </div>

      <div className="space-y-2">
        {COMPARE_ROWS.map((row, i) => (
          <div key={i} className="rounded-2xl overflow-hidden border border-blue-100 bg-white">
            <p
              className="font-bold text-gray-400 tracking-wide px-3 py-1.5 bg-slate-50 border-b border-blue-50"
              style={{ fontSize: 10 }}
            >
              {row.label}
            </p>
            <div className="grid grid-cols-2">
              <div className="px-3 py-3 flex items-start gap-1.5 border-r border-blue-50">
                <X size={12} className="shrink-0 mt-0.5" style={{ color: '#cbd5e1' }} />
                <p className="text-gray-400 leading-snug" style={{ fontSize: 11 }}>
                  {row.general}
                </p>
              </div>
              <div className="px-3 py-3 flex items-start gap-1.5" style={{ background: BLUE_BG }}>
                <CheckCircle2 size={12} className="shrink-0 mt-0.5" style={{ color: BLUE }} />
                <p className="font-semibold leading-snug" style={{ fontSize: 11, color: BLUE_DARK }}>
                  {row.shisetsu}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-center leading-relaxed" style={{ fontSize: 11, color: '#64748b' }}>
        ※職場によって異なります。求人内容は必ず確認してください。
      </p>

      {/* 一般的な訪問看護との違い用画像 */}
      <div className="mt-8">
        <ImagePlaceholder label="一般的な訪問看護との違い用画像" />
      </div>
    </SectionWrap>
  );
}

function MeritsSection() {
  return (
    <SectionWrap bg="white">
      <SectionLabel color="mint">施設訪問看護で働くメリット</SectionLabel>
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-7 leading-snug">
        <span style={{ color: MINT }}>4つのメリット</span>と
        <br />
        プライベートへの好影響
      </h2>

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
              borderColor: i === 4 ? MINT_BORDER : BLUE_BORDER,
              boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0"
                style={{
                  background: i === 4 ? MINT_BG : BLUE_BG,
                  color: i === 4 ? MINT : BLUE,
                }}
              >
                {merit.icon}
              </div>
              <div
                className="text-[10px] font-extrabold px-2 py-0.5 rounded-full"
                style={{
                  background: i === 4 ? MINT_BG : BLUE_BG,
                  color: i === 4 ? MINT : BLUE_DARK,
                }}
              >
                {i < 4 ? `MERIT ${i + 1}` : 'BONUS'}
              </div>
            </div>
            <p className="font-extrabold text-sm text-gray-900 mb-2 leading-snug">{merit.title}</p>
            <p className="text-gray-500 leading-relaxed" style={{ fontSize: 12 }}>
              {merit.body}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* 施設訪問看護で働くメリット用画像 */}
      <div className="mt-8">
        <ImagePlaceholder label="施設訪問看護で働くメリット用画像" />
      </div>
    </SectionWrap>
  );
}

function MidCtaSection() {
  return (
    <SectionWrap bg="mint">
      <div className="text-center mb-7">
        <SectionLabel color="mint">まずは求人を確認する</SectionLabel>
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-snug">
          「自分に合う求人があるか」
          <br />
          確認するだけでも大丈夫
        </h2>
        <p className="text-sm text-gray-500 mt-3 leading-relaxed">
          転職するかどうかは後から決められます。
          <br />
          まずは選択肢を広げることから。
        </p>
      </div>
      <CtaButton />
      <CtaNotes />
    </SectionWrap>
  );
}

function CautionsSection() {
  return (
    <SectionWrap bg="warm">
      <SectionLabel color="warm">確認しておきたいポイント</SectionLabel>
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-3 leading-snug">
        注意点・事前に
        <br />
        確認すべきこと
      </h2>

      <p className="text-sm text-gray-600 leading-relaxed mb-7">
        施設訪問看護には魅力がある一方、求人によって環境は大きく異なります。
        応募前に以下のポイントを確認しましょう。
      </p>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="space-y-4"
      >
        {CAUTIONS.map((item, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            className="p-4 rounded-2xl border bg-white"
            style={{ borderColor: '#fbbf24', borderLeft: '3px solid #f59e0b' }}
          >
            <div className="flex items-start gap-2.5 mb-2">
              <AlertTriangle size={15} className="shrink-0 mt-0.5" style={{ color: '#f59e0b' }} />
              <p className="font-extrabold text-sm text-gray-800 leading-snug">{item.title}</p>
            </div>
            <p className="text-gray-500 leading-relaxed pl-6" style={{ fontSize: 12 }}>
              {item.body}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* 注意点・確認すべきポイント用画像 */}
      <div className="mt-8">
        <ImagePlaceholder label="注意点・確認すべきポイント用画像" />
      </div>
    </SectionWrap>
  );
}

function NurseSenkaSection() {
  return (
    <SectionWrap bg="blue">
      <SectionLabel>ナース専科 転職とは？</SectionLabel>
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-5 leading-snug">
        看護師専門の
        <br />
        <span style={{ color: BLUE }}>転職サポートサービス</span>
      </h2>

      <p className="text-sm text-gray-600 leading-relaxed mb-6">
        ナース専科 転職は、看護師・保健師・助産師など医療職に特化した転職サポートサービスです。
        施設訪問看護の求人も多数掲載されており、条件に合った求人を探すことができます。
      </p>

      <div className="space-y-3 mb-8">
        {NURSE_SENKA_FEATURES.map((feat, i) => (
          <div key={i} className="flex items-start gap-3">
            <CheckCircle2 size={18} className="shrink-0 mt-0.5" style={{ color: BLUE }} />
            <p className="text-sm text-gray-700 leading-snug">{feat}</p>
          </div>
        ))}
      </div>

      <div
        className="p-5 rounded-2xl text-sm leading-relaxed mb-7"
        style={{ background: '#fff', border: `1px solid ${BLUE_BORDER}` }}
      >
        <p className="font-bold text-gray-800 mb-2">こんな希望も相談できます</p>
        <div className="flex flex-wrap gap-2">
          {[
            '夜勤を減らしたい',
            '日勤中心で探したい',
            '急変対応の少ない職場',
            '施設訪問看護の求人',
            'プライベートを大切にしたい',
          ].map((tag, i) => (
            <span
              key={i}
              className="inline-block px-3 py-1 text-xs font-bold rounded-full border"
              style={{ borderColor: BLUE_BORDER, color: BLUE_DARK, background: BLUE_BG }}
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="mt-3 leading-relaxed" style={{ fontSize: 11, color: '#94a3b8' }}>
          ※希望に必ず合う求人をご案内できるとは限りません。条件に合わせてご確認ください。
        </p>
      </div>

      {/* ナース専科 転職紹介用画像 */}
      <div className="mb-7">
        <ImagePlaceholder label="ナース専科 転職紹介用画像" />
      </div>

      <CtaButton />
      <CtaNotes />
    </SectionWrap>
  );
}

function FaqSection() {
  return (
    <SectionWrap bg="gray">
      <SectionLabel>よくある質問</SectionLabel>
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
        background: 'linear-gradient(160deg, #0f2a4a 0%, #1565a0 60%, #0d1f3c 100%)',
      }}
    >
      {/* グロー装飾 */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(26,123,184,0.18) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(42,157,143,0.12) 0%, transparent 70%)',
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
            style={{ fontSize: 10, letterSpacing: '0.32em', color: '#7dd3fc' }}
          >
            ナース専科 転職
          </motion.p>

          <motion.h2
            variants={fadeUp}
            className="text-xl sm:text-2xl font-extrabold text-white text-center leading-snug mb-5"
          >
            働き方を変えることで、
            <br />
            毎日が少し変わるかもしれない。
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-sm text-center leading-relaxed mb-8"
            style={{ color: 'rgba(255,255,255,0.72)' }}
          >
            転職するかどうかはまだ決めなくて大丈夫。
            <br />
            まずは「施設訪問看護の求人がどんなものか」
            <br />
            確認してみることから始めてみませんか？
          </motion.p>

          <motion.div variants={fadeUp}>
            <CtaButton label="公式サイトで求人を確認してみる" />
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

export default function NurseSenkaHoumonContent() {
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
        <ComparisonSection />
        <MeritsSection />
        <MidCtaSection />
        <CautionsSection />
        <NurseSenkaSection />
        <FaqSection />

        {/* 最終CTA直前用画像 */}
        <section className="px-5 py-10" style={{ background: '#f8fafc' }}>
          <div className="max-w-xl mx-auto">
            <ImagePlaceholder label="最終CTA直前用画像" heightClass="h-48 sm:h-64" />
          </div>
        </section>

        <FinalCtaSection />
      </main>
    </>
  );
}
