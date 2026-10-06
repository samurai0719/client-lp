"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronDown, LoaderCircle } from "lucide-react";
import { fireAdofyLead } from "@/lib/analytics/adofyPixel";
import { loadAttribution } from "@/lib/saiyoRescue/attribution";
import { PREFECTURES } from "@/lib/saiyoRescue/leads";
import { FORM_JOB_TYPES, FORM_PLAN_OPTIONS, type PlanId } from "./config";

type PlanValue = PlanId | "undecided";

const BUDGET_OPTIONS = ["0円（無料媒体のみ）", "〜5万円", "5〜10万円", "10〜30万円", "30〜50万円", "50万円以上", "分からない"];

/**
 * 無料相談フォーム。
 * CVRを落とさないよう、必須6項目だけを常に表示し、詳細は「任意」として折りたたむ。
 * 料金プランのCTA（data-sr-plan 付きリンク）がクリックされたら、そのプランを選択済みにする。
 */
export default function ContactForm() {
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState<PlanValue>("undecided");
  const lock = useRef(false);
  const shownAt = useRef(0);

  useEffect(() => {
    shownAt.current = Date.now();
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-sr-plan]");
      const value = el?.dataset.srPlan as PlanId | undefined;
      if (value) setPlan(value);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
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

      fireAdofyLead("saiyo-rescue");
      const thanks = window.location.pathname.startsWith("/saiyo-rescue") ? "/saiyo-rescue/thanks" : "/thanks";
      router.push(thanks);
      // 遷移が完了するまでボタンは押せないままにする
    } catch (err) {
      setError(err instanceof Error ? err.message : "送信に失敗しました");
      setSending(false);
      lock.current = false;
    }
  }

  const planLabel = FORM_PLAN_OPTIONS.find((o) => o.value === plan)?.label;

  return (
    <form className="sr-form" onSubmit={onSubmit}>
      <Field label="会社名" required>
        <input name="company" type="text" required autoComplete="organization" placeholder="例）株式会社〇〇" maxLength={100} />
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
      <div className="sr-form__row">
        <Field label="採用したい職種" required>
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
        <Field label="都道府県" required>
          <select name="prefecture" required defaultValue="" autoComplete="address-level1">
            <option value="" disabled>
              選択してください
            </option>
            {PREFECTURES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {plan !== "undecided" && (
        <p className="sr-form__plan">
          ご希望のプラン：<b>{planLabel}</b>
        </p>
      )}

      <details className="sr-form__more">
        <summary>
          <span>もっと詳しく伝える</span>
          <span className="sr-field__opt">任意</span>
          <ChevronDown aria-hidden="true" className="sr-form__more-icon" />
        </summary>
        <p className="sr-form__more-note">分かる範囲で大丈夫です。未入力でもご相談いただけます。</p>
        <div className="sr-form__row">
          <Field label="現在の採用人数（従業員数）">
            <input name="currentEmployees" type="text" placeholder="例）25名" maxLength={100} />
          </Field>
          <Field label="希望採用人数">
            <input name="desiredHires" type="text" placeholder="例）3名" maxLength={100} />
          </Field>
        </div>
        <Field label="現在使用している求人媒体">
          <input name="currentJobMedia" type="text" placeholder="例）Indeed、ハローワーク" maxLength={100} />
        </Field>
        <Field label="現在の月間採用広告費">
          <select name="monthlyBudget" defaultValue="">
            <option value="">選択してください</option>
            {BUDGET_OPTIONS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </Field>
        <Field label="ホームページURL">
          <input name="websiteUrl" type="url" inputMode="url" placeholder="https://" maxLength={500} />
        </Field>
        <Field label="求人ページURL">
          <input name="jobPageUrl" type="url" inputMode="url" placeholder="https://" maxLength={500} />
        </Field>
        <Field label="ご希望のプラン">
          <select name="plan" value={plan} onChange={(e) => setPlan(e.target.value as PlanValue)}>
            {FORM_PLAN_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
      </details>

      <Field label="ご相談内容">
        <textarea
          name="message"
          rows={4}
          maxLength={3000}
          placeholder="例）ドライバーを3名採用したい。求人媒体に出しているが応募が少ない。など"
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

      <button type="submit" className="sr-btn sr-btn--lg sr-btn--primary sr-form__submit" disabled={sending}>
        {sending ? (
          <>
            <LoaderCircle className="sr-spin" aria-hidden="true" />
            <span>送信中…</span>
          </>
        ) : (
          <>
            <span>無料で採用相談する</span>
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
