'use client';

import { useMemo, useState } from 'react';
import {
  CONTACT_TIMES,
  birthYearOptions,
  isValidEmail,
  normalizeDriverPhone,
  type DriverContact,
} from './questions';

interface RegisterSectionProps {
  contact: DriverContact;
  onChange: (patch: Partial<DriverContact>) => void;
  /** 送信する。失敗したら例外を投げる（入力内容はそのまま残す） */
  onSubmit: () => Promise<void>;
}

type Errors = Partial<Record<keyof DriverContact, string>>;

function validate(c: DriverContact): Errors {
  const e: Errors = {};
  if (!c.name.trim()) e.name = 'お名前を入力してください';
  if (!c.birthYear) e.birthYear = '生まれ年を選んでください';
  if (!c.phone.trim()) e.phone = '電話番号を入力してください';
  else if (!normalizeDriverPhone(c.phone)) e.phone = '電話番号は 0 から始まる10〜11桁の数字で入力してください';
  if (c.email.trim() && !isValidEmail(c.email)) e.email = 'メールアドレスの形式をご確認ください';
  return e;
}

/**
 * STEP7：診断完了 → 連絡先入力（無料登録）。
 * 入力内容は親（DriverContent）が持つので、戻って回答を直しても消えない。
 * 送信に失敗しても入力内容と回答はそのまま残す。
 */
export default function RegisterSection({ contact, onChange, onSubmit }: RegisterSectionProps) {
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const years = useMemo(() => birthYearOptions(), []);
  const errors = submitted ? validate(contact) : {};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSubmitted(true);
    setError(null);
    if (Object.keys(validate(contact)).length > 0) return;

    setSending(true);
    try {
      await onSubmit();
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : '送信に失敗しました。通信環境をご確認のうえ、もう一度お試しください。');
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="px-5 pt-6 pb-8">
      {/* 見出し */}
      <div className="text-center mb-6">
        <p className="text-[10px] font-bold tracking-[0.2em] text-blue-500 uppercase mb-2">
          STEP 7 / 7
        </p>
        <h2 className="text-xl font-bold text-slate-800 leading-snug">
          診断が完了しました
        </h2>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          条件に合う求人をご案内するため、
          <br className="min-[400px]:hidden" />
          最後にご連絡先を入力してください
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Field label="お名前" required error={errors.name}>
          <input
            type="text"
            value={contact.name}
            onChange={(e) => onChange({ name: e.target.value })}
            autoComplete="name"
            placeholder="山田 太郎"
            className={inputCls}
          />
        </Field>

        <Field label="生まれ年" required error={errors.birthYear}>
          <select
            value={contact.birthYear}
            onChange={(e) => onChange({ birthYear: e.target.value })}
            autoComplete="bday-year"
            className={inputCls}
          >
            <option value="">選択してください</option>
            {years.map((y) => (
              <option key={y} value={String(y)}>
                {y}年
              </option>
            ))}
          </select>
        </Field>

        <Field label="電話番号" required error={errors.phone}>
          <input
            type="tel"
            value={contact.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            autoComplete="tel"
            inputMode="tel"
            placeholder="09012345678"
            className={inputCls}
          />
        </Field>

        <Field label="メールアドレス" error={errors.email}>
          <input
            type="email"
            value={contact.email}
            onChange={(e) => onChange({ email: e.target.value })}
            autoComplete="email"
            inputMode="email"
            placeholder="example@example.com"
            className={inputCls}
          />
        </Field>

        <Field label="連絡を希望する時間帯">
          <select value={contact.contactTime} onChange={(e) => onChange({ contactTime: e.target.value })} className={inputCls}>
            <option value="">選択してください</option>
            {CONTACT_TIMES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>

        <Field label="ご希望・ご質問">
          <textarea
            rows={3}
            value={contact.comment}
            onChange={(e) => onChange({ comment: e.target.value })}
            placeholder="気になる点などがあればご記入ください"
            className={`${inputCls} resize-none`}
          />
        </Field>

        {error && (
          <p role="alert" className="text-xs font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <p className="text-[11px] text-slate-500 text-center leading-relaxed">
          <a href="/driver/terms" target="_blank" rel="noopener" className="font-bold text-blue-600 underline underline-offset-2">
            利用規約
          </a>
          と
          <a href="/driver/privacy" target="_blank" rel="noopener" className="font-bold text-blue-600 underline underline-offset-2">
            個人情報の取り扱い
          </a>
          に同意して登録する
        </p>

        {/* CTA: ファーストビューのプライマリボタンと同じトーン・サイズ */}
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
              <span className="block text-left text-[17px] font-extrabold leading-tight tracking-tight">
                {sending ? '送信中...' : '無料で求人を紹介してもらう'}
              </span>
              <span className="text-2xl shrink-0 group-hover:translate-x-1.5 transition-transform duration-150">
                →
              </span>
            </div>
          </button>
        </div>
      </form>
    </section>
  );
}

/** 登録完了 */
export function RegisterComplete() {
  return (
    <section className="px-5 py-8">
      <div className="text-center mb-6">
        <p className="text-[10px] font-bold tracking-[0.2em] text-blue-500 uppercase mb-2">
          THANK YOU
        </p>
        <h2 className="text-xl font-bold text-slate-800 leading-snug">
          登録を受け付けました
        </h2>
        <p className="text-xs text-slate-400 mt-2">
          ドラテクの担当より、ご入力の電話番号へご連絡いたします
        </p>
      </div>

      <div className="rounded-xl border-2 border-blue-100 bg-blue-50 px-4 py-5 text-center">
        <p className="text-sm font-bold text-blue-700 leading-relaxed">
          ご登録ありがとうございます
        </p>
        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
          ご回答いただいた条件をもとに、ドラテクがあなたに合う
          ドライバー求人をお探しします。
        </p>
      </div>
    </section>
  );
}

const inputCls =
  'w-full rounded-xl border-2 border-slate-200 bg-white px-3.5 py-3 text-base text-slate-800 ' +
  'placeholder:text-slate-300 shadow-sm transition-colors duration-150 ' +
  'focus:border-blue-500 focus:outline-none';

function Field({
  label,
  required = false,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
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
      {error && <span className="mt-1 block text-xs font-bold text-red-600">{error}</span>}
    </label>
  );
}
