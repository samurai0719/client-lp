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
const CTA_LABEL = '一級塗装技能士を紹介してもらう';
const CTA_NOTICE = '※一級塗装技能士の数には限りがあります。人気なサービスのためお待ちいただく可能性があります。';
// 全CTA(CtaNotice+CtaPrimaryのラッパー)共通の幅: モバイルは画面幅の約80%、PCはやや存在感のある最小幅
const CTA_WRAPPER_CLASS = 'w-[80vw] max-w-none mx-auto shrink-0 md:w-[420px] md:max-w-none';

function CtaNotice({ light = false }: { light?: boolean }) {
  return (
    <p
      className="mb-3 text-xs sm:text-sm text-center leading-relaxed"
      style={{ color: light ? 'rgba(219,234,254,0.85)' : '#5a5f6c' }}
    >
      {CTA_NOTICE}
    </p>
  );
}

// ─── ファーストビュー画像 — PC/スマホを個別に差し替え可能 ───────────────────
const HERO_IMG_DESKTOP = 'https://static.wixstatic.com/media/5ebda9_2c6720f518e84b18a9effd28d3b29944~mv2.png';
const HERO_IMG_MOBILE  = 'https://static.wixstatic.com/media/5ebda9_af7b870f6ff8427ea38ebeda8b99021e~mv2.png';

const BEFORE_IMG = 'https://static.wixstatic.com/media/5ebda9_c94aba7955a84b01b6e6cda114ec6d9a~mv2.png';
const AFTER_IMG  = 'https://static.wixstatic.com/media/5ebda9_837a33b2523f44e69904a1d7092d798b~mv2.png';
const LOGO_IMG   = 'https://static.wixstatic.com/media/5ebda9_759ae5aecbce476d806bbc03c12629a0~mv2.png';

// ─── 「ペイントネットの強み」セクション背景の控えめな職人写真アクセント ─────────
const STRENGTH_BG_PATTERN_IMG = 'https://static.wixstatic.com/media/5ebda9_909f09146d354b629e732b00dda1e325~mv2.png';

// ─── 「施工中の確認体制」セクション追加写真 — 準備〜施工の様子（全体表示・contain） ──
const PREP_PHOTO_IMG    = 'https://static.wixstatic.com/media/5ebda9_59fde646b4cd47509014fca067fe5dcb~mv2.png';
const PAINTING_PHOTO_IMG = 'https://static.wixstatic.com/media/5ebda9_5cc308a312c841bd8ff99d2769519443~mv2.png';

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
      className={`gaiheki-font-mincho text-balance break-keep [overflow-wrap:normal] text-[1.65rem] sm:text-[1.9rem] leading-[1.5] ${center ? 'text-center' : ''}`}
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

// ─── 見出しテキスト: モバイルは行ごとに改行＋マーカー、PCは1本のマーカーで連続表示 ──
// lines: モバイルで表示する自然な改行単位（各行に均等にマーカーが付く）
// full: PCで1行に収まる場合の全文（マーカーが途切れず連続する）
function HeadingLines({ lines, full }: { lines: string[]; full: string }) {
  return (
    <>
      <span className="md:hidden">
        {lines.flatMap((line, i) => [
          i > 0 ? <br key={`br-${line}`} /> : null,
          <span key={line} className="heading-highlight inline-block w-fit">
            {line}
          </span>,
        ])}
      </span>
      <span className="heading-highlight hidden md:inline-block md:w-fit">{full}</span>
    </>
  );
}

