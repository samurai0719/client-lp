"use client";

import { useRef, useState } from "react";

export default function PurchaseForm({ token, company, already }: { token: string; company: string | null; already: boolean }) {
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">(already ? "done" : "idle");
  const [error, setError] = useState("");
  const sendingRef = useRef(false);

  const submit = async () => {
    if (sendingRef.current) return;
    sendingRef.current = true;
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/free-design/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, message }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(j.error ?? "送信に失敗しました。時間をおいて再度お試しください。");
        setState("idle");
        return;
      }
      setState("done");
    } catch {
      setError("通信エラーで送信できませんでした。もう一度お試しください。");
      setState("idle");
    } finally {
      sendingRef.current = false;
    }
  };

  if (state === "done") {
    return (
      <div className="fd-done">
        <div className="fd-done__icon" aria-hidden="true">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12.5 9.5 18 20 6" />
          </svg>
        </div>
        <p className="fd-done__title">ご希望を承りました</p>
        <p className="fd-done__text">
          ありがとうございます。正式な制作・公開に必要な料金と契約条件を、担当者からメールでご案内します。
          <br />
          <br />
          内容をご確認いただき、ご納得いただいてから正式なお申し込みとなります。この時点でお支払いや契約が発生することはありません。
        </p>
      </div>
    );
  }

  return (
    <div className="fd-form fd-purchase__form">
      <p className="fd-purchase__lead">{company ? `${company}` : ""}</p>
      <h1 className="fd-done__title">このデザインで購入を希望する</h1>
      <p className="fd-purchase__text">
        下のボタンを押すと、担当者に「このデザインで進めたい」とお知らせします。
        その後、正式な制作・公開に必要な料金と契約条件をメールでご案内します。
      </p>
      <p className="fd-purchase__text">
        <b>このボタンを押しても、お支払いや契約は発生しません。</b>
        料金と契約条件をご確認いただき、ご納得いただいてから正式なお申し込みとなります。
      </p>
      <label className="fd-field">
        <span className="fd-field__label">ご要望・ご質問<em className="is-optional">任意</em></span>
        <textarea
          className="fd-input fd-textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={1000}
          rows={4}
          placeholder="例）トップの写真だけ差し替えたいです"
        />
      </label>
      {error && <p className="fd-error fd-error--box" role="alert">{error}</p>}
      <button type="button" className="fd-btn fd-btn--primary fd-btn--xl fd-btn--block" disabled={state === "sending"} onClick={submit}>
        {state === "sending" ? "送信中…" : "このデザインで購入を希望する"}
      </button>
    </div>
  );
}
