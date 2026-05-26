'use client';

import { useState, useEffect, useRef, type ReactNode } from 'react';
import {
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Shield,
  FileText,
  Star,
  Droplets,
  Sun,
  Home,
  Search,
  Camera,
} from 'lucide-react';

// ─── CTAリンク先 — ここを変えるだけで全CTAが差し替わる ─────────────────────
const DESTINATION_LP_URL = '/gaiheki';

// ─── ファーストビュー画像 — PC/スマホを個別に差し替え可能 ───────────────────
const HERO_IMG_DESKTOP = 'https://static.wixstatic.com/media/5ebda9_7e6c91edccdd4a78bb86a0a1b573fcb6~mv2.png';
const HERO_IMG_MOBILE  = 'https://static.wixstatic.com/media/5ebda9_6241eb02d83749be949dec2810da37ec~mv2.png';

const BEFORE_IMG = 'https://static.wixstatic.com/media/5ebda9_c94aba7955a84b01b6e6cda114ec6d9a~mv2.png';
const AFTER_IMG  = 'https://static.wixstatic.com/media/5ebda9_06c8eaff4d3b45fcb0f524ab67c50ec0~mv2.png';
const LOGO_IMG   = 'https://static.wixstatic.com/media/5ebda9_759ae5aecbce476d806bbc03c12629a0~mv2.png';

