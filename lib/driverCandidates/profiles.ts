import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/check";
import { candidateNo } from "./candidateNo";
import { showTestCandidates } from "@/lib/driverScout/requestsDb";

/**
 * 企業に見せる匿名プロフィール（driver_candidates.status = 'waiting' の人）。
 * 匿名プロフィール一覧ページ（/driver/scout/profiles）で使う。
 *
 * 氏名・電話・メール・現在の勤務先は select しない（このページの HTML に絶対に載せないため）。
 */
const PUBLIC_COLUMNS =
  "id, age_band, desired_prefecture, desired_area, desired_salary_band, licenses, experience, desired_job_types, change_timing, updated_at";

export type AnonymousProfile = {
  /** 画面に出す番号。id（uuid）の先頭6文字。無料登録フォームへ「どの候補者か」を渡すのにも使う */
  no: string;
  ageBand: string | null;
  area: string | null;
  salaryBand: string | null;
  licenses: string[];
  experience: string | null;
  jobTypes: string[];
  changeTiming: string | null;
  updatedAt: string;
};

type Row = {
  id: string;
  age_band: string | null;
  desired_prefecture: string | null;
  desired_area: string | null;
  desired_salary_band: string | null;
  licenses: string[] | null;
  experience: string | null;
  desired_job_types: string[] | null;
  change_timing: string | null;
  updated_at: string;
};

/** 取得できないときは null（ページ側で「表示できません」を出す。0件とは区別する） */
export async function listAnonymousProfiles(): Promise<AnonymousProfile[] | null> {
  if (!isSupabaseAdminConfigured()) return null;
  try {
    const run = (excludeTest: boolean) => {
      let q = createAdminClient().from("driver_candidates").select(PUBLIC_COLUMNS);
      // ローカルの動作確認（showTestCandidates）では、テスト用の一時停止中の求職者も一覧に出す
      q = excludeTest ? q.eq("status", "waiting").eq("is_test", false) : showTestCandidates() ? q.or("status.eq.waiting,and(is_test.eq.true,status.eq.paused)") : q.eq("status", "waiting");
      return q.order("updated_at", { ascending: false }).limit(200);
    };
    // テスト用の求職者（is_test）は本番に出さない。is_test 列が未作成（migration 016 未適用）なら条件なしで取り直す
    let { data, error } = await run(!showTestCandidates());
    if (error && (error.code === "42703" || error.code === "PGRST204")) ({ data, error } = await run(false));
    if (error) {
      console.error("[driver-candidates] list failed:", error.code, error.message);
      return null;
    }
    return (data as Row[]).map((r) => ({
      no: candidateNo(r.id),
      ageBand: r.age_band,
      area: [r.desired_prefecture, r.desired_area].filter(Boolean).join(" ") || null,
      salaryBand: r.desired_salary_band,
      licenses: r.licenses ?? [],
      experience: r.experience,
      jobTypes: r.desired_job_types ?? [],
      changeTiming: r.change_timing,
      updatedAt: r.updated_at,
    }));
  } catch (err) {
    console.error("[driver-candidates] list failed:", err instanceof Error ? err.message : err);
    return null;
  }
}
