'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const CTA_URL = 'https://px.a8.net/svt/ejp?a8mat=4B1HTK+EPVUPU+2JK4+5SECVM';
const A8_BEACON = 'https://www14.a8.net/0.gif?a8mat=4B1HTK+EPVUPU+2JK4+5SECVM';

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

/** 実画像 12:9 */
function SectionImage({ src, alt = '' }: { src: string; alt?: string }) {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        aspectRatio: '12 / 9',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(30, 60, 120, 0.10)',
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 480px) 100vw, 480px"
        style={{ objectFit: 'cover', objectPosition: 'center center' }}
      />
    </div>
  );
}

/** CTAボタン */
function CtaButton({ label, sub }: { label: string; sub?: string }) {
  return (
    <a href={CTA_URL} className="taxi-cta-btn" rel="nofollow sponsored">
      <span className="taxi-cta-shine" aria-hidden="true" />
      <span className="taxi-cta-btn-inner">
        <span
          style={{
            display: 'block',
            fontSize: '1.05rem',
            fontWeight: 900,
            letterSpacing: '0.01em',
            lineHeight: 1.3,
          }}
        >
          {label}
        </span>
        {sub && (
          <span
            style={{
              display: 'block',
              fontSize: '0.72rem',
              fontWeight: 600,
              opacity: 0.75,
              marginTop: '0.2rem',
            }}
          >
            {sub}
          </span>
        )}
      </span>
    </a>
  );
}

/** セクションラッパー */
function Section({
  children,
  style,
  className = '',
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  const { ref, visible } = useReveal();
  return (
    <section
      ref={ref}
      className={`section-fade ${visible ? 'in-view' : ''} ${className}`}
      style={style}
    >
      {children}
    </section>
  );
}

/** メリット・条件カード */
function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc?: string;
}) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '14px',
        padding: '1.1rem 1.2rem',
        boxShadow: '0 2px 12px rgba(30, 60, 120, 0.07)',
        border: '1.5px solid #ddeaf8',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.8rem',
      }}
    >
      <span style={{ fontSize: '1.6rem', lineHeight: 1, flexShrink: 0 }}>{icon}</span>
      <div>
        <p style={{ fontWeight: 700, color: '#1f2d3d', fontSize: '0.95rem', lineHeight: 1.4 }}>
          {title}
        </p>
        {desc && (
          <p style={{ fontSize: '0.8rem', color: '#5b7fa3', marginTop: '0.3rem', lineHeight: 1.5 }}>
            {desc}
          </p>
        )}
      </div>
    </div>
  );
}

