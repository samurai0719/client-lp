/**
 * 診断の設問定義。
 * DriverContent (画面) / RegisterSection (確認表示) / /api/driver-register (通知メール)
 * の3か所で共有します。設問を増減する場合はここも合わせて更新してください。
 */

/** 診断の全質問数。StepHeader / QuestionCard の「STEP n / 7」と同期しています。 */
export const TOTAL_STEPS = 7;

/** 設問ラベル。キーは step 番号 (= 質問番号) と一致させてください。 */
export const QUESTION_LABELS: Record<number, string> = {
  1: '今のお気持ち',
  2: '正社員での就業経験年数',
  3: '現在の就業状況',
  4: 'お持ちの免許',
  5: '希望する働き方',
  6: '希望の勤務エリア',
  7: '希望年収',
};
