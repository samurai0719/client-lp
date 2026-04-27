'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import type { ReactNode } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  Target,
  Shield,
  Users,
  Award,
  BarChart2,
  Eye,
  X,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// 画像URL変数 — 後から外部URLを入れてください
// ─────────────────────────────────────────────────────────────────────────────
const heroImage = 'https://static.wixstatic.com/media/5ebda9_56f2411ba35540e893541177d8306980~mv2.png';
const problemImage = 'https://static.wixstatic.com/media/5ebda9_de4aab3b17a3451dae3e43ac0382d79e~mv2.png';
const diagnosisImage = 'https://static.wixstatic.com/media/5ebda9_86fe0cab5d744de589a3c190a9926a0a~mv2.png';
const lessonImage = 'https://static.wixstatic.com/media/5ebda9_3a1b6944157b4ee89b8c2af46f2ce857~mv2.png';
const ctaImage = 'https://static.wixstatic.com/media/5ebda9_877f0360cd4d40d3ac13186bd52d90ca~mv2.png';

// ─────────────────────────────────────────────────────────────────────────────
// CTA リンク
// ─────────────────────────────────────────────────────────────────────────────
const CTA_HREF = 'https://px.a8.net/svt/ejp?a8mat=3ZD870+67V1S2+CW6+BF23HE';

// ─────────────────────────────────────────────────────────────────────────────
// 型定義
// ─────────────────────────────────────────────────────────────────────────────
type FaqItem = { q: string; a: ReactNode };
type StepItem = { n: number; title: string; body: string };
type FeatureItem = { icon: ReactNode; title: string; body: string };
type CompareRow = { label: string; self: string; rizap: string };

// ─────────────────────────────────────────────────────────────────────────────
// デザイントークン
// ─────────────────────────────────────────────────────────────────────────────
const GOLD = '#c9a84c';
const GOLD_DARK = '#8a6010';
const GREEN = '#2d5a3d';
const GREEN_DARK = '#1a3a2a';
const GOLD_BG = 'rgba(201,168,76,0.09)';
const GREEN_BG = 'rgba(45,90,61,0.07)';

// ─────────────────────────────────────────────────────────────────────────────
// アニメーション
// ─────────────────────────────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
};
const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

// ─────────────────────────────────────────────────────────────────────────────
// データ定数
// ─────────────────────────────────────────────────────────────────────────────
const STEPS: StepItem[] = [
  {
    n: 1,
    title: '体験レッスン付きゴルフ力診断',
    body: 'まずはあなたの現在のゴルフ力を診断します。スイングの傾向や基本的な課題を確認します。',
  },
  {
    n: 2,
    title: '高性能シミュレーションでショット診断',
    body: '高精度シミュレーターでスイングを分析。感覚では気づきにくい課題を数値で確認します。',
  },
  {
    n: 3,
    title: '自分の本当の課題を確認',
    body: 'グリップ・軌道・体の開きなど、スライスの真因を特定します。',
  },
  {
    n: 4,
    title: '診断結果を元にフォーム修正',
    body: '専属トレーナーがその場でアドバイスを提供。「修正前→修正後」を体感できます。',
  },
  {
    n: 5,
    title: '今後の練習方針が見える',
    body: 'あなたに最適な練習方針をご提案。目標に向けた最短ルートが明確になります。',
  },
];

