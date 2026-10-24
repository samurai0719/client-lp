"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PATHS, PRICING, SERVICE } from "@/config/driver-company";
import { loadUtm } from "@/lib/utm/storage";
import { CONSENTS, STEPS, normalizeField, type Field } from "@/lib/types/driverJobRegistration";
import { trackCompany } from "./track";

/**
 * 企業登録・求人登録フォーム（/company/register）。
 *
 * 離脱を減らすため、入力は「会社情報」「求人情報」の2ステップだけにしている。
 * ・必須項目と、よく使う任意項目だけを最初に表示する
 * ・それ以外（手当・研修・契約期間など）は「さらに詳しく入力する（任意）」の中に入れる
 * ・雇用形態・社会保険・受動喫煙対策などはよくある回答を選択済みにしておく
 * ・同意は1つのチェックにまとめる（チェックすると CONSENTS の全項目に同意したものとして送る）
 * ・確認画面は置かず、STEP2 からそのまま登録する
 *
 * 項目の定義は lib/types/driverJobRegistration.ts に集約している。
 * 入力チェックはクライアントとサーバーの両方で行うが、信用できるのはサーバー側だけ。
 * 登録後はメール認証が必要で、認証が完了するまで求人は掲載も配信もされない。
 */

type Values = Record<string, unknown>;

/* 入力欄の文字は16px以上にする。これより小さいと iOS Safari がフォーカス時にページを拡大してしまうため */
const FIELD =
  "w-full rounded-xl border border-[#0d2b52]/20 bg-white px-4 py-3.5 text-base text-[#0d2b52] outline-none transition-colors placeholder:text-[#0d2b52]/35 focus:border-[#1659e0] focus:ring-2 focus:ring-[#1659e0]/15";

const TOTAL_STEPS = STEPS.length;

/** 選択済みにしておく初期値 */
function initialValues(): Values {
  const v: Values = {};
  for (const step of STEPS) {
    for (const f of step.fields) if (f.defaultValue !== undefined) v[f.key] = f.defaultValue;
  }
  return v;
}

function isEmpty(v: unknown): boolean {
  return v === null || v === undefined || (Array.isArray(v) && v.length === 0) || (typeof v === "string" && v.trim() === "");
}

