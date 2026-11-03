"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, MessageCircle, Send, X } from "lucide-react";
import { fireAdofyLead } from "@/lib/analytics/adofyPixel";
import { fireShokuninAgentLead } from "@/lib/analytics/shokuninAgentPixel";
import { loadAttribution } from "@/lib/saiyoRescue/attribution";
import { FORM_ERROR, FORM_HIRES, FORM_JOBS, SERVICE_NAME } from "./config";

/** ヘッダーなどから開くときに送るイベント名 */
export const CHAT_OPEN_EVENT = "sa-chat-open";
export const openChat = () => window.dispatchEvent(new Event(CHAT_OPEN_EVENT));

type Key = "jobType" | "desiredHires" | "issue" | "contactWay" | "company" | "name" | "phone" | "email";

type Step = {
  key: Key;
  ask: string;
  choices?: readonly string[];
  input?: { type: "text" | "tel" | "email"; placeholder: string; autoComplete: string };
  optional?: boolean;
  check?: (v: string) => string | null;
};

const toHalf = (s: string) => s.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0));

const STEPS: Step[] = [
  { key: "jobType", ask: "採用したい職種を教えてください。", choices: FORM_JOBS },
  { key: "desiredHires", ask: "採用したい人数はどのくらいですか？", choices: FORM_HIRES },
  {
    key: "issue",
    ask: "いま一番困っていることは何ですか？",
    choices: ["応募が来ない", "応募者の電話に出られない", "採用してもすぐ辞める", "採用費用が高い", "その他"],
  },
  { key: "contactWay", ask: "ご相談への返信は、どの方法がよろしいですか？", choices: ["メールで返信がほしい", "電話でもよい"] },
  { key: "company", ask: "会社名か屋号を教えてください。", input: { type: "text", placeholder: "例）〇〇建設／〇〇塗装", autoComplete: "organization" } },
  { key: "name", ask: "ご担当者のお名前を教えてください。", input: { type: "text", placeholder: "例）山田 太郎", autoComplete: "name" } },
  {
    key: "phone",
    ask: "電話番号を教えてください（必須）。ご相談内容の確認のため、ご連絡することがあります。",
    input: { type: "tel", placeholder: "例）090-1234-5678", autoComplete: "tel" },
    check: (v) => {
      const n = toHalf(v).replace(/\D/g, "").length;
      return n >= 10 && n <= 11 ? null : "電話番号を正しく入力してください";
    },
  },
  {
    key: "email",
    ask: "最後に、返信先のメールアドレスを教えてください。",
    input: { type: "email", placeholder: "例）info@example.com", autoComplete: "email" },
    check: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : "メールアドレスを正しく入力してください"),
  },
];

const GREETING = `${SERVICE_NAME}です。チャットで無料相談を受け付けています。いくつか質問させてください（1分ほどで終わります）。`;

type Msg = { from: "bot" | "me"; text: string };

/** 運営側が次の発言を入力しているように見せる間（ミリ秒） */
const TYPING_MS = 1100;

function BotAvatar() {
  return (
    <span className="sa-chat__avatar" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/shokunin-agent/operator.webp" width={96} height={96} alt="" />
    </span>
  );
}

/**
 * チャット形式の無料相談。答えは相談フォームと同じAPI（/api/saiyo-rescue-contact → saiyo_rescue_leads）に送る。
 * 会話は画面内だけで進み、送信が成功した時だけ Lead を送ってサンクスページへ移る。
 */
