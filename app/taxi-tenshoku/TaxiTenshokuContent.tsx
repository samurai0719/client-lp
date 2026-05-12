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

/** FAQアイテム（回答常時表示） */
function FaqItem({ q, a }: { q: string; a: string }) {
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
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.8rem',
          padding: '1rem 1.1rem',
          textAlign: 'left',
        }}
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
      </div>
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
            タクシードライバーの転職は
            <br />
            <span style={{ color: '#c88500' }}>非公開求人</span>から
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
            ネットに出回っている求人だけで決めると、
            <br />
            ブラック求人をつかむリスクがあります。
            <br />
            まずは非公開求人を見てから、
            <br />
            転職するかどうか判断してください。
          </p>

          {/* 安心補足文 */}
          <p
            className="hero-enter"
            style={{
              fontSize: '0.8rem',
              color: '#3d6a9a',
              lineHeight: 1.75,
              marginTop: '0.85rem',
              padding: '0.8rem 1rem',
              background: 'rgba(255,255,255,0.75)',
              borderRadius: '10px',
              border: '1px solid rgba(91,127,163,0.22)',
              animationDelay: '0.23s',
            }}
          >
            公開求人だけでは分からない情報もあるため、
            非公開求人も合わせて見るのがおすすめです。
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
          FV直下 登録メリット3点バー
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div style={{ background: '#1a4099', padding: '1.5rem 1.2rem' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <p
            style={{
              color: '#f5c000',
              fontWeight: 800,
              fontSize: '0.72rem',
              textAlign: 'center',
              letterSpacing: '0.07em',
              marginBottom: '1rem',
            }}
          >
            登録すると、こんな求人が見られます
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {[
              { icon: '🌱', text: '未経験歓迎の非公開求人あり' },
              { icon: '📋', text: '二種免許取得サポートあり' },
              { icon: '✅', text: '面接1回求人も確認可能' },
            ].map(({ icon, text }) => (
              <div
                key={text}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  padding: '0.75rem 1rem',
                  border: '1px solid rgba(255,255,255,0.18)',
                }}
              >
                <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{icon}</span>
                <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', lineHeight: 1.35 }}>
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

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
          3. ブラック求人 注意喚起ブロック（NEW）
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Section
        style={{
          background: '#fff8f0',
          padding: '3rem 1.2rem',
          borderTop: '3px solid #f5a623',
        }}
      >
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          {/* 警告バッジ */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.2rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: '#f5a623',
                borderRadius: '20px',
                padding: '0.35rem 1rem',
                fontSize: '0.75rem',
                fontWeight: 800,
                color: '#fff',
                letterSpacing: '0.04em',
              }}
            >
              ⚠️ 転職前に知っておいてほしいこと
            </span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(1.1rem, 4.5vw, 1.45rem)',
              fontWeight: 900,
              textAlign: 'center',
              color: '#1f2d3d',
              lineHeight: 1.45,
              marginBottom: '1.4rem',
            }}
          >
            ネットに出回っている求人の中には、
            <br />
            <span style={{ color: '#c0392b' }}>条件が良く見えても</span>
            <br />
            実態が違う求人も存在します
          </h2>

          <p
            style={{
              fontSize: '0.87rem',
              color: '#4b5563',
              lineHeight: 1.8,
              marginBottom: '1.4rem',
            }}
          >
            求人サイトに掲載されている情報は、
            あくまで「会社が出したい情報」です。
            <br /><br />
            表向きには「高収入」「未経験OK」「働きやすい」と書いてあっても、
            実際に入社してみると「想定より収入が低い」「休みが取りにくい」
            といったミスマッチが起きるケースも少なくありません。
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.8rem',
            }}
          >
            {[
              {
                icon: '📋',
                text: '記載の月収はあくまで「目安」で、実際はかなり低いケースも',
              },
              {
                icon: '🕐',
                text: '残業・拘束時間が長く、実質の時給が低いことも',
              },
              {
                icon: '🔄',
                text: '離職率が高く、入社後すぐに辞める人が多い会社も',
              },
            ].map(({ icon, text }) => (
              <div
                key={text}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.8rem',
                  background: '#fff',
                  borderRadius: '12px',
                  padding: '0.9rem 1rem',
                  border: '1.5px solid #fce8d0',
                  boxShadow: '0 2px 8px rgba(200,100,0,0.06)',
                }}
              >
                <span style={{ fontSize: '1.3rem', lineHeight: 1, flexShrink: 0 }}>{icon}</span>
                <p style={{ fontSize: '0.85rem', color: '#4b3020', lineHeight: 1.55, fontWeight: 600 }}>
                  {text}
                </p>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: '1.6rem',
              padding: '1.1rem 1.2rem',
              background: 'linear-gradient(135deg, #c0392b 0%, #e74c3c 100%)',
              borderRadius: '14px',
              textAlign: 'center',
            }}
          >
            <p style={{ color: '#fff', fontWeight: 800, fontSize: '0.95rem', lineHeight: 1.6 }}>
              だからこそ、<br />
              <span style={{ color: '#ffe97a', fontSize: '1.05rem' }}>
                ネットで見られる求人だけで判断するのは
                少し危険かもしれません。
              </span>
            </p>
          </div>
        </div>
      </Section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          4. タクシードライバーのメリット
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
        </div>
      </Section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          5. なぜ優良求人は非公開なのか（NEW）
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
            知らないと損する話
          </p>
          <h2
            style={{
              fontSize: 'clamp(1.1rem, 4.5vw, 1.45rem)',
              fontWeight: 900,
              textAlign: 'center',
              color: '#1f2d3d',
              lineHeight: 1.45,
              marginBottom: '1.4rem',
            }}
          >
            なぜ、<span style={{ color: '#1a4099' }}>良い求人ほど</span>
            <br />
            表に出てこないのか？
          </h2>

          <p
            style={{
              fontSize: '0.87rem',
              color: '#4b5563',
              lineHeight: 1.8,
              marginBottom: '1.6rem',
            }}
          >
            条件の良いタクシー会社は、求人サイトに広く公開しなくても
            採用できることが多いです。
            <br /><br />
            転職エージェントを通じた紹介だけで定員が埋まってしまうため、
            一般公開する必要がないのです。
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.6rem' }}>
            {[
              {
                step: 'STEP 1',
                color: '#1a4099',
                title: '条件の良い会社は「応募が集まりすぎる」問題を避けたい',
                body: '公開すると大量の応募が来て、採用担当の工数が増えすぎてしまう。だから特定ルートだけで募集するケースが多い。',
              },
              {
                step: 'STEP 2',
                color: '#1a4099',
                title: '内部情報（給与体系・社風）を外に出したくない',
                body: '競合他社に知られたくない待遇条件や、社風・職場の雰囲気などは、エージェント経由でのみ伝えることが多い。',
              },
              {
                step: 'STEP 3',
                color: '#1a4099',
                title: 'ミスマッチを減らすため、エージェント経由を好む',
                body: '事前に求職者の条件や希望を絞り込んでくれるエージェント経由の方が、採用後のトラブルが少ない傾向がある。',
              },
            ].map(({ step, color, title, body }) => (
              <div
                key={step}
                style={{
                  background: '#f0f7ff',
                  borderRadius: '14px',
                  padding: '1.1rem 1.2rem',
                  borderLeft: `4px solid ${color}`,
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    color: '#fff',
                    background: color,
                    borderRadius: '4px',
                    padding: '0.1rem 0.5rem',
                    marginBottom: '0.5rem',
                    letterSpacing: '0.06em',
                  }}
                >
                  {step}
                </span>
                <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1f2d3d', marginBottom: '0.4rem', lineHeight: 1.4 }}>
                  {title}
                </p>
                <p style={{ fontSize: '0.8rem', color: '#4b5563', lineHeight: 1.65 }}>
                  {body}
                </p>
              </div>
            ))}
          </div>

          <div
            style={{
              padding: '1.2rem',
              background: 'linear-gradient(135deg, #1a4099 0%, #2255cc 100%)',
              borderRadius: '14px',
              textAlign: 'center',
            }}
          >
            <p style={{ color: '#f5c000', fontWeight: 800, fontSize: '0.95rem', lineHeight: 1.6 }}>
              つまり、転職サービスに登録しないと
              <br />
              <span style={{ color: '#fff', fontSize: '1.05rem' }}>
                そもそも見られない求人が多い
              </span>
            </p>
          </div>
        </div>
      </Section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          6. 公開求人 vs 非公開求人 比較（NEW）
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
            求人の種類
          </p>
          <h2
            style={{
              fontSize: 'clamp(1.1rem, 4vw, 1.4rem)',
              fontWeight: 900,
              textAlign: 'center',
              color: '#1f2d3d',
              lineHeight: 1.45,
              marginBottom: '1.6rem',
            }}
          >
            「公開求人」と「非公開求人」
            <br />
            何が違うの？
          </h2>

          {/* 比較カード */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
            }}
          >
            {/* 公開求人カード */}
            <div
              style={{
                background: '#fff',
                border: '2px solid #e0e0e0',
                borderRadius: '14px',
                padding: '1rem 0.9rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <div
                style={{
                  textAlign: 'center',
                  background: '#f0f0f0',
                  borderRadius: '8px',
                  padding: '0.4rem',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: '#666',
                  letterSpacing: '0.04em',
                }}
              >
                📢 公開求人
              </div>
              {[
                '誰でも閲覧・応募できる',
                '応募が集まりやすい傾向',
                '情報が表面的なことも多い',
                '条件が良く見えすぎる場合もある',
                '職場の内情は分かりにくい',
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.4rem',
                    fontSize: '0.75rem',
                    color: '#555',
                    lineHeight: 1.55,
                  }}
                >
                  <span style={{ color: '#bbb', flexShrink: 0, marginTop: '0.05rem' }}>▷</span>
                  {item}
                </div>
              ))}
            </div>

            {/* 非公開求人カード */}
            <div
              style={{
                background: '#fff',
                border: '2px solid #1a4099',
                borderRadius: '14px',
                padding: '1rem 0.9rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                boxShadow: '0 4px 16px rgba(26,64,153,0.12)',
              }}
            >
              <div
                style={{
                  textAlign: 'center',
                  background: '#1a4099',
                  borderRadius: '8px',
                  padding: '0.4rem',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: '#f5c000',
                  letterSpacing: '0.04em',
                }}
              >
                🔒 非公開求人
              </div>
              {[
                '登録者のみ閲覧可能',
                '条件の良い求人が含まれやすい',
                '給与や社風など内部情報が分かる',
                '担当者が事前に精査している',
                'ミスマッチを防ぎやすい',
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.4rem',
                    fontSize: '0.75rem',
                    color: '#1a3060',
                    lineHeight: 1.55,
                    fontWeight: 600,
                  }}
                >
                  <span style={{ color: '#f5c000', flexShrink: 0, marginTop: '0.05rem' }}>✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <p
            style={{
              fontSize: '0.68rem',
              color: '#8a9ab8',
              textAlign: 'center',
              marginTop: '0.8rem',
              lineHeight: 1.6,
            }}
          >
            ※すべての公開・非公開求人がこの特徴に当てはまるわけではありません。
            参考情報としてご覧ください。
          </p>

          <div
            style={{
              marginTop: '1.4rem',
              padding: '1.1rem 1.2rem',
              background: '#eef4ff',
              borderRadius: '12px',
              borderLeft: '4px solid #1a4099',
            }}
          >
            <p
              style={{
                fontSize: '0.88rem',
                color: '#1f2d3d',
                lineHeight: 1.7,
                fontWeight: 600,
              }}
            >
              非公開求人は、転職サービスに登録しないと
              そもそも見ることができません。
              <br />
              まず登録して、どんな求人があるかだけでも
              確認してみることをおすすめします。
            </p>
          </div>
        </div>
      </Section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          7. レバジョブ紹介ブロック（修正）
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
              marginBottom: '0.8rem',
            }}
          >
            面接1回求人や未経験歓迎の
            <br />
            <span style={{ color: '#1a4099' }}>非公開求人を探したいなら</span>、
            <br />
            レバジョブが有力です
          </h2>

          <p
            style={{
              fontSize: '0.85rem',
              color: '#4b5563',
              lineHeight: 1.8,
              textAlign: 'center',
              marginBottom: '1.6rem',
            }}
          >
            レバジョブはタクシードライバー転職に特化したサービス。
            担当者が事前に確認した求人のみを紹介しているため、
            入社後のミスマッチを減らしやすいのが特徴です。
          </p>

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
                title: 'タクシー特化だから、求人の質を絞り込める',
                body: 'タクシードライバーの求人に特化しているため、業界に詳しい担当者が条件や職場環境を把握。一般的な転職サイトより内部情報が充実しています。',
              },
              {
                num: '02',
                title: '最短1週間で内定が目指せる',
                body: '面接1回の非公開求人を多数保有。だからスピード転職が叶う。',
                note: '※レバジョブとしての2025年内定実績(登録~内定まで)',
              },
              {
                num: '03',
                title: '内定した方の90%が未経験からの転職',
                body: '業界を知り尽くしたプロが面倒な書類作成を代行。未経験転職のポイントを網羅しトータルでサポートするため、初めての転職でも安心です。',
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
          8. 条件例ブロック
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
          9. 不安解消FAQ
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
            <FaqItem
              q="登録したら、すぐに転職しないといけませんか？"
              a="そんなことはありません。まずは非公開求人を見て、条件が良ければ検討する、という流れで大丈夫です。登録後にしつこい営業を受けることもなく、転職するかどうかは自分のペースで決められます。"
            />
            <FaqItem
              q="求人を見るだけでも大丈夫ですか？"
              a="はい、大丈夫です。登録後は求人の確認だけでも問題ありません。「どんな求人があるか知りたい」という段階での登録も歓迎しています。気になる求人が見つかってから、次のステップを検討してください。"
            />
            <FaqItem
              q="しつこい連絡はありませんか？"
              a="ご安心ください。レバジョブでは、担当者から一方的にしつこく連絡を送ることはありません。ご自身のペースで転職活動を進めていただけます。不要な場合は、サポートを一時停止する旨を伝えていただければ対応してもらえます。"
            />
          </div>
        </div>
      </Section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          10. 最後のCTA（心理的ハードル低減強化）
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
            転職するかどうかは、
            <br />
            <span style={{ color: '#1a4099' }}>非公開求人を見てから</span>決めましょう
          </h2>

          <p
            style={{
              fontSize: '0.87rem',
              color: '#4b5563',
              lineHeight: 1.85,
              marginBottom: '1.4rem',
            }}
          >
            今すぐ転職しなくていいです。
            <br />
            まずは「どんな求人があるか」を
            確認するだけで十分です。
          </p>

          {/* 安心チェックリスト */}
          <div
            style={{
              background: '#f0f7ff',
              borderRadius: '14px',
              padding: '1.2rem',
              marginBottom: '1.6rem',
              textAlign: 'left',
            }}
          >
            {[
              '登録は30秒・完全無料',
              '見るだけでもOK、転職は任意',
              'しつこい連絡なし',
              '非公開求人を登録後すぐに確認できる',
              'ブラック求人を事前に避けやすくなる',
            ].map((item) => (
              <div
                key={item}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.7rem',
                  padding: '0.55rem 0',
                  borderBottom: '1px solid rgba(26,64,153,0.08)',
                  fontSize: '0.88rem',
                  color: '#1f2d3d',
                  fontWeight: 600,
                  lineHeight: 1.4,
                }}
              >
                <span style={{ color: '#1a4099', fontSize: '1.1rem', flexShrink: 0 }}>✓</span>
                {item}
              </div>
            ))}
          </div>

          <SectionImage
            src="https://static.wixstatic.com/media/5ebda9_6ad0a4c05da243e9ae2a5378e81b7589~mv2.png"
            alt="転職を考えているドライバーのイメージ"
          />

          {/* CTA直前 不安処理ボックス */}
          <div
            style={{
              marginTop: '1.8rem',
              background: '#fff8e1',
              border: '2px solid #f5c000',
              borderRadius: '14px',
              padding: '1.2rem 1.3rem',
              textAlign: 'left',
            }}
          >
            <p
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                color: '#c88500',
                letterSpacing: '0.05em',
                marginBottom: '0.7rem',
              }}
            >
              登録前に確認してください
            </p>
            {[
              '登録後すぐに応募ではありません',
              'まずは求人確認だけでOKです',
              '転職するかどうかは、あなたが決めます',
            ].map((text, i, arr) => (
              <div
                key={text}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.5rem 0',
                  borderBottom: i < arr.length - 1 ? '1px solid rgba(245,192,0,0.25)' : 'none',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  color: '#1f2d3d',
                  lineHeight: 1.4,
                }}
              >
                <span style={{ color: '#f5c000', fontSize: '1.2rem', flexShrink: 0 }}>★</span>
                {text}
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.4rem' }}>
            <CtaButton label="30秒の無料登録で求人を探しに行く" sub="レバジョブへ（無料）" />
          </div>

          <p
            style={{
              fontSize: '0.78rem',
              color: '#4b5563',
              marginTop: '1rem',
              lineHeight: 1.8,
              fontWeight: 500,
            }}
          >
            今の職場を辞めると決めなくていい。
            <br />
            「どんな求人があるか知りたい」
            <br />
            それだけで十分です。
          </p>

          <p
            style={{
              fontSize: '0.68rem',
              color: '#8a9ab8',
              marginTop: '0.8rem',
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
