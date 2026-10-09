"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { PATHS, PRICING, REFUND_TIERS, SERVICE } from "@/config/driver-company";
import { loadUtm } from "@/lib/utm/storage";
import {
  CONSENTS,
  STEPS,
  normalizeField,
  toDisplayRows,
  type Field,
} from "@/lib/types/driverJobRegistration";
import { trackCompany } from "./track";

/**
 * 企業登録・求人登録フォーム（/company/register）。
 *
 * 問い合わせフォームではなく、企業情報と求人情報の登録を完了させるフォーム。
 * STEP1〜4で入力し、STEP5で料金・規約へ同意し、確認画面を経て登録を確定する。
 *
 * 項目の定義は lib/types/driverJobRegistration.ts に集約している。
 * 入力チェックはクライアントとサーバーの両方で行うが、信用できるのはサーバー側だけ。
 *
 * 登録後はメール認証が必要で、認証が完了するまで求人は掲載も配信もされない。
 */

type Values = Record<string, unknown>;

/* ── 見た目の共通クラス ──
   入力欄の文字は16px以上にする。これより小さいと iOS Safari が
   フォーカス時にページを勝手に拡大してしまうため。 */
const FIELD =
  "w-full rounded-xl border border-[#0d2b52]/20 bg-white px-4 py-3 text-base text-[#0d2b52] outline-none transition-colors placeholder:text-[#0d2b52]/35 focus:border-[#0d2b52] focus:ring-2 focus:ring-[#0d2b52]/15";

