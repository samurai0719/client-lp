"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import ContactForm from "./ContactForm";
import { DISCLOSE_LABEL } from "./config";

/** カードのボタン → ライトボックスを開くイベント（detail は候補者番号。表示例は null） */
const OPEN_EVENT = "ks:open-interview";

/** 匿名プロフィールのカードに置く「この方と面接を希望する」 */
export function DiscloseButton({ no = null }: { no?: string | null }) {
  return (
    <button
      type="button"
      className="sr-btn sr-btn--lg sr-btn--primary ks-btn ks-disclose__btn"
      data-sr-cta="profile_card"
      onClick={() => window.dispatchEvent(new CustomEvent<string | null>(OPEN_EVENT, { detail: no }))}
    >
      <span>{DISCLOSE_LABEL}</span>
    </button>
  );
}

/**
 * 面接希望のライトボックス（一覧ページに1つだけ置く）。
 * 表示例のカードから開いたとき（候補者番号なし）は、依頼できない旨を伝えたうえで会社の無料登録フォームを出す。
 * ネイティブの <dialog> を使うので、Esc キー・フォーカスの閉じ込めはブラウザが行う。
 */
export default function InterviewModal() {
  const ref = useRef<HTMLDialogElement>(null);
  const [candidate, setCandidate] = useState<string | null>(null);
  /** 開くたびにフォームを作り直す（前回の入力・エラー表示を残さない） */
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    const onOpen = (e: Event) => {
      setCandidate((e as CustomEvent<string | null>).detail ?? null);
      setFormKey((k) => k + 1);
      const dialog = ref.current;
      if (dialog && !dialog.open) dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  const close = () => ref.current?.close();

  return (
    <dialog
      ref={ref}
      className="ks-modal"
      aria-labelledby="ks-modal-title"
      onClose={() => {
        document.documentElement.style.overflow = "";
      }}
      onClick={(e) => {
        // 背景（ダイアログの外側）を押したら閉じる
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="ks-modal__head">
        <p className="ks-modal__title" id="ks-modal-title">
          {candidate ? `候補者 No.${candidate} との面接を希望する` : `${DISCLOSE_LABEL}（表示例）`}
        </p>
        <button type="button" className="ks-modal__close" onClick={close} aria-label="閉じる">
          <X aria-hidden="true" />
        </button>
      </div>
      <div className="ks-modal__body">
        {candidate ? (
          <p className="ks-modal__lead">
            採用レスキューが求職者に連絡し、面接の希望と御社が確認したい内容を聞いたうえで、面接の日程を調整します。はじめての企業様には、ご契約の前にサービス内容と料金をご説明します。
          </p>
        ) : (
          <p className="ks-modal__lead">
            このカードは表示例（架空の求職者）のため、この方への面接のご依頼はお受けできません。
            <br />
            先に会社情報を無料でご登録いただけます。実際の求職者が公開されたら、その方のカードの「{DISCLOSE_LABEL}」からご依頼ください。
          </p>
        )}
        <ContactForm key={formKey} candidate={candidate} />
      </div>
    </dialog>
  );
}
