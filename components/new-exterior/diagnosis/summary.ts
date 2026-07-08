// チャット履歴用：質問文・回答テキストの導出。
// 質問文・選択肢は data/new-exterior/diagnosisQuestions.ts を参照し、ここで重複定義しない。

import {
  budgetOptions,
  constructionTypeOptions,
  diagnosisQuestions,
  parkingCountOptions,
  regionOptions,
  statusOptions,
  timingOptions,
  type DiagnosisOption,
} from "@/data/new-exterior/diagnosisQuestions";
import type { DiagnosisAnswers } from "./types";

export function labelOf(options: DiagnosisOption[], id: string | null): string {
  if (!id) return "";
  return options.find((option) => option.id === id)?.label ?? id;
}

export type ChatQuestion = {
  title: string;
  description?: string;
};

export function questionForStep(step: number): ChatQuestion {
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
      return [labelOf(regionOptions, answers.region)];
    case 2:
      return [labelOf(statusOptions, answers.status)];
    case 3:
      return answers.constructionTypes.map((id) => labelOf(constructionTypeOptions, id));
    case 4:
      return [labelOf(parkingCountOptions, answers.parkingCount)];
    case 5:
      return [labelOf(budgetOptions, answers.budget)];
    case 6:
      return [labelOf(timingOptions, answers.timing)];
    default:
      return [];
  }
}
