// チャット履歴用：質問文・回答テキストの導出。
// 質問文・選択肢は data/gaikou/diagnosisQuestions.ts を参照し、ここで重複定義しない。

import {
  budgetOptions,
  constructionTypeOptions,
  diagnosisQuestions,
  paymentMethodOptions,
  sizeOptions,
  timingOptions,
  worryOptions,
  type DiagnosisOption,
} from "@/data/gaikou/diagnosisQuestions";
import type { DiagnosisAnswers } from "../types";

function labelOf(options: DiagnosisOption[], id: string | null): string {
  if (!id) return "";
  return options.find((option) => option.id === id)?.label ?? id;
}

export type ChatQuestion = {
  title: string;
  description?: string;
};

// 各ステップの質問文（既存の質問文をそのまま使用。文言変更禁止）
export function questionForStep(step: number): ChatQuestion {
  if (step === 1) {
    return {
      title: "工事をご希望の地域を教えてください",
      description: "現在は東海3県に対応しています",
    };
  }
  if (step === 7) {
    return {
      title: "診断結果をお届けするため、\nお客様情報をご入力ください",
    };
  }
  const question = diagnosisQuestions.find((q) => q.step === step);
  return { title: question?.title ?? "", description: question?.description };
}

// 各ステップの回答表示（ユーザー側吹き出し・確認画面で使用）
export function answerLinesForStep(step: number, answers: DiagnosisAnswers): string[] {
  switch (step) {
    case 1:
      return [[answers.prefecture, answers.municipality].filter(Boolean).join(" ")];
    case 2:
      return answers.constructionTypes.map((id) => labelOf(constructionTypeOptions, id));
    case 3: {
      const lines = answers.worries.map((id) => labelOf(worryOptions, id));
      if (answers.worries.includes("other") && answers.worriesOther.trim()) {
        lines.push(`「${answers.worriesOther.trim()}」`);
      }
      return lines;
    }
    case 4:
      return [labelOf(sizeOptions, answers.size)];
    case 5:
      return [labelOf(timingOptions, answers.timing)];
    case 6: {
      const lines = [labelOf(budgetOptions, answers.budget)];
      if (answers.paymentMethod) {
        lines.push(`支払い方法：${labelOf(paymentMethodOptions, answers.paymentMethod)}`);
      }
      return lines;
    }
    default:
      return [];
  }
}

export const paymentMethodLabel = (id: string | null) => labelOf(paymentMethodOptions, id);
