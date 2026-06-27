'use client';

import { useState, useEffect } from 'react';

// ── Types ────────────────────────────────────────────────────────────────────

type Step = 'intro' | 'quiz' | 'form' | 'success';
type Segment = 'active' | 'middle' | 'passive';
type AnswerValue = string | string[];

interface Answers {
  [key: number]: AnswerValue;
}

interface FormData {
  name: string;
  phone: string;
  email: string;
  comment: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const TOP_IMAGE_URL =
  'https://static.wixstatic.com/media/5ebda9_cd66f7eb7f9847c8aa83463dcf9ddbb1~mv2.png';

const TOTAL_QUESTIONS = 8;

// Q1 は intro に直接表示（2択カード）
const Q1_OPTIONS = [
  {
    label: '外壁塗装をしたいと考えている',
    sub: '今すぐ・または近い将来に工事を検討している',
    emoji: '🏠',
    variant: 'orange' as const,
    badge: '今すぐ診断',
  },
  {
    label: '今は情報収集したい',
    sub: 'まずは相場・業者・時期について調べたい',
    emoji: '📚',
    variant: 'navy' as const,
    badge: 'まず情報収集',
  },
];

// Q2〜Q8（配列インデックス=id-2）
const QUESTIONS = [
  {
    id: 2,
    text: 'お住まいの地域を教えてください',
    sub: '対応エリアの確認に使用します',
    multi: false,
    options: ['岐阜県', '愛知県', '三重県', 'その他'],
  },
  {
    id: 3,
    text: '建物の種類を教えてください',
    sub: '建物に合わせた最適な塗装プランをご提案します',
    multi: false,
    options: ['戸建て', 'アパート・賃貸オーナー物件', '店舗・事務所', 'その他'],
  },
  {
    id: 4,
    text: '建物の築年数を教えてください',
    sub: '塗装の緊急度や最適な塗料選びの参考にします',
    multi: false,
    options: ['10年未満', '10〜15年', '16〜20年', '21年以上', 'わからない'],
  },
  {
    id: 5,
    text: '外壁で気になる症状はありますか？',
    sub: '複数選択できます（該当するものをすべて選んでください）',
    multi: true,
    options: ['色あせ', 'ひび割れ', 'コケ・カビ', 'チョーキング', '特にない', 'わからない'],
  },
  {
    id: 6,
    text: '工事を考えている時期はいつですか？',
    sub: 'スケジュールの調整に役立てます',
    multi: false,
    options: ['できるだけ早く', '3か月以内', '半年以内', 'まだ情報収集中'],
  },
  {
    id: 7,
    text: '一番重視したいことは何ですか？',
    sub: 'ご要望に合った業者・プランをご紹介します',
    multi: false,
    options: [
      '価格を抑えたい',
      '長持ちする塗料を選びたい',
      '見た目をきれいにしたい',
      '信頼できる会社に任せたい',
      '相見積もりしたい',
    ],
  },
  {
    id: 8,
    text: 'まず知りたいことは何ですか？',
    sub: '最適な情報をご案内します',
    multi: false,
    options: ['相場', 'おすすめの塗料', '工事時期', '優良業者の選び方', '無料見積もり'],
  },
];

const QUESTION_LABELS = [
  '現在の状況',
  'お住まいの地域',
  '建物の種類',
  '築年数',
  '気になる症状',
  '工事を考えている時期',
  '一番重視したいこと',
  'まず知りたいこと',
];

// ── Segmentation（Q6=工事時期, Q8=まず知りたいこと） ─────────────────────────

function getSegment(answers: Answers): Segment {
  const timing = answers[6] as string | undefined;
  const wantToKnow = answers[8] as string | undefined;
  if (timing === 'できるだけ早く' || wantToKnow === '無料見積もり') return 'active';
  if (timing === '3か月以内' || timing === '半年以内') return 'middle';
  return 'passive';
}

function formatAnswer(val: AnswerValue | undefined): string {
  if (val === undefined) return '未回答';
  if (Array.isArray(val)) return val.length > 0 ? val.join('、') : '未選択';
  return val;
}

const SEGMENT_CONFIG: Record<
  Segment,
  { badge: string; title: string; body: string; cta: string; icon: string; bgClass: string; borderClass: string; badgeClass: string }
> = {
  active: {
    badge: '今すぐ動けるタイミング',
    title: '一級塗装技能士に無料相談してみましょう',
    body: 'ご回答の内容から、今すぐ一級塗装技能士へのご相談をおすすめします。国家資格を持つ職人・業者を厳選してご紹介します。',
    cta: '一級塗装技能士に相談する',
    icon: '🔥',
    bgClass: 'bg-gradient-to-br from-orange-50 to-amber-50',
    borderClass: 'border-orange-200',
    badgeClass: 'bg-orange-100 text-orange-700',
  },
  middle: {
    badge: '計画的に進めるのがベスト',
    title: '事前に一級塗装技能士を確認しておきましょう',
    body: '工事時期に備えて、国家資格を持つ職人・業者を確認しておくことをおすすめします。技術力を重視して選ぶことができます。',
    cta: '一級塗装技能士を確認する',
    icon: '📋',
    bgClass: 'bg-gradient-to-br from-blue-50 to-sky-50',
    borderClass: 'border-blue-200',
    badgeClass: 'bg-blue-100 text-blue-700',
  },
  passive: {
    badge: 'まずは情報収集から',
    title: '相場と進め方を把握するところから始めましょう',
    body: '外壁塗装の相場・適切な時期・一級塗装技能士の選び方など、基本情報を整理するところから始めましょう。',
    cta: '相場と進め方を確認する',
    icon: '📚',
    bgClass: 'bg-gradient-to-br from-emerald-50 to-teal-50',
    borderClass: 'border-emerald-200',
    badgeClass: 'bg-emerald-100 text-emerald-700',
  },
};

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconCheck({ size = 'sm' }: { size?: 'sm' | 'xs' }) {
  const cls = size === 'xs' ? 'w-3 h-3' : 'w-3.5 h-3.5';
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconChevronLeft() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function IconSpinner() {
  return (
    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function IconHouse() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

// ── Top image（xl未満＝モバイル・iPad のみ表示）──────────────────────────────

function TopImage({ priority = false }: { priority?: boolean }) {
  return (
    <div className="block xl:hidden w-full overflow-hidden bg-slate-100">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={TOP_IMAGE_URL}
        alt="東海に強い外壁塗装会社"
        className="w-full h-auto block"
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function GaihekiLP() {
  const [step, setStep] = useState<Step>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(2); // quiz は Q2 から
  const [answers, setAnswers] = useState<Answers>({});
  const [formData, setFormData] = useState<FormData>({ name: '', phone: '', email: '', comment: '' });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [simulationData, setSimulationData] = useState<{ wallColor1?: { name: string; hex: string }; wallColor2?: { name: string; hex: string } | null; roofColor?: { name: string; hex: string } | null; simulationId?: string; paintPattern?: string } | null>(null);

  // カラーシミュレーションから引き継いだデータを sessionStorage から読み込む
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('gaiheki-sim-data');
      if (!raw) return;
      sessionStorage.removeItem('gaiheki-sim-data');
      const data = JSON.parse(raw);
      setSimulationData(data);
      const isOmakase = data.simulationId === 'omakase';
      const colorDesc = isOmakase
        ? '色の選定はプロにお任せ希望'
        : [
            data.paintPattern !== 'roof-only' && data.wallColor1 ? `外壁${data.paintPattern?.includes('twoTone') ? '1' : ''}：${data.wallColor1.name}（${data.wallColor1.hex}）` : null,
            data.wallColor2 ? `外壁2：${data.wallColor2.name}（${data.wallColor2.hex}）` : null,
            data.roofColor ? `屋根：${data.roofColor.name}（${data.roofColor.hex}）` : null,
            data.simulationId ? `シミュレーションID：${data.simulationId}` : null,
          ].filter(Boolean).join(' / ');
      setFormData((d) => ({ ...d, comment: `【カラーシミュレーション情報】\n${colorDesc}` }));
      setStep('form');
    } catch { /* ignore */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const segment: Segment =
    step === 'form' || step === 'success' ? getSegment(answers) : 'passive';
  const segCfg = SEGMENT_CONFIG[segment];

  // 現在表示中の質問定義（Q2〜Q8）
  const q = QUESTIONS.find((q) => q.id === currentQuestion);
  const isMultiQ = q?.multi ?? false;
  const multiAnswers: string[] = Array.isArray(answers[currentQuestion])
    ? (answers[currentQuestion] as string[])
    : [];

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Q1（ファーストビューの2択）を選択して quiz に入る
  function handleQ1Select(option: string) {
    setAnswers((prev) => ({ ...prev, 1: option }));
    setStep('quiz');
    setCurrentQuestion(2);
    scrollTop();
  }

  // Q2〜Q8 の単一選択
  function handleSingleAnswer(option: string) {
    const newAnswers = { ...answers, [currentQuestion]: option };
    setAnswers(newAnswers);
    if (currentQuestion < TOTAL_QUESTIONS) {
      setTimeout(() => { setCurrentQuestion((n) => n + 1); scrollTop(); }, 200);
    } else {
      setTimeout(() => { setStep('form'); scrollTop(); }, 200);
    }
  }

  // Q5（複数選択）のトグル
  function handleMultiToggle(option: string) {
    const next = multiAnswers.includes(option)
      ? multiAnswers.filter((o) => o !== option)
      : [...multiAnswers, option];
    setAnswers({ ...answers, [currentQuestion]: next });
  }

  // Q5「次へ進む」
  function handleMultiNext() {
    if (currentQuestion < TOTAL_QUESTIONS) {
      setCurrentQuestion((n) => n + 1);
      scrollTop();
    } else {
      setStep('form');
      scrollTop();
    }
  }

  function handleBack() {
    if (step === 'form') {
      setStep('quiz');
      setCurrentQuestion(TOTAL_QUESTIONS);
    } else if (currentQuestion > 2) {
      setCurrentQuestion((n) => n - 1);
    } else {
      // Q2 から戻る → intro（Q1 を再表示）
      setStep('intro');
    }
    scrollTop();
  }


  function validateForm(): boolean {
    const errors: FormErrors = {};
    if (!formData.name.trim()) errors.name = 'お名前を入力してください';
    if (!formData.phone.trim()) errors.phone = '電話番号を入力してください';
    if (!formData.email.trim()) {
      errors.email = 'メールアドレスを入力してください';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = '正しいメールアドレスの形式で入力してください';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, answers, segment }),
      });
      if (!res.ok) throw new Error();
      setStep('success');
      scrollTop();
    } catch {
      setSubmitError('送信に失敗しました。時間をおいてもう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-900" style={{ fontFamily: 'var(--font-sans, system-ui, sans-serif)' }}>

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-[#1e3a5f] shadow-lg">
        <div className="max-w-lg mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-sm">
              <IconHouse />
            </div>
            <div>
              <p className="text-white font-extrabold text-sm leading-none">外壁塗装 無料診断</p>
              <p className="text-blue-300 text-[10px] mt-0.5">一級塗装技能士を厳選紹介</p>
            </div>
          </div>
          {step === 'quiz' && (
            <span className="text-xs font-bold text-white bg-white/15 px-2.5 py-1 rounded-full border border-white/25">
              {currentQuestion} / {TOTAL_QUESTIONS}
            </span>
          )}
        </div>
      </header>

      {/* ── Progress bar（quiz のみ） ── */}
      {step === 'quiz' && (
        <div className="bg-white border-b border-slate-100 shadow-sm">
          <div className="max-w-lg mx-auto px-5 py-2.5">
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${(currentQuestion / TOTAL_QUESTIONS) * 100}%`,
                  background: 'linear-gradient(90deg, #f97316, #fb923c)',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Top image（xl未満のみ / intro・quiz で表示） ── */}
      {(step === 'intro' || step === 'quiz') && <TopImage priority={step === 'intro'} />}

      {/* ── Main ── */}
      <main className="max-w-lg mx-auto px-5 py-8 pb-20">

        {/* ══════════ INTRO（ヒーロー + Q1 の2択） ══════════ */}
        {step === 'intro' && (
          <div className="gaiheki-fade-in">

            {/* キャッチコピー */}
            <div className="text-center mb-4">
              <span
                className="inline-block text-[11px] font-extrabold tracking-widest px-4 py-1.5 rounded-full"
                style={{ background: '#fff3e0', color: '#ea580c', border: '1px solid #fed7aa' }}
              >
                国家資格「一級塗装技能士」だけを厳選紹介
              </span>
            </div>

            {/* メイン見出し */}
            <div className="text-center mb-4 px-1">
              <h1 className="text-[1.5rem] font-extrabold leading-[1.3] tracking-tight text-slate-900">
                外壁塗装を検討中の方へ
                <br />
                <span style={{ color: '#1e3a5f' }}>一級塗装技能士に</span>
                <br />
                <span style={{ color: '#1e3a5f' }}>相談すべきか診断します</span>
              </h1>
            </div>

            {/* サブコピー */}
            <p className="text-sm text-slate-500 text-center leading-relaxed mb-5">
              資格を持つ職人への相談が向いているか、<br />
              <span className="font-semibold text-slate-700">約1分</span>で確認できます。
            </p>

            {/* 信頼バッジ */}
            <div className="flex flex-wrap justify-center gap-2 mb-7">
              {['完全無料', 'しつこい営業なし', '一級塗装技能士のみ紹介'].map((b) => (
                <span
                  key={b}
                  className="flex items-center gap-1.5 text-xs font-medium rounded-full px-3 py-1.5"
                  style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }}
                >
                  <IconCheck size="xs" />
                  {b}
                </span>
              ))}
            </div>

            {/* ─── Q1：2択カード（ファーストビューから即スタート） ─── */}
            <div>
              <p className="text-center text-[0.9rem] font-bold text-slate-700 mb-4 leading-snug">
                まず、現在の状況に近いものを<br />お選びください
              </p>

              <div className="space-y-4">
                {Q1_OPTIONS.map(({ label, sub, emoji, variant, badge }) => {
                  const isOrange = variant === 'orange';
                  const base = isOrange
                    ? {
                        background: 'linear-gradient(150deg, #ff9a47 0%, #f97316 50%, #ea6010 100%)',
                        boxShadow: '0 6px 0 rgba(160,55,0,0.38), 0 14px 32px rgba(249,115,22,0.30), inset 0 1px 0 rgba(255,255,255,0.35)',
                        border: '1.5px solid rgba(210,72,0,0.35)',
                      }
                    : {
                        background: 'linear-gradient(150deg, #2d5a8e 0%, #1e3a5f 55%, #152d4e 100%)',
                        boxShadow: '0 6px 0 rgba(10,20,45,0.42), 0 14px 32px rgba(30,58,95,0.28), inset 0 1px 0 rgba(255,255,255,0.12)',
                        border: '1.5px solid rgba(255,255,255,0.10)',
                      };
                  const hover = isOrange
                    ? {
                        background: 'linear-gradient(150deg, #ffab60 0%, #fb8c2a 50%, #f06820 100%)',
                        boxShadow: '0 8px 0 rgba(160,55,0,0.32), 0 18px 36px rgba(249,115,22,0.40), inset 0 1px 0 rgba(255,255,255,0.40)',
                        transform: 'translateY(-2px)',
                      }
                    : {
                        background: 'linear-gradient(150deg, #3a6ca0 0%, #254a75 55%, #1a3860 100%)',
                        boxShadow: '0 8px 0 rgba(10,20,45,0.36), 0 18px 36px rgba(30,58,95,0.36), inset 0 1px 0 rgba(255,255,255,0.16)',
                        transform: 'translateY(-2px)',
                      };
                  return (
                    <button
                      key={label}
                      onClick={() => handleQ1Select(label)}
                      className="w-full rounded-2xl px-5 py-5 flex items-center gap-4 text-left transition-all duration-200 active:scale-[0.97] relative overflow-hidden"
                      style={{
                        ...base,
                        WebkitTapHighlightColor: 'transparent',
                        color: '#ffffff',
                      }}
                      onMouseEnter={(e) => {
                        Object.assign(e.currentTarget.style, hover);
                      }}
                      onMouseLeave={(e) => {
                        Object.assign(e.currentTarget.style, {
                          background: base.background,
                          boxShadow: base.boxShadow,
                          transform: 'translateY(0)',
                        });
                      }}
                    >
                      {/* 小バッジ */}
                      <span
                        className="absolute top-3 right-3 text-[9px] font-extrabold tracking-wider px-2 py-0.5 rounded-full"
                        style={{
                          background: isOrange ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.15)',
                          color: 'rgba(255,255,255,0.95)',
                        }}
                      >
                        {badge}
                      </span>

                      {/* アイコン */}
                      <span
                        className="text-3xl shrink-0 leading-none w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ background: isOrange ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.12)' }}
                      >
                        {emoji}
                      </span>

                      {/* テキスト */}
                      <div className="flex-1 min-w-0 pr-6">
                        <p className="font-extrabold text-white text-[1.02rem] leading-snug">{label}</p>
                        <p className="text-[0.78rem] mt-1 leading-snug" style={{ color: 'rgba(255,255,255,0.78)' }}>
                          {sub}
                        </p>
                      </div>

                      {/* 矢印 */}
                      <span className="shrink-0 absolute right-4 bottom-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
                        <IconChevronRight />
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="text-center text-[11px] text-slate-400 mt-4">
                選択後、続きの質問に進みます（全8問）
              </p>
            </div>
          </div>
        )}

        {/* ══════════ QUIZ（Q2〜Q8） ══════════ */}
        {step === 'quiz' && q && (
          <div key={currentQuestion} className="gaiheki-step-in">

            {/* 質問ヘッダー */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span
                  className="text-xs font-extrabold px-3 py-1 rounded-full"
                  style={{ background: '#fff3e0', color: '#f97316' }}
                >
                  Q{currentQuestion}
                </span>
                {isMultiQ && (
                  <span
                    className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }}
                  >
                    複数選択可
                  </span>
                )}
                <span className="text-xs text-slate-400 ml-auto">
                  残り {TOTAL_QUESTIONS - currentQuestion + 1} 問
                </span>
              </div>
              <h2 className="text-[1.15rem] font-extrabold text-slate-900 leading-snug tracking-tight mb-1.5">
                {q.text}
              </h2>
              <p className="text-sm text-slate-500">{q.sub}</p>
            </div>

            {/* 選択肢 */}
            <div className="space-y-3 mb-5">
              {q.options.map((option) => {
                const selected = isMultiQ
                  ? multiAnswers.includes(option)
                  : answers[currentQuestion] === option;
                return (
                  <button
                    key={option}
                    onClick={() => isMultiQ ? handleMultiToggle(option) : handleSingleAnswer(option)}
                    className="w-full text-left rounded-2xl border-2 px-5 py-4 flex items-center justify-between transition-all duration-150 active:scale-[0.97]"
                    style={{
                      background: selected ? '#1e3a5f' : '#ffffff',
                      borderColor: selected ? '#1e3a5f' : '#e2e8f0',
                      color: selected ? '#ffffff' : '#1e293b',
                      boxShadow: selected
                        ? '0 4px 16px rgba(30,58,95,0.2)'
                        : '0 1px 4px rgba(0,0,0,0.06)',
                    }}
                  >
                    <span className="font-semibold text-[1rem] leading-snug pr-2">{option}</span>
                    <span
                      className="shrink-0 w-6 h-6 flex items-center justify-center transition-all"
                      style={{
                        background: selected ? '#f97316' : 'transparent',
                        border: selected ? 'none' : '2px solid #cbd5e1',
                        borderRadius: isMultiQ ? '6px' : '50%',
                      }}
                    >
                      {selected && <IconCheck />}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 複数選択の「次へ進む」ボタン */}
            {isMultiQ && (
              <button onClick={handleMultiNext} className="gaiheki-cta-btn mb-5">
                <span className="gaiheki-cta-btn-inner">
                  <span className="text-base font-extrabold">
                    {multiAnswers.length > 0
                      ? `${multiAnswers.length}件選択 · 次へ進む`
                      : '次の質問へ進む'}
                  </span>
                </span>
                <span className="gaiheki-cta-shine" aria-hidden="true" />
              </button>
            )}

            {/* 戻るボタン */}
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              <IconChevronLeft />
              {currentQuestion > 2 ? '前の質問に戻る' : '最初に戻る'}
            </button>
          </div>
        )}

        {/* ══════════ FORM ══════════ */}
        {step === 'form' && (
          <div className="gaiheki-fade-in">

            {/* 結果バナー */}
            <div className={`rounded-2xl border ${segCfg.borderClass} ${segCfg.bgClass} p-5 mb-6 shadow-sm`}>
              <div className="flex items-start gap-3">
                <span className="text-4xl shrink-0 leading-none">{segCfg.icon}</span>
                <div>
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${segCfg.badgeClass} mb-2 inline-block`}>
                    {segCfg.badge}
                  </span>
                  <h2 className="text-[1.02rem] font-extrabold text-slate-900 leading-snug mb-2">
                    {segCfg.title}
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">{segCfg.body}</p>
                </div>
              </div>
            </div>

            {/* 回答サマリー */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-6">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">診断回答内容</p>
              <div className="space-y-2">
                {QUESTION_LABELS.map((label, i) => (
                  <div key={label} className="flex gap-2 text-xs items-baseline flex-wrap">
                    <span className="text-slate-300 shrink-0 w-4 font-mono">{i + 1}.</span>
                    <span className="text-slate-400 shrink-0">{label}：</span>
                    <span className="text-slate-700 font-semibold">{formatAnswer(answers[i + 1])}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* シミュレーション情報（引き継ぎ時のみ表示） */}
            {simulationData && (
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6">
                <p className="text-xs font-bold text-orange-600 mb-3">カラーシミュレーション情報</p>
                {simulationData.simulationId === 'omakase' ? (
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎨</span>
                    <span className="text-sm font-bold text-slate-700">色の選定はプロにお任せ希望</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {simulationData.paintPattern !== 'roof-only' && simulationData.wallColor1 && (
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md border border-black/10 shrink-0" style={{ backgroundColor: simulationData.wallColor1.hex }} />
                        <span className="text-xs text-slate-700">外壁{simulationData.paintPattern?.includes('twoTone') ? '1' : ''}：{simulationData.wallColor1.name} ({simulationData.wallColor1.hex})</span>
                      </div>
                    )}
                    {simulationData.wallColor2 && (
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md border border-black/10 shrink-0" style={{ backgroundColor: simulationData.wallColor2.hex }} />
                        <span className="text-xs text-slate-700">外壁2：{simulationData.wallColor2.name} ({simulationData.wallColor2.hex})</span>
                      </div>
                    )}
                    {simulationData.roofColor && (
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md border border-black/10 shrink-0" style={{ backgroundColor: simulationData.roofColor.hex }} />
                        <span className="text-xs text-slate-700">屋根：{simulationData.roofColor.name} ({simulationData.roofColor.hex})</span>
                      </div>
                    )}
                    {simulationData.simulationId && (
                      <p className="text-[10px] text-slate-400 font-mono">ID: {simulationData.simulationId}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 入力フォーム */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h3 className="text-lg font-extrabold text-slate-900 mb-1">お問い合わせフォーム</h3>
              <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                入力後、担当者より1〜2営業日以内にご連絡します。
              </p>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    お名前 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="山田 太郎"
                    autoComplete="name"
                    value={formData.name}
                    onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))}
                    className="w-full rounded-xl border px-4 py-3.5 text-base outline-none transition-colors"
                    style={{ borderColor: formErrors.name ? '#f87171' : '#e2e8f0', background: formErrors.name ? '#fff5f5' : '#fff' }}
                    onFocus={(e) => { if (!formErrors.name) e.currentTarget.style.borderColor = '#1e3a5f'; }}
                    onBlur={(e) => { if (!formErrors.name) e.currentTarget.style.borderColor = '#e2e8f0'; }}
                  />
                  {formErrors.name && <p className="mt-1 text-xs text-red-500">⚠ {formErrors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    電話番号 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="090-0000-0000"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData((d) => ({ ...d, phone: e.target.value }))}
                    className="w-full rounded-xl border px-4 py-3.5 text-base outline-none transition-colors"
                    style={{ borderColor: formErrors.phone ? '#f87171' : '#e2e8f0', background: formErrors.phone ? '#fff5f5' : '#fff' }}
                    onFocus={(e) => { if (!formErrors.phone) e.currentTarget.style.borderColor = '#1e3a5f'; }}
                    onBlur={(e) => { if (!formErrors.phone) e.currentTarget.style.borderColor = '#e2e8f0'; }}
                  />
                  {formErrors.phone && <p className="mt-1 text-xs text-red-500">⚠ {formErrors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    メールアドレス <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="example@email.com"
                    autoComplete="email"
                    value={formData.email}
                    onChange={(e) => setFormData((d) => ({ ...d, email: e.target.value }))}
                    className="w-full rounded-xl border px-4 py-3.5 text-base outline-none transition-colors"
                    style={{ borderColor: formErrors.email ? '#f87171' : '#e2e8f0', background: formErrors.email ? '#fff5f5' : '#fff' }}
                    onFocus={(e) => { if (!formErrors.email) e.currentTarget.style.borderColor = '#1e3a5f'; }}
                    onBlur={(e) => { if (!formErrors.email) e.currentTarget.style.borderColor = '#e2e8f0'; }}
                  />
                  {formErrors.email && <p className="mt-1 text-xs text-red-500">⚠ {formErrors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    ご質問・コメント <span className="text-xs text-slate-400 font-normal">（任意）</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="気になる点や質問があればこちらにどうぞ"
                    value={formData.comment}
                    onChange={(e) => setFormData((d) => ({ ...d, comment: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-base outline-none resize-none transition-colors"
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#1e3a5f'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
                  />
                </div>

                {submitError && (
                  <div className="rounded-xl bg-red-50 border border-red-200 p-3.5 text-sm text-red-600 flex items-start gap-2">
                    <span className="shrink-0">⚠</span>
                    <span>{submitError}</span>
                  </div>
                )}

                <button type="submit" disabled={isLoading} className="gaiheki-cta-btn">
                  {isLoading ? (
                    <span className="gaiheki-cta-btn-inner" style={{ flexDirection: 'row', gap: '0.6rem' }}>
                      <IconSpinner />
                      <span className="text-sm font-bold">送信中...</span>
                    </span>
                  ) : (
                    <>
                      <span className="gaiheki-cta-btn-inner">
                        <span className="text-[1.05rem] font-extrabold">{segCfg.cta}</span>
                        <span className="text-xs opacity-85">完全無料・しつこい営業なし</span>
                      </span>
                      <span className="gaiheki-cta-shine" aria-hidden="true" />
                    </>
                  )}
                </button>

                <p className="text-xs text-slate-400 text-center leading-relaxed">
                  個人情報は適切に管理し、第三者への提供は行いません。<br />
                  送信後、担当者より1〜2営業日以内にご連絡します。
                </p>
              </form>
            </div>

            <button
              onClick={handleBack}
              className="mt-6 flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              <IconChevronLeft />
              診断に戻る
            </button>
          </div>
        )}

        {/* ══════════ SUCCESS ══════════ */}
        {step === 'success' && (
          <div className="gaiheki-fade-in text-center py-8">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ background: '#d1fae5' }}
            >
              <span className="text-4xl">✅</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-3 tracking-tight">
              送信完了しました
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-7">
              お問い合わせありがとうございます。<br />
              担当者より1〜2営業日以内にご連絡いたします。
            </p>

            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-left mb-6">
              <p className="text-sm font-bold text-emerald-800 mb-3">次のステップ</p>
              <ul className="space-y-2.5">
                {[
                  '担当者からのご連絡をお待ちください',
                  '折り返し連絡の取りやすい時間帯をお知らせいただけるとスムーズです',
                  '外壁の写真（スマホ撮影でOK）をご用意いただけると診断がより的確になります',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-emerald-700">
                    <span
                      className="shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5"
                      style={{ background: '#a7f3d0' }}
                    >
                      <IconCheck size="xs" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer style={{ background: '#1e3a5f' }} className="text-slate-300 py-10 px-5">
        <div className="max-w-lg mx-auto">
          <div className="mb-5">
            <p className="font-extrabold text-white text-sm mb-1">外壁塗装 無料診断</p>
            <p className="text-xs text-slate-400 leading-relaxed">一級塗装技能士を厳選紹介する、岐阜・愛知・三重エリアの外壁塗装相談窓口</p>
          </div>

          <div
            className="rounded-xl p-4 mb-5 text-xs leading-relaxed"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <p className="font-semibold text-slate-300 mb-1.5">運営会社情報</p>
            <p className="text-slate-400">会社名：株式会社〇〇（仮）</p>
            <p className="text-slate-400">所在地：岐阜県岐阜市〇〇町〇〇番地</p>
            <p className="text-slate-400">電話番号：000-000-0000</p>
            <p className="text-slate-400">受付時間：平日 9:00〜18:00</p>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 mb-6">
            {['プライバシーポリシー', '利用規約', '運営会社', 'お問い合わせ'].map((link) => (
              <a key={link} href="#" className="text-xs text-slate-400 hover:text-white transition-colors">
                {link}
              </a>
            ))}
          </div>

          <p className="text-[11px] text-slate-500">
            © 2025 外壁塗装 無料診断. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
