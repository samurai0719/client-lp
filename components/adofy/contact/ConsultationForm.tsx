"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CONTACT_TIME_CHOICES, EMPTY_FORM, INDUSTRY_CHOICES, PLAN_CHOICES,
  PREFECTURES, STEP_TITLES, TOPIC_CHOICES,
  TOTAL_STEPS, firstIncompleteStep, normalizePlanParam, validateStep,
  type Choice, type FormData,
} from "./formConfig";
import {
  captureAttribution, clearAttribution, clearForm, loadForm, loadStep,
  markSubmitted, saveForm, saveStep, track, trackStep, type Attribution,
} from "./formState";
import { ChoiceCards, Question, SelectField, TextField } from "./fields";
import { fireAdofyLead } from "@/lib/analytics/adofyPixel";
import { fireLpInsightLead } from "@/components/analytics/lpInsightLead";

const CONFIRM_STEP = TOTAL_STEPS - 1; // 最後は確認画面

export default function ConsultationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [data, setData] = useState<FormData>(EMPTY_FORM);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [sending, setSending] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const attribution = useRef<Attribution>({ utm: {}, referrer: "", landingPage: "" });
  const startedAt = useRef<number>(0);
  const submitting = useRef(false); // 二重送信の最終防波堤
  const topRef = useRef<HTMLDivElement>(null);

  /*
    初期化：保存済みの入力・ステップ・流入情報を復元する。

    sessionStorage / URLパラメータはブラウザにしか無い情報なので、描画中に読むと
    サーバーの出力とズレて hydration error になる。ハイドレーション後に一度だけ
    state へ流し込むのが正しく、ここは意図的に effect 内で setState している。
    （初回マウント時の一度きりで、以降は再実行されない）
  */
  useEffect(() => {
    const saved = loadForm();
    const planParam = normalizePlanParam(searchParams.get("plan"));
    const base = saved ?? EMPTY_FORM;

    // 料金プランのCTAから来た場合はそのプランを選択済みにする
    // （ユーザーはフォーム内で変更できる）
    const next = planParam ? { ...base, selectedPlan: planParam } : base;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- 上記の理由により意図的
    setData(next);
    const savedStep = loadStep();
    setStep(savedStep > CONFIRM_STEP ? 0 : savedStep);
    attribution.current = captureAttribution();
    startedAt.current = Date.now();
    setHydrated(true);

    track("consultation_form_view", { plan: planParam || undefined });
  }, [searchParams]);

  /* ── 入力内容を保持する（再読み込みしても消えない） ──────────────────── */
  useEffect(() => {
    if (!hydrated) return;
    saveForm(data);
  }, [data, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    saveStep(step);
  }, [step, hydrated]);

  const update = useCallback((patch: Partial<FormData>) => {
    setData((d) => ({ ...d, ...patch }));
    setError("");
    // 最初の操作でフォーム開始を計測
    track("consultation_form_start");
  }, []);

  const scrollTop = useCallback(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const goNext = useCallback(() => {
    const message = validateStep(step, data);
    if (message) {
      setError(message);
      return;
    }
    trackStep(step, STEP_TITLES[step]);
    setError("");
    setStep((s) => Math.min(s + 1, CONFIRM_STEP));
    scrollTop();
  }, [step, data, scrollTop]);

  const goBack = useCallback(() => {
    setError("");
    setStep((s) => Math.max(s - 1, 0));
    scrollTop();
  }, [scrollTop]);

  /** 選択式の質問は、選ぶとそのまま次へ進む */
  const chooseAndAdvance = useCallback(
    (patch: Partial<FormData>) => {
      update(patch);
      window.setTimeout(() => {
        setStep((s) => {
          const merged = { ...data, ...patch };
          if (validateStep(s, merged)) return s;
          trackStep(s, STEP_TITLES[s]);
          return Math.min(s + 1, CONFIRM_STEP);
        });
        scrollTop();
      }, 180);
    },
    [update, data, scrollTop]
  );

  /* ── 送信 ─────────────────────────────────────────────────────────────── */
  const submit = useCallback(async () => {
    if (submitting.current) return; // 連打・二重送信を防ぐ
    if (!agreed) {
      setError("プライバシーポリシーへの同意が必要です。");
      return;
    }
    const incomplete = firstIncompleteStep(data);
    if (incomplete !== null) {
      setError(`「${STEP_TITLES[incomplete]}」の入力が不足しています。編集して修正してください。`);
      setStep(incomplete);
      scrollTop();
      return;
    }

    /*
      希望連絡方法は質問を減らすため画面から外し、入力された連絡先から決める。
      （電話だけ＝電話、メールだけ＝メール、両方＝どちらでもよい）
    */
    const method =
      data.phone.trim() && data.email.trim() ? "any" : data.phone.trim() ? "phone" : "email";

    submitting.current = true;
    setSending(true);
    setError("");

    try {
      track("consultation_submit", { plan: data.selectedPlan }, { once: false });

      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          preferredContactMethod: method,
          privacyAgreed: true,
          companyWebsite: honeypot,
          elapsedMs: Date.now() - startedAt.current,
          utm: attribution.current.utm,
          referrer: attribution.current.referrer,
          landingPage: attribution.current.landingPage,
        }),
      });

      const json = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        // 失敗時は入力内容を保持したままエラーを表示し、再送できるようにする
        setError(json.error ?? "送信に失敗しました。時間をおいて再度お試しください。");
        return;
      }

      track("consultation_complete", { plan: data.selectedPlan }, { once: false });
      // Meta広告の成果計測。APIが成功したこの分岐でのみ、adofyのPixelへ1回だけ送る
      fireAdofyLead("consultation_form");
      // LP Insight のコンバージョン。/contact/thanks はURL直打ちでも開けるため、
      // 完了ページ側ではなくここ（API成功時）で送る
      fireLpInsightLead("lead", 1);
      markSubmitted();
      clearForm();
      clearAttribution();
      router.push("/contact/thanks");
    } catch {
      setError(
        "通信エラーが発生しました。入力内容は保持されていますので、電波状況をご確認のうえ再度お試しください。"
      );
    } finally {
      submitting.current = false;
      setSending(false);
    }
  }, [agreed, data, honeypot, router, scrollTop]);

  // 送信完了ページへ遷移するまでの間、二重送信を防ぐためボタンを無効化する
  const disabled = sending;

  /* ── 描画 ─────────────────────────────────────────────────────────────── */
  const progress = Math.round(((step + (step === CONFIRM_STEP ? 1 : 0)) / TOTAL_STEPS) * 100);

  return (
    <div className="adf-form" ref={topRef}>
      {/* 進捗 */}
      <div className="adf-form__progress">
        <div className="adf-form__progress-head">
          <span className="adf-form__progress-label">
            {step === CONFIRM_STEP ? "入力内容の確認" : STEP_TITLES[step]}
          </span>
          <span className="adf-form__progress-count">
            {Math.min(step + 1, TOTAL_STEPS)} / {TOTAL_STEPS}
          </span>
        </div>
        <div
          className="adf-form__bar"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="入力の進捗"
        >
          <i style={{ transform: `scaleX(${progress / 100})` }} />
        </div>
      </div>

      {/* エラー：読み上げ対象にする */}
      <div className="adf-form__error-slot" aria-live="polite" role="status">
        {error ? (
          <p className="adf-form__error">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v6M12 16.5v.5" strokeLinecap="round" />
            </svg>
            {error}
          </p>
        ) : null}
      </div>

      <div className="adf-form__panel" key={step}>
        {step === 0 && (
          <Question step={1} total={TOTAL_STEPS} title="主な事業内容を教えてください">
            <ChoiceCards
              name="主な事業内容" choices={INDUSTRY_CHOICES} columns={2} compact
              value={data.industries[0] ?? ""}
              onChange={(v) =>
                v === "other"
                  ? update({ industries: [v] })
                  : chooseAndAdvance({ industries: [v], industryOther: "" })
              }
            />
            {data.industries.includes("other") ? (
              <TextField
                label="その他の事業内容" required
                value={data.industryOther} onChange={(v) => update({ industryOther: v })}
                placeholder="例：造園工事"
              />
            ) : null}
          </Question>
        )}

        {step === 1 && (
          <Question step={2} total={TOTAL_STEPS} title="今回ご相談したい内容を教えてください">
            <ChoiceCards
              name="相談内容" choices={TOPIC_CHOICES} columns={1}
              value={data.consultationTopics[0] ?? ""}
              onChange={(v) =>
                v === "other"
                  ? update({ consultationTopics: [v] })
                  : chooseAndAdvance({ consultationTopics: [v], consultationOther: "" })
              }
            />
            {data.consultationTopics.includes("other") ? (
              <TextField
                label="その他の相談内容" required
                value={data.consultationOther} onChange={(v) => update({ consultationOther: v })}
              />
            ) : null}
          </Question>
        )}

        {step === 2 && (
          <Question step={3} total={TOTAL_STEPS} title="会社情報をご入力ください">
            <TextField
              label="会社名・屋号" required autoComplete="organization"
              value={data.companyName} onChange={(v) => update({ companyName: v })}
              placeholder="例：株式会社adofy建設"
            />
            <TextField
              label="ご担当者名" required autoComplete="name"
              value={data.contactName} onChange={(v) => update({ contactName: v })}
              placeholder="例：山田 太郎"
            />
            <SelectField
              label="都道府県" required autoComplete="address-level1"
              options={PREFECTURES} value={data.prefecture}
              onChange={(v) => update({ prefecture: v })}
            />
          </Question>
        )}

        {step === 3 && (
          <Question
            step={4} total={TOTAL_STEPS} title="ご連絡先をご入力ください"
            description="電話番号とメールアドレスは、どちらか一方のご入力で送信できます。"
          >
            <TextField
              label="電話番号" type="tel" inputMode="tel" autoComplete="tel"
              value={data.phone} onChange={(v) => update({ phone: v })}
              placeholder="0581234567"
            />
            <TextField
              label="メールアドレス" type="email" inputMode="email" autoComplete="email"
              value={data.email} onChange={(v) => update({ email: v })}
              placeholder="info@example.co.jp"
            />
            <div className="adf-field">
              <p className="adf-field__label">
                連絡しやすい時間帯<span className="adf-field__req">必須</span>
              </p>
              <ChoiceCards
                name="連絡しやすい時間帯" choices={CONTACT_TIME_CHOICES} compact
                value={data.preferredContactTime}
                onChange={(v) => update({ preferredContactTime: v })}
              />
            </div>
          </Question>
        )}

        {step === CONFIRM_STEP && (
          <ConfirmPanel
            data={data}
            agreed={agreed}
            sending={sending}
            onAgree={setAgreed}
            onEdit={(s) => {
              setError("");
              setStep(s);
              scrollTop();
            }}
            onSubmit={submit}
          />
        )}
      </div>

      {/* ハニーポット：利用者には見えず、支援技術からも隠す */}
      <div className="adf-hp" aria-hidden="true">
        <label htmlFor="adf-company-website">Company website (入力しないでください)</label>
        <input
          id="adf-company-website"
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {/* 進む・戻る */}
      {step !== CONFIRM_STEP ? (
        <div className="adf-form__nav">
          <button
            type="button" className="adf-btn adf-btn--ghost"
            onClick={goBack} disabled={step === 0}
          >
            戻る
          </button>
          <button type="button" className="adf-btn adf-btn--primary" onClick={goNext}>
            次へ進む
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h13M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      ) : (
        <div className="adf-form__nav">
          <button
            type="button" className="adf-btn adf-btn--ghost"
            onClick={goBack} disabled={disabled}
          >
            戻る
          </button>
        </div>
      )}
    </div>
  );
}

