'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const CTA_URL = 'https://px.a8.net/svt/ejp?a8mat=459LBM+48F16Q+2JK4+669JL';

const DIAGNOSE_QUESTIONS = [
  { id: 'q1', text: 'Q1. 今の給料に不満がありますか？' },
  { id: 'q2', text: 'Q2. 日勤の人間関係に疲れていますか？' },
  { id: 'q3', text: 'Q3. 休みを増やしたいですか？' },
  { id: 'q4', text: 'Q4. 夜勤専従の求人を一度見てみたいですか？' },
] as const;

type QuestionId = (typeof DIAGNOSE_QUESTIONS)[number]['id'];

/* ─────────────────────────────────────────────────────
   Hook: スクロール表示検知
───────────────────────────────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

/* ─────────────────────────────────────────────────────
   共通コンポーネント
───────────────────────────────────────────────────── */

/** 背景装飾用ぼかし円 */
function Blob({ style }: { style: React.CSSProperties }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 0,
        ...style,
      }}
    />
  );
}

/** 画像プレースホルダー 12:9 */
function ImagePlaceholder() {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        aspectRatio: '12 / 9',
        borderRadius: '20px',
        background: 'linear-gradient(145deg, #e8f0fa 0%, #d8e6f5 50%, #e2daf5 100%)',
        boxShadow: '0 4px 20px rgba(26, 58, 92, 0.10)',
      }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(100, 140, 190, 0.25)' }}
        >
          <svg className="w-6 h-6" fill="rgba(80,120,170,0.7)" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 5 2-3.5L16 15z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <span style={{ color: '#8fa8c4', fontSize: '0.875rem', fontWeight: 500 }}>
          画像挿入予定
        </span>
      </div>
    </div>
  );
}

/**
 * セクション画像 12:9
 * src が指定されれば画像を表示、なければプレースホルダーにフォールバック
 */
function SectionImage({
  src,
  alt,
  contain = false,
}: {
  src?: string;
  alt?: string;
  contain?: boolean;
}) {
  const wrapStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    aspectRatio: '12 / 9',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(26, 58, 92, 0.10)',
  };

  if (!src) {
    return (
      <div
        style={{
          ...wrapStyle,
          background: 'linear-gradient(145deg, #e8f0fa 0%, #d8e6f5 50%, #e2daf5 100%)',
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(100, 140, 190, 0.25)' }}
          >
            <svg className="w-6 h-6" fill="rgba(80,120,170,0.7)" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 5 2-3.5L16 15z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span style={{ color: '#8fa8c4', fontSize: '0.875rem', fontWeight: 500 }}>
            画像挿入予定
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        ...wrapStyle,
        /* contain モード時：画像余白が出ても自然に見えるよう薄いラベンダー背景 */
        background: contain ? 'linear-gradient(145deg, #f5f3ff 0%, #eef0ff 100%)' : undefined,
      }}
    >
      <Image
        src={src}
        alt={alt ?? ''}
        fill
        style={{ objectFit: contain ? 'contain' : 'cover' }}
        sizes="(max-width: 640px) 100vw, 512px"
      />
    </div>
  );
}

/** CTAボタン — ネイビー×パープル */
function CTAButton({ text }: { text: string }) {
  return (
    <a
      href={CTA_URL}
      rel="nofollow sponsored"
      className="cta-btn block w-full text-center font-bold rounded-2xl"
      style={{
        padding: '18px 24px',
        background: 'linear-gradient(180deg, #6366f1 0%, #4338ca 50%, #1E3A8A 100%)',
        boxShadow: '0 6px 0 #1E40AF, 0 10px 28px rgba(79, 70, 229, 0.38)',
        textDecoration: 'none',
        fontSize: '1.1rem',
        letterSpacing: '0.04em',
        textShadow: '0 1px 3px rgba(0,0,0,0.25)',
        color: '#ffffff',
      }}
    >
      {text}
    </a>
  );
}

