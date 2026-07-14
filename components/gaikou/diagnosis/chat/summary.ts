// チャット履歴用：質問文・回答テキストの導出。
// 選択肢は data/gaikou/diagnosisQuestions.ts を参照し、ここで重複定義しない。

import {
  constructionTypeOptions,
  sizeOptions,
  timingOptions,
  workTypeOptions,
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

// 各ステップの質問文（4ステップ構成）
export function questionForStep(step: number): ChatQuestion {
  switch (step) {
    case 1:
      return {
        title: "工事をご希望の地域を教えてください",
        description: "現在は東海3県に対応しています",
      };
    case 2:
      return {
        title: "ご希望の工事を教えてください",
        description: "工事内容は複数選択できます",
      };
    case 3:
      return {
        title: "施工をご希望の広さと時期を教えてください",
        description: "希望時期は任意です",
      };
    case 4:
      return {
        title: "概算の目安が出ました。\n無料見積もりのご連絡先をご入力ください",
      };
    default:
      return { title: "" };
  }
}

// 各ステップの回答表示（ユーザー側吹き出しで使用）
export function answerLinesForStep(step: number, answers: DiagnosisAnswers): string[] {
  switch (step) {
    case 1:
      return [[answers.prefecture, answers.municipality].filter(Boolean).join(" ")];
    case 2: {
      const lines = [labelOf(workTypeOptions, answers.workType)];
      lines.push(...answers.constructionTypes.map((id) => labelOf(constructionTypeOptions, id)));
      return lines.filter(Boolean);
    }
    case 3: {
      const lines = [labelOf(sizeOptions, answers.size)];
      if (answers.timing) lines.push(`希望時期：${labelOf(timingOptions, answers.timing)}`);
      return lines.filter(Boolean);
    }
    default:
      return [];
  }
}