/* ── 確認画面 ─────────────────────────────────────────────────────────── */

function labelOf(choices: Choice[], value: string): string {
  return choices.find((c) => c.value === value)?.label ?? "";
}

function labelsOf(choices: Choice[], values: string[], other?: string): string {
  const list = values.map((v) => (v === "other" && other ? `その他（${other}）` : labelOf(choices, v)));
  return list.filter(Boolean).join("、");
}

function ConfirmPanel({
  data, agreed, sending, onAgree, onEdit, onSubmit,
}: {
  data: FormData;
  agreed: boolean;
  sending: boolean;
  onAgree: (v: boolean) => void;
  onEdit: (step: number) => void;
  onSubmit: () => void;
}) {
  /*
    step を持たない行（希望プラン）は料金表のCTAから引き継いだ値で、
    フォーム内に対応する質問が無いため「編集」ボタンを出さない。
  */
  const rows: { step?: number; label: string; value: string }[] = [
    { step: 0, label: "主な事業内容", value: labelsOf(INDUSTRY_CHOICES, data.industries, data.industryOther) },
    { step: 1, label: "ご相談内容", value: labelsOf(TOPIC_CHOICES, data.consultationTopics, data.consultationOther) },
    {
      step: 2, label: "会社情報",
      value: [
        data.companyName,
        `ご担当者：${data.contactName}`,
        `所在地：${data.prefecture}`,
      ].filter(Boolean).join(" / "),
    },
    {
      step: 3, label: "ご連絡先",
      value: [
        data.phone && `電話：${data.phone}`,
        data.email && `メール：${data.email}`,
        `時間帯：${labelOf(CONTACT_TIME_CHOICES, data.preferredContactTime)}`,
      ].filter(Boolean).join(" / "),
    },
    ...(data.selectedPlan
      ? [{ label: "気になっているプラン", value: labelOf(PLAN_CHOICES, data.selectedPlan) }]
      : []),
  ];

  return (
    <div className="adf-q">
      <p className="adf-q__count">CONFIRM</p>
      <h2 className="adf-q__title">入力内容をご確認ください</h2>
      <p className="adf-q__desc">修正する場合は、各項目の「編集」からその質問へ戻れます。</p>

      <dl className="adf-confirm">
        {rows.map((r) => (
          <div key={r.label} className="adf-confirm__row">
            <dt>{r.label}</dt>
            <dd>
              <span>{r.value || "未入力"}</span>
              {r.step !== undefined ? (
                <button type="button" className="adf-confirm__edit" onClick={() => onEdit(r.step as number)}>
                  編集
                </button>
              ) : null}
            </dd>
          </div>
        ))}
      </dl>

      <label className="adf-agree">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => onAgree(e.target.checked)}
          aria-required="true"
        />
        <span>
          <a href="/adofy#privacy" target="_blank" rel="noopener noreferrer">
            プライバシーポリシー
          </a>
          に同意して送信する
        </span>
      </label>

      <button
        type="button"
        className="adf-btn adf-btn--submit"
        onClick={onSubmit}
        disabled={sending || !agreed}
        aria-busy={sending}
      >
        {sending ? "送信中..." : "無料相談を申し込む"}
      </button>

      <ul className="adf-submit-notes">
        <li>相談は完全無料です</li>
        <li>無理な営業は行いません</li>
        <li>入力内容は相談対応以外には使用しません</li>
      </ul>
    </div>
  );
}