// ─── スクロールフェードアップ (globals.css の section-fade / in-view を使用) ──
function useFadeUp() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const show = () => el.classList.add('in-view');
    // 既にビューポート内にある要素は即座に表示（タイトル等ページ上部の要素向け）
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      show();
      return () => {};
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show();
          observer.unobserve(el);
        }
      },
      { threshold: 0.07 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function FadeUp({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useFadeUp();
  return (
    <div
      ref={ref}
      className={`section-fade ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ─── 画像プレースホルダー ────────────────────────────────────────────────────
function ImgPlaceholder({
  aspect = '4/3',
  label = '画像エリア',
  className = '',
}: {
  aspect?: string;
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl ${className}`}
      style={{ aspectRatio: aspect }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #e4ecf6 0%, #d8e6f2 45%, #dde8f4 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(100,130,180,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(100,130,180,0.09) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"
          style={{
            backgroundColor: 'rgba(255,255,255,0.88)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          <Camera className="w-6 h-6 text-[#8a8f9a]" />
        </div>
        <span
          className="text-xs font-medium tracking-wide px-3 py-1 rounded-full"
          style={{ backgroundColor: 'rgba(255,255,255,0.72)', color: '#94a3b8' }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

// ─── セクションラベル（英文ラベル — .sec-title .en パターン）────────────────
function Label({ children, center = true }: { children: ReactNode; center?: boolean }) {
  return (
    <div className={`flex ${center ? 'justify-center' : ''} mb-3`}>
      <span className={center ? 'gaiheki-sec-en' : 'gaiheki-sec-en-left'}>
        {children}
      </span>
    </div>
  );
}

// ─── セクション見出し（Shippori Mincho B1 + h-markアンダーライン）──────────
function H2({
  children,
  light = false,
  center = false,
}: {
  children: ReactNode;
  light?: boolean;
  center?: boolean;
}) {
  return (
    <h2
      className={`gaiheki-font-mincho text-[1.65rem] sm:text-[1.9rem] leading-snug ${center ? 'text-center' : ''}`}
      style={{
        color: light ? '#ffffff' : '#28292a',
        fontWeight: 500,
        letterSpacing: '0.12em',
      }}
    >
      {children}
    </h2>
  );
}

// ─── オレンジCTAボタン（globals.css の gaiheki-cta-btn を再利用）────────────
function CtaPrimary({ label, sub }: { label: string; sub?: string }) {
  return (
    <a href={DESTINATION_LP_URL} className="gaiheki-cta-btn">
      <span className="gaiheki-cta-shine" aria-hidden />
      <span className="gaiheki-cta-btn-inner">
        <span className="text-[15px] leading-snug">{label}</span>
        {sub && <span className="text-xs font-normal opacity-80 mt-0.5">{sub}</span>}
      </span>
    </a>
  );
}

// ─── テキストリンクCTA ───────────────────────────────────────────────────────
function CtaLink({ label, light = false }: { label: string; light?: boolean }) {
  return (
    <a
      href={DESTINATION_LP_URL}
      className="inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity duration-150 hover:opacity-60 cursor-pointer"
      style={{
        color: light ? '#93c5fd' : '#1a3a6b',
        textDecoration: 'underline',
        textUnderlineOffset: '3px',
      }}
    >
      {label}
      <ArrowRight className="w-3.5 h-3.5" />
    </a>
  );
}

// ─── FAQ アコーディオン（デザイン仕様準拠）──────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid #ece6dc' }}>
      <button
        className="w-full flex items-start justify-between gap-3 py-[18px] text-left cursor-pointer bg-transparent border-0"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {/* Q マーク — Manrope風、オレンジ、背景なし */}
        <span
          className="shrink-0 text-[20px] font-black leading-[1.4]"
          style={{ color: '#e96a1f', fontFamily: '"Manrope", system-ui, sans-serif', letterSpacing: '-0.01em' }}
          aria-hidden
        >
          Q
        </span>
        <span className="flex-1 text-sm font-bold leading-snug text-left" style={{ color: '#28292a', lineHeight: 1.6 }}>
          {q}
        </span>
        {/* 円形シェブロン */}
        <span
          className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            border: open ? 'none' : '1.5px solid #d8cebd',
            background: open ? '#e96a1f' : 'transparent',
            color: open ? '#fff' : '#5a5f6c',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
          aria-hidden
        >
          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="2 4 6 8 10 4" />
          </svg>
        </span>
      </button>
      {/* グリッドアニメーションで展開 */}
      <div
        style={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.28s ease',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <p
            className="text-sm leading-relaxed"
            style={{
              color: '#5a5f6c',
              lineHeight: 1.9,
              padding: open ? '0 0 20px 32px' : '0 0 0 32px',
            }}
          >
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── ビフォーアフタースライダー ──────────────────────────────────────────────
function BeforeAfterSlider({ beforeImg, afterImg }: { beforeImg: string; afterImg: string }) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const calcPos = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const { left, width } = el.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - left) / width) * 100)));
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => { if (isDragging.current) calcPos(e.clientX); };
    const onUp = () => { isDragging.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-3xl select-none shadow-xl"
      style={{ aspectRatio: '16/10', cursor: 'col-resize', touchAction: 'none' }}
      onMouseDown={(e) => { isDragging.current = true; calcPos(e.clientX); e.preventDefault(); }}
      onTouchMove={(e) => calcPos(e.touches[0].clientX)}
      onTouchStart={(e) => calcPos(e.touches[0].clientX)}
    >
      {/* アフター画像（ベース） */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={afterImg} alt="施工後（アフター）" className="absolute inset-0 w-full h-full object-cover pointer-events-none" draggable={false} />
      {/* ビフォー画像（クリップ） */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={beforeImg}
        alt="施工前（ビフォー）"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        draggable={false}
      />
      {/* ラベル */}
      <span
        className="absolute top-3 left-3 z-10 text-white text-xs font-black px-3 py-1 rounded-full"
        style={{ background: 'rgba(10,22,40,0.70)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
      >
        BEFORE
      </span>
      <span
        className="absolute top-3 right-3 z-10 text-white text-xs font-black px-3 py-1 rounded-full"
        style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
      >
        AFTER
      </span>
      {/* 仕切り線 */}
      <div
        className="absolute inset-y-0 z-10 w-0.5 bg-white"
        style={{ left: `${pos}%`, transform: 'translateX(-50%)', boxShadow: '0 0 8px rgba(0,0,0,0.35)' }}
      />
      {/* ハンドル */}
      <div
        className="absolute z-20 top-1/2 w-11 h-11 rounded-full bg-white flex items-center justify-center"
        style={{
          left: `${pos}%`,
          transform: 'translateX(-50%) translateY(-50%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.28)',
          border: '3px solid white',
        }}
      >
        <svg viewBox="0 0 32 16" width="30" height="15" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polyline points="10 1 4 8 10 15" />
          <polyline points="22 1 28 8 22 15" />
        </svg>
      </div>
      {/* 操作ヒント（初期表示） */}
      <div
        className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 text-white text-[11px] font-medium px-3 py-1 rounded-full whitespace-nowrap"
        style={{ background: 'rgba(10,22,40,0.55)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
      >
        スライドして比較
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// メインコンポーネント
// ════════════════════════════════════════════════════════════════════════════
export default function GaihekiArticleLP() {
  return (
    <div className="gaiheki-article-lp min-h-dvh bg-white antialiased overflow-x-hidden" style={{ color: '#28292a' }}>
      {/* Shippori Mincho B1 + Manrope フォント — React 19 link hoisting */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Shippori+Mincho+B1:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap"
        rel="stylesheet"
      />

      {/* ── ヘッダー ────────────────────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          backgroundColor: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(226,232,240,0.6)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOGO_IMG}
              alt="Paint Net"
              className="w-[135px] sm:w-[165px] h-auto object-contain"
              loading="eager"
            />
          </div>
          <a
            href={DESTINATION_LP_URL}
            className="text-sm font-bold text-white px-5 py-2.5 rounded-xl cursor-pointer transition-all duration-150 hover:opacity-90 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              boxShadow: '0 2px 12px rgba(234,88,12,0.35)',
            }}
          >
            無料診断へ →
          </a>
        </div>
      </header>

      {/* ── 1. ファーストビュー — 画像のみ ─────────────────────────────── */}
      <section className="pt-16 sm:pt-20">
        {/* デスクトップ画像 (lg = 1024px 以上) */}
        <img
          src={HERO_IMG_DESKTOP}
          alt="外壁塗装のプロが施工するきれいな外壁イメージ"
          className="hidden lg:block w-full h-auto"
          loading="eager"
        />
        {/* モバイル・タブレット画像 (lg 未満 = スマホ・タブレット) */}
        <img
          src={HERO_IMG_MOBILE}
          alt="外壁塗装のプロが施工するきれいな外壁イメージ"
          className="block lg:hidden w-full h-auto"
          loading="eager"
        />
      </section>

      {/* ── 2. ペイントネットの強み ──────────────────────────────────────── */}
      <section
        className="relative py-14 sm:py-24"
        style={{
          backgroundImage: 'url(https://static.wixstatic.com/media/5ebda9_d91c62c59e6c4bc6aef3cb0848c36058~mv2.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* 文字を読みやすくする薄い白オーバーレイ */}
        <div className="absolute inset-0 bg-white/70 pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">

          <div className="text-center mb-8">
            {/* ロゴ画像 ＋ "の強み" — 横一行 */}
            <div className="flex flex-row items-center justify-center gap-3 sm:gap-4 mb-4 flex-nowrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={LOGO_IMG}
                alt="Paint Net"
                className="w-[140px] sm:w-[195px] h-auto object-contain shrink-0"
              />
              <p
                className="gaiheki-font-mincho text-2xl sm:text-3xl whitespace-nowrap"
                style={{ color: '#28292a', fontWeight: 600, letterSpacing: '0.1em' }}
              >
                の強み
              </p>
            </div>
            <p className="text-sm sm:text-base text-[#5a5f6c] max-w-md mx-auto leading-relaxed">
              東海エリアでの外壁塗装をサポートする、Paint Netならではのポイントをご紹介します。
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
            {[
              {
                n: '01',
                icon: Home,
                title: '地域密着で外壁塗装の相談がしやすい',
                desc: '岐阜・愛知・三重エリアに精通した地域密着型のサポートで、気軽にご相談いただける環境を整えています。',
              },
              {
                n: '02',
                icon: Star,
                title: '一級塗装技能士など、技術力のある職人をご紹介可能',
                desc: '高い技術を持つ職人が在籍する実績ある業者をご紹介します。安心して工事をお任せいただけます。',
              },
              {
                n: '03',
                icon: Search,
                title: '外壁の状態に合わせて、必要な工事だけを提案',
                desc: '過剰な工事を勧めず、実際の外壁の状態を診断した上で本当に必要な施工内容だけをご提案します。',
              },
              {
                n: '04',
                icon: Shield,
                title: '屋根なし・外壁のみなど、希望に合わせた相談が可能',
                desc: '「外壁だけ塗り替えたい」「屋根は後回しで」など、ご予算や状況に合わせて柔軟に対応します。',
              },
              {
                n: '05',
                icon: CheckCircle,
                title: '見積もりから施工後まで、安心して相談できる体制',
                desc: '見積もり・工事中・完了後のアフターフォローまで、一貫して相談できる窓口をご用意しています。',
              },
            ].map(({ n, icon: Icon, title, desc }, i) => (
              <FadeUp key={n} delay={i * 70} className={n === '05' ? 'sm:col-span-2' : ''}>
                <div
                  className="relative overflow-hidden rounded-lg p-5 sm:p-6 border hover:border-orange-200 hover:shadow-md transition-all duration-200 h-full"
                  style={{
                    borderColor: '#d8cebd',
                    backgroundColor: '#fff',
                    boxShadow: '0 1px 1px rgba(28,29,32,.03), 0 6px 18px -14px rgba(28,29,32,.18)',
                  }}
                >
                  <span
                    className="absolute -top-3 -right-1 text-8xl font-black opacity-[0.04] tabular-nums leading-none select-none pointer-events-none"
                    style={{ fontFamily: '"Manrope", system-ui, sans-serif', color: '#e96a1f' }}
                  >
                    {n}
                  </span>
                  <div className="flex items-start gap-4">
                    <div
                      className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center shadow-sm"
                      style={{ background: 'linear-gradient(135deg, #e96a1f 0%, #c9501a 100%)' }}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold leading-snug mb-1.5" style={{ color: '#28292a' }}>{title}</p>
                      <p className="text-xs leading-relaxed" style={{ color: '#5a5f6c' }}>{desc}</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. よくある失敗 ──────────────────────────────────────────────── */}
      <section
        className="relative py-14 sm:py-20"
        style={{
          backgroundImage: 'url(https://static.wixstatic.com/media/5ebda9_b84350cba9754741ba1ad76461c6d345~mv2.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-white/65 pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">

          {/* セクションタイトル画像「こんなお悩みありませんか？」 */}
          <div className="flex justify-center mb-8 px-2 sm:px-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://static.wixstatic.com/media/5ebda9_031e9f734b9142f6add320141ab4faf4~mv2.png"
              alt="こんなお悩みありませんか？"
              className="w-full max-w-[900px] sm:max-w-[1000px] h-auto object-contain"
              loading="lazy"
            />
          </div>

          {/* チェックリスト */}
          <div className="max-w-2xl mx-auto space-y-3">
            {[
              '塗装業者がありすぎて、どこに頼んだらいいかわからない',
              '悪質な業者に騙されそうで怖い',
              '地域密着店で優良店にお願いしたい',
              '適切な価格で外壁を塗装してもらいたい',
              '家を長持ちさせたい',
            ].map((text, i) => (
              <FadeUp key={i} delay={i * 60}>
                <div
                  className="flex items-center gap-4 rounded-lg px-5 py-4 border"
                  style={{
                    background: '#fbf8f4',
                    borderColor: '#d8cebd',
                    boxShadow: '0 1px 1px rgba(28,29,32,.03), 0 6px 18px -14px rgba(28,29,32,.18)',
                  }}
                >
                  {/* オレンジチェックアイコン */}
                  <div
                    className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
                  >
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <p className="text-sm sm:text-base font-semibold leading-snug" style={{ color: '#28292a' }}>
                    {text}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. 解決できる内容（旧:相見積もり） ──────────────────────────── */}
      <section
        className="relative py-16 sm:py-24"
        style={{
          backgroundImage: 'url(https://static.wixstatic.com/media/5ebda9_abbfd76b5340448896ea7e32f0329150~mv2.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-white/60 pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">

          {/* セクション3タイトル画像 */}
          <div className="flex justify-center mb-8 px-2 sm:px-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://static.wixstatic.com/media/5ebda9_ad58c00f70f54482b0873d887206257b~mv2.png"
              alt="そんなお悩み、ペイントネットなら解決できます"
              className="w-full max-w-[900px] sm:max-w-[1000px] h-auto object-contain"
              loading="lazy"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: '地域密着の優良店のみをご紹介',
                body: '一級塗装技能士の職人や、外壁塗装歴10年以上のベテラン職人など、技術力と実績のある優良店をご紹介します。',
                // ▼ 画像を差し替える場合: src を変更してください
                imgSrc: 'https://static.wixstatic.com/media/5ebda9_24f40d7d07e34c6bae724890486dc288~mv2.png',
                imgAlt: '地域密着の優良店のみをご紹介',
                cta: null,
              },
              {
                title: '岐阜のIT企業が運営',
                body: '大手企業との取引実績や提携実績がある岐阜のIT企業が運営しているため、悪質な塗装店をご紹介することはありません。安心してご相談いただけます。',
                imgSrc: 'https://static.wixstatic.com/media/5ebda9_3dff8aaf91f84704b911db4531e67f77~mv2.png',
                imgAlt: '岐阜のIT企業が運営',
                cta: { label: '運営企業の実績を見てみる', href: '/works' },
              },
              {
                title: 'ご自宅に合った適正価格をご案内',
                body: '安すぎる塗装店には注意が必要です。弊社では「高すぎず、安すぎず」を大切にし、お客様と相談しながら、ご自宅に合った適正価格をご案内します。',
                imgSrc: 'https://static.wixstatic.com/media/5ebda9_9507f0f37b9a43afade26f41bc20f676~mv2.png',
                imgAlt: 'ご自宅に合った適正価格をご案内',
                cta: null,
              },
              {
                title: '塗料は最低でもシリコン以上をご提案',
                body: '外壁を長持ちさせるためには、品質面を考えてもシリコン以上の塗料を使用することが大切です。耐久性も踏まえたうえで、適切な塗料をご提案します。',
                imgSrc: 'https://static.wixstatic.com/media/5ebda9_2eda3a35968f49c28561d1f1987b06c7~mv2.png',
                imgAlt: '塗料は最低でもシリコン以上をご提案',
                cta: null,
              },
            ].map(({ title, body, imgSrc, imgAlt, cta }, i) => (
              <FadeUp key={i} delay={i * 80}>
                <div
                  className="overflow-hidden rounded-2xl shadow-md h-full flex flex-col"
                  style={{ backgroundColor: 'rgba(255,255,255,0.92)', border: '1px solid rgba(220,232,244,0.8)' }}
                >
                  {/* ── 画像エリア ── 後から imgSrc に URL を入れてください */}
                  {imgSrc ? (
                    /* 実画像: 縦横比を維持して自然に表示（object-contain） */
                    <div className="w-full px-4 pt-4 pb-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imgSrc}
                        alt={imgAlt}
                        className="w-full h-auto object-contain rounded-xl"
                      />
                    </div>
                  ) : (
                    /* プレースホルダー: 16:9 固定エリア */
                    <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                      <div
                        className="absolute inset-0 flex flex-col items-center justify-center gap-2"
                        style={{
                          background: 'linear-gradient(135deg, #e4ecf6 0%, #d8e6f2 45%, #dde8f4 100%)',
                        }}
                      >
                        <Camera className="w-8 h-8 text-slate-300" />
                        <span className="text-xs font-medium text-[#8a8f9a] tracking-wide">画像を挿入予定</span>
                      </div>
                    </div>
                  )}

                  {/* ── コンテンツエリア ── */}
                  <div className="p-5 sm:p-6 flex flex-col flex-1">
                    {/* オレンジアクセントライン */}
                    <div
                      className="w-8 h-1 rounded-full mb-3"
                      style={{ background: 'linear-gradient(90deg, #f97316, #ea580c)' }}
                    />
                    <h3 className="text-base sm:text-[1.05rem] font-bold mb-2 leading-snug" style={{ color: '#0a1628' }}>
                      {title}
                    </h3>
                    <p className="text-sm text-[#5a5f6c] leading-relaxed">{body}</p>
                    {cta && (
                      <a
                        href={cta.href}
                        className="mt-4 inline-flex items-center justify-center w-full rounded-xl px-4 py-3 text-sm font-bold text-white transition-all duration-150 hover:opacity-90 active:scale-95"
                        style={{
                          background: 'linear-gradient(135deg, #f97316, #ea580c)',
                          boxShadow: '0 3px 12px rgba(234,88,12,0.35)',
                        }}
                      >
                        {cta.label}
                        <svg className="ml-2 w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polyline points="9 18 15 12 9 6" /></svg>
                      </a>
                    )}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={200} className="mt-10 text-center">
            <div className="flex justify-center">
              <div style={{ minWidth: '240px', width: '100%', maxWidth: '300px' }}>
                <CtaPrimary label="無料で相談する" sub="登録不要・完全無料" />
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── 5. 業者の見極め ──────────────────────────────────────────────── */}
      <section
        className="relative py-16 sm:py-24"
        style={{
          backgroundImage: 'url(https://static.wixstatic.com/media/5ebda9_1dc8203348f343d89fc51b2a24eb20b4~mv2.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* オーバーレイ: Tailwind の opacity modifier の代わりに inline style で確実に適用 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.45)' }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">

          {/* セクション4タイトル画像 */}
          <div className="flex justify-center mb-8 px-2 sm:px-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://static.wixstatic.com/media/5ebda9_41213cde587d4344b552e043139c9cfe~mv2.png"
              alt="信頼できる外壁塗装会社の選び方"
              className="w-full max-w-[900px] sm:max-w-[1000px] h-auto object-contain"
              loading="lazy"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

            {/* 左: チェックリスト */}
            <div className="space-y-3">
              {[
                {
                  title: '説明が分かりやすく、質問に丁寧に答えてくれる',
                  desc: '専門用語を多用せず、施主目線で話せる担当者かどうか確認しましょう。',
                  iconSrc: 'https://static.wixstatic.com/media/5ebda9_0659303679724573b8b2ab61832229cd~mv2.png', // icon1
                },
                {
                  title: '見積もりの内訳が細かく記載されている',
                  desc: '「一式○○円」だけの見積もりは要注意。材料名・数量・単価が明記されているか確認を。',
                  iconSrc: 'https://static.wixstatic.com/media/5ebda9_289ce999043d496395b6c70f179edfca~mv2.png', // icon2
                },
                {
                  title: '施工後の保証・アフターフォローが明確',
                  desc: '保証期間、対応範囲、連絡先がはっきりしているか。口頭だけでなく書面で確認しましょう。',
                  iconSrc: 'https://static.wixstatic.com/media/5ebda9_e4cdf06f766c4442b7f37bf674b49bc4~mv2.png', // icon3
                },
                {
                  title: '地域での施工実績がある',
                  desc: '地元の気候・建材・規制を知っている業者は、より適切な提案をしやすい傾向があります。',
                  iconSrc: 'https://static.wixstatic.com/media/5ebda9_e50da6ed8be84e539a2bb6d271238cc7~mv2.png', // icon4
                },
                {
                  title: '無理な営業・即決プレッシャーをかけない',
                  desc: '「今日だけの特別価格」などの言葉には注意。じっくり検討できる環境を大切にしてください。',
                  iconSrc: 'https://static.wixstatic.com/media/5ebda9_505ea8ebff114121b5ff65de4a9c9147~mv2.png', // icon5
                },
              ].map(({ title, desc, iconSrc }, i) => (
                <FadeUp key={i} delay={i * 60}>
                  <div
                    className="flex items-start gap-4 rounded-lg p-4 sm:p-5 border transition-all duration-200"
                    style={{
                      borderColor: '#d8cebd',
                      backgroundColor: '#ffffff',
                      boxShadow: '0 1px 1px rgba(28,29,32,.03), 0 6px 18px -14px rgba(28,29,32,.18)',
                    }}
                  >
                    {/* ── アイコンエリア（76×76px）── iconSrc に URL を入れると画像表示 */}
                    <div
                      className="shrink-0 w-[76px] h-[76px] overflow-hidden flex items-center justify-center p-1"
                      style={{
                        borderRadius: '18px',
                        background: '#ffffff',
                        border: '1px solid #d8cebd',
                      }}
                    >
                      {iconSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={iconSrc} alt={title} className="w-full h-full object-contain" />
                      ) : (
                        /* プレースホルダー（空白状態） */
                        <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" aria-hidden>
                          <rect x="4" y="4" width="24" height="24" rx="4" stroke="#c8d8e8" strokeWidth="1.5" strokeDasharray="3 2" />
                          <circle cx="12" cy="13" r="3" stroke="#c8d8e8" strokeWidth="1.5" />
                          <path d="M4 24l7-7 5 5 4-4 8 7" stroke="#c8d8e8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>

                    {/* ── テキストエリア ── */}
                    <div className="flex-1 min-w-0 pt-1">
                      {/* タイトル：h-mark.strong 仕様 — rgba(233,106,31,0.45) 58%-95% */}
                      <p className="text-sm font-bold mb-2 leading-snug">
                        <span
                          style={{
                            display: 'inline',
                            backgroundImage: 'linear-gradient(transparent 58%, rgba(233,106,31,0.45) 58%, rgba(233,106,31,0.45) 95%, transparent 95%)',
                            backgroundRepeat: 'no-repeat',
                            WebkitBoxDecorationBreak: 'clone',
                            boxDecorationBreak: 'clone',
                            padding: '0 0.08em',
                            color: '#28292a',
                          }}
                        >
                          {title}
                        </span>
                      </p>
                      <p className="text-xs text-[#5a5f6c] leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>

            {/* 右: 画像 [IMAGE_3] */}
            {/* ↓ ここに業者との打ち合わせ・丁寧な説明シーンを差し込む */}
            <FadeUp delay={120}>
              <div className="relative" style={{ isolation: 'isolate' }}>
                <div
                  className="absolute inset-0 rounded-3xl pointer-events-none"
                  style={{
                    backgroundColor: '#d8e6f0',
                    transform: 'translate(14px, 14px)',
                    zIndex: -1,
                  }}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://static.wixstatic.com/media/5ebda9_cde1eeda171946b784bdfbc98ad03fd1~mv2.png"
                  alt="信頼できる外壁塗装会社の特徴"
                  className="w-full h-auto rounded-2xl shadow-xl object-contain"
                  loading="lazy"
                />
                <div
                  className="absolute top-4 -left-3 sm:-left-5 z-10 bg-white rounded-2xl px-4 py-3 shadow-xl border"
                  style={{ borderColor: '#e2eaf4' }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: '#fff0e6' }}
                    >
                      <CheckCircle className="w-4 h-4 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#28292a]">地域密着の実績あり</p>
                      <p className="text-[10px] text-[#8a8f9a]">東海エリア対応</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── 5-A. セクション5直後 追加画像 ①② ─────────────────────────────── */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
          <FadeUp>
            {/* PC版 */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://static.wixstatic.com/media/5ebda9_1f907cc4851044ffa60cf22237cd911f~mv2.png"
              alt=""
              className="hidden md:block w-full h-auto rounded-xl shadow-md object-contain"
              loading="lazy"
            />
            {/* モバイル版 */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://static.wixstatic.com/media/5ebda9_0a2881d6bdf1404f934d61b1c90e8a58~mv2.png"
              alt=""
              className="block md:hidden w-full h-auto rounded-xl shadow-md object-contain"
              loading="lazy"
            />
          </FadeUp>
          <FadeUp delay={80}>
            {/* PC版 */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://static.wixstatic.com/media/5ebda9_0e6ee6f23c9e4c99ac827795c36833be~mv2.png"
              alt=""
              className="hidden md:block w-full h-auto rounded-xl shadow-md object-contain"
              loading="lazy"
            />
            {/* モバイル版 */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://static.wixstatic.com/media/5ebda9_b96f6e2d460f4d9383290a3628e96b40~mv2.png"
              alt=""
              className="block md:hidden w-full h-auto rounded-xl shadow-md object-contain"
              loading="lazy"
            />
          </FadeUp>
        </div>
      </div>

      {/* ── 6. 費用・塗料・時期 ──────────────────────────────────────────── */}
      <section
        className="py-16 sm:py-24"
        style={{ background: 'linear-gradient(160deg, #fffbf7 0%, #fff6ee 50%, #fffbf7 100%)' }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          <div className="text-center mb-8">
            <Label>基礎知識</Label>
            <H2 center>
              <span>費用・塗料・時期について</span>
              <br className="md:hidden" />
              <span>知っておきたいこと</span>
            </H2>
            <p className="mt-4 text-sm sm:text-base text-[#5a5f6c] max-w-md mx-auto leading-relaxed">
              外壁塗装を検討するうえで、最初に押さえておきたい基本情報です。
            </p>
          </div>

          <div className="space-y-4">
            {[
              { n: '1', orange: true,
                title: '工事費用は家の条件によって大きく変わる',
                body: '建物の大きさ・外壁の状態・使用する塗料によって、費用は数十万〜百万円以上の幅があります。「相場が分からない」という方こそ、複数社で比較することが大切です。' },
              { n: '2', orange: false,
                title: '塗料の種類で耐久年数が変わる',
                body: 'シリコン・フッ素・無機など、塗料によって耐久年数は5〜20年以上と大きく異なります。コストと耐久性のバランスを、専門家に相談しながら選ぶのがおすすめです。' },
              { n: '3', orange: false,
                title: '早めの確認が補修費を抑えるポイント',
                body: '外壁の劣化は放置すると下地まで傷みが広がり、補修費用が増加しやすくなります。「まだ大丈夫かな」という段階で専門家に確認してもらうのが賢い選択です。' },
              { n: '4', orange: false,
                title: '時期よりも業者選びの方が結果を左右する',
                body: '塗装は年間を通じて施工可能です。「いつ塗るか」よりも「どの業者に頼むか」の方が、仕上がりや満足度に大きく影響します。' },
            ].map(({ n, orange, title, body }, i) => (
              <FadeUp key={n} delay={i * 80}>
                <div
                  className="grid items-start rounded-lg p-5 sm:p-7 border transition-shadow duration-200"
                  style={{
                    gridTemplateColumns: 'auto 1fr',
                    gap: '1.25rem',
                    backgroundColor: orange ? '#fff3e8' : '#ffffff',
                    borderColor: '#d8cebd',
                    boxShadow: '0 1px 1px rgba(28,29,32,.03), 0 6px 18px -14px rgba(28,29,32,.18)',
                  }}
                >
                  <span
                    className="text-5xl sm:text-6xl font-black leading-none tabular-nums"
                    style={{
                      background: orange
                        ? 'linear-gradient(135deg, #f97316, #ea580c)'
                        : 'linear-gradient(135deg, #1a3a6b, #0a1628)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {n}
                  </span>
                  <div className="pt-1">
                    <p className="text-base font-bold text-[#28292a] mb-2">{title}</p>
                    <p className="text-sm text-[#5a5f6c] leading-relaxed">{body}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. 症状チェック ──────────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <div className="text-center mb-8">
            <Label>劣化サイン</Label>
            <H2 center>
              <span>こんな症状があるなら、</span>
              <br className="md:hidden" />
              <span>早めの確認がおすすめ</span>
            </H2>
            <p className="mt-4 text-sm sm:text-base text-[#5a5f6c] max-w-md mx-auto leading-relaxed">
              外壁・屋根の以下のサインは、塗装時期が近づいているサインかもしれません。
            </p>
          </div>

          {/* 劣化サイン 6カード — PC: 3列グリッド / モバイル: 横スクロール(scroll-snap) */}
          <FadeUp delay={80}>
            <div
              className="flex flex-nowrap overflow-x-auto gap-4 pb-4 -mx-4 px-[7.5vw] sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-3 lg:gap-5"
              style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
            >
              {[
                {
                  icon: Sun,
                  label: '色あせ・くすみ',
                  desc: '外壁の色が褪せてきたら、塗膜の保護機能が落ちているサインです。',
                  imgSrc: 'https://static.wixstatic.com/media/5ebda9_8c869e549ced431a88586252a279042b~mv2.png',
                },
                {
                  icon: AlertTriangle,
                  label: 'ひび割れ（クラック）',
                  desc: '細かいひびでも雨水が侵入し、下地の腐食につながる場合があります。',
                  imgSrc: 'https://static.wixstatic.com/media/5ebda9_1142950534184f00b6e657fba7b33c93~mv2.png',
                },
                {
                  icon: Droplets,
                  label: 'コケ・カビの発生',
                  desc: '湿気がたまりやすい北面などに多く見られます。塗膜が劣化しているサインです。',
                  imgSrc: 'https://static.wixstatic.com/media/5ebda9_8f3d0842e9944bbf982d25b8211e4774~mv2.png',
                },
                {
                  icon: Home,
                  label: 'チョーキング（白い粉）',
                  desc: '外壁を触ったときに白い粉がつく状態。塗料の寿命が近づいています。',
                  imgSrc: 'https://static.wixstatic.com/media/5ebda9_4f9d1a87d9a848b785832c952033b37d~mv2.png',
                },
                {
                  icon: Shield,
                  label: '雨漏り・防水の不安',
                  desc: '天井のシミや水まわりの湿気が気になる場合、外壁や屋根の防水性を確認することをおすすめします。',
                  imgSrc: 'https://static.wixstatic.com/media/5ebda9_cf57b1abd4974fddae593241b083937f~mv2.png',
                },
                {
                  icon: Search,
                  label: '外壁の浮き・剥がれ',
                  desc: '塗膜が浮いていたり剥がれている場合は、下地までダメージが及んでいる可能性があります。',
                  imgSrc: 'https://static.wixstatic.com/media/5ebda9_8e3547e6e19149328120f9c5c11f3dc5~mv2.png',
                },
              ].map(({ icon: Icon, label, desc, imgSrc }) => (
                <div
                  key={label}
                  className="flex-none w-[85vw] sm:w-auto overflow-hidden rounded-xl border hover:border-orange-200 hover:shadow-md transition-all duration-200"
                  style={{
                    borderColor: '#d8cebd',
                    backgroundColor: '#fff',
                    boxShadow: '0 1px 4px rgba(0,0,0,.06)',
                    scrollSnapAlign: 'center',
                  }}
                >
                  {/* カード上部: 画像 (16:9) */}
                  <div className="w-full overflow-hidden" style={{ aspectRatio: '16/9' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imgSrc}
                      alt={label}
                      className="w-full h-full object-cover object-center"
                      loading="lazy"
                    />
                  </div>
                  {/* カード下部: アイコン・タイトル・説明文 */}
                  <div className="p-4 sm:p-5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 shadow-sm"
                      style={{ backgroundColor: '#fff3e8' }}
                    >
                      <Icon className="w-5 h-5 text-orange-500" />
                    </div>
                    <p className="text-sm font-bold text-[#28292a] mb-1.5">{label}</p>
                    <p className="text-xs text-[#5a5f6c] leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>

          <FadeUp delay={200}>
            <div
              className="mt-8 rounded-lg p-5 sm:p-6 flex items-start gap-4 border"
              style={{ backgroundColor: '#fff8f2', borderColor: '#f5c79b' }}
            >
              <AlertTriangle className="shrink-0 w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-orange-800 mb-1">
                  1つでも当てはまるなら、早めの確認をおすすめします
                </p>
                <p className="text-xs text-orange-700 leading-relaxed">
                  外壁の劣化は時間が経つほど補修の範囲・費用が増えやすくなります。
                  まずは無料診断で現状をチェックしてみましょう。
                </p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── 8. ビフォーアフター ──────────────────────────────────────────── */}
      <section
        className="py-16 sm:py-24"
        style={{ backgroundColor: '#fbf8f4' }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <Label>施工事例</Label>
            <H2 center>ビフォーアフター</H2>
            <p className="mt-4 text-sm sm:text-base text-[#5a5f6c] max-w-md mx-auto leading-relaxed">
              スライダーを左右に動かして、施工前後の変化を比較してみてください。
            </p>
          </div>

          {[
            {
              beforeImg: 'https://static.wixstatic.com/media/5ebda9_173d632532d4472eb1e82ebbc8186348~mv2.jpg',
              afterImg:  'https://static.wixstatic.com/media/5ebda9_7edcb11055b74ec8ba666390d99a9aa4~mv2.jpg',
              meta: [
                { label: '建物規模', value: '30坪前後' },
                { label: '施工価格', value: '約90万円' },
                { label: '屋根塗装', value: 'なし' },
                { label: '使用塗料', value: 'シリコン塗料' },
              ],
            },
            {
              beforeImg: BEFORE_IMG,
              afterImg:  AFTER_IMG,
              meta: [
                { label: '建物規模', value: '40坪' },
                { label: '施工価格', value: '110万円' },
                { label: '屋根塗装', value: 'なし' },
                { label: '使用塗料', value: 'シリコン塗料' },
              ],
            },
            {
              beforeImg: 'https://static.wixstatic.com/media/5ebda9_4ba7e7b8af4f4a7d845983808fd79f7a~mv2.jpg',
              afterImg:  'https://static.wixstatic.com/media/5ebda9_a3a23d7598434ac8a4054b6d64e67c6b~mv2.jpg',
              meta: [
                { label: '建物規模', value: '40坪' },
                { label: '施工価格', value: '110万円' },
                { label: '屋根塗装', value: 'なし' },
                { label: '使用塗料', value: 'シリコン塗料' },
              ],
            },
          ].map(({ beforeImg, afterImg, meta }, caseIdx) => (
            <div key={caseIdx} className={caseIdx > 0 ? 'mt-16 sm:mt-20' : ''}>
              <FadeUp delay={80}>
                <BeforeAfterSlider beforeImg={beforeImg} afterImg={afterImg} />
              </FadeUp>
              <FadeUp delay={160}>
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {meta.map(({ label, value }) => (
                    <div
                      key={label}
                      className="rounded-lg p-4 text-center border"
                      style={{
                        backgroundColor: '#ffffff',
                        borderColor: '#d8cebd',
                        boxShadow: '0 1px 4px rgba(0,0,0,.06)',
                      }}
                    >
                      <p className="text-[11px] font-bold text-[#8a8f9a] uppercase tracking-wider mb-1.5">{label}</p>
                      <p className="text-sm font-bold text-[#28292a]">{value}</p>
                    </div>
                  ))}
                </div>
              </FadeUp>
            </div>
          ))}

          {/* ── 施工中の確認体制ギャラリー ──────────────────────────────────── */}
          <FadeUp delay={120} className="mt-20 sm:mt-28">
            <div className="text-center mb-8 sm:mb-10">
              <Label>施工中の確認体制</Label>
              <H2 center>施工中も、毎日しっかり確認</H2>
              <p className="mt-4 text-sm sm:text-base text-[#5a5f6c] max-w-lg mx-auto leading-relaxed">
                Paint Netでは、毎日職人さんとやりとりしながら、しっかり塗装されているかを確認しています。
                お客様にも安心していただけるよう、施工中の写真も共有しています。
              </p>
            </div>

            {/* PC版: 大1枚(2列) + 右縦 + 下3枚 */}
            <div className="hidden sm:grid sm:grid-cols-3 sm:gap-3 lg:gap-4">
              {/* Photo 1: 横長・2列スパン */}
              <div
                className="sm:col-span-2 overflow-hidden rounded-2xl"
                style={{ aspectRatio: '16/9', boxShadow: '0 6px 24px rgba(0,0,0,.13)' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://static.wixstatic.com/media/5ebda9_1fa62fdbcb624c2ca60610428642a680~mv2.jpg"
                  alt="施工中の確認①"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              {/* Photo 2: 右縦・高さはPhoto 1に合わせてグリッドが自動調整 */}
              <div
                className="overflow-hidden rounded-2xl"
                style={{ boxShadow: '0 6px 24px rgba(0,0,0,.13)' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://static.wixstatic.com/media/5ebda9_aff0a15cae5f4801aa9595b40e82e256~mv2.jpg"
                  alt="施工中の確認②"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              {/* Photos 3–5: 3列均等 */}
              {[
                { src: 'https://static.wixstatic.com/media/5ebda9_f441a414f6c341c69ecee68493c03523~mv2.jpg', alt: '施工中の確認③' },
                { src: 'https://static.wixstatic.com/media/5ebda9_2199224b2c924ff2bb3dfb4a007dd2f7~mv2.jpg', alt: '施工中の確認④' },
                { src: 'https://static.wixstatic.com/media/5ebda9_d83b87c756884854b2f4f0e61cb2088b~mv2.jpg', alt: '施工中の確認⑤' },
              ].map(({ src, alt }) => (
                <div
                  key={alt}
                  className="overflow-hidden rounded-2xl"
                  style={{ aspectRatio: '4/3', boxShadow: '0 6px 24px rgba(0,0,0,.13)' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>

            {/* スマホ版: 横スクロール */}
            <div
              className="sm:hidden flex gap-3 overflow-x-auto pb-3 -mx-4 px-[5vw]"
              style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
            >
              {[
                'https://static.wixstatic.com/media/5ebda9_1fa62fdbcb624c2ca60610428642a680~mv2.jpg',
                'https://static.wixstatic.com/media/5ebda9_aff0a15cae5f4801aa9595b40e82e256~mv2.jpg',
                'https://static.wixstatic.com/media/5ebda9_f441a414f6c341c69ecee68493c03523~mv2.jpg',
                'https://static.wixstatic.com/media/5ebda9_2199224b2c924ff2bb3dfb4a007dd2f7~mv2.jpg',
                'https://static.wixstatic.com/media/5ebda9_d83b87c756884854b2f4f0e61cb2088b~mv2.jpg',
              ].map((src, i) => (
                <div
                  key={i}
                  className="flex-none overflow-hidden rounded-2xl"
                  style={{
                    width: '78vw',
                    aspectRatio: '4/3',
                    boxShadow: '0 4px 16px rgba(0,0,0,.12)',
                    scrollSnapAlign: 'center',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`施工中の確認${i + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── 9. お客様の口コミ ─────────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <Label>お客様の声</Label>
            <H2 center>実際に利用されたお客様の口コミ</H2>
            <p className="mt-4 text-sm sm:text-base text-[#5a5f6c] max-w-md mx-auto leading-relaxed">
              東海エリアで外壁塗装を行ったお客様からいただいた率直なご感想です。
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                initial: 'K',
                name: 'K.T 様',
                area: '岐阜県 / 戸建て',
                rating: 5,
                text: '見た目がかなり綺麗になって、家全体が明るく見えるようになりました。価格も想定内で安心してお願いできました。外壁だけでこんなに印象が変わるとは思っていなかったので驚いています。',
              },
              {
                initial: 'M',
                name: 'M.S 様',
                area: '愛知県 / 戸建て',
                rating: 5,
                text: '担当の方の対応が丁寧で、工事の流れも分かりやすかったです。初めての塗装工事でしたが不安なく進められました。細かい質問にも親切に答えていただけて、とても信頼できました。',
              },
              {
                initial: 'H',
                name: 'H.N 様',
                area: '三重県 / 戸建て',
                rating: 5,
                text: '古く見えていた外壁が新築みたいな印象になって驚きました。費用と仕上がりのバランスにも満足しています。近所の方にも「きれいになったね」と言ってもらえてとても嬉しかったです。',
              },
            ].map(({ initial, name, area, rating, text }, i) => (
              <FadeUp key={name} delay={i * 80}>
                <div
                  className="rounded-lg p-6 border flex flex-col gap-4 h-full transition-shadow duration-200"
                  style={{
                    backgroundColor: '#ffffff',
                    borderColor: '#d8cebd',
                    boxShadow: '0 1px 1px rgba(28,29,32,.03), 0 6px 18px -14px rgba(28,29,32,.18)',
                  }}
                >
                  {/* 星評価 */}
                  <div className="flex gap-0.5">
                    {Array.from({ length: rating }).map((_, j) => (
                      <svg key={j} viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="#f97316" aria-hidden>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
                      </svg>
                    ))}
                  </div>
                  {/* 口コミ本文 */}
                  <p className="text-sm text-[#5a5f6c] leading-relaxed flex-1">
                    「{text}」
                  </p>
                  {/* 投稿者 */}
                  <div
                    className="flex items-center gap-3 pt-4 border-t"
                    style={{ borderColor: '#f1f5f9' }}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0"
                      style={{ background: 'linear-gradient(135deg, #1a3a6b 0%, #0a1628 100%)' }}
                    >
                      {initial}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#28292a]">{name}</p>
                      <p className="text-xs text-[#8a8f9a]">{area}</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. メインCTA ────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-16 sm:py-24"
        style={{ background: 'linear-gradient(160deg, #0a1628 0%, #1a3a6b 55%, #1e4a8a 100%)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 75% 50%, rgba(249,115,22,0.18) 0%, transparent 55%), radial-gradient(circle at 25% 50%, rgba(59,130,246,0.18) 0%, transparent 55%)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <FadeUp>
            <span className="inline-block text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#fb923c' }}>
              無料診断 / Free Diagnosis
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight mb-5">
              東海エリアで対応できる
              <br />外壁塗装会社を確認する
            </h2>
            <p className="text-base text-blue-100 leading-relaxed mb-8">
              30秒・7問のかんたん診断で、
              <br />あなたに合った進め方をご案内します。
            </p>
            <div className="flex flex-col items-center gap-4">
              <div style={{ minWidth: '260px', width: '100%', maxWidth: '320px' }}>
                <CtaPrimary label="無料で診断をはじめる" sub="登録不要・完全無料" />
              </div>
              <CtaLink label="相場と進め方を先に確認する" light />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── 11. FAQ ──────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-24" style={{ backgroundColor: '#fbf8f4' }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <Label>よくある質問</Label>
            <H2 center>はじめての方からよくいただくご質問</H2>
          </div>
          <div className="space-y-3">
            {[
              { q: 'まだ塗装するか決めていなくても相談できますか？',     a: 'もちろん大丈夫です。「まだ先かな」と思っている段階でも、現状を確認することで最適なタイミングが分かります。情報収集だけでもお気軽にどうぞ。' },
              { q: '相見積もりだけでもお願いできますか？',               a: 'はい、問題ありません。むしろ複数社の見積もりを比較することを推奨しています。比較することで適正価格と良い業者を見つけやすくなります。' },
              { q: 'しつこい営業はありませんか？',                       a: '当サービスでは、無理な営業・即決のプレッシャーは一切ありません。ご納得いただけるまでじっくりとご検討いただける環境を大切にしています。' },
              { q: 'どのタイミングで塗装を検討すべきですか？',           a: '一般的な目安は前回の塗装から10〜15年ですが、外壁の状態によって異なります。色あせ・ひび割れ・チョーキングなどのサインが見られたら、早めに専門家に確認してもらいましょう。' },
            ].map((item, i) => (
              <FadeUp key={i} delay={i * 60}>
                <FaqItem {...item} />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── 12. 最終CTA ───────────────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">

          {/* [IMAGE_5: 信頼感ビジュアル — 施工後の美しい外壁・満足した施主イメージ] */}
          {/* ↓ ここにフィナルCTA直前の信頼感を演出する横長画像を差し込む */}
          <FadeUp className="mb-10">
            <ImgPlaceholder
              aspect="16/5"
              label="信頼感ビジュアル（施工後イメージ）"
              className="shadow-lg"
            />
          </FadeUp>

          <FadeUp delay={100}>
            <div
              className="relative overflow-hidden rounded-3xl p-8 sm:p-12 text-center"
              style={{
                background: 'linear-gradient(145deg, #0a1628 0%, #1a3a6b 55%, #1e4a8a 100%)',
                boxShadow: '0 20px 60px rgba(10,22,40,0.28), 0 4px 16px rgba(10,22,40,0.12)',
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 20% 80%, rgba(249,115,22,0.12) 0%, transparent 40%), radial-gradient(circle at 80% 20%, rgba(59,130,246,0.12) 0%, transparent 40%)',
                }}
              />
              <div className="relative">
                <span className="inline-block text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#fb923c' }}>
                  Next Step
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight mb-3">
                  記事を読んで、次の一歩へ
                </h2>
                <p className="text-sm text-blue-100 leading-relaxed mb-8 max-w-sm mx-auto">
                  かんたんな診断に答えるだけで、東海エリアで対応できる会社と相場の目安が分かります。
                </p>
                <div className="flex justify-center gap-6 text-xs text-blue-200 mb-8">
                  {['登録不要', '完全無料', '営業なし'].map((t) => (
                    <span key={t} className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-orange-400" />
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <div style={{ minWidth: '260px', width: '100%', maxWidth: '320px' }}>
                    <CtaPrimary label="東海で対応できる会社を確認する" sub="30秒・7問のかんたん診断" />
                  </div>
                  <CtaLink label="相場と進め方を先に確認する" light />
                </div>
                <p className="mt-6 text-xs text-blue-300 opacity-60">
                  岐阜・愛知・三重エリアに対応しています
                </p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── フッター ─────────────────────────────────────────────────────── */}
      <footer className="border-t py-8" style={{ borderColor: '#ece6dc', backgroundColor: '#fbf8f4' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-2.5 mb-3">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-sm"
              style={{ background: 'linear-gradient(135deg, #1a3a6b, #0a1628)' }}
            >
              P
            </div>
            <span className="font-black text-sm" style={{ color: '#0a1628' }}>Paint Net</span>
          </div>
          <p className="text-xs text-[#8a8f9a] leading-relaxed">
            東海エリアの外壁塗装をサポートする情報サービスです。
            <br />© 2024 Paint Net. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
