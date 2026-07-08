"use client";

import { Pencil } from "lucide-react";
import type { DiagnosisAnswers } from "./types";
import { answerLinesForStep } from "./summary";

type DiagnosisConfirmationProps = {
  answers: DiagnosisAnswers;
  submitting: boolean;
  submitError: string;
  onEdit: () => void;
  onSubmit: () => void;
};

type Row = { label: string; value: string };

// 送信前の最終確認カード。表示のみで、送信データは answers をそのまま使用する。
export default function DiagnosisConfirmation({
  answers,
  submitting,
  submitError,
  onEdit,
  onSubmit,
}: DiagnosisConfirmationProps) {
  const { contact } = answers;

  const rows: Row[] = [
    { label: "お住まいの地域", value: answerLinesForStep(1, answers).join("") },
    { label: "現在の状況", value: answerLinesForStep(2, answers).join("") },
    { label: "希望する工事内容", value: answerLinesForStep(3, answers).join("、") },
    { label: "駐車場の希望台数", value: answerLinesForStep(4, answers).join("") },
    { label: "希望予算", value: answerLinesForStep(5, answers).join("") },
    { label: "工事希望時期", value: answerLinesForStep(6, answers).join("") },
    { label: "お名前", value: contact.name },
    { label: "電話番号", value: contact.phone },
    { label: "メールアドレス", value: contact.email || "未入力" },
    { label: "住所・市区町村", value: contact.address || "未入力" },
    { label: "備考", value: contact.note.trim() || "なし" },
  ];

  return (
    <div className="rounded-2xl border border-[#e7e3d8] bg-white p-4 sm:p-5">
      <dl className="divide-y divide-[#f0ece1]">
        {rows.map((row) => (
          <div key={row.label} className="flex items-start gap-3 py-2.5">
            <dt className="w-[7.5em] shrink-0 text-[12px] sm:text-[13px] font-semibold text-[#6b7a73] leading-relaxed">
              {row.label}
            </dt>
            <dd
              className="flex-1 min-w-0 text-[13px] sm:text-sm text-[#10302a] leading-relaxed"
              style={{ overflowWrap: "anywhere" }}
            >
              {row.value || "—"}
            </dd>
          </div>
        ))}
      </dl>

      {submitError && (
        <p role="alert" className="mt-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {submitError}
        </p>
      )}

      <div className="mt-4 space-y-3">
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="gaikou-cta-btn w-full disabled:opacity-60"
          aria-busy={submitting}
        >
          <span className="gaikou-cta-btn-inner">
            {submitting ? "送信しています…" : "無料で診断結果・見積もり相談を送信する"}
          </span>
        </button>
        <button
          type="button"
          onClick={onEdit}
          disabled={submitting}
          className="mx-auto flex items-center justify-center gap-1.5 min-h-[44px] px-4 text-sm font-semibold text-[#2f7d5a] hover:text-[#10302a] transition-colors disabled:opacity-50"
        >
          <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
          内容を修正する
        </button>
      </div>
    </div>
  );
}
