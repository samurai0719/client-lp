"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AlertCircle, Building2, CheckCircle2, Loader2, UserRound } from "lucide-react";
import { PATHS } from "@/config/driver-company";
import { PREFECTURES } from "@/lib/types/driverScoutApply";
import { REQUEST_LIMITS, validateRequest, type RequestErrors } from "@/lib/driverScout/requests";
import { trackCompany } from "../driver-company/track";

/**
 * 「この方と面接を希望する」の依頼フォーム（匿名プロフィール一覧のライトボックス・/register?candidate= で使う）。
 * 送信先は /api/driver-scout-request。保存できなかったときは失敗表示にし、受け付けたように見せかけない。
 *
 * 会社情報は、送信に成功したらこの端末に保存し、次の依頼では入力を省く（済んだ手続きを繰り返させない）。
 * 保存するのは会社情報だけ。求職者の情報や依頼内容は保存しない。
 */

type Status = "idle" | "sending" | "done" | "failed";

type Company = { companyName: string; contactName: string; phone: string; email: string; prefecture: string; city: string };
type Request = { jobDescription: string; questions: string; availableTimes: string };

const EMPTY_COMPANY: Company = { companyName: "", contactName: "", phone: "", email: "", prefecture: "愛知県", city: "" };
const STORE_KEY = "ds-scout-company-v1";

function loadCompany(): Company | null {
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as Partial<Company>;
    if (!c.companyName || !c.email) return null;
    return { ...EMPTY_COMPANY, ...c } as Company;
  } catch {
    return null;
  }
}

function saveCompany(c: Company) {
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(c));
  } catch {
    // 保存できない環境（プライベートモード等）では、次回また入力してもらうだけ
  }
}

const INPUT = "ds-input";

