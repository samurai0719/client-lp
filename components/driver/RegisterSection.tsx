'use client';

import { useState } from 'react';
import { QUESTION_LABELS } from './questions';

interface RegisterSectionProps {
  /** 診断で選択した回答 (キー = 質問番号) */
  answers: Record<number, string>;
}

/**
 * 診断完了 → ドラテクの無料登録フォーム。
 * 外部サービスへ送客せず、このページ内で登録まで完結します。
 * 送信先は /api/driver-register (自社サーバー) です。
 */
/**
 * 完了画面のヘッダー。
 * StepHeader (質問ステップ用) と同じ見た目・高さを保ち、
 * ステップカウンターの代わりに「完了」バッジを表示します。
 */
function CompleteHeader() {
  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-20 shadow-sm">
      <div className="max-w-lg mx-auto">
        <div className="px-4 pt-2 pb-1 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/driver/logo-mark.png"
              alt=""
              width={512}
              height={512}
              className="h-5 w-5 object-contain block"
            />
            <span className="text-sm font-bold text-blue-800 tracking-wide">
              ドラテク
            </span>
          </span>
          <span className="text-xs font-semibold text-slate-500">
            STEP <span className="text-blue-600 text-sm">7</span> / 7
          </span>
        </div>

        {/* プログレスバー: 100% */}
        <div className="mx-4 mb-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full w-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400" />
        </div>

        <div className="px-4 pb-2.5 flex items-center gap-0.5">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-center gap-0.5">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 bg-blue-500 text-white">
                ✓
              </div>
              {i < 6 && <div className="h-0.5 w-3 rounded-full shrink-0 bg-blue-400" />}
            </div>
          ))}
          <span className="ml-auto text-[11px] font-semibold text-blue-500">回答完了</span>
        </div>
      </div>
    </header>
  );
}

export default function RegisterSection({ answers }: RegisterSectionProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const answerList = Object.keys(QUESTION_LABELS)
    .map(Number)
    .sort((a, b) => a - b)
    .filter((n) => answers[n]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError(null);

    try {
      const res = await fetch('/api/driver-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, comment, answers }),
      });
      if (!res.ok) throw new Error('request failed');
      setSent(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setError('送信に失敗しました。通信環境をご確認のうえ、もう一度お試しください。');
    } finally {
      setSending(false);
    }
  };

  /* ── 送信完了画面 ── */
  if (sent) {
    return (
      <>
        <CompleteHeader />
        <section className="px-5 py-8 animate-fade-in">
        <div className="text-center mb-6">
          <p className="text-[10px] font-bold tracking-[0.2em] text-blue-500 uppercase mb-2">
            THANK YOU
          </p>
          <h2 className="text-xl font-bold text-slate-800 leading-snug">
            無料登録が完了しました
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            ドラテクの担当より、1〜2営業日以内にご連絡いたします
          </p>
        </div>

        <div className="rounded-xl border-2 border-blue-100 bg-blue-50 px-4 py-5 text-center">
          <p className="text-sm font-bold text-blue-700 leading-relaxed">
            ご登録ありがとうございます
          </p>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            ご入力いただいた条件をもとに、ドラテクがあなたに合う
            ドライバー求人をお探しします。
          </p>
        </div>
        </section>
      </>
    );
  }

  /* ── 診断完了 + 登録フォーム ── */
  return (
    <>
      <CompleteHeader />
      <section className="px-5 py-8 animate-fade-in">

      {/* 見出し: 他ステップ (QuestionCard) と同じ構造・余白 */}
      <div className="text-center mb-6">
        <p className="text-[10px] font-bold tracking-[0.2em] text-blue-500 uppercase mb-2">
          COMPLETE
        </p>
        <h2 className="text-xl font-bold text-slate-800 leading-snug">
          診断が完了しました
        </h2>
        <p className="text-xs text-slate-400 mt-2">
          下記をご入力いただくと、条件に合う求人をご案内します
        </p>
      </div>

      {/* 回答サマリー */}
      {answerList.length > 0 && (
        <div className="rounded-xl border-2 border-slate-200 bg-white shadow-sm mb-5 overflow-hidden">
          <p className="bg-slate-50 border-b border-slate-100 px-4 py-2 text-[11px] font-bold text-slate-500 tracking-wide">
            ご回答内容
          </p>
          <dl className="divide-y divide-slate-100">
            {answerList.map((n) => (
              <div key={n} className="flex items-start gap-3 px-4 py-2.5">
                <dt className="w-28 shrink-0 text-[11px] text-slate-400 leading-snug">
                  {QUESTION_LABELS[n]}
                </dt>
                <dd className="flex-1 text-xs font-bold text-slate-800 leading-snug break-words">
                  {answers[n]}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* 入力フォーム */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="お名前" required>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            placeholder="山田 太郎"
            className={inputCls}
          />
        </Field>

        <Field label="電話番号" required>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            inputMode="tel"
            placeholder="09012345678"
            className={inputCls}
          />
        </Field>

        <Field label="メールアドレス" required>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            inputMode="email"
            placeholder="example@example.com"
            className={inputCls}
          />
        </Field>

        <Field label="ご希望・ご質問">
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="ご希望の勤務時間、気になる点などがあればご記入ください"
            className={`${inputCls} resize-none`}
          />
        </Field>

        {error && (
          <p className="text-xs font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {/* CTA: HeroSection のプライマリボタンと同じトーン・サイズ */}
        <div className="max-w-[360px] w-full mx-auto">
          <button
            type="submit"
            disabled={sending}
            className="group w-full rounded-2xl transition-all duration-150 active:scale-[0.97]
              bg-gradient-to-br from-blue-600 to-blue-800
              hover:from-blue-500 hover:to-blue-700
              shadow-[0_6px_22px_rgba(29,78,216,0.38)]
              hover:shadow-[0_8px_28px_rgba(29,78,216,0.50)]
              disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100
              text-white px-5 py-6"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="text-left">
                <span className="block text-[17px] font-extrabold leading-tight tracking-tight">
                  {sending ? '送信中...' : '無料で登録する'}
                </span>
                <span className="block text-xs font-normal text-blue-200 mt-1.5">
                  ドラテクがあなたに合う求人をご案内します
                </span>
              </div>
              <span className="text-2xl shrink-0 group-hover:translate-x-1.5 transition-transform duration-150">
                →
              </span>
            </div>
          </button>
        </div>

        <p className="text-[11px] text-slate-400 text-center leading-relaxed">
          ご入力いただいた情報は、ドラテクからのご連絡・求人のご案内のみに使用します。
        </p>
      </form>
      </section>
    </>
  );
}

const inputCls =
  'w-full rounded-xl border-2 border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 ' +
  'placeholder:text-slate-300 shadow-sm transition-colors duration-150 ' +
  'focus:border-blue-500 focus:outline-none';

function Field({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="flex items-center gap-1.5 mb-1.5">
        <span className="text-xs font-bold text-slate-700">{label}</span>
        <span
          className={
            'text-[9px] font-bold px-1.5 py-0.5 rounded ' +
            (required ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400')
          }
        >
          {required ? '必須' : '任意'}
        </span>
      </span>
      {children}
    </label>
  );
}
