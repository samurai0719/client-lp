import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/check";
import { showTestCandidates } from "@/lib/driverScout/requestsDb";

/**
 * 企業からの連絡を待っている求職者（driver_candidates.status = 'waiting'）の人数。
 * 企業向けLP（/driver/scout）の「○人のドライバーが待機中」に使う。
 *
 * テーブル未作成・Supabase未設定・取得失敗のときは null を返し、LP側は表示しない
 * （実数が取れないのに数字を出さないため）。
 */
export async function getWaitingDriverCount(): Promise<number | null> {
  // 表示確認用：ローカル開発中だけ、DRIVER_WAITING_COUNT_PREVIEW=30 のように固定値を出せる（本番では無視）
  const preview = Number(process.env.DRIVER_WAITING_COUNT_PREVIEW);
  if (process.env.NODE_ENV !== "production" && Number.isInteger(preview) && preview > 0) return preview;

  if (!isSupabaseAdminConfigured()) return null;
  try {
    const run = (excludeTest: boolean) => {
      const q = createAdminClient().from("driver_candidates").select("id", { count: "exact", head: true }).eq("status", "waiting");
      return excludeTest ? q.eq("is_test", false) : q;
    };
    // テスト用の求職者（is_test）は数えない。is_test 列が未作成（migration 016 未適用）の間は条件なしで数える
    let { count, error } = await run(!showTestCandidates());
    // 件数だけの問い合わせ（head）はエラー内容が返らないため、失敗したら is_test の条件なしで数え直す
    if (error) ({ count, error } = await run(false));
    if (error) {
      console.error("[driver-candidates] count failed:", error.code, error.message);
      return null;
    }
    return count ?? null;
  } catch (err) {
    console.error("[driver-candidates] count failed:", err instanceof Error ? err.message : err);
    return null;
  }
}
