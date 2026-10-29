"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { fireAdofyLead } from "@/lib/analytics/adofyPixel";
import { loadAttribution } from "@/lib/saiyoRescue/attribution";
import { PREFECTURES } from "@/lib/saiyoRescue/leads";
import { CTA_LABEL, FORM_HIRE_COUNTS, FORM_JOB_TYPES } from "./config";

/**
 * 建設業向けLPの無料相談フォーム。
 * 送信先・保存先・通知は採用レスキュー本体と共通（/api/saiyo-rescue-contact → saiyo_rescue_leads）。
 * plan: "kensetsu" を必ず付けて送り、管理画面・通知メールで建設業LP経由と識別できるようにする。
 */
export default function ContactForm() {
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const lock = useRef(false);
  const shownAt = useRef(0);

  useEffect(() => {
    shownAt.current = Date.now();
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // 二重送信防止（state更新前の連打もrefで止める）
    if (lock.current) return;
    lock.current = true;
    setSending(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const payload = {
      ...Object.fromEntries(fd.entries()),
      ...loadAttribution(),
      // 流入元（landing_page・utm）は本体LPと共通の保存値のまま送り、建設業LP経由かどうかは plan で識別する
      plan: "kensetsu",
      elapsedMs: Date.now() - shownAt.current,
    };

    try {
      const res = await fetch("/api/saiyo-rescue-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error || "送信に失敗しました");

      // Lead は API 成功時のここだけで送る（サンクスページでは送らない）
      fireAdofyLead("saiyo-rescue-kensetsu");
      const thanks = window.location.pathname.startsWith("/saiyo-rescue/") ? "/saiyo-rescue/kensetsu/thanks" : "/kensetsu/thanks";
      router.push(thanks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "送信に失敗しました");
      setSending(false);
      lock.current = false;
    }
  }

  return (
    <form className="sr-form" onSubmit={onSubmit}>
      <Field label="会社名" required>
        <input name="company" type="text" required autoComplete="organization" placeholder="例）株式会社〇〇建設" maxLength={100} />
      </Field>
      <Field label="ご担当者名" required>
        <input name="name" type="text" required autoComplete="name" placeholder="例）山田 太郎" maxLength={60} />
      </Field>
      <Field label="電話番号" required>
        <input
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          inputMode="tel"
          placeholder="例）090-1234-5678"
          pattern="[0-9０-９\-－‐ー()（）+＋ ]{10,}"
          maxLength={30}
        />
      </Field>
      <Field label="メールアドレス" required>
        <input name="email" type="email" required autoComplete="email" inputMode="email" placeholder="例）info@example.com" maxLength={200} />
      </Field>

      <fieldset className="ks-form__group">
        <legend className="sr-field__label">
          所在地・採用エリア
          <span className="sr-field__req">必須</span>
        </legend>
        <div className="sr-form__row">
          <label className="sr-field">
            <span className="ks-form__sublabel">所在地（都道府県）</span>
            <select name="prefecture" required defaultValue="" autoComplete="address-level1" aria-label="所在地（都道府県）">
              <option value="" disabled>
                選択してください
              </option>
              {PREFECTURES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
          <label className="sr-field">
            <span className="ks-form__sublabel">採用したいエリア（任意）</span>
            <input name="recruitArea" type="text" placeholder="例）岐阜市・各務原市周辺" maxLength={100} aria-label="採用したいエリア" />
          </label>
        </div>
      </fieldset>

      <div className="sr-form__row">
        <Field label="募集職種" required>
          <select name="jobType" required defaultValue="">
            <option value="" disabled>
              選択してください
            </option>
            {FORM_JOB_TYPES.map((j) => (
              <option key={j} value={j}>
                {j}
              </option>
            ))}
          </select>
        </Field>
        <Field label="採用予定人数">
          <select name="desiredHires" defaultValue="">
            <option value="">選択してください</option>
            {FORM_HIRE_COUNTS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="ご相談内容">
        <textarea
          name="message"
          rows={4}
          maxLength={3000}
          placeholder="例）足場の職人を2名採用したい。ハローワークに出しているが応募がない。など"
        />
      </Field>

      {/* スパム対策（人間には見えない） */}
      <div className="sr-hp" aria-hidden="true">
        <label>
          URL
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {error && (
        <p className="sr-form__error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="sr-btn sr-btn--lg sr-btn--primary sr-form__submit ks-btn" disabled={sending}>
        {sending ? (
          <>
            <LoaderCircle className="sr-spin" aria-hidden="true" />
            <span>送信中…</span>
          </>
        ) : (
          <>
            <span>{CTA_LABEL}</span>
            <ArrowRight className="sr-btn__arrow" aria-hidden="true" strokeWidth={2.6} />
          </>
        )}
      </button>
      <p className="sr-form__privacy">
        送信いただいた情報は、ご相談への回答・ご連絡のためにのみ利用します（
        <a href="#legal-privacy">プライバシーポリシー</a>）。
      </p>
    </form>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <label className="sr-field">
      <span className="sr-field__label">
        {label}
        <span className={required ? "sr-field__req" : "sr-field__opt"}>{required ? "必須" : "任意"}</span>
      </span>
      {children}
    </label>
  );
}