/** スクロール表示アニメーション付きセクション */
function AnimSection({
  children,
  style,
  delay = 0,
  decor,
  innerClass = 'px-5 py-12',
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  delay?: number;
  decor?: React.ReactNode;
  innerClass?: string;
}) {
  const { ref, visible } = useReveal();
  return (
    <section
      ref={ref}
      className={`relative overflow-hidden ${visible ? 'reveal-in' : 'reveal-out'}`}
      style={{ animationDelay: visible ? `${delay}s` : undefined, ...style }}
    >
      {decor}
      <div className={`max-w-lg mx-auto relative ${innerClass}`} style={{ zIndex: 1 }}>
        {children}
      </div>
    </section>
  );
}

/** セクション見出し */
function SectionHeading({
  children,
  dark = false,
  accent = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
  accent?: boolean;
}) {
  const color = dark ? '#ffffff' : accent ? '#6366f1' : '#1a3a5c';
  return (
    <div className="text-center mb-6">
      <div
        style={{
          display: 'inline-block',
          width: 32,
          height: 2,
          borderRadius: 9999,
          background: color,
          opacity: 0.35,
          marginBottom: 12,
        }}
      />
      <h2 className="text-2xl font-bold leading-tight" style={{ color }}>
        {children}
      </h2>
      <div
        style={{
          display: 'inline-block',
          width: 32,
          height: 2,
          borderRadius: 9999,
          background: color,
          opacity: 0.35,
          marginTop: 12,
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   メインコンポーネント
───────────────────────────────────────────────────── */
export default function YakinSenjuContent() {
  const [answers, setAnswers] = useState<Record<QuestionId, boolean | null>>({
    q1: null,
    q2: null,
    q3: null,
    q4: null,
  });
  const allAnswered = Object.values(answers).every((v) => v !== null);
  const handleAnswer = (id: QuestionId, value: boolean) =>
    setAnswers((prev) => ({ ...prev, [id]: value }));

  const heroReveal = useReveal();

  return (
    <>
      <style>{`
        /* ── Reveal ── */
        .reveal-out {
          opacity: 0;
          transform: translateY(28px);
          filter: blur(5px);
        }
        .reveal-in {
          animation: revealUp 0.82s ease-out forwards;
        }
        @keyframes revealUp {
          from { opacity: 0; transform: translateY(28px); filter: blur(5px); }
          to   { opacity: 1; transform: translateY(0);    filter: blur(0);   }
        }

        /* ── CTA ── */
        @keyframes ctaPulse {
          0%, 100% {
            transform: translateY(0px);
            box-shadow: 0 6px 0 #1E40AF, 0 10px 28px rgba(79, 70, 229, 0.38);
          }
          50% {
            transform: translateY(-3px);
            box-shadow: 0 9px 0 #1E40AF, 0 16px 36px rgba(79, 70, 229, 0.52);
          }
        }
        .cta-btn {
          animation: ctaPulse 2.4s ease-in-out infinite;
          display: block;
        }
        .cta-btn:hover {
          animation: none;
          transform: translateY(-2px);
          box-shadow: 0 8px 0 #1E40AF, 0 14px 32px rgba(79, 70, 229, 0.48) !important;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .cta-btn:active {
          animation: none;
          transform: translateY(4px);
          box-shadow: 0 2px 0 #1E40AF, 0 4px 12px rgba(79, 70, 229, 0.3) !important;
        }

        /* ── Dot pattern ── */
        .dot-bg {
          background-image: radial-gradient(rgba(99, 102, 241, 0.10) 1px, transparent 1px);
          background-size: 24px 24px;
        }

        /* ── Diagonal line pattern ── */
        .diag-bg {
          background-image: repeating-linear-gradient(
            -45deg,
            rgba(99, 102, 241, 0.04) 0px,
            rgba(99, 102, 241, 0.04) 1px,
            transparent 1px,
            transparent 12px
          );
        }
      `}</style>

      {/* ═══════════════════════════════════════════════
          1. FIRST VIEW
      ═══════════════════════════════════════════════ */}
      <section
        ref={heroReveal.ref}
        className={`relative overflow-hidden ${heroReveal.visible ? 'reveal-in' : 'reveal-out'}`}
        style={{
          background:
            'linear-gradient(160deg, #f6f3ff 0%, #eef4ff 40%, #ffffff 70%, #fafbff 100%)',
        }}
      >
        {/* 背景装飾 */}
        <Blob
          style={{
            width: 300,
            height: 300,
            background: 'rgba(99, 102, 241, 0.09)',
            filter: 'blur(90px)',
            top: -80,
            right: -80,
          }}
        />
        <Blob
          style={{
            width: 200,
            height: 200,
            background: 'rgba(59, 130, 246, 0.07)',
            filter: 'blur(70px)',
            bottom: 0,
            left: -60,
          }}
        />
        <div aria-hidden="true" className="absolute inset-0 dot-bg" style={{ opacity: 0.6 }} />

        <div className="max-w-lg mx-auto px-5 pt-6 pb-14 relative" style={{ zIndex: 1 }}>
          {/* PR */}
          <div className="text-right mb-4">
            <span
              className="text-xs rounded px-2 py-0.5"
              style={{ color: '#94a3b8', border: '1px solid #cbd5e1', letterSpacing: '0.08em' }}
            >
              PR
            </span>
          </div>

          {/* タイトル */}
          <div className="text-center mb-0">
            <p
              className="text-sm font-semibold mb-3"
              style={{ color: '#6366f1', letterSpacing: '0.1em' }}
            >
              ── 夜勤専従ではたらく看護師さんへ ──
            </p>
            <h1 className="font-bold leading-snug" style={{ color: '#1a3a5c', fontSize: '2rem' }}>
              夜勤専従で
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #4a90d9 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontSize: '2.4rem',
                  fontWeight: 800,
                }}
              >
                働き方を変えたい
              </span>
              <br />
              看護師さんへ
            </h1>
          </div>

          {/* 画像 ① ファーストビュー */}
          <div className="mt-6 mb-6">
            <SectionImage
              src="https://static.wixstatic.com/media/5ebda9_cc041baf8ac945a48344a666c11a410d~mv2.png"
              alt="夜勤専従の看護師向けファーストビュー画像"
            />
          </div>

          {/* サブコピー */}
          <p
            className="text-center text-slate-600 text-base leading-loose mb-8"
            style={{ letterSpacing: '0.02em' }}
          >
            今の給料・休み・人間関係に悩んでいるなら、
            <br />
            夜勤専従の求人を
            <br />
            一度確認してみませんか？
          </p>

          {/* 3サークル */}
          <div className="grid grid-cols-3 gap-4 mb-3 px-1">
            {[
              { icon: '💰', top: '月収', mid: '〜45万円', btm: 'を目指せる' },
              { icon: '📅', top: '年休', mid: '149〜150日', btm: '前後の求人例' },
              { icon: '⏰', top: '残業', mid: '月3時間', btm: '程度の求人例も' },
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center text-center"
                style={{
                  aspectRatio: '1 / 1',
                  borderRadius: '50%',
                  background: 'linear-gradient(145deg, #4338ca 0%, #1E3A8A 100%)',
                  boxShadow:
                    '0 6px 20px rgba(79, 70, 229, 0.30), inset 0 1px 0 rgba(255,255,255,0.15)',
                }}
              >
                <span style={{ fontSize: '1.3rem', lineHeight: 1 }}>{item.icon}</span>
                <span
                  className="text-white font-bold block mt-1"
                  style={{ fontSize: '0.68rem', lineHeight: 1.2 }}
                >
                  {item.top}
                </span>
                <span
                  className="font-extrabold block"
                  style={{ fontSize: '0.72rem', lineHeight: 1.2, color: '#c7d2fe' }}
                >
                  {item.mid}
                </span>
                <span
                  className="block mt-0.5"
                  style={{ fontSize: '0.5rem', lineHeight: 1.2, color: 'rgba(255,255,255,0.75)' }}
                >
                  {item.btm}
                </span>
              </div>
            ))}
          </div>

          <p className="text-xs text-center mb-8" style={{ color: '#94a3b8' }}>
            ※求人例。条件は地域・経験・資格・施設により異なります
          </p>

          {/* CTA 1本 */}
          <CTAButton text="夜勤専従の求人を見てみる" />
          <p className="text-center text-xs mt-3" style={{ color: '#94a3b8' }}>
            ※登録・利用は完全無料
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          2. 共感ブロック
      ═══════════════════════════════════════════════ */}
      <AnimSection
        delay={0}
        style={{ background: 'linear-gradient(180deg, #f8faff 0%, #f0f4ff 100%)' }}
        decor={
          <>
            <Blob
              style={{
                width: 260,
                height: 260,
                background: 'rgba(99, 102, 241, 0.07)',
                filter: 'blur(80px)',
                top: -60,
                right: -60,
              }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 dot-bg"
              style={{ opacity: 0.5 }}
            />
          </>
        }
      >
        <SectionHeading>
          今の働き方、
          <br />
          正直しんどくないですか？
        </SectionHeading>
        {/* 画像 ② 共感ブロック */}
        <SectionImage
          src="https://static.wixstatic.com/media/5ebda9_137f9743c8ef458894e57c97c1fcecfc~mv2.png"
          alt="夜勤で悩む看護師のイメージ"
        />
        <div className="flex flex-col gap-3 mt-5">
          {[
            '夜勤あり常勤なのに給料が思ったより上がらない',
            '日勤の人間関係がきつい',
            'お局看護師との関係に疲れた',
            '休みの日も疲れて寝るだけ',
            '副業したいけどバレるリスクが怖い',
            'もっと効率よく稼ぎたい',
          ].map((text, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl px-4 py-3"
              style={{
                background: '#fff',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                border: '1px solid #e8eef8',
              }}
            >
              <span style={{ color: '#6366f1', marginTop: '2px', flexShrink: 0 }}>✓</span>
              <span className="text-slate-700 text-sm leading-relaxed">{text}</span>
            </div>
          ))}
        </div>
      </AnimSection>

      {/* ═══════════════════════════════════════════════
          3. メリットブロック
      ═══════════════════════════════════════════════ */}
      <AnimSection
        delay={0.08}
        style={{ background: '#ffffff' }}
        decor={
          <>
            <Blob
              style={{
                width: 320,
                height: 320,
                background: 'rgba(99, 102, 241, 0.05)',
                filter: 'blur(90px)',
                top: -100,
                left: -100,
              }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 diag-bg"
            />
          </>
        }
      >
        <SectionHeading>夜勤専従という選択肢</SectionHeading>
        {/* 画像 ③ メリットブロック */}
        <SectionImage
          src="https://static.wixstatic.com/media/5ebda9_7cf438ddbaa54cd78daee9ca86591bbf~mv2.png"
          alt="夜勤専従で働く看護師のイメージ"
        />
        <div className="flex flex-col gap-4 mt-5">
          {[
            {
              icon: '📆',
              title: '出勤回数を抑えやすい',
              desc: '夜勤のみのため、出勤日数を少なく抑えられる求人例があります。',
            },
            {
              icon: '🤝',
              title: '日中の人間関係に巻き込まれにくい',
              desc: '日中スタッフとの関わりが少なく、職場ストレスが軽減しやすい傾向があります。',
            },
            {
              icon: '💴',
              title: '夜勤手当で収入アップを狙いやすい',
              desc: '夜勤手当が毎回つくため、月収〜45万円を目指せる求人例もあります。',
            },
            {
              icon: '🏖️',
              title: '年間休日149日〜150日前後の求人例もある',
              desc: '連休が取りやすい求人もあります（条件により異なります）。',
            },
            {
              icon: '⏱️',
              title: '残業月3時間程度の求人例もある',
              desc: 'ルーティン業務が中心のため、残業月3時間程度の職場の求人例もあります（条件により異なります）。',
            },
            {
              icon: '🌙',
              title: 'プライベート時間を確保しやすい',
              desc: '日中の時間が空きやすく、趣味・家族との時間が増えやすい傾向があります。',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-2xl p-5"
              style={{
                background: 'linear-gradient(135deg, #f0f5ff 0%, #f5f0ff 100%)',
                border: '1px solid #dde8f5',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{item.icon}</span>
                <span className="font-bold text-base" style={{ color: '#1a3a5c' }}>
                  {item.title}
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-center mt-4" style={{ color: '#94a3b8' }}>
          ※全て求人例です。条件は地域・経験・資格・施設により異なります
        </p>
      </AnimSection>

      {/* ═══════════════════════════════════════════════
          4. ストーリーブロック
      ═══════════════════════════════════════════════ */}
      <AnimSection
        delay={0}
        style={{ background: 'linear-gradient(180deg, #1a2a4a 0%, #0d1b35 100%)' }}
        decor={
          <>
            <Blob
              style={{
                width: 280,
                height: 280,
                background: 'rgba(99, 102, 241, 0.18)',
                filter: 'blur(90px)',
                top: -60,
                right: -40,
              }}
            />
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage:
                  'radial-gradient(rgba(255,255,255,0.055) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
                pointerEvents: 'none',
              }}
            />
          </>
        }
      >
        <SectionHeading dark>
          働き方を変えたら、
          <br />
          生活も変わった
        </SectionHeading>
        {/* 画像 ④ ストーリーブロック */}
        <SectionImage
          src="https://static.wixstatic.com/media/5ebda9_5a04f46cad844ec8b9955888047c38a9~mv2.png"
          alt="プライベートが充実した看護師のイメージ"
        />
        <div
          className="rounded-2xl p-5 mt-5"
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          <p className="text-white text-sm leading-relaxed mb-5">
            「ここずっと続けるの絶対無理」と思っていた頃、
            <br />
            夜勤専従という働き方を知りました。
          </p>
          <div className="flex flex-col gap-3 mb-5">
            {[
              { icon: '💰', text: '月収〜45万円を目指せる求人例も見つかった' },
              { icon: '📅', text: '年間休日149日〜150日前後の求人例も' },
              { icon: '⏰', text: '残業月3時間程度の求人例もあり、働き方を見直すきっかけに' },
              { icon: '🍽️', text: 'ご飯・旅行・自分の時間が増えた' },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl px-4 py-3"
                style={{ background: 'rgba(255,255,255,0.1)' }}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-white text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
          <p className="text-white text-sm leading-relaxed">
            「給料も休みも増えた」と感じている方の事例は、
            <br />
            求人サービスでご確認いただけます。
          </p>
          <p className="text-xs mt-2" style={{ color: '#a0b8d0' }}>
            ※全て求人例・事例です。条件は地域・経験・施設により異なります
          </p>
        </div>
      </AnimSection>

      {/* ═══════════════════════════════════════════════
          5. レバウェル看護紹介ブロック
      ═══════════════════════════════════════════════ */}
      <AnimSection
        delay={0.05}
        style={{ background: 'linear-gradient(160deg, #f8f6ff 0%, #f0f5ff 100%)' }}
        decor={
          <>
            <Blob
              style={{
                width: 280,
                height: 280,
                background: 'rgba(99, 102, 241, 0.08)',
                filter: 'blur(80px)',
                bottom: -80,
                right: -80,
              }}
            />
            <Blob
              style={{
                width: 180,
                height: 180,
                background: 'rgba(59, 130, 246, 0.06)',
                filter: 'blur(60px)',
                top: 0,
                left: -40,
              }}
            />
          </>
        }
      >
        <SectionHeading>
          夜勤専従の求人を探すなら
          <br />
          レバウェル看護
        </SectionHeading>
        {/* 画像 ⑤ レバウェル看護紹介 */}
        <SectionImage
          src="https://static.wixstatic.com/media/5ebda9_3854f433e1614c53955e45407605dbf9~mv2.png"
          alt="レバウェル看護の求人確認イメージ"
        />
        <div className="flex flex-col gap-3 mt-5 mb-6">
          {[
            { icon: '🏥', text: '看護師専門の転職サービス' },
            { icon: '🔍', text: '夜勤専従・高給与・休日多めなど条件で求人を探せる' },
            { icon: '💬', text: 'LINEで相談しやすい' },
            {
              icon: '🤫',
              text: '職場の雰囲気や働きやすさなど、自分では聞きにくい情報も相談できる',
            },
            { icon: '✅', text: '登録・利用は完全無料' },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl px-4 py-3"
              style={{
                background: '#fff',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                border: '1px solid #e8eef8',
              }}
            >
              <span className="text-xl" style={{ flexShrink: 0 }}>
                {item.icon}
              </span>
              <span className="text-slate-700 text-sm leading-relaxed">{item.text}</span>
            </div>
          ))}
        </div>
        <CTAButton text="レバウェル看護で求人を見てみる" />
        <p className="text-center text-xs mt-2" style={{ color: '#94a3b8' }}>
          ※登録・利用は完全無料
        </p>
      </AnimSection>

      {/* ═══════════════════════════════════════════════
          6. A8バナーブロック
      ═══════════════════════════════════════════════ */}
      <AnimSection
        delay={0}
        style={{ background: '#ffffff' }}
        decor={
          <Blob
            style={{
              width: 240,
              height: 240,
              background: 'rgba(99, 102, 241, 0.06)',
              filter: 'blur(70px)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        }
      >
        <p className="text-sm text-center text-slate-500 mb-5">
          レバウェル看護の公式サイトはこちら
        </p>
        <div className="flex justify-center">
          <a
            href="https://px.a8.net/svt/ejp?a8mat=459LBM+48F16Q+2JK4+669JL"
            rel="nofollow sponsored"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              width={300}
              height={250}
              alt="レバウェル看護"
              src="https://www25.a8.net/svt/bgt?aid=250710322256&wid=003&eno=01&mid=s00000011866001037000&mc=1"
              style={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: '12px',
                border: 'none',
              }}
            />
          </a>
        </div>
        {/* A8 tracking pixel */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          width={1}
          height={1}
          src="https://www13.a8.net/0.gif?a8mat=459LBM+48F16Q+2JK4+669JL"
          alt=""
          style={{ display: 'block', border: 'none' }}
        />
      </AnimSection>

      {/* ═══════════════════════════════════════════════
          7. 診断風CTAブロック
      ═══════════════════════════════════════════════ */}
      <AnimSection
        delay={0.05}
        style={{ background: 'linear-gradient(180deg, #f5f0ff 0%, #eef0ff 100%)' }}
        decor={
          <>
            <Blob
              style={{
                width: 220,
                height: 220,
                background: 'rgba(99, 102, 241, 0.10)',
                filter: 'blur(70px)',
                top: -50,
                left: -50,
              }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 dot-bg"
              style={{ opacity: 0.4 }}
            />
          </>
        }
      >
        <SectionHeading accent>
          あなたは夜勤専従に
          <br />
          向いている？
        </SectionHeading>
        {/* 画像 ⑥ 診断ブロック — contain で画像全体を表示 */}
        <SectionImage
          src="https://static.wixstatic.com/media/5ebda9_fdfcbdd0b65e49369a0815d0795a3f55~mv2.png"
          alt="夜勤専従の求人を確認する看護師のイメージ"
          contain
        />
        <div className="flex flex-col gap-4 mt-5 mb-6">
          {DIAGNOSE_QUESTIONS.map((q) => (
            <div
              key={q.id}
              className="rounded-2xl p-4"
              style={{
                background: '#fff',
                boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
                border: '1px solid #dde8f5',
              }}
            >
              <p className="text-sm font-bold mb-3" style={{ color: '#1a3a5c' }}>
                {q.text}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleAnswer(q.id, true)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background:
                      answers[q.id] === true
                        ? 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)'
                        : '#f0f5ff',
                    color: answers[q.id] === true ? '#fff' : '#1a3a5c',
                    border: answers[q.id] === true ? 'none' : '1px solid #dde8f5',
                    cursor: 'pointer',
                  }}
                >
                  はい
                </button>
                <button
                  onClick={() => handleAnswer(q.id, false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background: answers[q.id] === false ? '#e8eef8' : '#f0f5ff',
                    color: '#64748b',
                    border: '1px solid #dde8f5',
                    cursor: 'pointer',
                  }}
                >
                  いいえ
                </button>
              </div>
            </div>
          ))}
        </div>

        {allAnswered && (
          <div
            className="p-4 rounded-2xl mb-4"
            style={{
              background: 'linear-gradient(135deg, #f0f5ff 0%, #f5f0ff 100%)',
              border: '1px solid #c8d8f5',
            }}
          >
            <p className="text-center text-sm font-bold mb-3" style={{ color: '#6366f1' }}>
              夜勤専従の求人を確認してみましょう！
            </p>
            <CTAButton text="夜勤専従の求人を無料で確認する" />
          </div>
        )}
        {!allAnswered && <CTAButton text="夜勤専従の求人を無料で確認する" />}
      </AnimSection>

      {/* ═══════════════════════════════════════════════
          8. 注意書きブロック
      ═══════════════════════════════════════════════ */}
      <AnimSection delay={0} style={{ background: '#f8faff' }}>
        <div
          className="rounded-2xl p-5"
          style={{
            background: '#fff',
            border: '1px solid #e8eef8',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}
        >
          <h3 className="text-sm font-bold mb-3" style={{ color: '#1a3a5c' }}>
            ご注意
          </h3>
          <ul className="flex flex-col gap-2">
            {[
              '求人は時期・地域により変動します',
              '人気求人は募集終了している可能性があります',
              '月収・休日数などの条件は求人により異なります',
              '登録後に希望条件に近い求人を確認してください',
            ].map((text, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-xs leading-relaxed"
                style={{ color: '#94a3b8' }}
              >
                <span style={{ flexShrink: 0, marginTop: '1px' }}>※</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </AnimSection>

      {/* ═══════════════════════════════════════════════
          9. 最終CTA
      ═══════════════════════════════════════════════ */}
      <AnimSection
        delay={0}
        style={{ background: 'linear-gradient(180deg, #1a2a4a 0%, #0d1b35 100%)' }}
        decor={
          <>
            <Blob
              style={{
                width: 360,
                height: 360,
                background: 'rgba(99, 102, 241, 0.20)',
                filter: 'blur(100px)',
                top: -100,
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            />
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage:
                  'radial-gradient(rgba(255,255,255,0.045) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
                pointerEvents: 'none',
              }}
            />
          </>
        }
      >
        {/* 最終CTA前訴求 */}
        <div
          className="mb-8 rounded-2xl p-5"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          <h3 className="text-white font-bold text-center text-base mb-4">
            こんな求人例が見つかるかも
          </h3>
          <div className="flex flex-col gap-3">
            {[
              '月収〜45万円を目指せる求人例も',
              '年間休日149日〜150日前後の求人例も',
              '残業月3時間程度の求人例も',
              '人間関係の負担を減らせる働き方も',
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-white">
                <span style={{ color: '#818cf8', flexShrink: 0 }}>▶</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
          <p className="text-xs mt-4" style={{ color: '#a0b8d0' }}>
            ※条件は地域・経験・資格・施設により異なります
          </p>
        </div>

        <SectionHeading dark>
          今の職場だけで判断せず、
          <br />
          夜勤専従の求人も
          <br />
          見てみませんか？
        </SectionHeading>

        <div className="flex flex-col gap-3">
          <CTAButton text="レバウェル看護で求人を見てみる" />
          <CTAButton text="無料で相談してみる" />
        </div>
        <p className="text-center text-xs mt-2" style={{ color: '#a0b8d0' }}>
          ※登録・利用は完全無料
        </p>
      </AnimSection>

      {/* Footer */}
      <footer className="py-6 text-center px-5" style={{ background: '#0d1b35' }}>
        <p className="text-xs leading-relaxed" style={{ color: '#607080' }}>
          ※本ページはレバウェル看護のPRです。
          <br />
          求人条件は地域・経験・資格・施設により異なります。
        </p>
      </footer>
    </>
  );
}
