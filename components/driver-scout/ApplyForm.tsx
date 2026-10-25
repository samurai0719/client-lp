"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { PATHS } from "@/config/driver-company";
import { loadUtm } from "@/lib/utm/storage";
import {
  PREFECTURES,
  SCOUT_HIRING_COUNTS,
  SCOUT_HIRING_TIMINGS,
  SCOUT_JOB_TYPES,
  SCOUT_LICENSES,
  validateScoutApply,
  type ScoutApplyErrors,
} from "@/lib/types/driverScoutApply";
import { trackCompany } from "../driver-company/track";
import { CTA_LABEL } from "./content";
import { WaitingLine } from "./waiting";

type Status = "idle" | "sending" | "done" | "failed";

type Values = {
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  prefecture: string;
  city: string;
  jobTypes: string[];
  licenses: string[];
  hiringCount: string;
  hiringTiming: string;
  privacyAgreed: boolean;
};

const INITIAL: Values = {
  companyName: "",
  contactName: "",
  phone: "",
  email: "",
  prefecture: "愛知県",
  city: "",
  jobTypes: [],
  licenses: [],
  hiringCount: "",
  hiringTiming: "",
  privacyAgreed: false,
};

/** 入力欄の文字は16px以上（iOS Safari のフォーカス時拡大を防ぐ） */
const INPUT = "ds-input";

/**
 * 企業登録・利用申込みフォーム（8. 企業向け問い合わせフォーム）。
 * 送信先は /api/driver-scout-apply。保存・通知のどちらにも失敗した場合は失敗表示にし、
 * 送れたように見せかけない。
 */