/** FAQアイテム */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1.5px solid #d8e8f6',
        boxShadow: '0 2px 8px rgba(30, 60, 120, 0.05)',
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.8rem',
          padding: '1rem 1.1rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
        aria-expanded={open}
      >
        <span
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.55rem',
            fontSize: '0.9rem',
            fontWeight: 700,
            color: '#1f2d3d',
            lineHeight: 1.5,
          }}
        >
          <span
            style={{
              flexShrink: 0,
              fontWeight: 900,
              color: '#f5c000',
              fontSize: '1rem',
              background: '#1f2d3d',
              borderRadius: '6px',
              padding: '0.05rem 0.4rem',
              lineHeight: 1.5,
            }}
          >
            Q
          </span>
          {q}
        </span>
        <span
          style={{
            flexShrink: 0,
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: open ? '#1a4099' : '#e8f0fb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s',
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.25s' }}
          >
            <path
              d="M2 4l4 4 4-4"
              stroke={open ? '#f5c000' : '#1a4099'}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      {open && (
        <div
          style={{
            padding: '0 1.1rem 1rem',
            fontSize: '0.875rem',
            color: '#4b5563',
            lineHeight: 1.7,
            borderTop: '1px solid #e8f0fb',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              fontWeight: 900,
              color: '#1f2d3d',
              fontSize: '0.95rem',
              background: '#f5c000',
              borderRadius: '6px',
              padding: '0.05rem 0.4rem',
              marginRight: '0.4rem',
              lineHeight: 1.5,
            }}
          >
            A
          </span>
          {a}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   メインコンポーネント
───────────────────────────────────────────────────── */
export default function TaxiTenshokuContent() {
  return (
    <div
      style={{
        fontFamily:
          '"Hiragino Kaku Gothic ProN", "Hiragino Sans", "Yu Gothic", system-ui, sans-serif',
        background: '#f5f9ff',
        color: '#1f2d3d',
        overflowX: 'hidden',
      }}
    >
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          1. ファーストビュー
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <header
        style={{
          position: 'relative',
          background: 'linear-gradient(160deg, #eaf4ff 0%, #d8ecff 45%, #f0f7ff 100%)',
          overflow: 'hidden',
          paddingBottom: '2.5rem',
        }}
      >
        {/* 背景装飾 */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-60px',
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(91,127,163,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '-40px',
            left: '-40px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,192,0,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* PR表記 */}
        <div style={{ padding: '0.7rem 1.2rem 0' }}>
          <span
            style={{
              display: 'inline-block',
              fontSize: '0.62rem',
              fontWeight: 600,
              color: '#5b7fa3',
              background: 'rgba(255,255,255,0.85)',
              border: '1px solid rgba(91,127,163,0.2)',
              borderRadius: '4px',
              padding: '0.15rem 0.55rem',
              letterSpacing: '0.06em',
            }}
          >
            PR レバジョブ
          </span>
        </div>

        {/* メインコピー */}
        <div style={{ padding: '1.6rem 1.2rem 0' }}>
          <p
            className="hero-enter"
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#1a4099',
              letterSpacing: '0.06em',
              marginBottom: '0.6rem',
              lineHeight: 1.4,
            }}
          >
            東京・神奈川・千葉・埼玉・大阪で働ける方へ
          </p>
          <h1
            className="hero-enter"
            style={{
              fontSize: 'clamp(1.35rem, 5vw, 1.8rem)',
              fontWeight: 900,
              color: '#1f2d3d',
              lineHeight: 1.35,
              letterSpacing: '-0.01em',
              animationDelay: '0.08s',
            }}
          >
            未経験から
            <br />
            タクシードライバーで
            <br />
            <span style={{ color: '#c88500' }}>月収50万円</span>を
            <br />
            目指しませんか？
          </h1>

          <p
            className="hero-enter"
            style={{
              fontSize: '0.82rem',
              color: '#4b5563',
              lineHeight: 1.75,
              marginTop: '1rem',
              animationDelay: '0.18s',
            }}
          >
            普通免許から応募可能な求人も。
            <br />
            二種免許の取得サポートがある求人も掲載。
            <br />
            今の給料に不満がある方は、
            <br />
            まずは求人だけでも確認してみてください。
          </p>

          {/* 画像 */}
          <div
            className="hero-enter"
            style={{ marginTop: '1.4rem', animationDelay: '0.22s' }}
          >
            <SectionImage
              src="https://static.wixstatic.com/media/5ebda9_a622cadd3957476a86b109b17de26d5d~mv2.png"
              alt="タクシードライバーのイメージ"
            />
          </div>

          {/* CTAボタン */}
          <div
            className="hero-enter"
            style={{
              marginTop: '1.6rem',
              animationDelay: '0.28s',
            }}
          >
            <CtaButton label="30秒の無料登録で求人を探しに行く" />
          </div>

          {/* 免責 */}
          <p
            style={{
              fontSize: '0.65rem',
              color: '#8a9ab8',
              textAlign: 'center',
              marginTop: '0.9rem',
              lineHeight: 1.6,
            }}
          >
            ※掲載求人により条件は異なります。月収は求人・勤務形態・勤務エリアにより異なります。
          </p>
        </div>
      </header>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          2. 共感ブロック
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Section
        style={{
          background: '#fff',
          padding: '3rem 1.2rem',
        }}
      >
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <p
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#5b7fa3',
              letterSpacing: '0.08em',
              textAlign: 'center',
              marginBottom: '0.5rem',
            }}
          >
            あなたにも、こんな悩みはありませんか？
          </p>
          <h2
            style={{
              fontSize: 'clamp(1.2rem, 4.5vw, 1.55rem)',
              fontWeight: 900,
              textAlign: 'center',
              color: '#1f2d3d',
              lineHeight: 1.4,
              marginBottom: '1.8rem',
            }}
          >
            頑張って働いても、
            <br />
            <span style={{ color: '#1a4099' }}>給料が変わらない…</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              {
                icon: '😮‍💨',
                text: '毎日、上司の顔色をうかがいながら働いている',
              },
              {
                icon: '💸',
                text: 'どんなに頑張っても手取りが全然増えない',
              },
              {
                icon: '🔁',
                text: '休みも少なく、プライベートの時間がとれない',
              },
              {
                icon: '😔',
                text: 'やりがいを感じられず、このままでいいのか不安',
              },
            ].map(({ icon, text }) => (
              <div
                key={text}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.9rem',
                  background: '#f0f7ff',
                  borderRadius: '12px',
                  padding: '1rem 1.1rem',
                  borderLeft: '4px solid #1a4099',
                }}
              >
                <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{icon}</span>
                <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1f2d3d', lineHeight: 1.5 }}>
                  {text}
                </p>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: '1.8rem',
              padding: '1.2rem',
              background: 'linear-gradient(135deg, #1a4099 0%, #2255cc 100%)',
              borderRadius: '14px',
              textAlign: 'center',
            }}
          >
            <p style={{ color: '#f5c000', fontWeight: 800, fontSize: '1rem', lineHeight: 1.5 }}>
              その悩み、タクシードライバーへの
              <br />
              転職で解決できるかもしれません。
            </p>
          </div>
        </div>
      </Section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          3. タクシードライバーのメリット
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Section
        style={{
          background: '#f7fbff',
          padding: '3rem 1.2rem',
        }}
      >
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <p
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#1a4099',
              letterSpacing: '0.08em',
              textAlign: 'center',
              marginBottom: '0.5rem',
            }}
          >
            タクシードライバーという選択肢
          </p>
          <h2
            style={{
              fontSize: 'clamp(1.1rem, 4vw, 1.4rem)',
              fontWeight: 900,
              textAlign: 'center',
              color: '#1f2d3d',
              lineHeight: 1.45,
              marginBottom: '1.8rem',
            }}
          >
            実は、タクシードライバーは
            <br />
            <span style={{ color: '#1a4099' }}>未経験から始めやすい</span>仕事です
          </h2>

          <SectionImage
            src="https://static.wixstatic.com/media/5ebda9_bc3b64a82cc1414989b2aff408e651dc~mv2.png"
            alt="未経験からタクシードライバーになれるイメージ"
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '0.85rem',
              marginTop: '1.6rem',
            }}
          >
            <FeatureCard
              icon="🚖"
              title="未経験から始められる求人あり"
              desc="ドライバー未経験でも応募できる求人を多数掲載。研修制度が整っている会社も。"
            />
            <FeatureCard
              icon="📋"
              title="二種免許の取得サポートあり"
              desc="会社負担で二種免許を取得できるサポートがある求人も。費用の心配が少なく始められます。"
            />
            <FeatureCard
              icon="🗓️"
              title="月13回前後の出勤も可能"
              desc="隔日勤務など、少ない出勤日数でもしっかり稼げる働き方の求人もあります。"
            />
            <FeatureCard
              icon="💰"
              title="月収50万円以上を目指せる求人も"
              desc="歩合制で、頑張った分だけ収入に直結。高収入を目指したい方に向いています。"
            />
          </div>

          <div
            style={{
              marginTop: '1.2rem',
              padding: '0.9rem 1rem',
              background: '#fff',
              borderRadius: '10px',
              border: '1px solid #d8e8f6',
            }}
          >
            <p style={{ fontSize: '0.72rem', color: '#8a9ab8', lineHeight: 1.7 }}>
              ※掲載求人により条件は異なります
              <br />
              ※月収・勤務日数は求人・勤務形態・勤務エリアにより異なります
            </p>
          </div>

          <div style={{ marginTop: '1.8rem' }}>
            <CtaButton label="30秒の無料登録で求人を探しに行く" />
          </div>
        </div>
      </Section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          4. レバジョブ紹介ブロック
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Section
        style={{
          background: '#fff',
          padding: '3rem 1.2rem',
        }}
      >
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          {/* サービスロゴバッジ */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.4rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'linear-gradient(135deg, #1a4099 0%, #2255cc 100%)',
                borderRadius: '12px',
                padding: '0.55rem 1.1rem',
              }}
            >
              <span
                style={{
                  background: '#f5c000',
                  borderRadius: '6px',
                  padding: '0.1rem 0.55rem',
                  fontWeight: 900,
                  fontSize: '0.8rem',
                  color: '#1f2d3d',
                }}
              >
                レバジョブ
              </span>
            </div>
          </div>

          <h2
            style={{
              fontSize: 'clamp(1.1rem, 4vw, 1.4rem)',
              fontWeight: 900,
              textAlign: 'center',
              color: '#1f2d3d',
              lineHeight: 1.45,
              marginBottom: '1.4rem',
            }}
          >
            レバジョブなら、
            <br />
            非公開のタクシー求人を
            <br />
            <span style={{ color: '#1a4099' }}>探すことが出来ます</span>
          </h2>

          <SectionImage
            src="https://static.wixstatic.com/media/5ebda9_d5a5c6b54e0642d689dcf92c849e9f7e~mv2.png"
            alt="レバジョブで非公開のタクシー求人を確認するイメージ"
          />

          <div
            style={{
              marginTop: '1.6rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {[
              {
                num: '01',
                title: 'タクシー特化の転職サービス',
                body: 'レバジョブは、タクシードライバーの求人に特化した転職支援サービスです。',
              },
              {
                num: '02',
                title: '最短1週間で内定が目指せる',
                body: '面接1回の非公開求人を多数保有。だからスピード転職が叶う',
                note: '※レバジョブとしての2025年内定実績(登録~内定まで)',
              },
              {
                num: '03',
                title: '内定した方の90%が未経験',
                body: '業界を知り尽くしたプロが面倒な書類作成を代行。未経験転職のポイントを網羅しトータルでサポート',
                note: '※レバジョブとしての2025年内定実績(登録~内定まで)',
              },
            ].map(({ num, title, body, note }) => (
              <div
                key={num}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'flex-start',
                  background: '#f0f7ff',
                  borderRadius: '14px',
                  padding: '1.1rem 1.2rem',
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    fontWeight: 900,
                    fontSize: '1.4rem',
                    color: '#f5c000',
                    lineHeight: 1,
                    textShadow: '0 1px 4px rgba(0,0,0,0.15)',
                    background: '#1a4099',
                    borderRadius: '8px',
                    padding: '0.2rem 0.5rem',
                  }}
                >
                  {num}
                </span>
                <div>
                  <p style={{ fontWeight: 800, fontSize: '0.92rem', color: '#1f2d3d', marginBottom: '0.3rem' }}>
                    {title}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: '#4b5563', lineHeight: 1.65 }}>{body}</p>
                  {note && (
                    <p style={{ fontSize: '0.65rem', color: '#8a9ab8', lineHeight: 1.6, marginTop: '0.35rem' }}>{note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.8rem' }}>
            <CtaButton label="30秒の無料登録で求人を探しに行く" />
          </div>
        </div>
      </Section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          5. 条件例ブロック
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Section
        style={{
          background: 'linear-gradient(160deg, #eaf4ff 0%, #f5f9ff 100%)',
          padding: '3rem 1.2rem',
        }}
      >
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <p
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#5b7fa3',
              letterSpacing: '0.08em',
              textAlign: 'center',
              marginBottom: '0.5rem',
            }}
          >
            求人の条件例
          </p>
          <h2
            style={{
              fontSize: 'clamp(1.1rem, 4vw, 1.4rem)',
              fontWeight: 900,
              textAlign: 'center',
              color: '#1f2d3d',
              lineHeight: 1.45,
              marginBottom: '1.8rem',
            }}
          >
            こんな条件の求人を
            <br />
            探せます
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
            }}
          >
            {[
              { icon: '💰', label: '月収50万円以上を目指せる' },
              { icon: '🗓️', label: '月13回前後の出勤' },
              { icon: '🌱', label: '未経験歓迎' },
              { icon: '📋', label: '二種免許取得サポート' },
              { icon: '🚗', label: '普通免許から応募可能' },
              { icon: '📍', label: '東京・神奈川・千葉・埼玉・大阪エリア' },
            ].map(({ icon, label }) => (
              <div
                key={label}
                style={{
                  background: '#fff',
                  border: '1.5px solid rgba(26,64,153,0.12)',
                  borderRadius: '12px',
                  padding: '1rem 0.9rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                  boxShadow: '0 2px 8px rgba(30,60,120,0.06)',
                }}
              >
                <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{icon}</span>
                <p
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#1f2d3d',
                    lineHeight: 1.45,
                  }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: '1.1rem',
              padding: '0.8rem 1rem',
              background: 'rgba(26,64,153,0.04)',
              borderRadius: '10px',
              border: '1px solid rgba(26,64,153,0.1)',
            }}
          >
            <p style={{ fontSize: '0.7rem', color: '#8a9ab8', lineHeight: 1.7 }}>
              ※掲載求人により条件は異なります
              <br />
              ※月収・勤務日数は求人・勤務形態・勤務エリアにより異なります
            </p>
          </div>

          <div style={{ marginTop: '1.8rem' }}>
            <CtaButton label="30秒の無料登録で求人を探しに行く" />
          </div>
        </div>
      </Section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          6. 不安解消FAQ
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Section
        style={{
          background: '#f7fbff',
          padding: '3rem 1.2rem',
        }}
      >
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <p
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#1a4099',
              letterSpacing: '0.08em',
              textAlign: 'center',
              marginBottom: '0.5rem',
            }}
          >
            よくある質問
          </p>
          <h2
            style={{
              fontSize: 'clamp(1.1rem, 4vw, 1.4rem)',
              fontWeight: 900,
              textAlign: 'center',
              color: '#1f2d3d',
              lineHeight: 1.45,
              marginBottom: '1.8rem',
            }}
          >
            転職前の不安を
            <br />
            解消します
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <FaqItem
              q="二種免許がなくても大丈夫ですか？"
              a="大丈夫です。普通免許から応募できる求人や、入社後に会社のサポートで二種免許を取得できる求人も掲載しています。費用を会社が負担してくれるケースもあるため、免許の心配は少なく始められます。"
            />
            <FaqItem
              q="本当に未経験でも働けますか？"
              a="はい。タクシードライバーは未経験者を積極的に採用している会社が多く、研修制度が整っている職場も多数あります。運転が好きな方や、接客が好きな方には向いている仕事です。"
            />
            <FaqItem
              q="月13回勤務は本当ですか？"
              a="隔日勤務（1日働いて翌日休む）など、少ない出勤日数でもしっかり稼げる勤務形態の求人があります。ただし実際の勤務日数は求人・会社・勤務エリアにより異なりますので、詳細は各求人をご確認ください。"
            />
          </div>
        </div>
      </Section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          7. 最後のCTA
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Section
        style={{
          background: '#fff',
          padding: '3rem 1.2rem 4rem',
        }}
      >
        <div style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
          {/* アクセントライン */}
          <div
            style={{
              width: '40px',
              height: '4px',
              background: '#f5c000',
              borderRadius: '2px',
              margin: '0 auto 1.2rem',
            }}
          />

          <h2
            style={{
              fontSize: 'clamp(1.1rem, 4vw, 1.4rem)',
              fontWeight: 900,
              color: '#1f2d3d',
              lineHeight: 1.5,
              marginBottom: '1rem',
            }}
          >
            今の給料に不満があるなら、
            <br />
            まずは求人だけでも
            <br />
            確認してみてください
          </h2>

          <p
            style={{
              fontSize: '0.83rem',
              color: '#4b5563',
              lineHeight: 1.75,
              marginBottom: '1.8rem',
            }}
          >
            タクシードライバーへの転職で、
            <br />
            収入・働き方・やりがいを変えた方が
            <br />
            たくさんいます。まずは求人を見るだけでも。
          </p>

          <SectionImage
            src="https://static.wixstatic.com/media/5ebda9_6ad0a4c05da243e9ae2a5378e81b7589~mv2.png"
            alt="転職を考えているドライバーのイメージ"
          />

          <div style={{ marginTop: '2rem' }}>
            <CtaButton label="30秒の無料登録で求人を探しに行く" sub="レバジョブへ（無料）" />
          </div>

          <p
            style={{
              fontSize: '0.68rem',
              color: '#8a9ab8',
              marginTop: '1rem',
              lineHeight: 1.65,
            }}
          >
            ※掲載求人により条件は異なります。月収・勤務日数は求人・勤務形態・勤務エリアにより異なります。
          </p>
        </div>
      </Section>

      {/* フッター */}
      <footer
        style={{
          background: '#1f2d3d',
          padding: '1.4rem 1.2rem',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            marginBottom: '0.7rem',
          }}
        >
          <span
            style={{
              background: '#f5c000',
              borderRadius: '5px',
              padding: '0.15rem 0.5rem',
              fontWeight: 900,
              fontSize: '0.75rem',
              color: '#1f2d3d',
            }}
          >
            レバジョブ
          </span>
        </div>
        <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>
          本ページはPR（広告）です。
          <br />
          掲載情報は作成時点のものです。最新情報は公式サイトをご確認ください。
        </p>
        {/* A8.net ビーコン */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img width={1} height={1} src={A8_BEACON} alt="" style={{ display: 'none' }} />
      </footer>
    </div>
  );
}