export default function InterviewRequestForm({ candidateNo }: { candidateNo: string }) {
  const [company, setCompany] = useState<Company>(EMPTY_COMPANY);
  /** 前回の会社情報を使っているか（使っているときは会社情報の欄をたたむ） */
  const [savedMode, setSavedMode] = useState(false);
  const [req, setReq] = useState<Request>({ jobDescription: "", questions: "", availableTimes: "" });
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<RequestErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [failMessage, setFailMessage] = useState("");
  const [result, setResult] = useState<{ contracted: boolean; statusUrl: string | null } | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const mountedAt = useRef<number | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mountedAt.current = Date.now();
    const saved = loadCompany();
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- 端末に保存した会社情報はマウント後にしか読めない
      setCompany(saved);
      setSavedMode(true);
    }
  }, []);

  const clearError = (k: keyof RequestErrors) =>
    setErrors((p) => {
      if (!p[k]) return p;
      const n = { ...p };
      delete n[k];
      return n;
    });
  const setC = (k: keyof Company, value: string) => {
    setCompany((p) => ({ ...p, [k]: value }));
    clearError(k);
  };
  const setR = (k: keyof Request, value: string) => {
    setReq((p) => ({ ...p, [k]: value }));
    clearError(k);
  };

  const payload = () => ({ candidateNo, ...company, ...req, privacyAgreed: agreed });

  const focusFirst = (errs: RequestErrors) => {
    const first = Object.keys(errs)[0];
    if (!first) return;
    // 会社情報の誤りなら、たたんだ欄を開く
    if (["companyName", "contactName", "phone", "email", "prefecture", "city"].includes(first)) setSavedMode(false);
    requestAnimationFrame(() => {
      const el = document.getElementById(`ds-r-${first}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) el.focus({ preventScroll: true });
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    const checked = validateRequest(payload());
    if (!checked.ok) {
      setErrors(checked.errors);
      focusFirst(checked.errors);
      return;
    }
    setStatus("sending");
    setFailMessage("");
    try {
      const res = await fetch("/api/driver-scout-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload(),
          websiteUrl: honeypot,
          elapsedMs: mountedAt.current === null ? undefined : Date.now() - mountedAt.current,
        }),
      });
      const data: { error?: string; errors?: RequestErrors; contracted?: boolean; statusUrl?: string | null } = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
          focusFirst(data.errors);
        }
        setFailMessage(data.error ?? "送信に失敗しました。お手数ですが、時間をおいて再度お試しください。");
        setStatus("failed");
        return;
      }
      saveCompany(company);
      trackCompany("company_form_submit", { form: "scout_interview" });
      setResult({ contracted: Boolean(data.contracted), statusUrl: data.statusUrl ?? null });
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
        <h3>面接の希望を受け付けました</h3>
        <p>
          ドラテクが求職者へ連絡し、確認後にご連絡します。
          <br />
          <b>現時点では面接は確定していません。</b>
        </p>
        <p className="ds-form__donenote">
          {result?.contracted
            ? "ご契約済みのため、このまま求職者への連絡を進めます。"
            : "連絡の前に、担当者からサービス内容と料金をご説明します。ご契約のあと、ドラテクが求職者へ連絡します。"}
          求職者のご意向や日程によっては、面接に進まない場合もあります。
        </p>
        {result?.statusUrl && (
          <a href={result.statusUrl} className="ds-form__back" target="_blank" rel="noopener noreferrer">
            受付状況を確認する（受付メールにも記載しています）
          </a>
        )}
      </div>
    );
  }

  const err = (k: keyof RequestErrors) =>
    errors[k] ? (
      <p className="ds-form__err" role="alert" id={`ds-re-${k}`}>
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: keyof RequestErrors) => ({
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `ds-re-${k}` : undefined,
  });
  const errorCount = Object.keys(errors).length;

  return (
    <div ref={boxRef}>
      <form className="ds-form" onSubmit={submit} noValidate>
        <p className="ds-form__candidate">
          <UserRound aria-hidden="true" />
          <span>
            <b>候補者 No.{candidateNo}</b> との面接を希望します
          </span>
        </p>
        {errors.candidateNo && (
          <p className="ds-form__alert" role="alert">
            <AlertCircle aria-hidden="true" />
            {errors.candidateNo}
          </p>
        )}
        {errorCount > 0 && !errors.candidateNo && (
          <p className="ds-form__alert" role="alert">
            <AlertCircle aria-hidden="true" />
            入力内容をご確認ください（{errorCount}か所）。
          </p>
        )}

        <fieldset className="ds-form__group">
          <legend>会社情報</legend>
          {savedMode ? (
            <div className="ds-form__saved">
              <Building2 aria-hidden="true" />
              <p>
                <b>{company.companyName}</b>
                <span>
                  {company.contactName} 様／{company.email}
                </span>
                <small>前回ご入力いただいた会社情報で依頼します。</small>
              </p>
              <button type="button" className="ds-form__edit" onClick={() => setSavedMode(false)}>
                変更する
              </button>
            </div>
          ) : (
            <>
              <Field id="companyName" label="会社名" error={err("companyName")}>
                <input id="ds-r-companyName" className={INPUT} autoComplete="organization" value={company.companyName} onChange={(e) => setC("companyName", e.target.value)} placeholder="例）株式会社〇〇運輸" {...aria("companyName")} />
              </Field>
              <Field id="contactName" label="担当者名" error={err("contactName")}>
                <input id="ds-r-contactName" className={INPUT} autoComplete="name" value={company.contactName} onChange={(e) => setC("contactName", e.target.value)} placeholder="例）山田 太郎" {...aria("contactName")} />
              </Field>
              <Field id="phone" label="電話番号" error={err("phone")}>
                <input id="ds-r-phone" className={INPUT} type="tel" inputMode="tel" autoComplete="tel" value={company.phone} onChange={(e) => setC("phone", e.target.value)} placeholder="例）052-000-0000" {...aria("phone")} />
              </Field>
              <Field id="email" label="メールアドレス" error={err("email")}>
                <input id="ds-r-email" className={INPUT} type="email" inputMode="email" autoComplete="email" value={company.email} onChange={(e) => setC("email", e.target.value)} placeholder="例）saiyo@example.co.jp" {...aria("email")} />
              </Field>
              <div className="ds-form__row">
                <Field id="prefecture" label="所在地（都道府県）" error={err("prefecture")}>
                  <select id="ds-r-prefecture" className={INPUT} value={company.prefecture} onChange={(e) => setC("prefecture", e.target.value)} {...aria("prefecture")}>
                    <option value="">選択してください</option>
                    {PREFECTURES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field id="city" label="市区町村" error={err("city")}>
                  <input id="ds-r-city" className={INPUT} autoComplete="address-level2" value={company.city} onChange={(e) => setC("city", e.target.value)} placeholder="例）名古屋市港区" {...aria("city")} />
                </Field>
              </div>
            </>
          )}
        </fieldset>

        <fieldset className="ds-form__group">
          <legend>ドラテクへの依頼内容</legend>
          <Field id="jobDescription" label="求職者に伝える仕事内容" error={err("jobDescription")}>
            <textarea
              id="ds-r-jobDescription"
              className={`${INPUT} ds-textarea`}
              rows={4}
              maxLength={REQUEST_LIMITS.jobDescription}
              value={req.jobDescription}
              onChange={(e) => setR("jobDescription", e.target.value)}
              placeholder="例）4t ウイング車での地場配送（愛知県内）。勤務地は名古屋市港区。日勤・土日休み。月給30万円〜。"
              {...aria("jobDescription")}
            />
          </Field>
          <Field id="questions" label="求職者に確認したいこと" optional error={null}>
            <textarea
              id="ds-r-questions"
              className={`${INPUT} ds-textarea`}
              rows={3}
              maxLength={REQUEST_LIMITS.questions}
              value={req.questions}
              onChange={(e) => setR("questions", e.target.value)}
              placeholder="例）夜間の運転はできるか、手積み・手降ろしの経験はあるか、いつから働けるか など"
            />
          </Field>
          <Field id="availableTimes" label="面接できる日時" optional error={null}>
            <textarea
              id="ds-r-availableTimes"
              className={`${INPUT} ds-textarea ds-textarea--short`}
              rows={2}
              maxLength={REQUEST_LIMITS.availableTimes}
              value={req.availableTimes}
              onChange={(e) => setR("availableTimes", e.target.value)}
              placeholder="例）平日 10〜17時、土曜の午前"
            />
            <p className="ds-form__help">未定の場合は空欄で構いません。日程の調整時に担当者がお伺いします。</p>
          </Field>
        </fieldset>

        <div className="ds-form__consent">
          <label className={`ds-check${agreed ? " is-on" : ""}${errors.privacyAgreed ? " is-err" : ""}`}>
            <input
              id="ds-r-privacyAgreed"
              type="checkbox"
              checked={agreed}
              onChange={(e) => {
                setAgreed(e.target.checked);
                clearError("privacyAgreed");
              }}
              {...aria("privacyAgreed")}
            />
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

        <div aria-hidden="true" className="ds-hp">
          <label htmlFor="ds-r-website">Webサイト</label>
          <input id="ds-r-website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
        </div>

        {status === "failed" && (
          <p className="ds-form__alert" role="alert">
            <AlertCircle aria-hidden="true" />
            {failMessage}
          </p>
        )}

        <button type="submit" className="dt-btn dt-btn--lg ds-form__submit" disabled={status === "sending"} aria-busy={status === "sending"}>
          <span className="dt-btn__body">
            {status === "sending" ? (
              <span className="dt-btn__label ds-form__sending">
                <Loader2 aria-hidden="true" className="ds-spin" />
                送信しています…
              </span>
            ) : (
              <span className="dt-btn__label">この方と面接を希望する</span>
            )}
          </span>
        </button>
        <p className="ds-form__foot">
          送信しただけで費用は発生しません。ドラテクが求職者に連絡し、面接の希望を確認します。費用が発生するのは、ご契約のうえ採用が決定したときの成功報酬（想定年収の10％）だけです。
        </p>
      </form>
    </div>
  );
}

function Field({
  id,
  label,
  error,
  optional = false,
  children,
}: {
  id: string;
  label: string;
  error: React.ReactNode;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="ds-form__field">
      <label htmlFor={`ds-r-${id}`} className="ds-form__label">
        {label}
        {optional ? <em className="ds-opt">任意</em> : <em className="ds-req">必須</em>}
      </label>
      {children}
      {error}
    </div>
  );
}
