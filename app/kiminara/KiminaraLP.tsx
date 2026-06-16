'use client';

import { useState } from 'react';

/* ─── Placeholder ─── */
function ImagePlaceholder({
  className = '',
  label,
  height,
}: {
  className?: string;
  label: string;
  height: string;
}) {
  return (
    <div
      className={className}
      style={{
        background: '#f3f6fb',
        border: '2px dashed #b8c7dd',
        borderRadius: '16px',
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#8fa3bc',
        fontSize: '14px',
        fontWeight: 500,
        textAlign: 'center',
        padding: '12px',
        width: '100%',
      }}
    >
      {label}
    </div>
  );
}

/* ─── Icon Placeholder ─── */
function IconPlaceholder({
  className = '',
  label,
  size,
}: {
  className?: string;
  label: string;
  size: number;
}) {
  return (
    <div
      className={className}
      style={{
        background: '#f3f6fb',
        border: '2px dashed #b8c7dd',
        borderRadius: '12px',
        width: size,
        height: size,
        minWidth: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#8fa3bc',
        fontSize: '10px',
        fontWeight: 500,
        textAlign: 'center',
      }}
    >
      {label}
    </div>
  );
}

/* ─── CTA Button ─── */
function CTAButton({ label = '無料で相談してみる' }: { label?: string }) {
  return (
    <div className="cta-wrap">
      <a href="#contact" className="cta-btn">
        {label}
      </a>
    </div>
  );
}