export default function ApplyForm() {
  const [v, setV] = useState<Values>(INITIAL);
  const [errors, setErrors] = useState<ScoutApplyErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [failMessage, setFailMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const mountedAt = useRef<number | null>(null);
  const started = useRef(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    if (!started.current) {
      started.current = true;
      trackCompany("company_form_start", { form: "scout" });
    }
    setV((p) => ({ ...p, [key]: value }));
    setErrors((p) => {
      if (!p[key as keyof ScoutApplyErrors]) return p;
      const n = { ...p };
      delete n[key as keyof ScoutApplyErrors];
      return n;
    });
  };

  const toggle = (key: "jobTypes" | "licenses", item: string) =>
    set(key, v[key].includes(item) ? v[key].filter((x) => x !== item) : [...v[key], item]);

  const focusFirstError = (errs: ScoutApplyErrors) => {
    const first = Object.keys(errs)[0];
    if (!first) return;
    requestAnimationFrame(() => {
      const el = document.getElementById(`ds-f-${first}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement) el.focus({ preventScroll: true });
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return; // 二重送信の防止

    const checked = validateScoutApply(v);
    if (!checked.ok) {
      setErrors(checked.errors);
      focusFirstError(checked.errors);
      return;
    }

    setStatus("sending");
    setFailMessage("");
    try {
      const utm = loadUtm() ?? {};
      const res = await fetch("/api/driver-scout-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...v,
          websiteUrl: honeypot,
          elapsedMs: mountedAt.current === null ? undefined : Date.now() - mountedAt.current,
          utm: {
            utm_source: utm.utm_source,
            utm_medium: utm.utm_medium,
            utm_campaign: utm.utm_campaign,
            utm_content: utm.utm_content,
            utm_term: utm.utm_term,
          },
          referrer: utm.referrer ?? document.referrer,
          landingPage: utm.landing_page ?? window.location.pathname,
        }),
      });
      const data: { error?: string; errors?: ScoutApplyErrors } = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
          focusFirstError(data.errors);
        }
        setFailMessage(data.error ?? "送信に失敗しました。お手数ですが、時間をおいて再度お試しください。");
        setStatus("failed");
        return;
      }
      trackCompany("company_form_submit", { form: "scout" });
      setStatus("done");
      requestAnimationFrame(() => boxRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } catch {
      setFailMessage("送信に失敗しました。通信環境をご確認のうえ、もう一度お試しください。");
      setStatus("failed");
    }
  };

  if (status === "done") {
    return (
      <div ref={boxRef} className="ds-form ds-form--done" role="status">
        <CheckCircle2 className="ds-form__doneicon" aria-hidden="true" />
        <h3>お申し込みを受け付けました</h3>
        <p>
          ご入力いただいた内容を確認のうえ、採用条件のヒアリングのため担当者よりご連絡します。
          <br />
          企業確認・ご契約・アカウント発行のあと、匿名プロフィールの閲覧を始められます。
        </p>
      </div>
    );
  }

  const err = (k: keyof ScoutApplyErrors) =>
    errors[k] ? (
      <p className="ds-form__err" role="alert" id={`ds-e-${k}`}>
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: keyof ScoutApplyErrors) => ({
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `ds-e-${k}` : undefined,
  });
  const errorCount = Object.keys(errors).length;

  return (
    <div ref={boxRef}>
      <form className="ds-form" onSubmit={submit} noValidate>
        {errorCount > 0 && (
          <p className="ds-form__alert" role="alert">
            <AlertCircle aria-hidden="true" />
            入力内容をご確認ください（{errorCount}か所）。
          </p>
        )}

        <fieldset className="ds-form__group">
          <legend>会社情報</legend>
          <Field id="companyName" label="会社名" error={err("companyName")}>
            <input id="ds-f-companyName" className={INPUT} autoComplete="organization" value={v.companyName} onChange={(e) => set("companyName", e.target.value)} placeholder="例）株式会社〇〇運輸" {...aria("companyName")} />
          </Field>
          <Field id="contactName" label="担当者名" error={err("contactName")}>
            <input id="ds-f-contactName" className={INPUT} autoComplete="name" value={v.contactName} onChange={(e) => set("contactName", e.target.value)} placeholder="例）山田 太郎" {...aria("contactName")} />
          </Field>
          <Field id="phone" label="電話番号" error={err("phone")}>
            <input id="ds-f-phone" className={INPUT} type="tel" inputMode="tel" autoComplete="tel" value={v.phone} onChange={(e) => set("phone", e.target.value)} placeholder="例）052-000-0000" {...aria("phone")} />
          </Field>
          <Field id="email" label="メールアドレス" error={err("email")}>
            <input id="ds-f-email" className={INPUT} type="email" inputMode="email" autoComplete="email" value={v.email} onChange={(e) => set("email", e.target.value)} placeholder="例）saiyo@example.co.jp" {...aria("email")} />
          </Field>
          <div className="ds-form__row">
            <Field id="prefecture" label="所在地（都道府県）" error={err("prefecture")}>
              <select id="ds-f-prefecture" className={INPUT} value={v.prefecture} onChange={(e) => set("prefecture", e.target.value)} {...aria("prefecture")}>
                <option value="">選択してください</option>
                {PREFECTURES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </Field>
            <Field id="city" label="所在地（市区町村）" error={err("city")}>
              <input id="ds-f-city" className={INPUT} autoComplete="address-level2" value={v.city} onChange={(e) => set("city", e.target.value)} placeholder="例）名古屋市港区" {...aria("city")} />
            </Field>
          </div>
        </fieldset>

        <fieldset className="ds-form__group">
          <legend>採用したい条件</legend>
          <Chips id="jobTypes" label="採用したい職種（複数選択可）" options={SCOUT_JOB_TYPES} selected={v.jobTypes} onToggle={(o) => toggle("jobTypes", o)} error={err("jobTypes")} />
          <Chips id="licenses" label="求める免許（複数選択可）" options={SCOUT_LICENSES} selected={v.licenses} onToggle={(o) => toggle("licenses", o)} error={err("licenses")} />
          <div className="ds-form__row">
            <Field id="hiringCount" label="採用予定人数" error={err("hiringCount")}>
              <select id="ds-f-hiringCount" className={INPUT} value={v.hiringCount} onChange={(e) => set("hiringCount", e.target.value)} {...aria("hiringCount")}>
                <option value="">選択してください</option>
                {SCOUT_HIRING_COUNTS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </Field>
            <Field id="hiringTiming" label="採用希望時期" error={err("hiringTiming")}>
              <select id="ds-f-hiringTiming" className={INPUT} value={v.hiringTiming} onChange={(e) => set("hiringTiming", e.target.value)} {...aria("hiringTiming")}>
                <option value="">選択してください</option>
                {SCOUT_HIRING_TIMINGS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </fieldset>

        <div className="ds-form__consent">
          <label className={`ds-check${v.privacyAgreed ? " is-on" : ""}${errors.privacyAgreed ? " is-err" : ""}`}>
            <input id="ds-f-privacyAgreed" type="checkbox" checked={v.privacyAgreed} onChange={(e) => set("privacyAgreed", e.target.checked)} {...aria("privacyAgreed")} />
            <span>
              <Link href={PATHS.privacy} target="_blank" rel="noopener noreferrer">
                個人情報保護方針
              </Link>
              に同意する
              <em className="ds-req">必須</em>
            </span>
          </label>
          {err("privacyAgreed")}
        </div>

        {/* ハニーポット：人間には見えない。スクリーンリーダーからも隠す */}
        <div aria-hidden="true" className="ds-hp">
          <label htmlFor="ds-website">Webサイト</label>
          <input id="ds-website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
        </div>

        {status === "failed" && (
          <p className="ds-form__alert" role="alert">
            <AlertCircle aria-hidden="true" />
            {failMessage}
          </p>
        )}

        <div className="ds-form__waiting">
          <WaitingLine />
        </div>
        <button type="submit" className="dt-btn dt-btn--lg ds-form__submit" disabled={status === "sending"} aria-busy={status === "sending"}>
          <span className="dt-btn__body">
            {status === "sending" ? (
              <span className="dt-btn__label ds-form__sending">
                <Loader2 aria-hidden="true" className="ds-spin" />
                送信しています…
              </span>
            ) : (
              <span className="dt-btn__label">{CTA_LABEL}</span>
            )}
          </span>
        </button>
        <p className="ds-form__foot">送信しただけで費用は発生しません。初期費用・月額費用0円、採用決定時のみ成功報酬（想定年収の10％）です。</p>
      </form>
    </div>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="ds-form__field">
      <label htmlFor={`ds-f-${id}`} className="ds-form__label">
        {label}
        <em className="ds-req">必須</em>
      </label>
      {children}
      {error}
    </div>
  );
}

function Chips({
  id,
  label,
  options,
  selected,
  onToggle,
  error,
}: {
  id: string;
  label: string;
  options: readonly string[];
  selected: string[];
  onToggle: (o: string) => void;
  error: React.ReactNode;
}) {
  return (
    <div className="ds-form__field">
      <p className="ds-form__label" id={`ds-l-${id}`}>
        {label}
        <em className="ds-req">必須</em>
      </p>
      <div className="ds-chipset" role="group" aria-labelledby={`ds-l-${id}`} id={`ds-f-${id}`} tabIndex={-1}>
        {options.map((o) => {
          const on = selected.includes(o);
          return (
            <label key={o} className={`ds-chip${on ? " is-on" : ""}`}>
              <input type="checkbox" checked={on} onChange={() => onToggle(o)} />
              {o}
            </label>
          );
        })}
      </div>
      {error}
    </div>
  );
}
