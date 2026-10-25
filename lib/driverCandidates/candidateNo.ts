/**
 * 候補者番号。driver_candidates.id（uuid）の先頭6文字を大文字にしたもの。
 * 匿名プロフィールの表示と、無料登録フォームへ「どの候補者か」を渡すのに使う。
 * ブラウザ側（無料登録フォーム）でも使うため、DBに触る処理は置かない。
 */
export const CANDIDATE_NO_PATTERN = /^[0-9A-F]{6}$/;

export function candidateNo(id: string): string {
  return id.replace(/-/g, "").slice(0, 6).toUpperCase();
}