function Badge({ required }: { required?: boolean }) {
  return required ? (
    <span className="shrink-0 whitespace-nowrap rounded bg-[#d9342b] px-1.5 py-0.5 text-[10px] font-bold text-white">
      必須
    </span>
  ) : (
    <span className="shrink-0 whitespace-nowrap rounded bg-[#0d2b52]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#0d2b52]/70">
      任意
    </span>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1.5 text-sm font-medium text-[#d9342b]">
      {message}
    </p>
  );
}

/* ── 1項目の入力欄 ───────────────────────────────────────────────────── */

function FieldInput({
  field,
  value,
  error,
  onChange,
}: {
  field: Field;
  value: unknown;
  error?: string;
  onChange: (v: unknown) => void;
}) {
  const id = `f-${field.key}`;
  const describedBy = field.help ? `${id}-help` : undefined;

  const common = {
    id,
    name: field.key,
    "aria-describedby": describedBy,
    "aria-invalid": error ? true : undefined,
    className: FIELD,
  } as const;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex flex-wrap items-center gap-2 text-sm font-bold text-[#0d2b52]">
        {field.label} <Badge required={field.required} />
      </label>

      {field.help && (
        <p id={describedBy} className="mb-1.5 text-[13px] leading-relaxed text-[#0d2b52]/60">
          {field.help}
        </p>
      )}

      {field.type === "textarea" && (
        <textarea
          {...common}
          rows={4}
          maxLength={field.max}
          placeholder={field.placeholder}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.type === "select" && (
        <select
          {...common}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">選択してください</option>
          {field.options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      )}

      {field.type === "multiselect" && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {field.options?.map((o) => {
            const list = Array.isArray(value) ? (value as string[]) : [];
            const checked = list.includes(o);
            return (
              <label
                key={o}
                className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-3 text-[15px] font-medium transition-colors ${
                  checked
                    ? "border-[#0d2b52] bg-[#0d2b52]/5 text-[#0d2b52]"
                    : "border-[#0d2b52]/20 bg-white text-[#0d2b52]/80"
                }`}
              >
                <input
                  type="checkbox"
                  name={field.key}
                  value={o}
                  checked={checked}
                  onChange={() =>
                    onChange(checked ? list.filter((x) => x !== o) : [...list, o])
                  }
                  className="h-5 w-5 shrink-0 accent-[#0d2b52]"
                />
                <span className="leading-snug">{o}</span>
              </label>
            );
          })}
        </div>
      )}

      {field.type === "number" && (
        <div className="flex items-center gap-2">
          <input
            {...common}
            type="text"
            inputMode="numeric"
            placeholder={field.placeholder}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
          />
          {field.unit && (
            <span className="shrink-0 text-sm font-bold text-[#0d2b52]/70">{field.unit}</span>
          )}
        </div>
      )}

      {(field.type === "text" ||
        field.type === "email" ||
        field.type === "tel" ||
        field.type === "postal" ||
        field.type === "url" ||
        field.type === "date") && (
        <input
          {...common}
          type={
            field.type === "date"
              ? "date"
              : field.type === "email"
                ? "email"
                : field.type === "tel"
                  ? "tel"
                  : "text"
          }
          inputMode={
            field.type === "postal" || field.type === "tel"
              ? "numeric"
              : field.type === "email"
                ? "email"
                : undefined
          }
          maxLength={field.type === "date" ? undefined : field.max}
          placeholder={field.placeholder}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      <FieldError message={error} />
    </div>
  );
}

/* ── 本体 ────────────────────────────────────────────────────────────── */

const TOTAL_STEPS = STEPS.length + 1; // 入力4ステップ + 同意1ステップ

export default function RegisterWizard() {
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<Values>({});
  const [consents, setConsents] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mode, setMode] = useState<"form" | "confirm" | "done">("form");
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState("");
  const [emailDelivered, setEmailDelivered] = useState(true);

  /** ハニーポット。人間には見えない項目なので、埋まっていればボット */
  const [faxNumber, setFaxNumber] = useState("");
  const mountedAt = useRef<number | null>(null);
  const started = useRef(false);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const set = (key: string, v: unknown) => {
    if (!started.current) {
      started.current = true;
      trackCompany("company_form_start");
    }
    setValues((prev) => ({ ...prev, [key]: v }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  /** 表示中のステップだけを検証する */
  const validateStep = (n: number): boolean => {
    const found: Record<string, string> = {};

    if (n <= STEPS.length) {
      for (const field of STEPS[n - 1].fields) {
        const { value, error } = normalizeField(field, values[field.key]);
        if (error) {
          found[field.key] = error;
          continue;
        }
        const empty =
          value === null ||
          value === undefined ||
          (Array.isArray(value) && value.length === 0) ||
          (typeof value === "string" && value.trim() === "");
        if (field.required && empty) found[field.key] = `${field.label}をご入力ください。`;
      }

      // STEP1: メールアドレスの確認入力の一致
      if (n === 1 && !found.notificationEmail && !found.notificationEmailConfirm) {
        const a = normalizeField(STEPS[0].fields.find((f) => f.key === "notificationEmail")!, values.notificationEmail).value;
        const b = normalizeField(STEPS[0].fields.find((f) => f.key === "notificationEmailConfirm")!, values.notificationEmailConfirm).value;
        if (a !== b) found.notificationEmailConfirm = "メールアドレスが一致しません。";
      }

      // STEP3: 給与の下限・上限、固定残業代の整合
      if (n === 3) {
        const min = normalizeField(STEPS[2].fields.find((f) => f.key === "salaryMin")!, values.salaryMin).value;
        const max = normalizeField(STEPS[2].fields.find((f) => f.key === "salaryMax")!, values.salaryMax).value;
        if (typeof min === "number" && typeof max === "number" && min > max) {
          found.salaryMax = "給与上限は下限以上の金額をご入力ください。";
        }
        if (values.fixedOvertime === "あり" && !String(values.fixedOvertimeAmount ?? "").trim()) {
          found.fixedOvertimeAmount = "固定残業代の金額をご入力ください。";
        }
      }
    } else {
      // STEP5: 同意
      for (const c of CONSENTS) {
        if (!consents[c.key]) found[`consent.${c.key}`] = "同意が必要です。";
      }
    }

    setErrors(found);
    if (Object.keys(found).length > 0) {
      setFormError("入力内容をご確認ください。");
      scrollTop();
      return false;
    }
    setFormError(null);
    return true;
  };

  const next = () => {
    if (!validateStep(step)) return;
    trackCompany("company_form_step", { step });
    if (step === TOTAL_STEPS) {
      setMode("confirm");
    } else {
      setStep(step + 1);
    }
    scrollTop();
  };

  const back = () => {
    setFormError(null);
    if (mode === "confirm") {
      setMode("form");
    } else if (step > 1) {
      setStep(step - 1);
    }
    scrollTop();
  };

  const submit = async () => {
    if (sending) return; // 二重送信の防止
    setSending(true);
    setFormError(null);

    try {
      const utm = loadUtm() ?? {};
      const res = await fetch("/api/driver-company-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          consents,
          faxNumber,
          elapsedMs:
            mountedAt.current === null ? undefined : Date.now() - mountedAt.current,
          utm: {
            utm_source: utm.utm_source,
            utm_medium: utm.utm_medium,
            utm_campaign: utm.utm_campaign,
            utm_content: utm.utm_content,
            utm_term: utm.utm_term,
          },
          referrer: utm.referrer ?? (typeof document !== "undefined" ? document.referrer : ""),
          landingPage:
            utm.landing_page ?? (typeof window !== "undefined" ? window.location.pathname : ""),
        }),
      });

      const data: { error?: string; errors?: Record<string, string>; emailSent?: boolean; email?: string } =
        await res.json().catch(() => ({}));

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
          // サーバー側で弾かれた項目のあるステップへ戻す
          const firstKey = Object.keys(data.errors)[0];
          const stepIndex = STEPS.findIndex((s) => s.fields.some((f) => f.key === firstKey));
          setMode("form");
          setStep(stepIndex >= 0 ? stepIndex + 1 : TOTAL_STEPS);
        }
        setFormError(data.error ?? "登録に失敗しました。時間をおいて再度お試しください。");
        scrollTop();
        return;
      }

      trackCompany("company_form_submit");
      setSentTo(data.email ?? (values.notificationEmail as string) ?? "");
      setEmailDelivered(data.emailSent !== false);
      setMode("done");
      scrollTop();
    } catch {
      setFormError("登録に失敗しました。通信環境をご確認のうえ、もう一度お試しください。");
      scrollTop();
    } finally {
      setSending(false);
    }
  };

  const displayRows = useMemo(() => toDisplayRows(values), [values]);

  /* ── 登録完了画面 ── */
  if (mode === "done") {
    return (
      <div className="rounded-2xl border border-[#0d2b52]/10 bg-white p-6 text-center shadow-[0_10px_30px_rgba(13,43,82,0.08)] sm:p-10">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#ffc400]">
          <span className="text-2xl font-bold text-[#0d2b52]">✓</span>
        </div>
        <h2 className="text-xl font-bold text-[#0d2b52] sm:text-2xl">
          確認メールをお送りしました
        </h2>
        <div className="mx-auto mt-4 max-w-lg space-y-3 text-[15px] leading-relaxed text-[#0d2b52]/75">
          <p>
            {sentTo && <strong className="font-bold text-[#0d2b52]">{sentTo}</strong>}
            {sentTo ? " 宛に確認メールをお送りしました。" : "ご登録のメールアドレス宛に確認メールをお送りしました。"}
          </p>
          <p className="rounded-xl bg-[#fffbee] px-4 py-3.5 font-bold text-[#0d2b52]">
            メール内のURLを開くまで、求人は掲載・配信されません。
            <br />
            お手数ですが、メールのURLから確認を完了してください。
          </p>
          {!emailDelivered && (
            <p role="alert" className="rounded-xl bg-[#d9342b]/5 px-4 py-3.5 text-[14px] font-bold text-[#d9342b]">
              確認メールの送信に失敗しました。入力内容は受け付けていますので、お手数ですが時間をおいて再度ご登録いただくか、迷惑メールフォルダをご確認ください。
            </p>
          )}
          <p className="text-sm text-[#0d2b52]/60">
            この時点で費用は一切発生しません。{SERVICE.name}から営業電話を行うこともありません。
          </p>
        </div>
        <Link
          href={PATHS.lp}
          className="mt-6 inline-block rounded-xl border-2 border-[#0d2b52]/20 px-6 py-3 text-sm font-bold text-[#0d2b52]"
        >
          サービス内容に戻る
        </Link>
      </div>
    );
  }

  /* ── 確認画面 ── */
  if (mode === "confirm") {
    return (
      <div className="space-y-5">
        {formError && (
          <div role="alert" className="rounded-xl border border-[#d9342b]/30 bg-[#d9342b]/5 px-4 py-3 text-sm font-bold text-[#d9342b]">
            {formError}
          </div>
        )}

        <div className="rounded-2xl border border-[#0d2b52]/10 bg-white p-5 shadow-[0_10px_30px_rgba(13,43,82,0.08)] sm:p-8">
          <h2 className="text-xl font-bold text-[#0d2b52]">入力内容の確認</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-[#0d2b52]/70">
            この内容で求人を登録します。求人情報はそのまま求職者へ表示されるため、
            労働条件に誤りがないかご確認ください。
          </p>

          {displayRows.map((section) => (
            <section key={section.step} className="mt-6">
              <h3 className="mb-2 rounded-lg bg-[#f5f8fc] px-3 py-2 text-sm font-bold text-[#0d2b52]">
                {section.step}
              </h3>
              <dl className="divide-y divide-[#0d2b52]/8">
                {section.rows.map((row) => (
                  <div key={row.label} className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:gap-4">
                    <dt className="shrink-0 text-[13px] font-bold text-[#0d2b52]/60 sm:w-56">
                      {row.label}
                    </dt>
                    <dd className="flex-1 whitespace-pre-wrap break-words text-[15px] text-[#0d2b52]">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}

          <section className="mt-6">
            <h3 className="mb-2 rounded-lg bg-[#f5f8fc] px-3 py-2 text-sm font-bold text-[#0d2b52]">
              STEP5 料金・規約への同意
            </h3>
            <ul className="space-y-1.5">
              {CONSENTS.map((c) => (
                <li key={c.key} className="flex items-start gap-2 text-[15px] text-[#0d2b52]">
                  <span aria-hidden="true" className="mt-0.5 shrink-0 font-bold text-[#0d2b52]">
                    ✓
                  </span>
                  {c.label}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row-reverse">
          <button
            type="button"
            onClick={submit}
            disabled={sending}
            className="flex w-full items-center justify-center rounded-2xl bg-[#ffc400] px-6 py-4 text-[17px] font-bold text-[#0d2b52] shadow-[0_8px_24px_rgba(255,196,0,0.35)] transition-colors hover:bg-[#ffd233] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#0d2b52]/20 disabled:text-[#0d2b52]/50 disabled:shadow-none sm:flex-1"
          >
            {sending ? "登録中です…" : "この内容で求人を無料登録する"}
          </button>
          <button
            type="button"
            onClick={back}
            disabled={sending}
            className="w-full rounded-2xl border-2 border-[#0d2b52]/20 px-6 py-4 text-base font-bold text-[#0d2b52] disabled:opacity-50 sm:w-auto sm:px-8"
          >
            修正する
          </button>
        </div>

        <p className="text-center text-[13px] text-[#0d2b52]/60">
          登録しただけで費用は発生しません。料金は採用1名につき{PRICING.successFee}
          {PRICING.taxNote}の成果報酬のみです。
        </p>
      </div>
    );
  }

  /* ── 入力ステップ ── */
  const current = step <= STEPS.length ? STEPS[step - 1] : null;

  return (
    <div className="space-y-5">
      {/* 進捗 */}
      <div className="rounded-2xl border border-[#0d2b52]/10 bg-white px-5 py-4">
        <div className="flex items-center justify-between text-sm font-bold text-[#0d2b52]">
          <span>
            STEP <span className="text-lg">{step}</span> / {TOTAL_STEPS}
          </span>
          <span className="text-[#0d2b52]/60">
            {current ? current.title : "料金・規約への同意"}
          </span>
        </div>
        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[#0d2b52]/10">
          <div
            className="h-full rounded-full bg-[#ffc400] transition-[width] duration-200"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      {formError && (
        <div role="alert" className="rounded-xl border border-[#d9342b]/30 bg-[#d9342b]/5 px-4 py-3 text-sm font-bold text-[#d9342b]">
          {formError}
        </div>
      )}

      <div className="rounded-2xl border border-[#0d2b52]/10 bg-white p-5 shadow-[0_10px_30px_rgba(13,43,82,0.08)] sm:p-8">
        {current ? (
          <>
            <h2 className="text-xl font-bold text-[#0d2b52]">
              STEP{current.no} {current.title}
            </h2>
            {current.description && (
              <p className="mt-2 text-[15px] leading-relaxed text-[#0d2b52]/70">
                {current.description}
              </p>
            )}

            <div className="mt-6 space-y-5">
              {current.fields.map((field) => (
                <FieldInput
                  key={field.key}
                  field={field}
                  value={values[field.key]}
                  error={errors[field.key]}
                  onChange={(v) => set(field.key, v)}
                />
              ))}
            </div>

            {/* ハニーポット: 人間には見えない。スクリーンリーダーからも隠す */}
            {step === 1 && (
              <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label htmlFor="company-fax">FAX番号</label>
                <input
                  id="company-fax"
                  name="company-fax"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={faxNumber}
                  onChange={(e) => setFaxNumber(e.target.value)}
                />
              </div>
            )}
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold text-[#0d2b52]">STEP5 料金・規約への同意</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-[#0d2b52]/70">
              ご登録の前に、料金と返金条件をご確認ください。
            </p>

            <div className="mt-5 rounded-2xl border-2 border-[#0d2b52] bg-[#f5f8fc] p-5">
              <p className="text-sm font-bold text-[#0d2b52]/70">採用成果報酬</p>
              <p className="mt-1 flex items-baseline gap-1">
                <span className="text-[44px] font-bold leading-none text-[#0d2b52]">25</span>
                <span className="text-xl font-bold text-[#0d2b52]">万円</span>
                <span className="ml-2 text-sm font-bold text-[#0d2b52]/70">／ 採用1名</span>
                {PRICING.taxNote && (
                  <span className="ml-1 text-sm text-[#0d2b52]/60">{PRICING.taxNote}</span>
                )}
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-[#0d2b52]/75">
                {PRICING.condition}
              </p>
              <ul className="mt-3 space-y-1 border-t border-[#0d2b52]/10 pt-3">
                {REFUND_TIERS.map((t) => (
                  <li key={t.label} className="flex justify-between gap-3 text-[13px] text-[#0d2b52]/75">
                    <span>{t.label}</span>
                    <span className="shrink-0 font-bold">{t.refund}</span>
                  </li>
                ))}
              </ul>
            </div>

            <ul className="mt-6 space-y-2.5">
              {CONSENTS.map((c) => (
                <li key={c.key}>
                  <label
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                      consents[c.key]
                        ? "border-[#0d2b52] bg-[#0d2b52]/5"
                        : "border-[#0d2b52]/20 bg-white"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={consents[c.key] ?? false}
                      onChange={(e) => {
                        setConsents((prev) => ({ ...prev, [c.key]: e.target.checked }));
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next[`consent.${c.key}`];
                          return next;
                        });
                      }}
                      className="mt-0.5 h-5 w-5 shrink-0 accent-[#0d2b52]"
                    />
                    <span className="flex-1 text-[15px] font-medium leading-relaxed text-[#0d2b52]">
                      {c.label}
                      {c.href && (
                        <>
                          {" "}
                          <Link
                            href={c.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold underline underline-offset-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {c.linkLabel}を読む
                          </Link>
                        </>
                      )}
                    </span>
                    <Badge required />
                  </label>
                  <FieldError message={errors[`consent.${c.key}`]} />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row-reverse">
        <button
          type="button"
          onClick={next}
          className="flex w-full items-center justify-center rounded-2xl bg-[#ffc400] px-6 py-4 text-[17px] font-bold text-[#0d2b52] shadow-[0_8px_24px_rgba(255,196,0,0.35)] transition-colors hover:bg-[#ffd233] active:scale-[0.99] sm:flex-1"
        >
          {step === TOTAL_STEPS ? "入力内容を確認する" : "次へ進む"}
        </button>
        {step > 1 && (
          <button
            type="button"
            onClick={back}
            className="w-full rounded-2xl border-2 border-[#0d2b52]/20 px-6 py-4 text-base font-bold text-[#0d2b52] sm:w-auto sm:px-8"
          >
            前に戻る
          </button>
        )}
      </div>

      <p className="text-center text-[13px] leading-relaxed text-[#0d2b52]/60">
        入力しただけでは費用は発生しません。登録後にメールで確認していただくまで、求人は掲載・配信されません。
      </p>
    </div>
  );
}