const FEATURES: FeatureItem[] = [
  {
    icon: <Users size={20} />,
    title: 'マンツーマンレッスン',
    body: '専属トレーナーが1対1で丁寧に指導。あなたのペースに合わせて進められます。',
  },
  {
    icon: <Shield size={20} />,
    title: '完全個室のレッスン環境',
    body: '周りの目を気にせず集中できる完全個室。プライベートな空間でレッスンに臨めます。',
  },
  {
    icon: <BarChart2 size={20} />,
    title: '高性能シミュレーションによるショット診断',
    body: '弾道・スピン・軌道を精密に分析。感覚だけでは気づけない課題を数値化します。',
  },
  {
    icon: <Eye size={20} />,
    title: 'フォームの癖を確認できる',
    body: 'スイングを多角度から確認。自分では見えにくいフォームの癖を視覚的に把握できます。',
  },
  {
    icon: <Award size={20} />,
    title: '専属トレーナーによるサポート',
    body: '担当トレーナーが一貫してサポート。継続的な成果管理で着実な上達を目指します。',
  },
  {
    icon: <Target size={20} />,
    title: '体験レッスン付きゴルフ力診断',
    body: '初回3,300円（税込）でゴルフ力診断＋体験レッスン。まず試してから継続を検討できます。',
  },
];

const TARGET_ITEMS = [
  'ドライバーのスライスを直したい',
  '打ちっぱなしに通っても上達を感じない',
  'OBを減らしたい',
  '自己流の練習に限界を感じている',
  '自分のフォームのどこが悪いのか知りたい',
  '本気でゴルフを上達させたい',
];

const COMPARE_ROWS: CompareRow[] = [
  { label: '課題の見つけやすさ', self: '感覚頼りで気づきにくい', rizap: '高精度シミュレーションで見える化' },
  { label: 'フォーム確認', self: '自己判断・動画模倣', rizap: '専属トレーナーが丁寧に確認' },
  { label: 'ショット分析', self: 'なし（感覚のみ）', rizap: '弾道・軌道・スピンを数値で分析' },
  { label: '改善の方向性', self: '自分で試行錯誤', rizap: '診断結果から明確に提示' },
  { label: 'サポート体制', self: 'なし', rizap: '専属トレーナーが伴走' },
];

