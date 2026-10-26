"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import InterviewRequestForm from "./InterviewRequestForm";
import { OPEN_INTERVIEW_EVENT } from "./events";


/**
 * 面接希望のライトボックス（匿名プロフィール一覧に1つだけ置く）。
 * 各カードのボタンが候補者番号つきのイベントを出し、ここで企業登録フォームを開く。
 * フォームは InterviewRequestForm（会社情報・仕事内容・確認したいこと・面接できる日時を送る）。
 * ネイティブの <dialog> を使うので、Esc キー・フォーカスの閉じ込めはブラウザが行う。
 */
export default function InterviewModal() {
  const ref = useRef<HTMLDialogElement>(null);
  const [candidate, setCandidate] = useState<string | null>(null);
  /** 開くたびにフォームを作り直す（前回の入力・完了表示を残さない） */
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const no = (e as CustomEvent<string>).detail;
      setCandidate(no);
      setFormKey((k) => k + 1);
      const dialog = ref.current;
      if (dialog && !dialog.open) dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    };
    window.addEventListener(OPEN_INTERVIEW_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_INTERVIEW_EVENT, onOpen);
  }, []);

  const close = () => ref.current?.close();

  return (
    <dialog
      ref={ref}
      className="ds-modal"
      aria-labelledby="ds-modal-title"
      onClose={() => {
        document.documentElement.style.overflow = "";
      }}
      onClick={(e) => {
        // 背景（ダイアログの外側）を押したら閉じる
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="ds-modal__head">
        <p className="ds-modal__title" id="ds-modal-title">
          {candidate ? `候補者 No.${candidate} との面接を希望する` : "面接を希望する"}
        </p>
        <button type="button" className="ds-modal__close" onClick={close} aria-label="閉じる">
          <X aria-hidden="true" />
        </button>
      </div>
      <div className="ds-modal__body">
        <p className="ds-modal__lead">
          ドラテクが求職者に連絡し、面接の希望と御社が確認したい内容を聞いたうえで、面接の日程を調整します。はじめての企業さまは、ご契約の前に担当者がサービス内容と料金をご説明します。
        </p>
        {candidate && <InterviewRequestForm key={formKey} candidateNo={candidate} />}
      </div>
    </dialog>
  );
}
