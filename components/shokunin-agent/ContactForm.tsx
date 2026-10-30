"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { fireAdofyLead } from "@/lib/analytics/adofyPixel";
import { loadAttribution } from "@/lib/saiyoRescue/attribution";
import { CTA_MAIN, FORM_ERROR, FORM_HIRES, FORM_JOBS, FORM_PLACEHOLDER } from "./config";

type Errors = Partial<Record<"company" | "name" | "phone" | "email" | "jobType" | "privacyConsent", string>>;

function validate(fd: FormData): Errors {
  const v = (k: string) => String(fd.get(k) ?? "").trim();
  const errors: Errors = {};
  if (!v("company")) errors.company = "会社名を入力してください";
  if (!v("name")) errors.name = "担当者名を入力してください";
  const digits = v("phone").replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0)).replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 11) errors.phone = "電話番号を正しく入力してください";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("email"))) errors.email = "メールアドレスを正しく入力してください";
  if (!v("jobType")) errors.jobType = "採用したい職種を選択してください";
  if (fd.get("privacyConsent") !== "on") errors.privacyConsent = "個人情報保護方針への同意が必要です";
  return errors;
}

/**
 * 無料相談フォーム。
 * 送信先・保存先・通知は採用レスキューと共通（/api/saiyo-rescue-contact → saiyo_rescue_leads）。
 * plan: "shokunin" を付けて送り、管理画面・通知メールで職人採用エージェント経由と識別する。
 */
export default function ContactForm() {
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const lock = useRef(false);
  const shownAt = useRef(0);

  useEffect(() => {
    shownAt.current = Date.now();
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (lock.current) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const found = validate(fd);
    setErrors(found);
    setError("");
    const first = Object.keys(found)[0];
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    // 二重送信防止（state更新前の連打もrefで止める）
    lock.current = true;
    setSending(true);
    try {
      const res = await fetch("/api/saiyo-rescue-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(fd.entries()),
          ...loadAttribution(),
          plan: "shokunin",
          elapsedMs: Date.now() - shownAt.current,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error || FORM_ERROR);

      // Lead は API 成功時のここだけで送る（サンクスページでは送らない）
      fireAdofyLead("shokunin-agent");
      router.push("/shokunin-agent/thanks");
    } catch (err) {
      setError(err instanceof Error ? err.message : FORM_ERROR);
      setSending(false);
      lock.current = false;
    }
  }

  const describe = (key: keyof Errors) => (errors[key] ? { "aria-invalid": true, "aria-describedby": `sa-err-${key}` } : {});

  return (
    <form className="sr-form" onSubmit={onSubmit} noValidate>
      <Field label="会社名" required error={errors.company} errorId="sa-err-company">
        <input name="company" type="text" required autoComplete="organization" placeholder="例）株式会社〇〇建設" maxLength={100} {...describe("company")} />
      </Field>
      <Field label="担当者名" required error={errors.name} errorId="sa-err-name">
        <input name="name" type="text" required autoComplete="name" placeholder="例）山田 太郎" maxLength={60} {...describe("name")} />
      </Field>
      <Field label="電話番号" required error={errors.phone} errorId="sa-err-phone">
        <input name="phone" type="tel" required autoComplete="tel" inputMode="tel" placeholder="例）090-1234-5678" maxLength={30} {...describe("phone")} />
      </Field>
      <Field label="メールアドレス" required error={errors.email} errorId="sa-err-email">
        <input name="email" type="email" required autoComplete="email" inputMode="email" placeholder="例）info@example.com" maxLength={200} {...describe("email")} />
      </Field>
      <div className="sr-form__row">
        <Field label="採用したい職種" required error={errors.jobType} errorId="sa-err-jobType">
          <select name="jobType" required defaultValue="" {...describe("jobType")}>
            <option value="" disabled>
              選択してください
            </option>
            {FORM_JOBS.map((j) => (
              <option key={j} value={j}>
                {j}
              </option>
            ))}
          </select>
        </Field>
        <Field label="採用予定人数">
          <select name="desiredHires" defaultValue="">
            <option value="">選択してください</option>
            {FORM_HIRES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="現在の採用課題">
        <textarea name="message" rows={4} maxLength={3000} placeholder={FORM_PLACEHOLDER} />
      </Field>

      <div className="sa-consent">
        <label>
          <input name="privacyConsent" type="checkbox" required {...describe("privacyConsent")} />
          <span>
            <a href="#legal-privacy">個人情報保護方針</a>に同意する
          </span>
          <span className="sr-field__req">必須</span>
        </label>
        {errors.privacyConsent && (
          <p className="sa-field-error" id="sa-err-privacyConsent">
            {errors.privacyConsent}
          </p>
        )}
      </div>

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
            <span>{CTA_MAIN}</span>
            <ArrowRight className="sr-btn__arrow" aria-hidden="true" strokeWidth={2.6} />
          </>
        )}
      </button>
    </form>
  );
}

function Field({
  label,
  required,
  error,
  errorId,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  errorId?: string;
  children: ReactNode;
}) {
  return (
    <label className="sr-field">
      <span className="sr-field__label">
        {label}
        <span className={required ? "sr-field__req" : "sr-field__opt"}>{required ? "必須" : "任意"}</span>
      </span>
      {children}
      {error && (
        <span className="sa-field-error" id={errorId}>
          {error}
        </span>
      )}
    </label>
  );
}