// ─── オレンジCTAボタン（globals.css の gaiheki-cta-btn を再利用）────────────
function CtaPrimary({ label, sub }: { label: string; sub?: string }) {
  return (
    <a href={DESTINATION_LP_URL} className="gaiheki-cta-btn">
      <span className="gaiheki-cta-shine" aria-hidden />
      <span className="gaiheki-cta-btn-inner">
        <span className="text-[15px] leading-normal text-center break-keep [overflow-wrap:anywhere]">
          {label === CTA_LABEL ? (
            <>
              <span className="inline-block">一級塗装技能士を</span>
              <span className="inline-block">紹介してもらう</span>
            </>
          ) : (
            label
          )}
        </span>
        {sub && <span className="text-xs font-normal opacity-80 mt-1">{sub}</span>}
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

// ─── 装飾用 inline SVG（背景の有機的シェイプ＋資格・職人イラスト群） ──────────
// 配色: ネイビー #1E3A5F / オレンジ #F97316 / 薄ブルー #EAF5FF / 薄オレンジ #FFF3E8 / 薄グレー #F8FAFC / 白
const SVG_NAVY = '#1E3A5F';
const SVG_ORANGE = '#F97316';
const SVG_BLUE_BG = '#EAF5FF';
const SVG_BEIGE_BG = '#FFF3E8';
const SVG_GRAY_BG = '#F8FAFC';
const SVG_WHITE = '#FFFFFF';
const SVG_BEIGE_LIGHT = '#FFFBF5';
const SVG_GRAY_LINE = '#64748B';

// セクション背景に敷く大きな波形（淡い色を重ねた柔らかいレイヤー）
function SoftWaveBg({
  className = 'w-full h-auto',
  tone = 'light',
}: {
  className?: string;
  tone?: 'light' | 'navy';
}) {
  if (tone === 'navy') {
    return (
      <svg className={className} viewBox="0 0 800 400" fill="none" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 120C140 50 240 95 380 120C530 147 620 60 800 100V400H0V120Z" fill={SVG_WHITE} opacity="0.05" />
        <path d="M0 190C150 130 260 175 400 145C550 113 660 168 800 120V400H0V190Z" fill={SVG_ORANGE} opacity="0.10" />
        <path d="M30 260C170 210 300 275 450 225C580 182 690 200 770 175" stroke={SVG_WHITE} strokeWidth="3" strokeLinecap="round" opacity="0.16" />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 800 500" fill="none" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 120C120 40 220 80 340 110C480 145 560 40 800 90V500H0V120Z" fill={SVG_BLUE_BG} opacity="0.75" />
      <path d="M0 210C130 140 250 190 390 160C540 128 640 190 800 130V500H0V210Z" fill={SVG_BEIGE_BG} opacity="0.8" />
      <path d="M40 310C180 250 300 330 450 270C570 220 680 240 760 210" stroke={SVG_WHITE} strokeWidth="8" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
}

// セクション角に添える柔らかいblob形状（低opacityで背景の邪魔をしない）
function OrganicBlob({
  className = 'w-64 h-64',
  color = SVG_BLUE_BG,
  opacity = 0.5,
}: {
  className?: string;
  color?: string;
  opacity?: number;
}) {
  return (
    <svg className={className} viewBox="0 0 400 400" fill="none" aria-hidden="true">
      <path
        d="M200 40C260 35 330 70 355 130C380 190 365 265 310 310C255 355 175 365 120 330C65 295 35 225 45 160C55 95 140 45 200 40Z"
        fill={color}
        opacity={opacity}
      />
    </svg>
  );
}

// ファーストビュー: 資格バッジ（メダル＋リボン＋チェック）
function CertificationBadgeSvg({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 160 160" fill="none" aria-hidden="true">
      <circle cx="80" cy="70" r="46" fill={SVG_BEIGE_BG} />
      <circle cx="80" cy="70" r="34" fill="none" stroke={SVG_NAVY} strokeWidth="5" />
      <path d="M64 70L75 81L98 56" fill="none" stroke={SVG_ORANGE} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M62 110L52 146L80 130L108 146L98 110" fill={SVG_BLUE_BG} stroke={SVG_NAVY} strokeWidth="4" strokeLinejoin="round" />
    </svg>
  );
}

// 悩みセクション: 家＋クエスチョン＋見積書＋虫眼鏡
function InspectionHouseSvg({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 220 180" fill="none" aria-hidden="true">
      <path d="M20 86L86 30L152 86" stroke={SVG_NAVY} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M38 82V148H134V82" fill={SVG_WHITE} stroke={SVG_NAVY} strokeWidth="7" strokeLinejoin="round" />
      <path d="M70 148V112H102V148" fill={SVG_BLUE_BG} stroke={SVG_NAVY} strokeWidth="6" strokeLinejoin="round" />
      <path d="M68 50c0 -9 7 -15 14 -15c8 0 14 5.5 14 12.5c0 7 -5.5 9.5 -9.5 12.5c-3 2.2 -4.5 5 -4.5 8.5" fill="none" stroke={SVG_ORANGE} strokeWidth="6" strokeLinecap="round" />
      <circle cx="82" cy="86" r="3.6" fill={SVG_ORANGE} />
      <circle cx="168" cy="120" r="26" fill={SVG_BEIGE_BG} stroke={SVG_NAVY} strokeWidth="7" />
      <line x1="187" y1="139" x2="206" y2="158" stroke={SVG_NAVY} strokeWidth="8" strokeLinecap="round" />
      <rect x="156" y="106" width="24" height="28" rx="2" fill={SVG_WHITE} stroke={SVG_ORANGE} strokeWidth="3" />
      <line x1="161" y1="114" x2="175" y2="114" stroke={SVG_ORANGE} strokeWidth="2.4" strokeLinecap="round" />
      <line x1="161" y1="121" x2="175" y2="121" stroke={SVG_ORANGE} strokeWidth="2.4" strokeLinecap="round" />
      <line x1="161" y1="128" x2="171" y2="128" stroke={SVG_ORANGE} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

// 解決セクション: 家＋盾＋チェック＋職人ヘルメット
function CraftsmanShieldSvg({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 220 180" fill="none" aria-hidden="true">
      <path d="M14 78L62 40L110 78" stroke={SVG_NAVY} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="34" y="76" width="56" height="50" fill={SVG_BLUE_BG} stroke={SVG_NAVY} strokeWidth="7" strokeLinejoin="round" />
      <path d="M150 22L196 38V78C196 108 174 126 150 138C126 126 104 108 104 78V38Z" fill={SVG_BEIGE_BG} stroke={SVG_ORANGE} strokeWidth="7" strokeLinejoin="round" />
      <path d="M128 80L144 98L176 58" fill="none" stroke={SVG_ORANGE} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M40 158a22 18 0 0 1 44 0Z" fill={SVG_NAVY} />
      <rect x="34" y="156" width="56" height="8" rx="4" fill={SVG_NAVY} />
    </svg>
  );
}

// 劣化サインセクション: ひび割れた壁＋虫眼鏡＋チェック（写真が主役のため控えめに使用）
function CrackInspectionSvg({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 220 180" fill="none" aria-hidden="true">
      <rect x="14" y="20" width="130" height="110" rx="6" fill={SVG_GRAY_BG} stroke={SVG_NAVY} strokeWidth="5" />
      <line x1="14" y1="55" x2="144" y2="55" stroke={SVG_NAVY} strokeWidth="2" opacity="0.25" />
      <line x1="14" y1="90" x2="144" y2="90" stroke={SVG_NAVY} strokeWidth="2" opacity="0.25" />
      <path d="M38 20L56 55L40 80L62 110L50 130" fill="none" stroke={SVG_ORANGE} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="156" cy="118" r="34" fill={SVG_BLUE_BG} stroke={SVG_NAVY} strokeWidth="7" />
      <path d="M142 118L153 129L174 102" fill="none" stroke={SVG_ORANGE} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="180" y1="142" x2="204" y2="166" stroke={SVG_NAVY} strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}

// 信頼できる特徴セクション: 資格証＋リボン＋チェックリスト
function TrustFeatureSvg({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 220 180" fill="none" aria-hidden="true">
      <rect x="16" y="14" width="92" height="120" rx="6" fill={SVG_BLUE_BG} stroke={SVG_NAVY} strokeWidth="6" />
      <line x1="32" y1="34" x2="92" y2="34" stroke={SVG_NAVY} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      <line x1="32" y1="46" x2="92" y2="46" stroke={SVG_NAVY} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      <circle cx="62" cy="84" r="22" fill={SVG_BEIGE_BG} stroke={SVG_ORANGE} strokeWidth="5" />
      <path d="M62 70L70 84L62 98L54 84Z" fill={SVG_ORANGE} />
      <path d="M48 134L40 162L62 150L84 162L76 134" fill={SVG_BEIGE_BG} stroke={SVG_ORANGE} strokeWidth="4" strokeLinejoin="round" />
      <rect x="124" y="40" width="84" height="92" rx="6" fill={SVG_WHITE} stroke={SVG_NAVY} strokeWidth="6" />
      <path d="M138 64l6 6 12 -14" fill="none" stroke={SVG_ORANGE} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="164" y1="64" x2="196" y2="64" stroke={SVG_NAVY} strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      <path d="M138 92l6 6 12 -14" fill="none" stroke={SVG_ORANGE} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="164" y1="92" x2="196" y2="92" stroke={SVG_NAVY} strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      <path d="M138 112l6 6 12 -14" fill="none" stroke={SVG_ORANGE} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="164" y1="112" x2="188" y2="112" stroke={SVG_NAVY} strokeWidth="3" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

// 費用セクション: 見積書＋電卓＋チェック
function EstimateDocumentSvg({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 220 180" fill="none" aria-hidden="true">
      <rect x="20" y="16" width="78" height="108" rx="3" fill={SVG_WHITE} stroke={SVG_NAVY} strokeWidth="6" />
      <line x1="34" y1="38" x2="84" y2="38" stroke={SVG_NAVY} strokeWidth="4" strokeLinecap="round" opacity="0.55" />
      <line x1="34" y1="54" x2="84" y2="54" stroke={SVG_NAVY} strokeWidth="4" strokeLinecap="round" opacity="0.55" />
      <line x1="34" y1="70" x2="70" y2="70" stroke={SVG_NAVY} strokeWidth="4" strokeLinecap="round" opacity="0.55" />
      <path d="M30 100l8 -10 9 6 7 -9 9 12" fill="none" stroke={SVG_ORANGE} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="118" y="58" width="76" height="92" rx="8" fill={SVG_BLUE_BG} stroke={SVG_NAVY} strokeWidth="6" />
      <g stroke={SVG_NAVY} strokeWidth="3.6" strokeLinecap="round" opacity="0.7">
        <line x1="138" y1="78" x2="150" y2="94" />
        <line x1="162" y1="78" x2="150" y2="94" />
        <line x1="150" y1="94" x2="150" y2="110" />
        <line x1="142" y1="98" x2="158" y2="98" />
        <line x1="142" y1="104" x2="158" y2="104" />
      </g>
      <circle cx="186" cy="130" r="22" fill={SVG_ORANGE} />
      <path d="M176 130l7 7 14 -16" fill="none" stroke={SVG_WHITE} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 費用カードの背景ウォーターマーク: ペイント缶＋筆
function PaintCanLineSvg({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 160 160" fill="none" aria-hidden="true">
      <path d="M46 64L114 64L106 138a8 8 0 0 1 -8 7H62a8 8 0 0 1 -8 -7Z" fill={SVG_BLUE_BG} stroke={SVG_NAVY} strokeWidth="6" strokeLinejoin="round" />
      <path d="M40 64C40 52 58 44 80 44C102 44 120 52 120 64" fill="none" stroke={SVG_NAVY} strokeWidth="6" strokeLinecap="round" />
      <path d="M64 44L70 20L98 20L96 44" fill="none" stroke={SVG_ORANGE} strokeWidth="5" strokeLinejoin="round" />
      <line x1="58" y1="88" x2="102" y2="88" stroke={SVG_ORANGE} strokeWidth="5" strokeLinecap="round" opacity="0.6" />
      <line x1="58" y1="108" x2="96" y2="108" stroke={SVG_ORANGE} strokeWidth="5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

// 費用カードの背景ウォーターマーク: 円マーク＋チェック
function YenCoinCheckSvg({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 160 160" fill="none" aria-hidden="true">
      <circle cx="68" cy="76" r="48" fill={SVG_BEIGE_BG} stroke={SVG_NAVY} strokeWidth="6" />
      <g stroke={SVG_NAVY} strokeWidth="5" strokeLinecap="round">
        <line x1="50" y1="54" x2="68" y2="78" />
        <line x1="86" y1="54" x2="68" y2="78" />
        <line x1="68" y1="78" x2="68" y2="100" />
        <line x1="54" y1="84" x2="82" y2="84" />
        <line x1="54" y1="92" x2="82" y2="92" />
      </g>
      <circle cx="118" cy="112" r="24" fill={SVG_ORANGE} />
      <path d="M107 112L115 120L130 102" fill="none" stroke={SVG_WHITE} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// CTAボタン横の小さな矢印アクセント
function ArrowNudgeSvg({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 60 60" fill="none" aria-hidden="true">
      <path d="M8 40C20 44 36 38 50 18" stroke={SVG_ORANGE} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.8" />
      <path d="M38 14L51 17L47 30" fill="none" stroke={SVG_ORANGE} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
    </svg>
  );
}

// ─── 「一級塗装技能士とは」セクション群: 図解用アイコン ──────────────────────

// 国家検定・受検資格・実務経験のあかし（証書＋認定シール）
function CertDocIcon({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="9" y="6" width="36" height="46" rx="3" fill={SVG_BLUE_BG} stroke={SVG_NAVY} strokeWidth="2.5" />
      <line x1="15" y1="16" x2="39" y2="16" stroke={SVG_NAVY} strokeWidth="2" strokeLinecap="round" opacity="0.55" />
      <line x1="15" y1="23" x2="39" y2="23" stroke={SVG_NAVY} strokeWidth="2" strokeLinecap="round" opacity="0.55" />
      <line x1="15" y1="30" x2="31" y2="30" stroke={SVG_NAVY} strokeWidth="2" strokeLinecap="round" opacity="0.55" />
      <circle cx="44" cy="42" r="12" fill={SVG_BEIGE_BG} stroke={SVG_ORANGE} strokeWidth="2.4" />
      <path d="M39 42l3.4 3.4 7-7.4" fill="none" stroke={SVG_ORANGE} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 実務経験のあかし（積み重ね＋時計）
function ExperienceIcon({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="27" cy="25" r="17" fill={SVG_BLUE_BG} stroke={SVG_NAVY} strokeWidth="2.4" />
      <path d="M27 15v10l7 5.5" fill="none" stroke={SVG_NAVY} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="13" y="48" width="38" height="6" rx="3" fill={SVG_ORANGE} opacity="0.85" />
      <rect x="18" y="40" width="28" height="6" rx="3" fill={SVG_ORANGE} opacity="0.55" />
    </svg>
  );
}

// 実技＋学科試験のあかし（試験用紙＋採点チェック）
function ExamPaperIcon({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="11" y="7" width="32" height="44" rx="3" fill={SVG_WHITE} stroke={SVG_NAVY} strokeWidth="2.4" />
      <path d="M18 19l3 3 5-6" fill="none" stroke={SVG_ORANGE} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="29" y1="19" x2="37" y2="19" stroke={SVG_NAVY} strokeWidth="2" strokeLinecap="round" opacity="0.45" />
      <path d="M18 31l3 3 5-6" fill="none" stroke={SVG_ORANGE} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="29" y1="31" x2="37" y2="31" stroke={SVG_NAVY} strokeWidth="2" strokeLinecap="round" opacity="0.45" />
      <line x1="18" y1="41" x2="37" y2="41" stroke={SVG_NAVY} strokeWidth="2" strokeLinecap="round" opacity="0.25" />
      <path d="M39 46l9-9 4 4-9 9h-4z" fill={SVG_BEIGE_BG} stroke={SVG_ORANGE} strokeWidth="2.2" strokeLinejoin="round" />
    </svg>
  );
}

// 現場経験のあかし（職人ヘルメット）
function HelmetIcon({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M13 41a19 16 0 0 1 38 0Z" fill={SVG_BLUE_BG} stroke={SVG_NAVY} strokeWidth="2.4" strokeLinejoin="round" />
      <rect x="9" y="39" width="46" height="7" rx="3.5" fill={SVG_NAVY} />
      <path d="M32 10v9" stroke={SVG_ORANGE} strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="32" cy="9" r="2.4" fill={SVG_ORANGE} />
    </svg>
  );
}

// 技能のあかし（ペイントブラシ＋チェック）
function BrushCheckIcon({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M17 47L37 27" stroke={SVG_NAVY} strokeWidth="3.2" strokeLinecap="round" />
      <path d="M34 24l10-10c2.4-2.4 5.8-2.4 7.8 0 2 2.4 2.4 5.4 0 7.8L42 32Z" fill={SVG_BEIGE_BG} stroke={SVG_ORANGE} strokeWidth="2.3" strokeLinejoin="round" />
      <path d="M14 50c-2 2-2 5.5 1 7s6-1 5.6-4.2" fill="none" stroke={SVG_ORANGE} strokeWidth="2.3" strokeLinecap="round" />
      <circle cx="46" cy="46" r="11" fill={SVG_BLUE_BG} stroke={SVG_NAVY} strokeWidth="2.2" />
      <path d="M41 46l3.4 3.4 7-7" fill="none" stroke={SVG_ORANGE} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 品質のあかし（盾＋星）
function ShieldStarIcon({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M32 7l19 6.5v16.5c0 14.5-9.5 21.5-19 25.5-9.5-4-19-11-19-25.5V13.5Z" fill={SVG_BLUE_BG} stroke={SVG_NAVY} strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M32 19l3.6 7.2 8 1.1-5.8 5.6 1.4 7.9-7.2-3.8-7.2 3.8 1.4-7.9-5.8-5.6 8-1.1Z" fill={SVG_ORANGE} />
    </svg>
  );
}

// ステップをつなぐ矢印（→ がデフォルト。rotate-90 で ↓ にも使える）
function ArrowConnectorSvg({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <line x1="4" y1="16" x2="23" y2="16" stroke={SVG_ORANGE} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M18 8l9 8-9 8" fill="none" stroke={SVG_ORANGE} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── 「なぜ限られるの？」3ステップ図 専用アイコン ───────────────────────────

// 実務経験が必要: 書類＋チェック＋実績バッジ（リボン付き）
function ExperienceCredentialIcon({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="11" y="7" width="30" height="40" rx="3" fill={SVG_WHITE} stroke={SVG_NAVY} strokeWidth="2.2" />
      <line x1="17" y1="17" x2="35" y2="17" stroke={SVG_NAVY} strokeWidth="1.8" strokeLinecap="round" opacity="0.4" />
      <line x1="17" y1="24" x2="35" y2="24" stroke={SVG_NAVY} strokeWidth="1.8" strokeLinecap="round" opacity="0.4" />
      <line x1="17" y1="31" x2="28" y2="31" stroke={SVG_NAVY} strokeWidth="1.8" strokeLinecap="round" opacity="0.4" />
      <circle cx="43" cy="40" r="14" fill={SVG_BEIGE_BG} stroke={SVG_ORANGE} strokeWidth="2.2" />
      <path d="M37 40l4 4 8-9" fill="none" stroke={SVG_ORANGE} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M37 53l-2.5 6.5 8.5-4 8.5 4-2.5-6.5" fill={SVG_BEIGE_BG} stroke={SVG_ORANGE} strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

// 実技と学科の両方が必要: 採点済み答案＋実技ツールのバランス構成
function PracticalExamIcon({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="9" y="9" width="28" height="38" rx="3" fill={SVG_WHITE} stroke={SVG_NAVY} strokeWidth="2.2" />
      <path d="M15 20l2.6 2.6 4.4-5.2" fill="none" stroke={SVG_ORANGE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="25" y1="20" x2="32" y2="20" stroke={SVG_NAVY} strokeWidth="1.8" strokeLinecap="round" opacity="0.4" />
      <path d="M15 30l2.6 2.6 4.4-5.2" fill="none" stroke={SVG_ORANGE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="25" y1="30" x2="32" y2="30" stroke={SVG_NAVY} strokeWidth="1.8" strokeLinecap="round" opacity="0.4" />
      <line x1="15" y1="40" x2="32" y2="40" stroke={SVG_NAVY} strokeWidth="1.8" strokeLinecap="round" opacity="0.25" />
      <path d="M35 51l16-16 5.5 5.5-16 16h-5.5z" fill={SVG_BEIGE_BG} stroke={SVG_ORANGE} strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M47.5 39.5l5.5 5.5" stroke={SVG_NAVY} strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

// 継続して技能を磨く必要がある: メダル＋リボン＋きらめき（上質感）
function MasteryMedalIcon({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="32" cy="25" r="18" fill={SVG_BEIGE_BG} stroke={SVG_ORANGE} strokeWidth="2.4" />
      <circle cx="32" cy="25" r="12.5" fill="none" stroke={SVG_NAVY} strokeWidth="1.6" strokeDasharray="2.4 3.2" opacity="0.7" />
      <path d="M24.5 25.5l5 5L41.5 16.5" fill="none" stroke={SVG_ORANGE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 40l-5 17 15-8 15 8-5-17" fill={SVG_BLUE_BG} stroke={SVG_NAVY} strokeWidth="2" strokeLinejoin="round" />
      <path d="M47 10.5l2.6 2.6-2.6 2.6-2.6-2.6Z" fill={SVG_ORANGE} opacity="0.85" />
      <path d="M14 14l1.8 1.8-1.8 1.8-1.8-1.8Z" fill={SVG_ORANGE} opacity="0.6" />
    </svg>
  );
}

// ─── 「ペイントネットの強み」セクション: 図解用 inline SVG ───────────────────

// ペンキ缶
function PaintBucketSvg({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M16 22h32l-4 30a4 4 0 0 1-4 3.5H24a4 4 0 0 1-4-3.5Z" fill={SVG_BLUE_BG} stroke={SVG_NAVY} strokeWidth="2.4" strokeLinejoin="round" />
      <ellipse cx="32" cy="22" rx="16" ry="5" fill={SVG_WHITE} stroke={SVG_NAVY} strokeWidth="2.4" />
      <path d="M22 22c0 2.8 4.5 5 10 5s10-2.2 10-5" fill="none" stroke={SVG_ORANGE} strokeWidth="2" strokeLinecap="round" />
      <path d="M27 11l1.5-5M37 11l-1.5-5" stroke={SVG_NAVY} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ペイントローラー
function PaintRollerSvg({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="10" y="14" width="32" height="14" rx="4" fill={SVG_BEIGE_BG} stroke={SVG_ORANGE} strokeWidth="2.4" />
      <line x1="26" y1="28" x2="26" y2="38" stroke={SVG_NAVY} strokeWidth="2.4" strokeLinecap="round" />
      <line x1="26" y1="38" x2="40" y2="50" stroke={SVG_NAVY} strokeWidth="2.4" strokeLinecap="round" />
      <line x1="34" y1="50" x2="46" y2="50" stroke={SVG_NAVY} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

// ペイントブラシ
function BrushSvg({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M20 44L38 26" stroke={SVG_NAVY} strokeWidth="3" strokeLinecap="round" />
      <path d="M35 23l9-9c2.2-2.2 5.4-2.2 7.4 0 2 2 2 5.2 0 7.4l-9 9Z" fill={SVG_BEIGE_BG} stroke={SVG_ORANGE} strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M17 47c-2 2-2 5.5 1 7s6-1 5.5-4" fill="none" stroke={SVG_ORANGE} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

// 家
function HouseSvg({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M10 30L32 12l22 18" stroke={SVG_NAVY} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 27v23h32V27" fill={SVG_BLUE_BG} stroke={SVG_NAVY} strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="27" y="36" width="10" height="14" fill={SVG_WHITE} stroke={SVG_NAVY} strokeWidth="2" />
    </svg>
  );
}

// 職人（ヘルメット＋ブラシ）
function CraftsmanSvg({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 140" fill="none" aria-hidden="true">
      {/* 上半身（作業服）: 首の付け根(y=64)でなめらかに繋がる山型 */}
      <path
        d="M24 132C24 98 38 64 60 64C82 64 96 98 96 132"
        fill={SVG_WHITE}
        stroke={SVG_NAVY}
        strokeWidth="2.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* 襟・ファスナー */}
      <path d="M60 72v54" stroke={SVG_NAVY} strokeWidth="1.8" strokeLinecap="round" opacity="0.4" />
      <path d="M48 74c3 5 21 5 24 0" fill="none" stroke={SVG_NAVY} strokeWidth="1.6" strokeLinecap="round" opacity="0.4" />
      {/* 首（顔の下端と肩の頂点をつなぐ） */}
      <rect x="52" y="50" width="16" height="15" rx="4" fill={SVG_BEIGE_BG} stroke={SVG_NAVY} strokeWidth="2" />
      {/* 顔 */}
      <circle cx="60" cy="36" r="18" fill={SVG_BEIGE_BG} stroke={SVG_NAVY} strokeWidth="2.6" />
      <circle cx="53" cy="37" r="1.8" fill={SVG_NAVY} />
      <circle cx="67" cy="37" r="1.8" fill={SVG_NAVY} />
      <path d="M52 44c3.5 3.5 12.5 3.5 16 0" stroke={SVG_NAVY} strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* ヘルメット */}
      <path d="M39 28a21 16 0 0 1 42 0Z" fill={SVG_ORANGE} stroke={SVG_NAVY} strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M37 28h46" stroke={SVG_NAVY} strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="60" cy="13" r="2.2" fill={SVG_NAVY} />
      {/* 腕＋刷毛（肩の輪郭から自然に伸びる） */}
      <path d="M78 75l20-21" stroke={SVG_NAVY} strokeWidth="2.6" strokeLinecap="round" />
      <path
        d="M95 56l12-12c2.2-2.2 5.4-2.2 7.4 0 2 2 2 5.2 0 7.4l-12 12Z"
        fill={SVG_BEIGE_BG}
        stroke={SVG_ORANGE}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M26 114c-3 3-3 8 1.5 10.5s9.5-1 8.5-6.5" fill="none" stroke={SVG_ORANGE} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

// オペレーター（ヘッドセットの女性）
function OperatorSvg({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 140" fill="none" aria-hidden="true">
      {/* 上半身（ブラウス）: 首の付け根(y=64)でなめらかに繋がる山型 */}
      <path
        d="M24 132C24 98 38 64 60 64C82 64 96 98 96 132"
        fill={SVG_WHITE}
        stroke={SVG_NAVY}
        strokeWidth="2.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path d="M44 76c0 4.5 5 8 16 8s16-3.5 16-8" fill="none" stroke={SVG_NAVY} strokeWidth="1.6" strokeLinecap="round" opacity="0.4" />
      {/* 首（顔の下端と肩の頂点をつなぐ） */}
      <rect x="52" y="50" width="16" height="15" rx="4" fill={SVG_BEIGE_BG} stroke={SVG_NAVY} strokeWidth="2" />
      {/* 髪（後ろ） */}
      <path d="M39 36c0-14 9-24 21-24s21 10 21 24c0 5-1 9-3 13H42c-2-4-3-8-3-13Z" fill={SVG_NAVY} />
      {/* 顔 */}
      <circle cx="60" cy="36" r="18" fill={SVG_BEIGE_BG} stroke={SVG_NAVY} strokeWidth="2.6" />
      <circle cx="53" cy="37" r="1.8" fill={SVG_NAVY} />
      <circle cx="67" cy="37" r="1.8" fill={SVG_NAVY} />
      <path d="M52 44c3.5 3.5 12.5 3.5 16 0" stroke={SVG_NAVY} strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* 前髪 */}
      <path d="M42 28c4-7 12-11 18-11s14 4 18 11c-6-3-12-4-18-4s-12 1-18 4Z" fill={SVG_NAVY} />
      {/* ヘッドセット */}
      <path d="M35 32a25 25 0 0 1 50 0" fill="none" stroke={SVG_ORANGE} strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="35" cy="36" r="4.5" fill={SVG_ORANGE} stroke={SVG_NAVY} strokeWidth="1.4" />
      <path d="M35 40.5v5c0 2.8 2.2 5 5 5h4" stroke={SVG_ORANGE} strokeWidth="2.2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// 盾＋チェック
function ShieldCheckSvg({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M32 7l19 6.5v16.5c0 14.5-9.5 21.5-19 25.5-9.5-4-19-11-19-25.5V13.5Z" fill={SVG_BLUE_BG} stroke={SVG_NAVY} strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M23 31l7 7 12-14" fill="none" stroke={SVG_ORANGE} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 電卓
function CalculatorSvg({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="14" y="8" width="36" height="48" rx="4" fill={SVG_WHITE} stroke={SVG_NAVY} strokeWidth="2.4" />
      <rect x="19" y="14" width="26" height="10" rx="2" fill={SVG_BLUE_BG} stroke={SVG_NAVY} strokeWidth="1.6" />
      <g fill={SVG_ORANGE} opacity="0.75">
        <rect x="19" y="29" width="7" height="6" rx="1.5" />
        <rect x="28.5" y="29" width="7" height="6" rx="1.5" />
        <rect x="38" y="29" width="7" height="6" rx="1.5" />
        <rect x="19" y="38" width="7" height="6" rx="1.5" />
        <rect x="28.5" y="38" width="7" height="6" rx="1.5" />
        <rect x="38" y="38" width="7" height="6" rx="1.5" />
        <rect x="19" y="47" width="7" height="6" rx="1.5" />
        <rect x="28.5" y="47" width="7" height="6" rx="1.5" />
        <rect x="38" y="47" width="7" height="6" rx="1.5" />
      </g>
    </svg>
  );
}

// 積み重ねコスト（小アイコン）
function CostStackSvg({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="12" y="40" width="40" height="12" rx="3" fill={SVG_ORANGE} opacity="0.85" />
      <rect x="12" y="26" width="40" height="12" rx="3" fill={SVG_NAVY} opacity="0.55" />
      <rect x="12" y="12" width="40" height="12" rx="3" fill={SVG_NAVY} opacity="0.25" />
    </svg>
  );
}

// オレンジ丸チェック
function CheckCircleSvg({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="14" fill={SVG_ORANGE} />
      <path d="M10 16l4 4 8-9" fill="none" stroke={SVG_WHITE} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 吹き出し（小アイコン）
function SpeechBubbleSvg({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M10 14h36a8 8 0 0 1 8 8v14a8 8 0 0 1-8 8H30l-10 9v-9h-10a8 8 0 0 1-8-8V22a8 8 0 0 1 8-8Z" fill={SVG_BLUE_BG} stroke={SVG_NAVY} strokeWidth="2.4" strokeLinejoin="round" />
      <circle cx="20" cy="29" r="2.4" fill={SVG_ORANGE} />
      <circle cx="30" cy="29" r="2.4" fill={SVG_ORANGE} />
      <circle cx="40" cy="29" r="2.4" fill={SVG_ORANGE} />
    </svg>
  );
}

// 葉っぱの装飾
function LeafDecorationSvg({ className = 'w-12 h-12' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M8 56C8 30 26 10 56 8c2 28-16 46-48 48Z" fill={SVG_BLUE_BG} opacity="0.7" stroke={SVG_NAVY} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M14 50C20 36 30 24 50 14" stroke={SVG_NAVY} strokeWidth="1.3" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

// 水彩風の背景ブロブ（淡い色の重なり）
function WatercolorBlobSvg({
  className = 'w-64 h-64',
  tone = 'orange',
}: {
  className?: string;
  tone?: 'orange' | 'navy';
}) {
  const c1 = tone === 'orange' ? SVG_BEIGE_BG : SVG_BLUE_BG;
  const c2 = tone === 'orange' ? '#FFE8D5' : '#DCEAFB';
  return (
    <svg className={className} viewBox="0 0 400 400" fill="none" aria-hidden="true">
      <path
        d="M190 50C250 45 320 90 340 150C360 215 330 290 270 330C205 372 120 360 75 305C32 252 35 175 80 120C115 78 145 55 190 50Z"
        fill={c1}
        opacity="0.55"
      />
      <path
        d="M210 90C255 95 290 140 295 185C300 235 265 280 220 295C175 310 125 295 100 255C77 218 85 165 120 130C150 100 175 87 210 90Z"
        fill={c2}
        opacity="0.5"
      />
    </svg>
  );
}

// ─── 「ペイントネットの強み」セクション: 比較カード（左右1組） ───────────────
function ComparisonSideCard({
  tone,
  label,
  points,
  boxTitle,
  rows,
  topSpacerWeight,
  tag,
  footerText,
}: {
  tone: 'orange' | 'navy';
  label: string;
  points: string[];
  boxTitle: string;
  rows: { text: string; highlight?: boolean; weight?: number }[];
  topSpacerWeight?: number;
  tag?: string;
  footerText: string;
}) {
  const isOrange = tone === 'orange';
  const accent = isOrange ? '#f3c08a' : '#9db8d8';
  const mutedBg = isOrange ? '#FBDCB8' : '#CFE2F5';
  return (
    <div
      className="relative rounded-3xl p-6 sm:p-7 h-full flex flex-col"
      style={{
        border: `2px dashed ${accent}`,
        background: isOrange
          ? 'linear-gradient(160deg, #FFFBF5 0%, #FFF3E8 100%)'
          : 'linear-gradient(160deg, #FBFDFF 0%, #EAF5FF 100%)',
      }}
    >
      <span
        className="inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm sm:text-base font-extrabold mb-4 text-balance break-keep [overflow-wrap:normal]"
        style={{ background: isOrange ? SVG_ORANGE : SVG_NAVY, color: '#fff' }}
      >
        {isOrange ? <PaintBucketSvg className="w-5 h-5 shrink-0" /> : <HouseSvg className="w-5 h-5 shrink-0" />}
        {label}
      </span>
      <ul className="space-y-1 mb-5 text-xs sm:text-sm text-[#5a5f6c] leading-relaxed">
        {points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>

      {/* 積み上げ式コスト構造図: 上に乗るほど削られ、最下段が実際に施工へ回る金額 */}
      {/* 比較エリアは左右で同じ4行分の高さを確保し、施工費・材料費ブロックの下端をそろえる */}
      <div className="mb-4 flex-1 flex flex-col">
        <div className="flex items-center gap-1.5 mb-2">
          <CostStackSvg className="w-5 h-5 shrink-0" />
          <p className="text-xs font-bold" style={{ color: SVG_NAVY }}>
            {boxTitle}
          </p>
        </div>
        <div
          className="flex flex-col min-h-[200px] sm:min-h-[260px] flex-1 rounded-2xl overflow-hidden"
          style={{ border: `1.5px solid ${accent}` }}
        >
          {topSpacerWeight && (
            <div aria-hidden="true" style={{ flexGrow: topSpacerWeight }} />
          )}
          {rows.map((row, i) => (
            <div
              key={row.text}
              className={`flex items-center justify-center text-center font-bold ${row.highlight ? 'text-sm sm:text-base' : 'text-[11px] sm:text-xs'}`}
              style={{
                flexGrow: row.weight ?? (row.highlight ? 2 : 1),
                background: row.highlight ? (isOrange ? SVG_ORANGE : SVG_NAVY) : mutedBg,
                color: row.highlight ? '#fff' : SVG_NAVY,
                opacity: row.highlight ? 1 : 0.85,
                borderTop: i > 0 ? '2px solid #fff' : 'none',
              }}
            >
              {row.text}
            </div>
          ))}
        </div>
        {tag && (
          <div
            className="mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold"
            style={{ background: SVG_BEIGE_BG, color: SVG_NAVY }}
          >
            <CheckCircleSvg className="w-4 h-4 shrink-0" />
            {tag}
          </div>
        )}
      </div>

      <p
        className="text-sm sm:text-base font-extrabold text-center text-balance break-keep [overflow-wrap:normal]"
        style={{ color: isOrange ? SVG_ORANGE : SVG_NAVY }}
      >
        {footerText}
      </p>
    </div>
  );
}

// ─── 「ペイントネットの強み」セクション: 会社依頼 vs ペイントネット 簡易比較 ──
function MiniCostCompare() {
  return (
    <div className="rounded-2xl p-4 sm:p-6" style={{ background: SVG_GRAY_BG }}>
      <div className="flex items-center gap-3 sm:gap-5">
        <div className="flex-1 rounded-2xl p-4 sm:p-5 text-center bg-white" style={{ border: '2px dashed #c7d0db' }}>
          <p className="text-xs sm:text-sm font-bold mb-3" style={{ color: SVG_GRAY_LINE }}>
            会社依頼
          </p>
          <div className="space-y-2">
            <div className="rounded-lg px-1.5 py-2.5 text-[11px] sm:text-xs font-bold break-keep [overflow-wrap:normal]" style={{ background: '#e2e8f0', color: SVG_GRAY_LINE }}>
              会社の利益
            </div>
            <div className="rounded-lg px-1.5 py-2.5 text-[11px] sm:text-xs font-bold break-keep [overflow-wrap:normal]" style={{ background: '#e2e8f0', color: SVG_GRAY_LINE }}>
              中間マージン
            </div>
            <div className="rounded-lg px-1.5 py-2.5 text-xs sm:text-sm font-extrabold break-keep [overflow-wrap:normal]" style={{ background: SVG_BLUE_BG, color: SVG_NAVY }}>
              職人の費用
            </div>
          </div>
        </div>
        <ArrowConnectorSvg className="w-7 h-7 sm:w-9 sm:h-9 shrink-0" />
        <div className="flex-1 rounded-2xl p-4 sm:p-5 text-center" style={{ background: SVG_BEIGE_BG, border: `2px solid ${SVG_ORANGE}` }}>
          <p className="text-xs sm:text-sm font-extrabold mb-3" style={{ color: SVG_ORANGE }}>
            ペイントネット
          </p>
          <div className="space-y-2">
            <div
              className="rounded-lg px-1.5 py-2.5 text-[11px] sm:text-xs font-bold bg-white break-keep [overflow-wrap:normal]"
              style={{ color: SVG_NAVY, border: `1.5px dashed ${SVG_ORANGE}` }}
            >
              中間マージンなし
            </div>
            <div className="rounded-lg px-1.5 py-3 text-sm sm:text-base font-extrabold break-keep [overflow-wrap:normal]" style={{ background: SVG_ORANGE, color: '#fff' }}>
              職人の費用
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 「ペイントネットの強み」セクション: 吹き出し付きの一言メモ ─────────────
function BubbleNote({ text }: { text: string }) {
  return (
    <div className="inline-flex items-start gap-2 rounded-2xl px-4 py-2.5" style={{ background: SVG_BLUE_BG }}>
      <SpeechBubbleSvg className="w-5 h-5 shrink-0 mt-0.5" />
      <span className="text-xs sm:text-sm font-bold leading-snug" style={{ color: SVG_NAVY }}>
        {text}
      </span>
    </div>
  );
}

// ─── 「ペイントネットの強み」セクション: 番号付き特徴カード ──────────────────
// visual: 職人・オペレーターなどの人物イラスト（横並びレイアウト）
// diagram: 会社依頼との比較図など、横幅いっぱいで見せたい図解
function NumberedFeatureCard({
  number,
  title,
  body,
  bubble,
  visual,
  diagram,
}: {
  number: number;
  title: ReactNode;
  body: string;
  bubble: string;
  visual?: ReactNode;
  diagram?: ReactNode;
}) {
  return (
    <div
      className="rounded-3xl p-6 sm:p-8"
      style={{
        border: '1px solid #d8cebd',
        backgroundColor: '#fff',
        boxShadow: '0 1px 1px rgba(28,29,32,.03), 0 6px 18px -14px rgba(28,29,32,.18)',
      }}
    >
      <div className="flex items-center gap-3 mb-5">
        <span
          className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-extrabold text-base sm:text-lg"
          style={{ background: SVG_ORANGE }}
        >
          {number}
        </span>
        <h4
          className="min-w-0 flex-1 text-base sm:text-xl font-extrabold leading-[1.5] break-keep [overflow-wrap:anywhere]"
          style={{ color: SVG_NAVY }}
        >
          {title}
        </h4>
      </div>

      {visual && (
        <div className="grid grid-cols-1 sm:grid-cols-[136px_1fr] gap-5 sm:gap-7 items-center">
          <div className="flex justify-center sm:justify-start">
            <div
              className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl flex items-center justify-center"
              style={{ background: SVG_BLUE_BG }}
            >
              {visual}
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-sm text-[#5a5f6c] leading-relaxed mb-4">{body}</p>
            <BubbleNote text={bubble} />
          </div>
        </div>
      )}

      {diagram && (
        <div>
          <p className="text-sm text-[#5a5f6c] leading-relaxed mb-5">{body}</p>
          <div className="mb-5">{diagram}</div>
          <BubbleNote text={bubble} />
        </div>
      )}
    </div>
  );
}

// ─── 「ペイントネットの強み」セクション本体 ─────────────────────────────────
function StrengthSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24" style={{ background: SVG_BEIGE_LIGHT }}>
      <WatercolorBlobSvg
        className="hidden lg:block absolute -top-16 -right-16 w-72 h-72 pointer-events-none"
        tone="orange"
      />
      <WatercolorBlobSvg
        className="hidden lg:block absolute -bottom-20 -left-16 w-72 h-72 pointer-events-none"
        tone="navy"
      />
      <LeafDecorationSvg className="hidden md:block absolute top-10 left-6 w-16 h-16 opacity-60 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <Label>ペイントネットの強み</Label>
          <p className="mt-2 text-sm sm:text-base text-[#5a5f6c] max-w-xl mx-auto leading-[1.9] text-balance break-keep [overflow-wrap:anywhere]">
            <span className="inline-block">一級塗装技能士</span>を紹介するだけでなく、費用のわかりやすさや紹介後の安心感まで<span className="inline-block">サポート</span>します。
          </p>
        </div>

        {/* ── ブロック1: なぜしっかり工事しやすい？ ── */}
        <FadeUp>
          <div className="text-center mb-10 sm:mb-12">
            <h3 className="gaiheki-font-mincho text-balance break-keep [overflow-wrap:normal] text-[1.4rem] sm:text-[1.85rem] leading-[1.5]" style={{ color: '#28292a', fontWeight: 600 }}>
              <HeadingLines
                lines={['ペイントネットはなぜ、', 'しっかり工事しやすい？']}
                full="ペイントネットはなぜ、しっかり工事しやすい？"
              />
            </h3>
            <p className="mt-4 text-sm sm:text-base text-[#5a5f6c] max-w-md mx-auto leading-relaxed">
              中間コストを抑えやすい仕組みだから、施工に必要な費用を確保しやすくなります。
            </p>
          </div>

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
            <ComparisonSideCard
              tone="orange"
              label="ペイントネットの場合"
              points={['中間会社への費用が少ないから', '施工に回しやすい']}
              boxTitle="必要な運営コスト"
              topSpacerWeight={1.3}
              rows={[
                { text: 'ペイントネットの運用費', weight: 1 },
                { text: '施工費・材料費', highlight: true, weight: 2.4 },
              ]}
              tag="職人の手間を確保"
              footerText="工事に必要な費用を確保しやすい！"
            />

            <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-20 h-20 rounded-full items-center justify-center text-base font-extrabold text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #1a3a6b, #0a1628)', border: '4px solid #fff' }}>
              比較
            </div>
            <div className="lg:hidden flex justify-center -my-2 relative z-20">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-sm font-extrabold text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #1a3a6b, #0a1628)', border: '4px solid #fff' }}>
                比較
              </div>
            </div>

            <ComparisonSideCard
              tone="navy"
              label="一般的な紹介・会社依頼の場合"
              points={['中間会社への支払いが増えるほど', '施工に回る分が減りやすい']}
              boxTitle="必要な運営コスト"
              rows={[
                { text: '紹介会社の利益' },
                { text: '営業会社の利益' },
                { text: '下請けの利益' },
                { text: '施工費・材料費', highlight: true },
              ]}
              footerText="工事に回せる費用が減りやすい…"
            />
          </div>
        </FadeUp>

        {/* ── ブロック2: 安心して頼める3つの特徴 ①② ── */}
        <FadeUp delay={80} className="mt-20 sm:mt-28">
          <div className="text-center mb-10 sm:mb-12">
            <h3 className="gaiheki-font-mincho text-balance break-keep [overflow-wrap:normal] text-[1.4rem] sm:text-[1.85rem] leading-[1.5]" style={{ color: '#28292a', fontWeight: 600 }}>
              <span className="heading-highlight">安心して頼める3つの特徴</span>
            </h3>
          </div>

          <div className="space-y-6">
            <NumberedFeatureCard
              number={1}
              title={<HeadingLines lines={['一級塗装技能士を', '直接紹介']} full="一級塗装技能士を直接紹介" />}
              body="経験豊富な一級塗装技能士とつながりやすいから、技術力を見極めやすく、余計な伝言も少なく、話がスムーズです。"
              bubble="余計な伝言が少なく、話が伝わりやすい"
              visual={<CraftsmanSvg className="w-20 h-20 sm:w-24 sm:h-24" />}
            />
            <NumberedFeatureCard
              number={2}
              title={<HeadingLines lines={['会社依頼より', '価格を抑えやすい']} full="会社依頼より価格を抑えやすい" />}
              body="中間会社が少ないぶん、余計な費用がかかりにくく、必要な費用がわかりやすい仕組みです。"
              bubble="必要な費用がわかりやすい"
              diagram={<MiniCostCompare />}
            />
          </div>
        </FadeUp>

        {/* ── ブロック3: 紹介後もペイントネットが対応 ③＋まとめ ── */}
        <FadeUp delay={120} className="mt-6">
          <NumberedFeatureCard
            number={3}
            title={<HeadingLines lines={['紹介後も', 'ペイントネットが対応']} full="紹介後もペイントネットが対応" />}
            body="直接紹介でも、紹介して終わりではありません。万一のトラブル時も、ペイントネットが窓口となって対応します。"
            bubble="紹介後の安心感も大切にします"
            visual={<OperatorSvg className="w-20 h-20 sm:w-24 sm:h-24" />}
          />

          <div
            className="mt-8 rounded-3xl p-6 sm:p-8"
            style={{ background: SVG_BEIGE_BG, border: '1px solid #f0e0c8' }}
          >
            <div className="flex justify-center mb-4">
              <ShieldCheckSvg className="w-10 h-10" />
            </div>
            <h4 className="text-center text-base sm:text-lg font-extrabold mb-5 leading-[1.5] break-keep [overflow-wrap:anywhere]" style={{ color: SVG_NAVY }}>
              <span className="heading-highlight">
                <span className="inline-block">ペイントネット</span>の3つの強みまとめ
              </span>
            </h4>
            <ul className="space-y-3 max-w-md mx-auto mb-6">
              {[
                <>
                  <span className="inline-block">一級塗装技能士</span>とつながりやすい
                </>,
                <>価格がわかりやすく抑えやすい</>,
                <>
                  トラブル時は<span className="inline-block">ペイントネット</span>が対応
                </>,
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 rounded-xl bg-white px-4 py-2.5">
                  <CheckCircleSvg className="w-6 h-6 shrink-0" />
                  <span className="text-sm font-bold text-[#28292a] break-keep [overflow-wrap:anywhere]">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-[#5a5f6c] leading-relaxed text-center">
              <span className="inline-block">ペイントネット</span>が、あなたの<span className="inline-block">外壁塗装</span>を
              <span className="font-bold" style={{ color: SVG_ORANGE }}>
                安心・納得の価格
              </span>
              で<span className="inline-block">サポートします。</span>
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
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
            className="text-[11px] sm:text-sm font-bold text-white px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl cursor-pointer transition-all duration-150 hover:opacity-90 active:scale-95 whitespace-nowrap shrink-0"
            style={{
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              boxShadow: '0 2px 12px rgba(234,88,12,0.35)',
            }}
          >
            {CTA_LABEL}
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

      {/* ── 1-A. ファーストビュー直下: 新コンセプトの見出し ───────────────── */}
      <section className="relative bg-white pt-10 pb-16 sm:pt-14 sm:pb-24 overflow-hidden">
        <SoftWaveBg className="absolute inset-x-0 top-0 w-full h-auto pointer-events-none" />
        <OrganicBlob
          className="absolute -top-16 -right-20 w-64 h-64 sm:w-96 sm:h-96 pointer-events-none"
          color={SVG_BLUE_BG}
          opacity={0.6}
        />
        <OrganicBlob
          className="absolute -bottom-24 -left-16 w-56 h-56 sm:w-80 sm:h-80 pointer-events-none"
          color={SVG_BEIGE_BG}
          opacity={0.65}
        />
        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <FadeUp>
            <span
              className="inline-flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold tracking-wide px-3 sm:px-4 py-1.5 rounded-full mb-5 whitespace-nowrap"
              style={{ background: 'rgba(255,255,255,0.8)', color: SVG_NAVY, border: '1px solid #c8d8ec' }}
            >
              <CertificationBadgeSvg className="w-4 h-4 shrink-0" />
              国家資格「一級塗装技能士」だけを厳選紹介
            </span>
            <h1 className="gaiheki-font-mincho break-keep [overflow-wrap:normal] text-[1.55rem] sm:text-[2.1rem] leading-[1.5] tracking-wide text-center" style={{ color: '#28292a', fontWeight: 600 }}>
              <span className="heading-highlight inline-block w-fit">一級塗装技能士だけを</span>
              <br />
              <span className="heading-highlight inline-block w-fit">厳選紹介。</span>
            </h1>
            <p className="mt-5 text-sm sm:text-base text-[#5a5f6c] leading-relaxed text-balance break-keep [overflow-wrap:anywhere]">
              外壁塗装は、誰に任せるかで仕上がりが変わります。
              <br className="md:hidden" />
              <span className="whitespace-nowrap">Paint Net</span>では、一級塗装技能士を持つ職人・業者を中心に、
              <br className="md:hidden" />
              品質を重視した外壁塗装をご案内します。
            </p>
            <div className="mt-8 flex flex-col items-center">
              <div className={CTA_WRAPPER_CLASS}>
                <CtaNotice />
                <CtaPrimary label={CTA_LABEL} sub="登録不要・完全無料" />
              </div>
            </div>
          </FadeUp>
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
        <OrganicBlob
          className="absolute -bottom-10 -right-10 w-56 h-56 sm:w-72 sm:h-72 pointer-events-none"
          color={SVG_BEIGE_BG}
          opacity={0.35}
        />
        <InspectionHouseSvg className="hidden lg:block absolute -top-10 -left-10 w-40 h-40 opacity-[0.14] pointer-events-none" />
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
              '安さだけで選んで、手抜き工事にならないか不安',
              'どの業者の技術力が高いのか分からない',
              '見積もりの金額だけで比較していいか迷っている',
              '職人さんの腕や資格まで確認できない',
              '信頼できる職人に直接相談したい',
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
        <OrganicBlob
          className="absolute -top-10 -right-10 w-60 h-60 sm:w-80 sm:h-80 pointer-events-none"
          color={SVG_BEIGE_BG}
          opacity={0.4}
        />
        <TrustFeatureSvg className="hidden lg:block absolute -bottom-12 -left-12 w-44 h-44 opacity-[0.14] pointer-events-none" />
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

          <FadeUp>
            <div className="text-center mb-10">
              <p className="text-sm sm:text-base text-[#5a5f6c] max-w-lg mx-auto leading-relaxed">
                資格の有無だけでなく、説明の丁寧さや見積もりの透明性まで含めて、安心して相談できる職人かどうかを確認しましょう。
              </p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

            {/* 左: チェックリスト */}
            <div className="space-y-3">
              {[
                {
                  title: '一級塗装技能士などの資格を持っている',
                  desc: '国家資格を保有しているかどうかは、技術力を見極める分かりやすい指標です。',
                  iconSrc: 'https://static.wixstatic.com/media/5ebda9_0659303679724573b8b2ab61832229cd~mv2.png', // icon1
                },
                {
                  title: '劣化状況を見たうえで、必要な工事を説明してくれる',
                  desc: '専門用語を多用せず、施主目線で分かりやすく状態を説明してくれるか確認しましょう。',
                  iconSrc: 'https://static.wixstatic.com/media/5ebda9_289ce999043d496395b6c70f179edfca~mv2.png', // icon2
                },
                {
                  title: '見積もりの内訳が細かく、塗料や工程が分かりやすい',
                  desc: '「一式○○円」だけの見積もりは要注意。材料名・数量・単価が明記されているか確認を。',
                  iconSrc: 'https://static.wixstatic.com/media/5ebda9_e4cdf06f766c4442b7f37bf674b49bc4~mv2.png', // icon3
                },
                {
                  title: '施工中の写真や進捗を共有してくれる',
                  desc: '見えにくい工程も、写真で共有してくれる職人なら安心して任せられます。',
                  iconSrc: 'https://static.wixstatic.com/media/5ebda9_e50da6ed8be84e539a2bb6d271238cc7~mv2.png', // icon4
                },
                {
                  title: '契約を急かさず、比較検討をすすめてくれる',
                  desc: '「今日だけの特別価格」など即決を迫る言葉には注意。じっくり検討できる環境を大切にしている職人を選びましょう。',
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
                      <p className="text-xs font-bold text-[#28292a]">一級塗装技能士 在籍</p>
                      <p className="text-[10px] text-[#8a8f9a]">国家資格保有の実績</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>
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
        <OrganicBlob
          className="absolute -top-12 -left-12 w-60 h-60 sm:w-80 sm:h-80 pointer-events-none"
          color={SVG_BLUE_BG}
          opacity={0.4}
        />
        <CraftsmanShieldSvg className="hidden lg:block absolute -bottom-10 -right-10 w-44 h-44 opacity-[0.14] pointer-events-none" />
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

          <FadeUp>
            <div className="text-center mb-10">
              <H2 center>
                <HeadingLines
                  lines={['一級塗装技能士を持つ', '職人だから、', '品質面でも相談しやすい']}
                  full="一級塗装技能士を持つ職人だから、品質面でも相談しやすい"
                />
              </H2>
              <p className="mt-4 text-sm sm:text-base text-[#5a5f6c] max-w-lg mx-auto leading-relaxed">
                <span className="whitespace-nowrap">Paint Net</span>では、外壁塗装の品質を重視したい方に向けて、一級塗装技能士を持つ職人・業者を中心にご紹介しています。
                価格だけでなく、技術力・説明の丁寧さ・施工後の安心感まで考えて選びたい方に向いています。
              </p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: '一級塗装技能士を持つ職人だけをご紹介',
                body: '国家資格である一級塗装技能士の職人や、外壁塗装歴10年以上のベテラン職人など、技術力と実績を厳選してご紹介します。',
                // ▼ 画像を差し替える場合: src を変更してください
                imgSrc: 'https://static.wixstatic.com/media/5ebda9_24f40d7d07e34c6bae724890486dc288~mv2.png',
                imgAlt: '一級塗装技能士を持つ職人だけをご紹介',
                cta: null,
              },
              {
                title: '岐阜のIT企業が運営',
                body: '大手企業との取引実績や提携実績がある岐阜のIT企業が運営しているため、資格を持たない業者や悪質な塗装店をご紹介することはありません。安心してご相談いただけます。',
                imgSrc: 'https://static.wixstatic.com/media/5ebda9_3dff8aaf91f84704b911db4531e67f77~mv2.png',
                imgAlt: '岐阜のIT企業が運営',
                cta: { label: '運営企業の実績を見てみる', href: '/works' },
              },
              {
                title: '価格だけで選ばない、適正価格をご案内',
                body: '安さだけを基準にすると、必要な工程が省かれてしまう場合があります。一級塗装技能士の技術力を踏まえたうえで、お客様と相談しながらご自宅に合った適正価格をご案内します。',
                imgSrc: 'https://static.wixstatic.com/media/5ebda9_9507f0f37b9a43afade26f41bc20f676~mv2.png',
                imgAlt: '価格だけで選ばない、適正価格をご案内',
                cta: null,
              },
              {
                title: '塗料は最低でもシリコン以上をご提案',
                body: '外壁を長持ちさせるためには、品質面を考えてもシリコン以上の塗料を使用することが大切です。職人の技術力と耐久性を踏まえたうえで、適切な塗料をご提案します。',
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
                    <h3 className="text-balance break-keep [overflow-wrap:anywhere] text-base sm:text-[1.05rem] font-bold mb-2 leading-[1.45]" style={{ color: '#0a1628' }}>
                      <span className="heading-highlight">{title}</span>
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

        </div>
      </section>

      {/* ── 2. ペイントネットの強み ──────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden py-14 sm:py-24">
        {/* PC・タブレット: 既存の背景画像（変更なし） */}
        <div
          aria-hidden="true"
          className="hidden md:block absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(https://static.wixstatic.com/media/5ebda9_d91c62c59e6c4bc6aef3cb0848c36058~mv2.png)' }}
        />
        {/* モバイル: 指定の背景画像のみ表示 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={STRENGTH_BG_PATTERN_IMG}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 block h-full w-full object-cover object-top opacity-30 md:hidden"
        />
        {/* 文字を読みやすくする薄い白オーバーレイ（PC/モバイルで強度を分ける） */}
        <div className="hidden md:block absolute inset-0 z-[1] bg-white/70 pointer-events-none" />
        <div className="block md:hidden absolute inset-0 z-[1] bg-white/45 pointer-events-none" />
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
              <span className="inline-block">国家資格</span>である<span className="inline-block">一級塗装技能士</span>を持つ職人・業者を<span className="inline-block">厳選</span>してご紹介する、<span className="whitespace-nowrap">Paint Net</span>ならではのポイントをご紹介します。
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
            {[
              {
                n: '01',
                icon: Home,
                title: '地域密着で、一級塗装技能士に相談がしやすい',
                desc: '岐阜・愛知・三重エリアに精通した地域密着型のサポートで、資格を持つ職人に気軽にご相談いただける環境を整えています。',
              },
              {
                n: '02',
                icon: Star,
                title: '一級塗装技能士を持つ職人だけをご紹介',
                desc: '国家資格である一級塗装技能士を保有し、技術力に実績のある職人・業者だけを厳選してご紹介します。安心して工事をお任せいただけます。',
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
                      <p className="text-sm font-bold leading-[1.45] mb-1.5 text-balance break-keep [overflow-wrap:anywhere]" style={{ color: '#28292a' }}>
                        <span className="heading-highlight">{title}</span>
                      </p>
                      <p className="text-xs leading-relaxed" style={{ color: '#5a5f6c' }}>{desc}</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={200} className="mt-10">
            <div className="flex flex-col items-center">
              <div className={CTA_WRAPPER_CLASS}>
                <CtaNotice />
                <CtaPrimary label={CTA_LABEL} sub="登録不要・完全無料" />
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── 8. ビフォーアフター ──────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-16 sm:py-24"
        style={{ backgroundColor: '#fbf8f4' }}
      >
        <OrganicBlob
          className="absolute -top-10 -right-10 w-56 h-56 sm:w-72 sm:h-72 pointer-events-none"
          color={SVG_BLUE_BG}
          opacity={0.3}
        />
        <OrganicBlob
          className="absolute -bottom-16 -right-16 w-64 h-64 sm:w-96 sm:h-96 pointer-events-none"
          color={SVG_BEIGE_BG}
          opacity={0.35}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <Label>施工事例</Label>
            <H2 center>
              <span className="heading-highlight">ビフォーアフター</span>
            </H2>
            <p className="mt-4 text-sm sm:text-base text-[#5a5f6c] max-w-md mx-auto leading-relaxed">
              スライダーを左右に動かして、施工前後の変化を比較してみてください。一級塗装技能士による施工事例です。
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

        </div>
      </section>
      {/* ── 7. 症状チェック ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white py-16 sm:py-24">
        <CrackInspectionSvg className="hidden lg:block absolute -top-10 -right-10 w-40 h-40 opacity-[0.13] pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">

          <div className="text-center mb-8">
            <Label>劣化サイン</Label>
            <H2 center>
              <HeadingLines
                lines={['こんな症状があるなら、', '早めの確認がおすすめ']}
                full="こんな症状があるなら、早めの確認がおすすめ"
              />
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

        </div>
      </section>

      {/* ── 5-A. ペイントネットの強み（コードベース・inline SVG） ───────────── */}
      <StrengthSection />

      {/* ── 5-B. 一級塗装技能士とは？ ─────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white py-16 sm:py-24">
        <OrganicBlob
          className="absolute -top-16 -right-16 w-64 h-64 sm:w-80 sm:h-80 pointer-events-none"
          color={SVG_BLUE_BG}
          opacity={0.35}
        />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <Label>一級塗装技能士とは</Label>
            <H2 center>
              <span className="heading-highlight">一級塗装技能士とは？</span>
            </H2>
            <p className="mt-4 text-sm sm:text-base text-[#5a5f6c] max-w-lg mx-auto leading-relaxed text-balance break-keep [overflow-wrap:anywhere]">
              国家検定に合格した、塗装技能の証です
            </p>
          </div>

          <FadeUp>
            <div
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center rounded-2xl border p-6 sm:p-10"
              style={{
                borderColor: '#d8cebd',
                backgroundColor: '#fbf8f4',
                boxShadow: '0 1px 1px rgba(28,29,32,.03), 0 6px 18px -14px rgba(28,29,32,.18)',
              }}
            >
              {/* 図解: 国家検定＋実務経験＋実技学科 → 合格バッジ */}
              <div>
                <div className="grid grid-cols-1 gap-3 max-w-xs mx-auto">
                  {[
                    { Icon: CertDocIcon, label: '国家検定' },
                    { Icon: ExperienceIcon, label: '塗装の実務経験' },
                    { Icon: ExamPaperIcon, label: '実技＋学科' },
                  ].map(({ Icon, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-3 rounded-xl border bg-white px-4 py-3"
                      style={{ borderColor: '#d8cebd' }}
                    >
                      <Icon className="w-9 h-9 shrink-0" />
                      <span className="text-sm font-bold text-[#28292a]">{label}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center my-3">
                  <ArrowConnectorSvg className="w-6 h-6 rotate-90 opacity-80" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <CertificationBadgeSvg className="w-20 h-20" />
                  <span className="text-sm font-extrabold text-center text-balance break-keep [overflow-wrap:anywhere]" style={{ color: SVG_NAVY }}>
                    合格 → 一級塗装技能士
                  </span>
                </div>
              </div>

              {/* 説明文 */}
              <div>
                <p className="text-sm sm:text-base text-[#5a5f6c] leading-relaxed text-balance break-keep [overflow-wrap:anywhere]">
                  一級塗装技能士は、厚生労働省の技能検定制度に基づく国家資格のひとつです。
                  塗装に関する知識だけでなく、実務経験と技能の両方が求められ、合格者は「技能士」と名乗ることができます。
                  外壁塗装では、こうした資格を持つ職人に相談できるかどうかが、安心感のひとつになります。
                </p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── 5-D. なぜ一級塗装技能士だと安心なの？ ─────────────────────────── */}
      <section className="relative overflow-hidden bg-white py-16 sm:py-24">
        <OrganicBlob
          className="absolute -top-14 -left-14 w-60 h-60 sm:w-80 sm:h-80 pointer-events-none"
          color={SVG_BEIGE_BG}
          opacity={0.35}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Label>3つの安心理由</Label>
            <H2 center>
              <HeadingLines
                lines={['なぜ一級塗装技能士', 'だと安心なの？']}
                full="なぜ一級塗装技能士だと安心なの？"
              />
            </H2>
            <p className="mt-4 text-sm sm:text-base text-[#5a5f6c] max-w-lg mx-auto leading-relaxed text-balance break-keep [overflow-wrap:anywhere]">
              資格そのものが、経験と技能のひとつの目安になります
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                tag: '経験', Icon: ExperienceIcon, bg: SVG_BLUE_BG,
                title: '実務経験を前提にしている',
                desc: '一級塗装技能士は、いきなり誰でも取れる資格ではありません。一定の実務経験が必要なため、現場経験の蓄積が前提になっています。',
              },
              {
                tag: '技能', Icon: BrushCheckIcon, bg: SVG_BEIGE_BG,
                title: '実技と学科の両方が必要',
                desc: '知識だけでなく、実際の施工技能も評価されます。そのため、現場での対応力も含めた技能の目安になります。',
              },
              {
                tag: '品質', Icon: ShieldStarIcon, bg: SVG_GRAY_BG,
                title: '品質向上の考え方と相性が良い',
                desc: '公共工事の標準的な仕様の考え方では、1級などの技能者が現場で作業しながら、他の技能者に作業指導を行い、施工品質の向上を図るとされています。一級塗装技能士は、こうした品質を高める役割が期待されるレベルの技能者といえます。',
              },
            ].map(({ tag, Icon, bg, title, desc }, i) => (
              <FadeUp key={tag} delay={i * 80}>
                <div
                  className="h-full rounded-2xl border p-6 flex flex-col gap-4"
                  style={{
                    borderColor: '#d8cebd',
                    backgroundColor: bg,
                    boxShadow: '0 1px 1px rgba(28,29,32,.03), 0 6px 18px -14px rgba(28,29,32,.18)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-white">
                      <Icon className="w-8 h-8" />
                    </div>
                    <span className="text-xs font-extrabold tracking-widest" style={{ color: SVG_ORANGE }}>
                      理由{i + 1}・{tag}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-[#28292a] leading-[1.45] text-balance break-keep [overflow-wrap:anywhere]">
                    <span className="heading-highlight">{title}</span>
                  </p>
                  <p className="text-xs text-[#5a5f6c] leading-relaxed">{desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5-C. どうやって取得するの？ ───────────────────────────────────── */}
      <section className="relative overflow-hidden py-16 sm:py-24" style={{ backgroundColor: '#fbf8f4' }}>
        <OrganicBlob
          className="absolute -bottom-16 -left-16 w-60 h-60 sm:w-80 sm:h-80 pointer-events-none"
          color={SVG_BEIGE_BG}
          opacity={0.4}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Label>取得プロセス</Label>
            <H2 center>
              <HeadingLines
                lines={['どうやって', '一級塗装技能士に', 'なるの？']}
                full="どうやって一級塗装技能士になるの？"
              />
            </H2>
            <p className="mt-4 text-sm sm:text-base text-[#5a5f6c] max-w-lg mx-auto leading-relaxed text-balance break-keep [overflow-wrap:anywhere]">
              経験を積み、実技と学科の両方をクリアして取得します
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-4">
            {[
              { Icon: HelmetIcon, title: '現場経験を積む', desc: '塗装の現場で実務経験を重ねます。' },
              { Icon: CertDocIcon, title: '受検資格を満たす', desc: '実務経験などの受検条件を満たします。' },
              { Icon: ExamPaperIcon, title: '実技試験・学科試験を受ける', desc: '技能と知識の両方が試されます。' },
              { Icon: CertificationBadgeSvg, title: '両方合格で一級塗装技能士', desc: '実技・学科の両方に合格して認定されます。' },
            ].map(({ Icon, title, desc }, i, arr) => (
              <FadeUp key={title} delay={i * 70} className="relative">
                <div
                  className="h-full flex flex-col items-center text-center gap-3 rounded-2xl border bg-white p-6"
                  style={{ borderColor: '#d8cebd', boxShadow: '0 1px 1px rgba(28,29,32,.03), 0 6px 18px -14px rgba(28,29,32,.18)' }}
                >
                  <span className="text-xs font-extrabold tracking-widest" style={{ color: SVG_ORANGE }}>
                    STEP {i + 1}
                  </span>
                  <Icon className="w-12 h-12" />
                  <p className="text-sm font-bold text-[#28292a] leading-[1.45] text-balance break-keep [overflow-wrap:anywhere]">
                    <span className="heading-highlight">{title}</span>
                  </p>
                  <p className="text-xs text-[#5a5f6c] leading-relaxed">{desc}</p>
                </div>
                {i < arr.length - 1 && (
                  <div className="lg:hidden flex justify-center my-2">
                    <ArrowConnectorSvg className="w-6 h-6 rotate-90 opacity-70" />
                  </div>
                )}
                {i < arr.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-5 -translate-y-1/2 z-10">
                    <ArrowConnectorSvg className="w-5 h-5 opacity-70" />
                  </div>
                )}
              </FadeUp>
            ))}
          </div>

          <p className="mt-10 text-xs text-[#8a8f9a] leading-relaxed text-center max-w-2xl mx-auto">
            ※実務経験のみの場合、1級受検の目安は7年以上です。学歴や職業訓練歴などで短縮される場合があります。
            <br className="md:hidden" />
            ※実技試験は100点満点中60点以上、学科試験は100点満点中65点以上が合格の目安です（都道府県職業能力開発協会が実施する職種の場合）。
          </p>
        </div>
      </section>

      {/* ── 5-E. なぜ一級塗装技能士は限られるの？ ─────────────────────────── */}
      <section className="relative overflow-hidden py-16 sm:py-24" style={{ backgroundColor: '#fbf8f4' }}>
        <OrganicBlob
          className="absolute -bottom-14 -right-14 w-60 h-60 sm:w-80 sm:h-80 pointer-events-none"
          color={SVG_BLUE_BG}
          opacity={0.3}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Label>取得のハードル</Label>
            <H2 center>
              <HeadingLines
                lines={['なぜ一級塗装技能士は', '限られるの？']}
                full="なぜ一級塗装技能士は限られるの？"
              />
            </H2>
            <p className="mt-4 text-sm sm:text-base text-[#5a5f6c] max-w-lg mx-auto leading-relaxed text-balance break-keep [overflow-wrap:anywhere]">
              取得までのハードルが高いため、誰でもすぐに名乗れる資格ではありません
            </p>
          </div>

          {/* 図解: 3つのハードルが階段状に積み上がるイメージ */}
          <div className="relative flex items-end justify-center gap-4 sm:gap-8 mb-10">
            {/* 3段をつなぐ、うっすらとした動線 */}
            <div
              className="hidden sm:block absolute left-[12%] right-[12%] bottom-0 h-px pointer-events-none"
              style={{ borderTop: '2px dashed #f3c08a', opacity: 0.6 }}
            />
            {[
              { Icon: ExperienceCredentialIcon, label: '実務経験が必要', h: 'h-28 sm:h-32', watermark: CheckCircleSvg },
              { Icon: PracticalExamIcon, label: '実技と学科の\n両方が必要', h: 'h-36 sm:h-44', watermark: ExamPaperIcon },
              { Icon: MasteryMedalIcon, label: '継続して技能を\n磨く必要がある', h: 'h-44 sm:h-56', watermark: ShieldCheckSvg },
            ].map(({ Icon, label, h, watermark: Watermark }, i, arr) => (
              <FadeUp key={i} delay={i * 80} className="relative flex flex-col items-center gap-3 flex-1 max-w-[150px]">
                {/* 淡い丸背景＋アイコン */}
                <div
                  className="relative w-[72px] h-[72px] sm:w-20 sm:h-20 rounded-full flex items-center justify-center pointer-events-none"
                  style={{ background: `radial-gradient(circle, ${i === 2 ? SVG_BEIGE_BG : SVG_BLUE_BG} 0%, rgba(255,255,255,0) 72%)` }}
                >
                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-white"
                    style={{ border: '1.5px solid #f0e3d0', boxShadow: '0 4px 14px -6px rgba(28,29,32,0.18)' }}
                  >
                    <Icon className="w-8 h-8 sm:w-9 sm:h-9" />
                  </div>
                </div>

                <p className="text-[11px] sm:text-xs font-bold text-[#28292a] text-center leading-snug whitespace-pre-line text-balance break-keep [overflow-wrap:anywhere]">
                  {label}
                </p>

                {/* 段差カード（土台） */}
                <div
                  className={`relative w-full rounded-t-2xl overflow-hidden ${h}`}
                  style={{
                    background: 'linear-gradient(165deg, #fdba74 0%, #f97316 45%, #ea580c 100%)',
                    boxShadow: '0 10px 22px -8px rgba(234,88,12,0.45), inset 0 2px 0 rgba(255,255,255,0.35)',
                  }}
                >
                  <div className="absolute inset-x-0 top-0 h-2.5" style={{ background: 'rgba(255,255,255,0.28)' }} />
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.16] pointer-events-none">
                    <Watermark className="w-9 h-9 sm:w-10 sm:h-10" />
                  </div>
                  <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-extrabold tracking-wider text-white/90">
                    STEP {i + 1}
                  </span>
                </div>

                {i < arr.length - 1 && (
                  <ArrowConnectorSvg className="hidden sm:block absolute -right-7 bottom-12 w-5 h-5 opacity-50 rotate-[-28deg] pointer-events-none" />
                )}
              </FadeUp>
            ))}
          </div>

          <FadeUp>
            <p className="text-sm sm:text-base text-[#5a5f6c] leading-relaxed text-balance break-keep [overflow-wrap:anywhere] max-w-2xl mx-auto text-center">
              一級塗装技能士が限られる理由は、取得条件の厳しさにあります。
              原則として長い実務経験が必要で、さらに実技試験と学科試験の両方に合格しなければなりません。
              そのため、現場経験・知識・技能を継続して積み重ねた人だけが取得しやすい資格です。
            </p>
          </FadeUp>

          <p className="mt-10 text-[11px] text-[#8a8f9a] text-center">
            ※技能検定制度・JAVADA公開情報をもとに構成
          </p>
          <FadeUp delay={200} className="mt-10">
            <div className="flex flex-col items-center">
              <div className={CTA_WRAPPER_CLASS}>
                <CtaNotice />
                <CtaPrimary label={CTA_LABEL} sub="登録不要・完全無料" />
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── 6. 費用・塗料・時期 ──────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-16 sm:py-24"
        style={{ background: 'linear-gradient(160deg, #fffbf7 0%, #fff6ee 50%, #fffbf7 100%)' }}
      >
        <OrganicBlob
          className="absolute -bottom-16 -left-16 w-60 h-60 sm:w-80 sm:h-80 pointer-events-none"
          color={SVG_BLUE_BG}
          opacity={0.4}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">

          <div className="text-center mb-8">
            <Label>基礎知識</Label>
            <H2 center>
              <HeadingLines
                lines={['費用・塗料・時期について', '知っておきたいこと']}
                full="費用・塗料・時期について知っておきたいこと"
              />
            </H2>
            <p className="mt-4 text-sm sm:text-base text-[#5a5f6c] max-w-md mx-auto leading-relaxed">
              外壁塗装を検討するうえで、最初に押さえておきたい基本情報です。
              金額の安さだけで選ぶと、必要な工程が省かれてしまう場合があります。塗料の種類・下地処理・塗装回数・職人の技術力まで含めて比較することが大切です。
            </p>
          </div>

          <div className="space-y-4">
            {[
              { n: '1', orange: true, icon: YenCoinCheckSvg,
                title: '工事費用は家の条件によって大きく変わる',
                body: '建物の大きさ・外壁の状態・使用する塗料によって、費用は数十万〜百万円以上の幅があります。「相場が分からない」という方こそ、塗料・工程・職人の技術力まで含めて比較することが大切です。' },
              { n: '2', orange: false, icon: PaintCanLineSvg,
                title: '塗料の種類で耐久年数が変わる',
                body: 'シリコン・フッ素・無機など、塗料によって耐久年数は5〜20年以上と大きく異なります。コストと耐久性のバランスを、専門家に相談しながら選ぶのがおすすめです。' },
              { n: '3', orange: false, icon: EstimateDocumentSvg,
                title: '早めの確認が補修費を抑えるポイント',
                body: '外壁の劣化は放置すると下地まで傷みが広がり、補修費用が増加しやすくなります。「まだ大丈夫かな」という段階で、資格を持つ職人に確認してもらうのが賢い選択です。' },
              { n: '4', orange: false, icon: CertificationBadgeSvg,
                title: '時期よりも職人選びの方が結果を左右する',
                body: '塗装は年間を通じて施工可能です。「いつ塗るか」よりも「どの職人に頼むか」の方が、仕上がりや満足度に大きく影響します。' },
            ].map(({ n, orange, icon: CardIcon, title, body }, i) => (
              <FadeUp key={n} delay={i * 80}>
                <div
                  className="relative overflow-hidden grid items-start rounded-lg p-5 sm:p-7 border transition-shadow duration-200"
                  style={{
                    gridTemplateColumns: 'auto 1fr',
                    gap: '1.25rem',
                    backgroundColor: orange ? '#fff3e8' : '#ffffff',
                    borderColor: '#d8cebd',
                    boxShadow: '0 1px 1px rgba(28,29,32,.03), 0 6px 18px -14px rgba(28,29,32,.18)',
                  }}
                >
                  <CardIcon className="hidden sm:block absolute -bottom-4 -right-4 w-24 h-24 opacity-[0.08] pointer-events-none" />
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
                    <p className="text-base font-bold text-[#28292a] mb-2 leading-[1.45] text-balance break-keep [overflow-wrap:anywhere]">
                      <span className="heading-highlight">{title}</span>
                    </p>
                    <p className="text-sm text-[#5a5f6c] leading-relaxed">{body}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── 施工事例・施工中の確認体制・サポート ────────────────────────────── */}
      <section className="relative overflow-hidden py-16 sm:py-24" style={{ backgroundColor: '#fbf8f4' }}>
        <OrganicBlob
          className="absolute -top-10 -right-10 w-56 h-56 sm:w-72 sm:h-72 pointer-events-none"
          color={SVG_BLUE_BG}
          opacity={0.3}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          {/* ── 施工中の確認体制ギャラリー ──────────────────────────────────── */}
          <FadeUp delay={120} className="mt-20 sm:mt-28">
            <div className="text-center mb-8 sm:mb-10">
              <Label>施工中の確認体制</Label>
              <H2 center>
                <HeadingLines
                  lines={['一級塗装技能士による', '施工品質を、', '写真で確認']}
                  full="一級塗装技能士による施工品質を、写真で確認"
                />
              </H2>
              <p className="mt-4 text-sm sm:text-base text-[#5a5f6c] max-w-lg mx-auto leading-relaxed text-balance break-keep [overflow-wrap:anywhere]">
                <span className="whitespace-nowrap">Paint Net</span>では、施工中も職人さんとやりとりしながら、作業状況を確認します。
                お客様にも安心していただけるよう、施工中の写真を共有し、見えにくい工程も分かりやすくお伝えします。
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

            {/* 準備〜施工の様子: 画像全体をそのまま見せる(object-contain) */}
            <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {[
                { src: PREP_PHOTO_IMG, alt: '施工前の道具・材料の準備の様子', caption: '丁寧な準備からはじまる施工' },
                { src: PAINTING_PHOTO_IMG, alt: '一級塗装技能士による外壁塗装の様子', caption: '一級塗装技能士による塗装作業' },
              ].map(({ src, alt, caption }) => (
                <div
                  key={alt}
                  className="mx-auto w-full max-w-5xl rounded-2xl"
                  style={{ backgroundColor: '#fbf8f4', boxShadow: '0 6px 24px rgba(0,0,0,.08)' }}
                >
                  <div className="p-2.5 sm:p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={alt}
                      className="block h-auto w-full max-w-full object-contain rounded-xl"
                      loading="lazy"
                    />
                  </div>
                  <p className="px-4 pb-4 text-xs sm:text-sm text-center font-bold text-balance break-keep [overflow-wrap:anywhere]" style={{ color: '#5a5f6c' }}>
                    {caption}
                  </p>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>
      {/* ── 10. メインCTA ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-16 sm:py-24" style={{ backgroundColor: SVG_BEIGE_LIGHT }}>
        <OrganicBlob
          className="hidden lg:block absolute -top-16 -left-16 w-72 h-72 pointer-events-none"
          color={SVG_BLUE_BG}
          opacity={0.4}
        />
        <OrganicBlob
          className="hidden lg:block absolute -bottom-20 -right-16 w-72 h-72 pointer-events-none"
          color={SVG_BEIGE_BG}
          opacity={0.5}
        />
        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6">
          <FadeUp>
            <div
              className="relative overflow-hidden rounded-[28px] p-8 sm:p-12 text-center"
              style={{
                background: 'linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 55%, #EFF6FF 100%)',
                border: '1px solid #FED7AA',
                boxShadow: '0 18px 45px rgba(15,23,42,0.08)',
              }}
            >
              <SoftWaveBg className="absolute inset-x-0 bottom-0 w-full h-auto pointer-events-none opacity-80" />
              <div className="relative z-10">
                <span className="inline-block text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#ea580c' }}>
                  一級塗装技能士紹介 / Certified Craftsman
                </span>
                <h2
                  className="break-keep [overflow-wrap:normal] text-2xl sm:text-3xl font-black leading-[1.45] tracking-tight mb-5"
                  style={{ color: SVG_NAVY }}
                >
                  <HeadingLines lines={['一級塗装技能士に', '相談してみませんか？']} full="一級塗装技能士に相談してみませんか？" />
                </h2>
                <p className="text-balance break-keep [overflow-wrap:anywhere] text-base text-[#5a5f6c] leading-relaxed mb-8">
                  外壁の状態や費用感が分からない方も、まずはお気軽にご相談ください。
                  <br className="md:hidden" />
                  <span className="whitespace-nowrap">Paint Net</span>が、品質を重視した外壁塗装の相談先をご案内します。
                </p>
                <div className="flex flex-col items-center gap-4">
                  <div className={`relative ${CTA_WRAPPER_CLASS}`}>
                    <ArrowNudgeSvg className="hidden lg:block absolute top-1/2 -translate-y-1/2 -left-14 w-10 h-10 opacity-60 scale-x-[-1] pointer-events-none" />
                    <CtaNotice />
                    <CtaPrimary label={CTA_LABEL} sub="登録不要・完全無料" />
                  </div>
                  <CtaLink label="相場と進め方を先に確認する" />
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── 13. ご利用の流れ ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white py-16 sm:py-24">
        <OrganicBlob
          className="absolute -bottom-14 -left-14 w-60 h-60 sm:w-80 sm:h-80 pointer-events-none"
          color={SVG_BEIGE_BG}
          opacity={0.35}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <Label>ご利用の流れ</Label>
            <H2 center>
              <HeadingLines
                lines={['ご相談から', 'ご依頼までの流れ']}
                full="ご相談からご依頼までの流れ"
              />
            </H2>
            <p className="mt-4 text-sm sm:text-base text-[#5a5f6c] max-w-md mx-auto leading-relaxed">
              登録不要・相談無料で、無理な勧誘なくご検討いただけます。
            </p>
          </div>

          <div className="space-y-4">
            {[
              { n: '1', title: '無料相談', body: 'まずはお気軽にご相談ください。登録不要・完全無料でご利用いただけます。' },
              { n: '2', title: '希望内容の確認', body: 'ご希望の工事内容や、気になっている外壁の状態について確認します。' },
              { n: '3', title: '一級塗装技能士を紹介', body: '国家資格である一級塗装技能士を持つ職人・業者を厳選してご紹介します。' },
              { n: '4', title: '現地調査・見積もり', body: '現地調査のうえ、内訳の分かりやすい見積もりをご案内します。' },
              { n: '5', title: '内容に納得してから依頼', body: '価格・工程に納得いただいたうえで、ご依頼いただけます。即決を迫ることはありません。' },
            ].map(({ n, title, body }, i) => (
              <FadeUp key={n} delay={i * 70}>
                <div
                  className="relative overflow-hidden flex items-start gap-4 rounded-lg p-5 sm:p-6 border"
                  style={{
                    borderColor: '#d8cebd',
                    backgroundColor: '#fbf8f4',
                    boxShadow: '0 1px 1px rgba(28,29,32,.03), 0 6px 18px -14px rgba(28,29,32,.18)',
                  }}
                >
                  <span
                    className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-base font-extrabold text-white"
                    style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
                  >
                    {n}
                  </span>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-sm sm:text-base font-bold mb-1.5 leading-[1.45] text-balance break-keep [overflow-wrap:anywhere]" style={{ color: '#28292a' }}>
                      <span className="heading-highlight">{title}</span>
                    </p>
                    <p className="text-sm text-[#5a5f6c] leading-relaxed">{body}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. お客様の口コミ ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white py-16 sm:py-24">
        <OrganicBlob
          className="absolute -top-12 -left-12 w-56 h-56 sm:w-72 sm:h-72 pointer-events-none"
          color={SVG_BEIGE_BG}
          opacity={0.3}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <Label>お客様の声</Label>
            <H2 center>
              <HeadingLines
                lines={['実際に利用された', 'お客様の口コミ']}
                full="実際に利用されたお客様の口コミ"
              />
            </H2>
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

      {/* ── 11. FAQ ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-14 sm:py-24" style={{ backgroundColor: '#fbf8f4' }}>
        <OrganicBlob
          className="absolute -bottom-14 -right-14 w-56 h-56 sm:w-72 sm:h-72 pointer-events-none"
          color={SVG_BLUE_BG}
          opacity={0.3}
        />
        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <Label>よくある質問</Label>
            <H2 center>
              <HeadingLines
                lines={['はじめての方から', 'よくいただくご質問']}
                full="はじめての方からよくいただくご質問"
              />
            </H2>
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
                background: 'linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 55%, #EFF6FF 100%)',
                border: '1px solid #FED7AA',
                boxShadow: '0 18px 45px rgba(15,23,42,0.08)',
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 20% 80%, rgba(249,115,22,0.07) 0%, transparent 40%), radial-gradient(circle at 80% 20%, rgba(59,130,246,0.07) 0%, transparent 40%)',
                }}
              />
              <SoftWaveBg className="absolute inset-x-0 bottom-0 w-full h-auto pointer-events-none opacity-80" />
              <div className="relative z-10">
                <span className="inline-block text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#ea580c' }}>
                  Next Step
                </span>
                <h2
                  className="break-keep [overflow-wrap:normal] text-2xl sm:text-3xl font-black leading-[1.45] tracking-tight mb-3"
                  style={{ color: SVG_NAVY }}
                >
                  <HeadingLines lines={['一級塗装技能士に', '相談してみませんか？']} full="一級塗装技能士に相談してみませんか？" />
                </h2>
                <p className="text-balance break-keep [overflow-wrap:anywhere] text-sm text-[#5a5f6c] leading-relaxed mb-8 max-w-sm mx-auto">
                  外壁の状態や費用感が分からない方も、まずはお気軽にご相談ください。<span className="whitespace-nowrap">Paint Net</span>が、品質を重視した外壁塗装の相談先をご案内します。
                </p>
                <div className="flex justify-center gap-6 text-xs text-[#5a5f6c] mb-8">
                  {['登録不要', '完全無料', '営業なし'].map((t) => (
                    <span key={t} className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-orange-500" />
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                  <div className={`relative ${CTA_WRAPPER_CLASS}`}>
                    <ArrowNudgeSvg className="hidden lg:block absolute top-1/2 -translate-y-1/2 -left-14 w-10 h-10 opacity-60 scale-x-[-1] pointer-events-none" />
                    <CtaNotice />
                    <CtaPrimary label={CTA_LABEL} sub="登録不要・完全無料" />
                  </div>
                  <CtaLink label="相場と進め方を先に確認する" />
                </div>
                <p className="mt-6 text-xs text-[#8a8f9a]">
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
            <span className="inline-block">一級塗装技能士</span>を持つ職人・業者を厳選してご紹介する、東海エリアの<span className="inline-block">外壁塗装</span>サポートサービスです。
            <br />© 2024 <span className="whitespace-nowrap">Paint Net</span>. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