function Required() {
  return (
    <span className="shrink-0 whitespace-nowrap rounded bg-[#e5484d] px-1.5 py-0.5 text-[10px] font-bold text-white">必須</span>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1.5 text-sm font-bold text-[#e5484d]">
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
      <label htmlFor={field.type === "multiselect" ? undefined : id} className="mb-1.5 flex flex-wrap items-center gap-2 text-[15px] font-bold text-[#0d2b52]">
        {field.label}
        {field.required && <Required />}
      </label>

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
        <select {...common} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)}>
          <option value="">選択してください</option>
          {field.options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      )}

      {/* 複数選択はタップしやすいチップにする */}
      {field.type === "multiselect" && (
        <div role="group" aria-label={field.label} className="flex flex-wrap gap-2">
          {field.options?.map((o) => {
            const list = Array.isArray(value) ? (value as string[]) : [];
            const checked = list.includes(o);
            return (
              <label
                key={o}
                className={`flex cursor-pointer items-center gap-1.5 rounded-full border-2 px-3.5 py-2 text-[14px] font-bold transition-colors ${
                  checked ? "border-[#1659e0] bg-[#1659e0] text-white" : "border-[#0d2b52]/15 bg-white text-[#0d2b52]/80"
                }`}
              >
                <input
                  type="checkbox"
                  name={field.key}
                  value={o}
                  checked={checked}
                  onChange={() => onChange(checked ? list.filter((x) => x !== o) : [...list, o])}
                  className="sr-only"
                />
                {checked && <span aria-hidden="true">✓</span>}
                {o}
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
          {field.unit && <span className="shrink-0 text-sm font-bold text-[#0d2b52]/70">{field.unit}</span>}
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
          type={field.type === "date" ? "date" : field.type === "email" ? "email" : field.type === "tel" ? "tel" : field.type === "url" ? "url" : "text"}
          inputMode={field.type === "postal" || field.type === "tel" ? "numeric" : field.type === "email" ? "email" : undefined}
          autoComplete={
            field.key === "notificationEmail"
              ? "email"
              : field.key === "phone"
                ? "tel"
                : field.key === "companyName"
                  ? "organization"
                  : field.key === "contactName"
                    ? "name"
                    : undefined
          }
          maxLength={field.type === "date" ? undefined : field.max}
          placeholder={field.placeholder}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.help && (
        <p id={describedBy} className="mt-1.5 text-[13px] leading-relaxed text-[#0d2b52]/55">
          {field.help}
        </p>
      )}
      <FieldError message={error} />
    </div>
  );
}

/* ── 本体 ────────────────────────────────────────────────────────────── */

export default function RegisterWizard() {
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<Values>(initialValues);
  const [agreed, setAgreed] = useState(false);
  const [openAdvanced, setOpenAdvanced] = useState<Record<number, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState("");
  const [emailDelivered, setEmailDelivered] = useState(true);

  /** ハニーポット。人間には見えない項目なので、埋まっていればボット */
  const [faxNumber, setFaxNumber] = useState("");
  const mountedAt = useRef<number | null>(null);
  const started = useRef(false);
  const topRef = useRef<HTMLDivElement>(null);

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

  const scrollTop = () => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  /** 表示中のステップだけを検証する */
  const validateStep = (n: number): boolean => {
    const found: Record<string, string> = {};
    for (const field of STEPS[n - 1].fields) {
      const { value, error } = normalizeField(field, values[field.key]);
      if (error) found[field.key] = error;
      else if (field.required && isEmpty(value)) found[field.key] = `${field.label}をご入力ください。`;
    }
    if (n === 2) {
      const salary = (k: string) => normalizeField(STEPS[1].fields.find((f) => f.key === k)!, values[k]).value;
      const min = salary("salaryMin");
      const max = salary("salaryMax");
      if (typeof min === "number" && typeof max === "number" && min > max) {
        found.salaryMax = "上限は下限以上の金額をご入力ください。";
      }
      if (values.fixedOvertime === "あり" && isEmpty(values.fixedOvertimeAmount)) {
        found.fixedOvertimeAmount = "固定残業代の金額をご入力ください。";
        setOpenAdvanced((p) => ({ ...p, 2: true }));
      }
      if (!agreed) found.consent = "ご登録には同意が必要です。";
    }

    setErrors(found);
    if (Object.keys(found).length > 0) {
      setFormError(`未入力・入力内容の誤りが${Object.keys(found).length}か所あります。`);
      // 最初のエラー項目へスクロールする
      requestAnimationFrame(() => {
        const first = Object.keys(found)[0];
        document.getElementById(first === "consent" ? "f-consent" : `f-${first}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      return false;
    }
    setFormError(null);
    return true;
  };

  const next = () => {
    if (!validateStep(1)) return;
    trackCompany("company_form_step", { step: 1 });
    setStep(2);
    scrollTop();
  };

  const back = () => {
    setFormError(null);
    setErrors({});
    setStep(1);
    scrollTop();
  };

  const submit = async () => {
    if (sending) return; // 二重送信の防止
    if (!validateStep(2)) return;
    trackCompany("company_form_step", { step: 2 });
    setSending(true);
    setFormError(null);

    try {
      const utm = loadUtm() ?? {};
      const res = await fetch("/api/driver-company-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          // 同意は1つのチェックにまとめている。規約・返金規程・プライバシーポリシー・成功報酬のすべてに同意
          consents: Object.fromEntries(CONSENTS.map((c) => [c.key, agreed])),
          faxNumber,
          elapsedMs: mountedAt.current === null ? undefined : Date.now() - mountedAt.current,
          utm: {
            utm_source: utm.utm_source,
            utm_medium: utm.utm_medium,
            utm_campaign: utm.utm_campaign,
            utm_content: utm.utm_content,
            utm_term: utm.utm_term,
          },
          referrer: utm.referrer ?? (typeof document !== "undefined" ? document.referrer : ""),
          landingPage: utm.landing_page ?? (typeof window !== "undefined" ? window.location.pathname : ""),
        }),
      });

      const data: { error?: string; errors?: Record<string, string>; emailSent?: boolean; email?: string } = await res
        .json()
        .catch(() => ({}));

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
          // サーバー側で弾かれた項目のあるステップへ戻す
          const firstKey = Object.keys(data.errors)[0];
          const stepIndex = STEPS.findIndex((s) => s.fields.some((f) => f.key === firstKey));
          if (stepIndex >= 0) setStep(stepIndex + 1);
          const field = STEPS.flatMap((s) => s.fields).find((f) => f.key === firstKey);
          if (field?.advanced) setOpenAdvanced((p) => ({ ...p, [stepIndex + 1]: true }));
        }
        setFormError(data.error ?? "登録に失敗しました。時間をおいて再度お試しください。");
        scrollTop();
        return;
      }

      trackCompany("company_form_submit");
      setSentTo(data.email ?? (values.notificationEmail as string) ?? "");
      setEmailDelivered(data.emailSent !== false);
      setDone(true);
      scrollTop();
    } catch {
      setFormError("登録に失敗しました。通信環境をご確認のうえ、もう一度お試しください。");
      scrollTop();
    } finally {
      setSending(false);
    }
  };

  /* ── 登録完了画面 ── */
  if (done) {
    return (
      <div ref={topRef} className="scroll-mt-24 rounded-2xl border border-[#0d2b52]/10 bg-white p-6 text-center shadow-[0_10px_30px_rgba(13,43,82,0.08)] sm:p-10">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#ffc400]">
          <span className="text-2xl font-bold text-[#0d2b52]">✓</span>
        </div>
        <h2 className="text-xl font-bold text-[#0d2b52] sm:text-2xl">あと1つで掲載完了です</h2>
        <div className="mx-auto mt-4 max-w-lg space-y-3 text-[15px] leading-relaxed text-[#0d2b52]/75">
          <p>
            {sentTo && <strong className="font-bold text-[#0d2b52]">{sentTo}</strong>}
            {sentTo ? " 宛に確認メールをお送りしました。" : "ご登録のメールアドレス宛に確認メールをお送りしました。"}
          </p>
          <p className="rounded-xl bg-[#fffbee] px-4 py-3.5 font-bold text-[#0d2b52]">
            メール内のURLを開くと、求人の掲載が始まります。
          </p>
          {!emailDelivered && (
            <p role="alert" className="rounded-xl bg-[#e5484d]/5 px-4 py-3.5 text-[14px] font-bold text-[#e5484d]">
              確認メールの送信に失敗しました。お手数ですが時間をおいて再度ご登録いただくか、迷惑メールフォルダをご確認ください。
            </p>
          )}
          <p className="text-sm text-[#0d2b52]/60">
            この時点で費用は一切発生しません。ご登録後に{SERVICE.name}から営業電話を行うこともありません。
          </p>
        </div>
        <Link href={PATHS.lp} className="mt-6 inline-block rounded-xl border-2 border-[#0d2b52]/20 px-6 py-3 text-sm font-bold text-[#0d2b52]">
          サービス内容に戻る
        </Link>
      </div>
    );
  }

  const current = STEPS[step - 1];
  const basic = current.fields.filter((f) => !f.advanced);
  const advanced = current.fields.filter((f) => f.advanced);
  const advancedOpen = openAdvanced[step] ?? false;

  const renderField = (field: Field) => (
    <FieldInput key={field.key} field={field} value={values[field.key]} error={errors[field.key]} onChange={(v) => set(field.key, v)} />
  );

  return (
    <div ref={topRef} className="scroll-mt-24 space-y-4">
      {/* 進捗 */}
      <ol className="grid grid-cols-2 gap-2" aria-label="入力の進み具合">
        {STEPS.map((s) => {
          const active = s.no === step;
          const finished = s.no < step;
          return (
            <li
              key={s.no}
              aria-current={active ? "step" : undefined}
              className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold ${
                active ? "bg-[#0a1f4e] text-white" : finished ? "bg-[#1659e0]/10 text-[#1659e0]" : "bg-white text-[#0d2b52]/45 ring-1 ring-[#0d2b52]/10"
              }`}
            >
              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${active ? "bg-[#ffc400] text-[#0a1f4e]" : "bg-[#0d2b52]/10"}`}>
                {finished ? "✓" : s.no}
              </span>
              {s.title}
            </li>
          );
        })}
      </ol>

      {formError && (
        <div role="alert" className="rounded-xl border border-[#e5484d]/30 bg-[#e5484d]/5 px-4 py-3 text-sm font-bold text-[#e5484d]">
          {formError}
        </div>
      )}

      <div className="rounded-2xl border border-[#0d2b52]/10 bg-white p-5 shadow-[0_10px_30px_rgba(13,43,82,0.08)] sm:p-8">
        <h2 className="text-xl font-bold text-[#0d2b52]">
          STEP{current.no} {current.title}
        </h2>
        {current.description && <p className="mt-1.5 text-[14px] leading-relaxed text-[#0d2b52]/65">{current.description}</p>}

        <div className="mt-5 space-y-5">{basic.map(renderField)}</div>

        {advanced.length > 0 && (
          <div className="mt-6 border-t border-dashed border-[#0d2b52]/15 pt-4">
            <button
              type="button"
              onClick={() => setOpenAdvanced((p) => ({ ...p, [step]: !advancedOpen }))}
              aria-expanded={advancedOpen}
              className="flex w-full items-center justify-between rounded-xl bg-[#f5f8fc] px-4 py-3 text-left text-[15px] font-bold text-[#0d2b52]"
            >
              <span>
                {advancedOpen ? "－" : "＋"} さらに詳しく入力する（任意）
                <span className="mt-0.5 block text-[12px] font-medium text-[#0d2b52]/55">
                  {step === 1 ? "ふりがな・代表者名・事業内容など" : "手当・賞与・車両・研修・契約期間など。詳しいほど応募されやすくなります"}
                </span>
              </span>
            </button>
            {advancedOpen && <div className="mt-5 space-y-5">{advanced.map(renderField)}</div>}
          </div>
        )}

        {step === 2 && (
          <div className="mt-6">
            <label
              id="f-consent"
              className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 ${
                agreed ? "border-[#1659e0] bg-[#1659e0]/5" : errors.consent ? "border-[#e5484d]" : "border-[#0d2b52]/15"
              }`}
            >
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => {
                  setAgreed(e.target.checked);
                  setErrors((p) => {
                    const n = { ...p };
                    delete n.consent;
                    return n;
                  });
                }}
                className="mt-0.5 h-6 w-6 shrink-0 accent-[#1659e0]"
              />
              <span className="text-[14px] leading-relaxed text-[#0d2b52]">
                採用時の成功報酬（1名{PRICING.successFee}
                {PRICING.taxNote}）と、
                <Link href={PATHS.terms} target="_blank" rel="noopener noreferrer" className="font-bold underline underline-offset-2">
                  利用規約
                </Link>
                ・
                <Link href={PATHS.refundPolicy} target="_blank" rel="noopener noreferrer" className="font-bold underline underline-offset-2">
                  早期退職時返金規程
                </Link>
                ・
                <Link href={PATHS.privacy} target="_blank" rel="noopener noreferrer" className="font-bold underline underline-offset-2">
                  プライバシーポリシー
                </Link>
                に同意し、入力した求人情報が正確であることを確認しました。
              </span>
            </label>
            <FieldError message={errors.consent} />
          </div>
        )}

        {/* ハニーポット: 人間には見えない。スクリーンリーダーからも隠す */}
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
      </div>

      <div className="flex flex-col gap-3 sm:flex-row-reverse">
        <button
          type="button"
          onClick={step === TOTAL_STEPS ? submit : next}
          disabled={sending}
          className="flex w-full flex-col items-center justify-center rounded-full bg-gradient-to-b from-[#ffd84d] via-[#ffc400] to-[#f0a500] px-6 py-4 text-[18px] font-black text-[#0a1f4e] shadow-[0_5px_0_#b98000] transition active:translate-y-[3px] active:shadow-[0_2px_0_#b98000] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-1"
        >
          {step === TOTAL_STEPS ? (sending ? "登録中です…" : "無料で求人を掲載する") : "次へ（求人情報の入力）"}
          <span className="text-[11px] font-bold opacity-75">{step === TOTAL_STEPS ? "登録・掲載・月額0円" : "あと1ステップ"}</span>
        </button>
        {step > 1 && (
          <button
            type="button"
            onClick={back}
            disabled={sending}
            className="w-full rounded-full border-2 border-[#0d2b52]/20 px-6 py-3.5 text-base font-bold text-[#0d2b52] disabled:opacity-50 sm:w-auto sm:px-8"
          >
            戻る
          </button>
        )}
      </div>

      <p className="text-center text-[13px] leading-relaxed text-[#0d2b52]/60">
        入力しただけでは費用は発生しません。登録後に届くメールで確認していただくと、掲載が始まります。
      </p>
    </div>
  );
}