/* ─── FAQ Item ─── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        border: '1px solid #dde8f5',
        borderRadius: '12px',
        overflow: 'hidden',
        marginBottom: '12px',
        background: '#fff',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          textAlign: 'left',
          padding: '20px 24px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <span style={{ fontWeight: 700, fontSize: '16px', color: '#1e3a5f', lineHeight: 1.5 }}>
          Q. {q}
        </span>
        <span
          style={{
            fontSize: '22px',
            color: '#3b7dd8',
            transition: 'transform 0.3s',
            transform: open ? 'rotate(45deg)' : 'rotate(0)',
            flexShrink: 0,
          }}
        >
          +
        </span>
      </button>
      {open && (
        <div
          style={{
            padding: '0 24px 20px',
            color: '#445566',
            fontSize: '15px',
            lineHeight: 1.8,
            borderTop: '1px solid #eef3fb',
          }}
        >
          A. {a}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN LP COMPONENT
══════════════════════════════════════ */
export default function KiminaraLP() {
  return (
    <div style={{ fontFamily: '"Hiragino Kaku Gothic ProN", "Hiragino Sans", "Yu Gothic", system-ui, sans-serif', background: '#fff', color: '#1a2a3a', overflowX: 'hidden' }}>

      {/* ─── GLOBAL STYLES ─── */}
      <style>{`
        * { box-sizing: border-box; }
        .container { width: 100%; max-width: 1100px; margin: 0 auto; padding: 0 20px; }
        .section { padding: 72px 0; }
        .section-sm { padding: 48px 0; }
        .section-title {
          font-size: clamp(22px, 5vw, 34px);
          font-weight: 800;
          color: #1e3a5f;
          line-height: 1.4;
          text-align: center;
        }
        .section-title span { color: #3b7dd8; }
        .section-subtitle {
          text-align: center;
          color: #5a7a99;
          font-size: 16px;
          margin-top: 12px;
          line-height: 1.7;
        }
        .card {
          background: #fff;
          border: 1px solid #dde8f5;
          border-radius: 20px;
          padding: 28px 24px;
          box-shadow: 0 2px 16px rgba(59, 125, 216, 0.07);
        }
        .badge {
          display: inline-block;
          background: #e8f1ff;
          color: #3b7dd8;
          font-size: 12px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 20px;
          letter-spacing: 0.05em;
        }

        /* ── CTA Button (全ページ共通) ── */
        .cta-wrap {
          display: flex;
          justify-content: center;
          width: 100%;
          margin: 32px 0;
        }
        .cta-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 80%;
          max-width: 420px;
          min-height: 64px;
          padding: 20px 24px;
          border-radius: 999px;
          font-size: 19px;
          font-weight: 800;
          text-align: center;
          text-decoration: none;
          color: #1a1a2e;
          background: linear-gradient(135deg, #FFD93D 0%, #FFB800 100%);
          box-shadow: 0 6px 24px rgba(255, 184, 0, 0.45);
          letter-spacing: 0.02em;
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: pointer;
        }
        .cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(255, 184, 0, 0.55);
        }
        @media (min-width: 768px) {
          .cta-btn {
            max-width: 520px;
            min-height: 72px;
            font-size: 22px;
            padding: 22px 32px;
          }
        }

        /* Header */
        .header {
          background: #fff;
          border-bottom: 2px solid #e8f1ff;
          position: sticky;
          top: 0;
          z-index: 100;
          padding: 14px 20px;
        }
        .header-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .logo {
          font-size: 22px;
          font-weight: 900;
          color: #1e3a5f;
          letter-spacing: -0.02em;
        }
        .logo span { color: #3b7dd8; }

        /* FV */
        .fv {
          background: linear-gradient(135deg, #e8f1ff 0%, #f0f7ff 50%, #fff 100%);
          min-height: 88vh;
          display: flex;
          align-items: center;
          padding: 60px 0 56px;
        }
        .fv-inner {
          max-width: 760px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          width: 100%;
          gap: 0;
        }
        .fv-tag {
          display: inline-block;
          background: #3b7dd8;
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          padding: 6px 16px;
          border-radius: 20px;
          margin-bottom: 24px;
        }
        .fv-headline {
          font-size: clamp(28px, 7vw, 46px);
          font-weight: 900;
          line-height: 1.35;
          color: #1e3a5f;
          margin-bottom: 24px;
        }
        .fv-headline em {
          font-style: normal;
          color: #3b7dd8;
        }
        .fv-sub {
          font-size: clamp(15px, 3vw, 18px);
          color: #445566;
          line-height: 1.85;
          margin-bottom: 28px;
          max-width: 580px;
        }
        .fv-notes {
          background: #fff;
          border-left: 4px solid #FFB800;
          border-radius: 0 8px 8px 0;
          padding: 14px 20px;
          margin-bottom: 4px;
          text-align: left;
          width: 100%;
          max-width: 480px;
        }
        .fv-notes p {
          font-size: 15px;
          color: #5a7a99;
          margin: 5px 0;
          line-height: 1.6;
        }
        .fv-notes p::before { content: "✓ "; color: #FFB800; font-weight: 700; }

        /* Feature Cards */
        .feature-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          margin-top: 36px;
        }
        @media (min-width: 640px) {
          .feature-grid { grid-template-columns: repeat(3, 1fr); }
        }
        .feature-card {
          background: linear-gradient(135deg, #3b7dd8 0%, #2563c7 100%);
          color: #fff;
          border-radius: 16px;
          padding: 24px 20px;
          text-align: center;
        }
        .feature-card-num {
          font-size: 13px;
          font-weight: 700;
          opacity: 0.75;
          margin-bottom: 8px;
        }
        .feature-card-title {
          font-size: 17px;
          font-weight: 800;
          line-height: 1.4;
        }

        /* Problem Cards */
        .problem-card {
          background: #fff;
          border: 1.5px solid #dde8f5;
          border-radius: 16px;
          padding: 20px 20px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 14px;
          box-shadow: 0 2px 10px rgba(59, 125, 216, 0.06);
        }
        .problem-text {
          font-size: 16px;
          font-weight: 600;
          color: #1e3a5f;
          line-height: 1.6;
        }

        /* Need Section */
        .need-section { background: linear-gradient(180deg, #f0f7ff 0%, #fff 100%); }
        .need-emphasis {
          background: linear-gradient(135deg, #1e3a5f 0%, #2d5489 100%);
          border-radius: 16px;
          padding: 28px 28px;
          color: #fff;
          margin-top: 32px;
        }
        .need-emphasis p {
          font-size: clamp(17px, 3.5vw, 22px);
          font-weight: 800;
          line-height: 1.6;
          margin: 8px 0;
        }
        .need-emphasis p span { color: #FFD93D; }

        /* Reason Cards */
        .reason-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          margin-top: 36px;
        }
        @media (min-width: 640px) {
          .reason-grid { grid-template-columns: repeat(2, 1fr); }
        }
        .reason-card {
          background: #fff;
          border: 1.5px solid #dde8f5;
          border-radius: 20px;
          padding: 28px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          box-shadow: 0 2px 12px rgba(59, 125, 216, 0.07);
        }
        .reason-card-num {
          font-size: 13px;
          font-weight: 700;
          color: #3b7dd8;
          letter-spacing: 0.05em;
        }
        .reason-card-title {
          font-size: 18px;
          font-weight: 800;
          color: #1e3a5f;
        }
        .reason-card-text {
          font-size: 15px;
          color: #5a7a99;
          line-height: 1.8;
        }

        /* Comparison */
        .compare-section { background: #f0f7ff; }
        .compare-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          margin-top: 36px;
        }
        @media (min-width: 768px) {
          .compare-grid { grid-template-columns: repeat(3, 1fr); }
        }
        .compare-card {
          background: #fff;
          border: 1.5px solid #dde8f5;
          border-radius: 20px;
          padding: 28px 22px;
          box-shadow: 0 2px 12px rgba(59, 125, 216, 0.06);
        }
        .compare-card.highlight {
          background: linear-gradient(160deg, #e8f1ff 0%, #d5e8ff 100%);
          border: 2.5px solid #3b7dd8;
          position: relative;
        }
        .compare-card.highlight::before {
          content: "おすすめ";
          position: absolute;
          top: -14px;
          left: 50%;
          transform: translateX(-50%);
          background: #3b7dd8;
          color: #fff;
          font-size: 12px;
          font-weight: 800;
          padding: 4px 16px;
          border-radius: 20px;
        }
        .compare-label {
          font-size: 15px;
          font-weight: 800;
          color: #1e3a5f;
          margin-bottom: 18px;
          padding-bottom: 14px;
          border-bottom: 1px solid #dde8f5;
          text-align: center;
        }
        .compare-card.highlight .compare-label { color: #3b7dd8; }
        .compare-item {
          font-size: 14px;
          color: #445566;
          padding: 10px 0;
          border-bottom: 1px solid #eef3fb;
          line-height: 1.6;
          display: flex;
          gap: 8px;
          align-items: flex-start;
        }
        .compare-item::before { content: "・"; color: #8fa3bc; flex-shrink: 0; }
        .compare-card.highlight .compare-item::before { content: "✓"; color: #3b7dd8; font-weight: 700; }
        .compare-card.highlight .compare-item { color: #1e3a5f; font-weight: 600; }

        /* Cases */
        .case-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          margin-top: 36px;
        }
        @media (min-width: 768px) {
          .case-grid { grid-template-columns: repeat(2, 1fr); }
        }
        .case-card {
          background: #fff;
          border: 1.5px solid #dde8f5;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 2px 14px rgba(59, 125, 216, 0.07);
        }
        .case-profile {
          padding: 20px 20px 0;
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .case-profile-info { flex: 1; }
        .case-name {
          font-size: 15px;
          font-weight: 800;
          color: #1e3a5f;
        }
        .case-career {
          font-size: 13px;
          color: #5a7a99;
          margin-top: 4px;
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }
        .career-arrow {
          color: #3b7dd8;
          font-size: 16px;
          font-weight: 900;
        }
        .case-body { padding: 16px 20px 20px; }
        .case-label {
          font-size: 12px;
          font-weight: 700;
          color: #3b7dd8;
          background: #e8f1ff;
          padding: 3px 10px;
          border-radius: 10px;
          display: inline-block;
          margin-bottom: 6px;
        }
        .case-text {
          font-size: 14px;
          color: #445566;
          line-height: 1.7;
          margin-bottom: 12px;
        }
        .case-proposal {
          background: linear-gradient(135deg, #f0f7ff 0%, #e8f1ff 100%);
          border-radius: 10px;
          padding: 12px 14px;
        }

        /* Counselor */
        .counselor-section { background: #f0f7ff; }
        .counselor-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-top: 36px;
        }
        @media (min-width: 768px) {
          .counselor-grid { grid-template-columns: repeat(4, 1fr); }
        }
        .counselor-card {
          background: #fff;
          border: 1.5px solid #dde8f5;
          border-radius: 20px;
          padding: 24px 16px;
          text-align: center;
          box-shadow: 0 2px 12px rgba(59, 125, 216, 0.07);
        }
        .counselor-name {
          font-size: 14px;
          font-weight: 700;
          color: #1e3a5f;
          margin-top: 14px;
          line-height: 1.5;
        }

        /* Steps */
        .step-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
          margin-top: 40px;
          position: relative;
        }
        @media (min-width: 768px) {
          .step-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 24px;
          }
        }
        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 24px 16px;
          position: relative;
        }
        .step-item:not(:last-child)::after {
          content: "";
          position: absolute;
          background: #dde8f5;
        }
        @media (max-width: 767px) {
          .step-item:not(:last-child)::after {
            width: 2px;
            height: 40px;
            bottom: -20px;
            left: 50%;
            transform: translateX(-50%);
          }
        }
        @media (min-width: 768px) {
          .step-item:not(:last-child)::after {
            width: 100%;
            height: 2px;
            top: 36px;
            left: 50%;
            z-index: 0;
          }
        }
        .step-num {
          font-size: 11px;
          font-weight: 800;
          color: #3b7dd8;
          letter-spacing: 0.1em;
          margin-bottom: 10px;
        }
        .step-title {
          font-size: 16px;
          font-weight: 800;
          color: #1e3a5f;
          margin-top: 14px;
          margin-bottom: 8px;
        }
        .step-text {
          font-size: 14px;
          color: #5a7a99;
          line-height: 1.7;
        }

        /* Final CTA */
        .final-cta {
          background: linear-gradient(135deg, #1e3a5f 0%, #2d5489 100%);
          color: #fff;
          padding: 80px 20px;
          text-align: center;
        }
        .final-cta-title {
          font-size: clamp(24px, 5vw, 36px);
          font-weight: 900;
          line-height: 1.4;
          margin-bottom: 20px;
        }
        .final-cta-sub {
          font-size: clamp(15px, 3vw, 18px);
          opacity: 0.85;
          line-height: 1.8;
          margin-bottom: 8px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        /* Footer */
        .footer {
          background: #1a2a3a;
          color: #8fa3bc;
          text-align: center;
          padding: 32px 20px;
          font-size: 13px;
          line-height: 1.8;
        }
        .footer a { color: #8fa3bc; text-decoration: underline; }

        /* Need section image layout */
        .need-inner {
          display: flex;
          flex-direction: column;
          gap: 32px;
          align-items: center;
        }
        @media (min-width: 768px) {
          .need-inner {
            flex-direction: row;
            align-items: flex-start;
            gap: 48px;
          }
          .need-text-col { flex: 1; }
          .need-image-col { flex: 1; max-width: 50%; }
        }

        /* CTA セクション区切り */
        .cta-section {
          background: #fff;
          padding: 48px 20px 16px;
          text-align: center;
        }
        .cta-section-note {
          font-size: '13px';
          color: #8fa3bc;
          margin-top: -16px;
          margin-bottom: 16px;
        }
      `}</style>

      {/* ─── HEADER ─── */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">キミ<span>ナラ</span></div>
        </div>
      </header>

      {/* ─────────────────────────────────────
          1. FIRST VIEW
      ───────────────────────────────────── */}
      <section className="fv">
        <div className="fv-inner">
          <div className="fv-tag">20代の転職に</div>
          <h1 className="fv-headline">
            20代の転職、<br />
            <em>誰に相談するか</em>で<br />
            未来が変わる
          </h1>
          <p className="fv-sub">
            キミナラは、あなたに合う転職エージェントを紹介する<br />
            20代向け転職支援サービスです。
          </p>
          <div className="fv-notes">
            <p>転職サービスが多すぎて選べない方へ</p>
            <p>希望や性格に合うキャリアアドバイザーを紹介</p>
          </div>
          <CTAButton />
          <p style={{ fontSize: '13px', color: '#8fa3bc', marginTop: '-16px' }}>
            ※完全無料・登録3分
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────
          2. SERVICE DESCRIPTION
      ───────────────────────────────────── */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <p className="badge" style={{ display: 'block', textAlign: 'center', width: 'fit-content', margin: '0 auto 16px' }}>
            キミナラとは
          </p>
          <h2 className="section-title">
            キミナラは、あなたに合う<br />
            <span>転職エージェントを紹介する</span>サービスです
          </h2>
          <p className="section-subtitle">
            転職サイトや転職エージェントはたくさんあります。<br />
            しかし、本当に大切なのは"どのサービスを使うか"だけではなく、<br />
            "<strong>誰に相談するか</strong>"です。
          </p>

          <div style={{ maxWidth: '760px', margin: '28px auto 0', padding: '28px 28px', background: '#f0f7ff', borderRadius: '20px', lineHeight: 1.85, color: '#445566', fontSize: '16px' }}>
            キミナラでは、あなたの希望・悩み・性格・目指したいキャリアをもとに、相性の良いキャリアアドバイザーをご紹介します。
          </div>

          <div style={{ marginTop: '36px' }}>
            <ImagePlaceholder
              className="service-image-placeholder"
              label="ここにサービス説明画像"
              height="clamp(220px, 30vw, 320px)"
            />
          </div>

          <div className="feature-grid">
            {[
              { num: 'POINT 01', title: '20代の転職に特化' },
              { num: 'POINT 02', title: '希望や悩みを丁寧にヒアリング' },
              { num: 'POINT 03', title: '自分に合うアドバイザーを紹介' },
            ].map((item) => (
              <div key={item.num} className="feature-card">
                <div className="feature-card-num">{item.num}</div>
                <div className="feature-card-title">{item.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────
          3. PAIN POINTS
      ───────────────────────────────────── */}
      <section className="section" style={{ background: '#f9fbff' }}>
        <div className="container">
          <p className="badge" style={{ display: 'block', textAlign: 'center', width: 'fit-content', margin: '0 auto 16px' }}>
            よくあるお悩み
          </p>
          <h2 className="section-title">
            転職したいけど、<br />
            <span>こんな悩みありませんか？</span>
          </h2>

          <div style={{ maxWidth: '680px', margin: '40px auto 0' }}>
            {[
              '転職サイトが多すぎて、どれを使えばいいか分からない',
              '求人を見ても、自分に合っているか判断できない',
              'エージェントに登録したけど、担当者と合わなかった',
              '希望しない求人ばかり紹介された',
              '今の仕事がつらいけど、次に何をすればいいか分からない',
              'キャリアアップしたいけど、相談できる人がいない',
            ].map((text, i) => (
              <div key={i} className="problem-card">
                <IconPlaceholder
                  className="problem-icon-placeholder"
                  label="アイコン"
                  size={48}
                />
                <p className="problem-text">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────
          4. NEEDS SECTION
      ───────────────────────────────────── */}
      <section className="section need-section">
        <div className="container">
          <p className="badge" style={{ display: 'block', textAlign: 'center', width: 'fit-content', margin: '0 auto 16px' }}>
            あなただけじゃありません
          </p>
          <h2 className="section-title">
            そう思っている人は、<br />
            <span>実はたくさんいます</span>
          </h2>

          <div className="need-inner" style={{ marginTop: '40px' }}>
            <div className="need-text-col">
              <p style={{ fontSize: '16px', color: '#445566', lineHeight: 1.85, marginBottom: '28px' }}>
                20代の転職では、仕事内容・人間関係・年収・将来性など、悩みは人それぞれです。だからこそ、ひとりで求人を探すだけではなく、自分の状況を理解してくれる相談相手を見つけることが大切です。
              </p>
              <div className="need-emphasis">
                <p>「転職活動で大切なのは、<span>求人の数</span>だけではありません。」</p>
                <p>「あなたに合う<span>担当者と出会えるかどうか</span>です。」</p>
              </div>
            </div>
            <div className="need-image-col" style={{ width: '100%' }}>
              <ImagePlaceholder
                className="empathy-image-placeholder"
                label="ここに共感イメージ画像"
                height="clamp(260px, 40vw, 360px)"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="cta-section">
        <p style={{ color: '#5a7a99', marginBottom: '4px', fontSize: '16px' }}>まずは無料相談から始めてみませんか？</p>
        <CTAButton />
      </div>

      {/* ─────────────────────────────────────
          5. WHY KIMINARA
      ───────────────────────────────────── */}
      <section className="section" style={{ background: '#f0f7ff' }}>
        <div className="container">
          <p className="badge" style={{ display: 'block', textAlign: 'center', width: 'fit-content', margin: '0 auto 16px' }}>
            選ばれる理由
          </p>
          <h2 className="section-title">
            キミナラが<span>20代に選ばれる</span>理由
          </h2>

          <div className="reason-grid">
            {[
              {
                num: 'REASON 01',
                title: '自分に合うアドバイザーを紹介',
                text: '希望職種や転職理由、性格や悩みに合わせて、相性の良いキャリアアドバイザーを紹介します。',
              },
              {
                num: 'REASON 02',
                title: '20代の転職に強い',
                text: '未経験転職、キャリアチェンジ、営業職、IT業界など、20代の転職でよくある悩みに対応しやすいアドバイザーと出会えます。',
              },
              {
                num: 'REASON 03',
                title: '相談から始められる',
                text: 'まだ転職するか迷っている段階でも、自分の考えを整理しながら相談できます。',
              },
              {
                num: 'REASON 04',
                title: '完全無料で相談できる',
                text: 'カウンセリングは無料。まずは気軽に相談できます。',
              },
            ].map((item, i) => (
              <div key={i} className="reason-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <IconPlaceholder
                    className="reason-icon-placeholder"
                    label="理由アイコン"
                    size={64}
                  />
                  <div>
                    <div className="reason-card-num">{item.num}</div>
                    <div className="reason-card-title">{item.title}</div>
                  </div>
                </div>
                <p className="reason-card-text">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────
          6. COMPARISON
      ───────────────────────────────────── */}
      <section className="section compare-section">
        <div className="container">
          <p className="badge" style={{ display: 'block', textAlign: 'center', width: 'fit-content', margin: '0 auto 16px' }}>
            他との違い
          </p>
          <h2 className="section-title">
            自分で探す転職活動と、<br />
            <span>キミナラの違い</span>
          </h2>

          <div className="compare-grid">
            <div className="compare-card">
              <div className="compare-label">自分で転職サイトを使う</div>
              {[
                '求人が多すぎて選びにくい',
                '自分に合う求人か判断しづらい',
                '相談相手がいない',
              ].map((t, i) => <div key={i} className="compare-item">{t}</div>)}
            </div>

            <div className="compare-card">
              <div className="compare-label">自分で転職エージェントを選ぶ</div>
              {[
                '担当者との相性に左右される',
                '希望と違う求人を紹介されることもある',
                '登録してみないと分からない',
              ].map((t, i) => <div key={i} className="compare-item">{t}</div>)}
            </div>

            <div className="compare-card highlight">
              <div className="compare-label">キミナラを使う</div>
              {[
                '希望や悩みに合わせて相談できる',
                '自分に合うアドバイザーを紹介',
                'ひとりで迷わず転職活動を進めやすい',
              ].map((t, i) => <div key={i} className="compare-item">{t}</div>)}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="cta-section">
        <CTAButton />
      </div>

      {/* ─────────────────────────────────────
          7. CASE STUDIES
      ───────────────────────────────────── */}
      <section className="section" style={{ background: '#f9fbff' }}>
        <div className="container">
          <p className="badge" style={{ display: 'block', textAlign: 'center', width: 'fit-content', margin: '0 auto 16px' }}>
            転職事例
          </p>
          <h2 className="section-title">
            キミナラを利用した<span>転職事例</span>
          </h2>

          <div className="case-grid">
            {[
              {
                name: '24歳女性',
                from: '事務職',
                to: 'エンジニア職',
                q: '今まで事務職で働いてきたが、思い切ってエンジニアになろうと思っている。',
                a: '未経験でもエンジニア業界への紹介実績のあるエージェントをご紹介。',
              },
              {
                name: '27歳女性',
                from: '広告運用',
                to: 'SaaS会社のマーケター',
                q: 'WEBの広告運用で4年。疲弊してしまい転職を決意。4年間得たWEBの知識を活かした転職をしたい。',
                a: 'IT専門のエージェントをご紹介。',
              },
              {
                name: '22歳女性',
                from: '事務職',
                to: 'BtoBコンサルタント',
                q: '希望配属につけず事務を経験。営業職で稼ぎたく転職を希望。',
                a: '若手特化の転職アドバイザーを紹介。',
              },
              {
                name: '27歳男性',
                from: 'メーカー系営業',
                to: '人材コンサルタント',
                q: 'もっと人の役に立つ仕事や、キャリア・業界の知識を深められる仕事がしたい。',
                a: 'HR専門のアドバイザーをご紹介。',
              },
              {
                name: '24歳男性',
                from: '未経験',
                to: '最新ITシステムの営業',
                q: 'IT系の仕事に興味があるが、未経験での転職に不安があった。',
                a: 'IT系やベンチャー企業に特化したアドバイザーを紹介。',
              },
            ].map((c, i) => (
              <div key={i} className="case-card">
                <ImagePlaceholder
                  className="case-image-placeholder"
                  label="ここに転職事例画像"
                  height="clamp(200px, 28vw, 240px)"
                />
                <div className="case-profile">
                  <div className="case-profile-info">
                    <div className="case-name">{c.name}</div>
                    <div className="case-career">
                      <span>{c.from}</span>
                      <span className="career-arrow">→</span>
                      <span style={{ color: '#3b7dd8', fontWeight: 700 }}>{c.to}</span>
                    </div>
                  </div>
                </div>
                <div className="case-body">
                  <div className="case-label">相談内容</div>
                  <p className="case-text">「{c.q}」</p>
                  <div className="case-proposal">
                    <div className="case-label" style={{ background: '#d5e8ff' }}>キミナラの提案</div>
                    <p className="case-text" style={{ marginBottom: 0 }}>{c.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────
          8. COUNSELORS
      ───────────────────────────────────── */}
      <section className="section counselor-section">
        <div className="container">
          <p className="badge" style={{ display: 'block', textAlign: 'center', width: 'fit-content', margin: '0 auto 16px' }}>
            アドバイザー紹介
          </p>
          <h2 className="section-title">
            あなたに合う<span>カウンセラー・アドバイザー</span>をご紹介
          </h2>
          <p className="section-subtitle">
            キミナラでは、あなたの希望や悩みを丁寧にヒアリングし、<br />
            相性の良いキャリアアドバイザーを選定します。<br />
            転職の方向性がまだ決まっていない方でも、まずは相談から始められます。
          </p>

          <div className="counselor-grid">
            {[
              '20代転職に強いアドバイザー',
              '未経験転職に強いアドバイザー',
              'IT・営業職に強いアドバイザー',
              '女性の転職相談に強いアドバイザー',
            ].map((name, i) => (
              <div key={i} className="counselor-card">
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div
                    className="counselor-image-placeholder"
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      background: '#f3f6fb',
                      border: '2px dashed #b8c7dd',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#8fa3bc',
                      fontSize: '11px',
                      fontWeight: 500,
                    }}
                  >
                    カウンセラー画像
                  </div>
                </div>
                <p className="counselor-name">{name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="cta-section">
        <CTAButton />
      </div>

      {/* ─────────────────────────────────────
          9. STEPS
      ───────────────────────────────────── */}
      <section className="section" style={{ background: '#f0f7ff' }}>
        <div className="container">
          <p className="badge" style={{ display: 'block', textAlign: 'center', width: 'fit-content', margin: '0 auto 16px' }}>
            ご利用の流れ
          </p>
          <h2 className="section-title">
            <span>無料相談</span>までの流れ
          </h2>

          <div className="step-grid">
            {[
              { num: 'STEP 01', title: '無料相談に申し込み', text: 'まずはフォームから簡単に申し込み。' },
              { num: 'STEP 02', title: '希望や悩みをヒアリング', text: '転職理由や希望条件、将来の方向性を丁寧に確認します。' },
              { num: 'STEP 03', title: 'あなたに合うアドバイザーを紹介', text: 'ヒアリング内容をもとに、相性の良いキャリアアドバイザーをご紹介します。' },
              { num: 'STEP 04', title: '転職活動をスタート', text: '紹介されたアドバイザーと一緒に、求人探しや選考対策を進めます。' },
            ].map((step, i) => (
              <div key={i} className="step-item">
                <div className="step-num">{step.num}</div>
                <IconPlaceholder
                  className="step-icon-placeholder"
                  label="STEPアイコン"
                  size={72}
                />
                <div className="step-title">{step.title}</div>
                <p className="step-text">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────
          10. FAQ
      ───────────────────────────────────── */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <p className="badge" style={{ display: 'block', textAlign: 'center', width: 'fit-content', margin: '0 auto 16px' }}>
            よくある質問
          </p>
          <h2 className="section-title">
            <span>FAQ</span>
          </h2>

          <div style={{ maxWidth: '680px', margin: '40px auto 0' }}>
            <FAQItem
              q="相談は無料ですか？"
              a="はい。無料で相談できます。"
            />
            <FAQItem
              q="転職するか決まっていなくても相談できますか？"
              a="はい。まずは今の悩みや希望を整理するところから相談できます。"
            />
            <FAQItem
              q="オンライン相談はできますか？"
              a="はい。オンラインでの相談にも対応しています。"
            />
            <FAQItem
              q="紹介されたアドバイザーと合わなかった場合は？"
              a="合わないと感じた場合は、再度ヒアリングのうえ別のアドバイザーを紹介してもらえる可能性があります。"
            />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────
          11. FINAL CTA
      ───────────────────────────────────── */}
      <section style={{ background: '#fff', paddingBottom: 0 }}>
        <ImagePlaceholder
          className="final-cta-image-placeholder"
          label="ここに最終CTA画像"
          height="clamp(300px, 35vw, 420px)"
        />
      </section>

      <section className="final-cta" id="contact">
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <h2 className="final-cta-title">
            20代の転職は、<br />
            ひとりで悩まず相談から
          </h2>
          <p className="final-cta-sub">
            自分に合う仕事、自分に合う担当者を見つけたい方は、<br />
            まずは無料相談から始めてみませんか？
          </p>
          <CTAButton />
          <p style={{ marginTop: '-12px', fontSize: '13px', opacity: 0.65 }}>
            ※完全無料・登録3分・オンライン対応
          </p>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="footer">
        <p style={{ marginBottom: '8px', fontWeight: 700, color: '#b8c7dd', fontSize: '15px' }}>キミナラ</p>
        <p>20代向け転職エージェント紹介サービス</p>
        <p style={{ marginTop: '16px', fontSize: '12px', color: '#6a8099' }}>
          ※転職成功を保証するものではありません。
        </p>
        <p style={{ marginTop: '12px', fontSize: '12px', color: '#4a6070' }}>
          © 2025 キミナラ All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