const FAQ_ITEMS: FaqItem[] = [
  {
    q: 'ゴルフ初心者でも大丈夫ですか？',
    a: 'はい、初心者の方も歓迎しています。体験レッスン付きゴルフ力診断では、現在のゴルフ力を丁寧に診断し、あなたのレベルに合ったアドバイスをご提供します。',
  },
  {
    q: 'スライス改善の相談でも利用できますか？',
    a: 'はい、もちろんです。スライスのお悩みは多くの方に共通する課題です。高性能シミュレーションを使ったショット診断で、スライスの原因を明確にし、フォーム修正のアドバイスまで行います。',
  },
  {
    q: '体験レッスンだけでも大丈夫ですか？',
    a: 'はい、体験レッスンのみの利用も可能です。まずはRIZAP GOLFのレッスン環境を体験してみてください。続けるかどうかは、体験後にゆっくりご検討いただけます。',
  },
  {
    q: '料金はいくらですか？',
    a: (
      <>
        <p>
          体験レッスン付きゴルフ力診断は、初回限定60分{' '}
          <strong>3,300円（税込）</strong>です。
        </p>
        <p className="mt-2 leading-relaxed" style={{ fontSize: 10, color: '#9ca3af' }}>
          ※ライザップゴルフでのトレーニング、カウンセリング、ゴルフ力診断などのサービス未経験の方に限らせていただきます。
          <br />
          ※お支払い方法はクレジットカード、デビットカード、交通・流通系電子マネーに限ります。
        </p>
      </>
    ),
  },
  {
    q: '仕事帰りでも通えますか？',
    a: 'RIZAP GOLFは全国に多数の店舗があり、早朝や夜間など幅広い時間帯に対応しています。お近くの店舗でご都合に合わせてご利用いただけます。',
  },
  {
    q: '無理な勧誘はありますか？',
    a: 'ご安心ください。体験後に無理なセールスや勧誘は行っておりません。体験を受けたうえで、続けるかどうかをご自身のペースでご判断いただけます。',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 汎用コンポーネント
// ─────────────────────────────────────────────────────────────────────────────

function SectionWrap({
  id,
  children,
  bg = 'white',
}: {
  id?: string;
  children: ReactNode;
  bg?: 'white' | 'gray' | 'green';
}) {
  const bgMap: Record<'white' | 'gray' | 'green', string> = {
    white: '#ffffff',
    gray: '#f8f8f6',
    green: '#f0f5f2',
  };
  return (
    <motion.section
      id={id}
      className="px-4 py-14"
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

function Label({ children, green }: { children: string; green?: boolean }) {
  return (
    <p
      className="text-[10px] font-extrabold uppercase tracking-[0.26em] mb-3"
      style={{ color: green ? GREEN : GOLD_DARK }}
    >
      {children}
    </p>
  );
}

function GoldLine({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        backgroundImage: `linear-gradient(to right, ${GOLD} 0%, rgba(232,200,96,0.55) 100%)`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 2px',
        backgroundPosition: '0 100%',
        paddingBottom: 3,
      }}
    >
      {children}
    </span>
  );
}

function Pain({ children }: { children: ReactNode }) {
  return (
    <strong
      style={{
        backgroundImage: 'linear-gradient(120deg, rgba(201,168,76,0.22) 0%, rgba(201,168,76,0.22) 100%)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 78%',
        backgroundPosition: '0 90%',
      }}
    >
      {children}
    </strong>
  );
}

function TagPill({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-block px-3 py-1 text-xs font-bold rounded-full border mr-1.5 mb-1.5"
      style={{ borderColor: GREEN, color: GREEN, background: GREEN_BG }}
    >
      {children}
    </span>
  );
}

function KeyCard({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-block px-3 py-2 text-sm font-bold rounded-xl border-2 mx-1 my-1"
      style={{ borderColor: GOLD, color: GOLD_DARK, background: GOLD_BG }}
    >
      {children}
    </span>
  );
}

function StepBadge({ n }: { n: number }) {
  return (
    <span
      className="flex items-center justify-center w-10 h-10 rounded-full text-sm font-extrabold shrink-0"
      style={{
        background: `linear-gradient(135deg, #b07820 0%, ${GOLD} 45%, #e8c860 70%, #b07820 100%)`,
        color: '#1a0f00',
        boxShadow: '0 2px 10px rgba(180,140,30,0.4)',
      }}
    >
      {n}
    </span>
  );
}

function ImageBlock({
  src,
  gradient,
  alt,
  className = '',
  preload = false,
}: {
  src: string;
  gradient: string;
  alt: string;
  className?: string;
  preload?: boolean;
}) {
  if (src) {
    return (
      <div className={`relative w-full rounded-2xl overflow-hidden ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, 640px"
          className="object-cover"
          quality={70}
          preload={preload}
          loading={preload ? 'eager' : 'lazy'}
        />
      </div>
    );
  }
  return (
    <div
      className={`w-full rounded-2xl flex items-center justify-center ${className}`}
      style={{ background: gradient, minHeight: 200 }}
    >
      <span className="text-white/40 text-xs px-4 text-center">{alt}</span>
    </div>
  );
}

function CtaButton({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full max-w-sm mx-auto rounded-2xl py-5 px-6 text-center cursor-pointer touch-manipulation active:scale-[0.97] transition-transform duration-150 select-none"
      style={{
        background:
          'linear-gradient(135deg, #b07020 0%, #d4a840 22%, #f0d060 50%, #d4a840 78%, #9a6010 100%)',
        color: '#1a0f00',
        fontWeight: 800,
        boxShadow:
          '0 6px 28px rgba(160,120,20,0.5), 0 1px 0 rgba(255,255,255,0.45) inset, 0 -1px 0 rgba(0,0,0,0.15) inset',
      }}
    >
      <span
        className="block font-semibold mb-0.5"
        style={{ fontSize: 10, letterSpacing: '0.24em', opacity: 0.65 }}
      >
        RIZAP GOLF
      </span>
      <span className="block text-[15px] leading-tight tracking-wide">
        体験レッスン付きゴルフ力診断へ
      </span>
      <span className="block mt-1 font-normal" style={{ fontSize: 11, opacity: 0.65 }}>
        ▼ まずは診断を受けてみる
      </span>
    </a>
  );
}

function PriceNote({ dark = false }: { dark?: boolean }) {
  const textColor = dark ? 'rgba(255,255,255,0.9)' : '#4b4030';
  const noteColor = dark ? 'rgba(255,255,255,0.5)' : '#9a8060';
  const badgeBg = dark ? 'rgba(201,168,76,0.2)' : GOLD_BG;
  const badgeText = dark ? '#f0d080' : GOLD_DARK;

  return (
    <div className="mt-5 text-center">
      <p className="text-xs font-semibold mb-2" style={{ color: textColor }}>
        RIZAP GOLFの体験レッスン付きゴルフ力診断
      </p>
      <span
        className="inline-block px-4 py-1.5 text-sm font-bold rounded-full border"
        style={{ borderColor: GOLD, color: badgeText, background: badgeBg }}
      >
        初回限定60分 3,300円（税込）
      </span>
      <div className="mt-3 max-w-xs mx-auto space-y-1.5 text-left">
        <p className="leading-relaxed" style={{ fontSize: 10, color: noteColor }}>
          ※ライザップゴルフでのトレーニング、カウンセリング、ゴルフ力診断などのサービス未経験の方に限らせていただきます。
        </p>
        <p className="leading-relaxed" style={{ fontSize: 10, color: noteColor }}>
          ※お支払い方法はクレジットカード、デビットカード、交通・流通系電子マネーに限ります。
        </p>
      </div>
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
            borderColor: open === i ? GOLD : '#e5e7eb',
            background: open === i ? GOLD_BG : '#fff',
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
                background: open === i ? `linear-gradient(135deg, ${GOLD}, #f0d060)` : '#f3f4f6',
                color: open === i ? '#1a0f00' : '#9ca3af',
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
              <ChevronDown size={16} style={{ color: GOLD }} />
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
                <div className="px-5 pb-5 pt-1 flex gap-3 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                  <span
                    className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full font-extrabold mt-0.5"
                    style={{ fontSize: 11, background: GREEN_BG, color: GREEN }}
                  >
                    A
                  </span>
                  <div className="flex-1">{item.a}</div>
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
// セクションコンポーネント
// ─────────────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative px-4 pt-8 pb-14 bg-white overflow-hidden">
      {/* PR バッジ + ブランドラベル */}
      <div className="flex items-center gap-2.5 mb-5">
        <span
          className="font-bold border border-gray-300 text-gray-400 px-2 py-0.5 rounded-sm shrink-0"
          style={{ fontSize: 9, letterSpacing: '0.18em' }}
        >
          PR
        </span>
        <span
          className="font-extrabold"
          style={{ fontSize: 10, letterSpacing: '0.32em', color: GOLD_DARK }}
        >
          RIZAP GOLF
        </span>
      </div>

      <motion.div initial="hidden" animate="visible" variants={stagger}>

        {/* H1 */}
        <motion.h1
          variants={fadeUp}
          className="text-2xl sm:text-3xl font-extrabold leading-snug text-gray-900 mb-5"
          style={{ letterSpacing: '-0.01em' }}
        >
          <span
            style={{
              backgroundImage: `linear-gradient(135deg, ${GOLD} 0%, #e8c860 50%, #d4a030 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            ドライバーのスライス
          </span>
          、<br />
          <GoldLine>自己流で直そうとしていませんか？</GoldLine>
        </motion.h1>

        {/* サブコピー */}
        <motion.p variants={fadeUp} className="text-sm text-gray-600 leading-relaxed mb-7">
          打ちっぱなしに通っているのに、なぜか同じミスを繰り返してしまう。
          <br />
          その原因は、努力不足ではなく
          <strong className="text-gray-800">「本当の課題」が見えていない</strong>
          ことかもしれません。
        </motion.p>

        {/* ヒーロー画像 */}
        <motion.div variants={fadeUp} className="mb-8">
          <ImageBlock
            src={heroImage}
            gradient={`linear-gradient(135deg, ${GREEN_DARK} 0%, ${GREEN} 40%, #1e4a2e 70%, ${GREEN_DARK} 100%)`}
            alt="RIZAP GOLF ヒーロー画像"
            className="aspect-[4/3]"
            preload
          />
        </motion.div>

        {/* CTA */}
        <motion.div variants={fadeUp}>
          <CtaButton href={CTA_HREF} />
          <PriceNote />
        </motion.div>
      </motion.div>

      {/* 装飾 */}
      <div
        className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)`,
          transform: 'translate(30%, -30%)',
        }}
      />
    </section>
  );
}

function EmpathySection() {
  return (
    <SectionWrap bg="gray">
      <Label>あなたの悩みに寄り添う</Label>
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-6 leading-snug">
        練習しているのに、
        <br />
        <Pain>スライスが直らない</Pain>。
      </h2>

      <div className="space-y-4 text-sm text-gray-700 leading-loose">
        <p>
          週に何度も打ちっぱなしに通っている。
          <br />
          動画を見ながらフォームを真似している。
          <br />
          それでも、ドライバーを握ると<Pain>同じミスを繰り返して</Pain>しまう。
        </p>

        <div
          className="p-4 rounded-2xl border"
          style={{ borderColor: 'rgba(201,168,76,0.3)', background: 'rgba(201,168,76,0.06)' }}
        >
          <p className="font-bold text-gray-800">
            <Pain>OB</Pain>
            が増えると、スコアだけでなく周りの目も気になってしまう。
          </p>
        </div>

        <p className="text-gray-500" style={{ fontSize: 12 }}>
          そんな悩みを抱えながら、それでも上手くなりたいと練習を続けている。
          <br />
          そのひたむきさは、決して間違っていません。
        </p>
      </div>

      <div className="mt-7">
        <ImageBlock
          src={problemImage}
          gradient="linear-gradient(135deg, #374151 0%, #1f2937 100%)"
          alt="打ちっぱなし・練習イメージ"
          className="aspect-video"
        />
      </div>
    </SectionWrap>
  );
}

function ProblemSection() {
  return (
    <SectionWrap bg="white">
      <Label>問題の本質</Label>
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-6 leading-snug">
        自己流では、自分の
        <br />
        <GoldLine>本当の課題に気づきにくい。</GoldLine>
      </h2>

      <div className="space-y-4 text-sm text-gray-700 leading-loose">
        <p>スライスの原因は、人によって違います。</p>

        <div className="flex flex-wrap">
          <TagPill>グリップ</TagPill>
          <TagPill>体の開き</TagPill>
          <TagPill>軌道</TagPill>
          <TagPill>インパクト</TagPill>
        </div>

        <p>原因が分からないまま練習しても、改善まで遠回りになる可能性があります。</p>

        <div
          className="p-4 rounded-2xl border"
          style={{ borderColor: `rgba(201,168,76,0.4)`, background: GOLD_BG }}
        >
          <p className="text-sm font-bold text-gray-800">
            自主練だけでは、
            <Pain>自分の本当の癖やフォームの問題</Pain>
            に気づくことは難しいのです。
          </p>
        </div>
      </div>
    </SectionWrap>
  );
}

function SolutionSection() {
  return (
    <SectionWrap bg="green">
      <Label green>RIZAP GOLFの解決策</Label>
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-6 leading-snug">
        RIZAP GOLFなら、
        <br />
        ショット診断で
        <span style={{ color: GREEN }}>課題を見える化。</span>
      </h2>

      <div className="mb-6">
        <ImageBlock
          src={diagnosisImage}
          gradient={`linear-gradient(135deg, ${GREEN_DARK} 0%, #3a6b4a 50%, ${GREEN_DARK} 100%)`}
          alt="高性能シミュレーション診断イメージ"
          className="aspect-[4/3]"
        />
      </div>

      <p className="text-sm text-gray-700 leading-loose mb-6">
        自分では気づきにくいフォームの癖やスイングの課題を、
        最新テクノロジーで「見える化」します。
      </p>

      <div className="flex flex-wrap justify-center -mx-1">
        <KeyCard>高性能シミュレーション</KeyCard>
        <KeyCard>ショット診断</KeyCard>
        <KeyCard>課題を見える化</KeyCard>
      </div>
    </SectionWrap>
  );
}

function StepsSection() {
  return (
    <SectionWrap bg="white">
      <Label>フォーム修正の流れ</Label>
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-7 leading-snug">
        体験から改善まで、
        <br />5 つのステップで進む。
      </h2>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="space-y-4"
      >
        {STEPS.map((s) => (
          <motion.div
            key={s.n}
            variants={fadeUp}
            className="flex gap-4 p-4 rounded-2xl border bg-white"
            style={{
              borderColor: `rgba(201,168,76,0.45)`,
              boxShadow: '0 2px 14px rgba(0,0,0,0.06)',
            }}
          >
            <StepBadge n={s.n} />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm leading-snug mb-1">{s.title}</p>
              <p className="text-gray-500 leading-relaxed" style={{ fontSize: 12 }}>
                {s.body}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* レッスン画像エリア */}
      <div className="mt-8">
        <ImageBlock
          src={lessonImage}
          gradient={`linear-gradient(135deg, #1a2a3a 0%, #2a3a4a 50%, #1a2a3a 100%)`}
          alt="フォーム修正前後イメージ"
          className="aspect-video"
        />
      </div>
    </SectionWrap>
  );
}

function FeaturesSection() {
  return (
    <SectionWrap bg="gray">
      <Label>RIZAP GOLFの特徴</Label>
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-7 leading-snug">
        なぜRIZAP GOLFで、
        <br />
        課題が見つかるのか。
      </h2>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        {FEATURES.map((f, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            className="p-4 rounded-2xl border bg-white"
            style={{ borderColor: '#e8e0d0', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
          >
            <div
              className="flex items-center justify-center w-9 h-9 rounded-xl mb-3"
              style={{ background: GOLD_BG, color: GOLD_DARK }}
            >
              {f.icon}
            </div>
            <p className="font-bold text-sm text-gray-900 mb-1 leading-snug">{f.title}</p>
            <p className="text-gray-500 leading-relaxed" style={{ fontSize: 12 }}>
              {f.body}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrap>
  );
}

function TargetSection() {
  return (
    <SectionWrap bg="white">
      <Label green>こんな人におすすめ</Label>
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-7 leading-snug">
        ひとつでも当てはまる方へ。
      </h2>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="space-y-3"
      >
        {TARGET_ITEMS.map((item, i) => (
          <motion.div key={i} variants={fadeUp} className="flex items-center gap-3">
            <CheckCircle2 size={20} className="shrink-0" style={{ color: GREEN }} />
            <p className="text-sm text-gray-800 font-medium">{item}</p>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrap>
  );
}

function ComparisonSection() {
  return (
    <SectionWrap bg="gray">
      <Label>比較</Label>
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-7 leading-snug">
        自己流練習との違い。
      </h2>

      {/* ヘッダー行 */}
      <div className="grid grid-cols-2 gap-2 mb-3 text-center">
        <div
          className="py-2.5 rounded-xl font-bold text-gray-400"
          style={{ fontSize: 12, background: '#f0f0ee', border: '1px solid #e5e5e0' }}
        >
          一般的な自己流練習
        </div>
        <div
          className="py-2.5 rounded-xl font-bold"
          style={{
            fontSize: 12,
            background: `linear-gradient(135deg, ${GREEN_DARK}, ${GREEN})`,
            color: GOLD,
            border: `1px solid ${GREEN}`,
          }}
        >
          RIZAP GOLF
        </div>
      </div>

      {/* 比較行 */}
      <div className="space-y-2">
        {COMPARE_ROWS.map((row, i) => (
          <div key={i} className="rounded-2xl overflow-hidden border border-gray-100">
            <p
              className="font-bold text-gray-400 tracking-wide px-3 py-1.5 bg-gray-50 border-b border-gray-100"
              style={{ fontSize: 10 }}
            >
              {row.label}
            </p>
            <div className="grid grid-cols-2">
              <div className="px-3 py-3 flex items-start gap-1.5 border-r border-gray-100">
                <X size={12} className="shrink-0 mt-0.5" style={{ color: '#d1d5db' }} />
                <p className="text-gray-400 leading-snug" style={{ fontSize: 11 }}>
                  {row.self}
                </p>
              </div>
              <div
                className="px-3 py-3 flex items-start gap-1.5"
                style={{ background: 'rgba(45,90,61,0.05)' }}
              >
                <CheckCircle2 size={12} className="shrink-0 mt-0.5" style={{ color: GREEN }} />
                <p className="font-semibold leading-snug" style={{ fontSize: 11, color: GREEN }}>
                  {row.rizap}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionWrap>
  );
}

function MidCtaSection() {
  return (
    <SectionWrap bg="white">
      <div className="text-center mb-7">
        <Label>まずは一歩から</Label>
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-snug">
          まずは、自分のスイングの
          <br />
          課題を知るところから。
        </h2>
      </div>
      <CtaButton href={CTA_HREF} />
      <PriceNote />
    </SectionWrap>
  );
}

function FaqSection() {
  return (
    <SectionWrap bg="gray">
      <Label>よくある質問</Label>
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-7 leading-snug">FAQ</h2>
      <FaqAccordion items={FAQ_ITEMS} />
    </SectionWrap>
  );
}

function FinalCtaSection() {
  return (
    <section
      className="px-4 py-16 relative overflow-hidden"
      style={{
        background: `linear-gradient(160deg, ${GREEN_DARK} 0%, #0f2015 40%, #0a0a08 100%)`,
      }}
    >
      {/* ゴールドグロー装飾 */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(201,168,76,0.09) 0%, transparent 70%)',
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
            style={{ fontSize: 10, letterSpacing: '0.32em', color: GOLD }}
          >
            RIZAP GOLF
          </motion.p>

          <motion.h2
            variants={fadeUp}
            className="text-xl sm:text-2xl font-extrabold text-white text-center leading-snug mb-5"
          >
            ドライバーのスライスを、
            <br />
            自己流のまま放置しない。
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-sm text-center leading-relaxed mb-8"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            まずは、あなたのスイングにどんな課題があるのか。
            <br />
            RIZAP GOLFの体験レッスン付きゴルフ力診断で確認してみてください。
          </motion.p>

          <motion.div variants={fadeUp} className="mb-7">
            <ImageBlock
              src={ctaImage}
              gradient="linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)"
              alt="体験レッスンイメージ"
              className="aspect-video"
            />
          </motion.div>

          <motion.div variants={fadeUp}>
            <CtaButton href={CTA_HREF} />
            <PriceNote dark />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ページ
// ─────────────────────────────────────────────────────────────────────────────

export default function RizapGolfPage() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <HeroSection />
      <EmpathySection />
      <ProblemSection />
      <SolutionSection />
      <StepsSection />
      <FeaturesSection />
      <TargetSection />
      <ComparisonSection />
      <MidCtaSection />
      <FaqSection />
      <FinalCtaSection />
    </main>
  );
}