export default function ChatConsult() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Record<Key, string>>>({});
  const [log, setLog] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const timers = useRef<number[]>([]);
  const [draft, setDraft] = useState("");
  const [inputError, setInputError] = useState("");
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const openedAt = useRef(0);
  const lock = useRef(false);
  const bottom = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(CHAT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(CHAT_OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  /** 「・・・」を少し見せてから、運営側の発言を1つずつ出す */
  function botSay(texts: string[]) {
    setTyping(true);
    texts.forEach((text, i) => {
      timers.current.push(
        window.setTimeout(() => {
          setLog((l) => [...l, { from: "bot", text }]);
          setTyping(i < texts.length - 1);
        }, TYPING_MS * (i + 1)),
      );
    });
  }

  useEffect(() => {
    if (!open) return;
    if (!openedAt.current) {
      openedAt.current = Date.now();
      botSay([GREETING, STEPS[0].ask]);
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    bottom.current?.scrollIntoView({ block: "end" });
    if (open && !typing && STEPS[step]?.input) field.current?.focus();
  }, [log, step, open, typing]);

  const current = STEPS[step];
  // 運営側の発言が出るまでは答えられないようにする
  const ready = !typing && log.length > 0;
  const done = ready && step >= STEPS.length;

  function answer(value: string) {
    const v = value.trim();
    if (!current || !v) return;
    const problem = current.check?.(v);
    if (problem) {
      setInputError(problem);
      return;
    }
    setInputError("");
    setDraft("");
    setAnswers((a) => ({ ...a, [current.key]: v }));
    const next = step + 1;
    setLog((l) => [...l, { from: "me", text: v }]);
    setStep(next);
    botSay([next < STEPS.length ? STEPS[next].ask : "ありがとうございます。内容を確認して、送信してください。"]);
  }

  function onType(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    answer(draft);
  }

  async function submit() {
    if (lock.current) return;
    if (!consent) {
      setError("個人情報保護方針への同意が必要です");
      return;
    }
    lock.current = true;
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/saiyo-rescue-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: answers.company,
          name: answers.name,
          phone: answers.phone,
          email: answers.email,
          jobType: answers.jobType,
          desiredHires: answers.desiredHires,
          message: `【チャット相談】\n困っていること：${answers.issue}\n希望の連絡方法：${answers.contactWay}`,
          privacyConsent: "on",
          ...loadAttribution(),
          plan: "shokunin",
          elapsedMs: Date.now() - openedAt.current,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error || FORM_ERROR);

      // Lead は API 成功時のここだけで送る（相談フォームと同じ）
      fireAdofyLead("shokunin-agent");
      fireShokuninAgentLead();
      router.push("/shokunin-agent/thanks");
    } catch (err) {
      setError(err instanceof Error ? err.message : FORM_ERROR);
      setSending(false);
      lock.current = false;
    }
  }

  return (
    <>
      <button type="button" className={`sa-chat-fab${open ? " is-hidden" : ""}`} onClick={() => setOpen(true)} data-sr-cta="chat-fab">
        <MessageCircle aria-hidden="true" strokeWidth={2.4} />
        <span>チャットで相談</span>
      </button>
      {open && (
        <div className="sa-chat" role="dialog" aria-modal="false" aria-label="チャットで無料相談">
          <div className="sa-chat__head">
            <MessageCircle aria-hidden="true" strokeWidth={2.4} />
            <p>
              チャットで無料相談
              <small>1分で完了・相談無料</small>
            </p>
            <button type="button" onClick={() => setOpen(false)} aria-label="チャットを閉じる">
              <X aria-hidden="true" />
            </button>
          </div>
          <div className="sa-chat__log" aria-live="polite">
            {log.map((m, i) => (
              <div key={i} className={`sa-chat__row is-${m.from}`}>
                {m.from === "bot" && <BotAvatar />}
                <p className={`sa-chat__msg is-${m.from}`}>{m.text}</p>
              </div>
            ))}
            {typing && (
              <div className="sa-chat__row is-bot">
                <BotAvatar />
                <p className="sa-chat__msg is-bot sa-chat__typing" aria-label="入力中">
                  <span />
                  <span />
                  <span />
                </p>
              </div>
            )}
            <div ref={bottom} />
          </div>
          <div className="sa-chat__foot">
            {ready && current?.choices && (
              <div className="sa-chat__choices">
                {current.choices.map((c) => (
                  <button key={c} type="button" onClick={() => answer(c)}>
                    {c}
                  </button>
                ))}
              </div>
            )}
            {ready && current?.input && (
              <form className="sa-chat__input" onSubmit={onType} noValidate>
                <input
                  ref={field}
                  type={current.input.type}
                  inputMode={current.input.type === "tel" ? "tel" : current.input.type === "email" ? "email" : undefined}
                  autoComplete={current.input.autoComplete}
                  placeholder={current.input.placeholder}
                  maxLength={current.key === "email" ? 200 : 100}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  aria-label={current.ask}
                  aria-invalid={inputError ? true : undefined}
                />
                <button type="submit" aria-label="送る" disabled={!draft.trim()}>
                  <Send aria-hidden="true" />
                </button>
              </form>
            )}
            {inputError && (
              <p className="sa-chat__error" role="alert">
                {inputError}
              </p>
            )}
            {done && (
              <div className="sa-chat__send">
                <label>
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                  <span>
                    <a href="#legal-privacy" onClick={() => setOpen(false)}>
                      個人情報保護方針
                    </a>
                    に同意する
                  </span>
                </label>
                {error && (
                  <p className="sa-chat__error" role="alert">
                    {error}
                  </p>
                )}
                <button type="button" className="sr-btn sr-btn--primary ks-btn" onClick={submit} disabled={sending}>
                  {sending ? <LoaderCircle className="sr-spin" aria-hidden="true" /> : <Send aria-hidden="true" />}
                  <span>{sending ? "送信中…" : "この内容で相談する"}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
