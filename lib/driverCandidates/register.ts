import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/check";
import { normalizeEmail, normalizePhone } from "@/lib/types/driverScoutApply";
import { QUESTION_LABELS } from "@/components/driver/questions";

/**
 * 求職者LP（/driver）の無料登録を driver_candidates に保存する。サーバー専用。
 *
 * 登録しただけでは企業に公開しない（status = 'pending'）。運営が本人に確認し、
 * 年代などを補って管理画面で「公開中」にしたときだけ、企業向けの一覧に匿名で載る。
 * 同じ電話番号かメールの人が既にいれば、新しく作らずに回答とコメントを更新する。
 *
 * 保存できなかったときは false（呼び出し側はメール通知だけで続ける）。
 */
export async function saveDriverRegistration(input: {
  name: string;
  phone: string;
  email: string;
  comment?: string;
  answers?: Record<string, string>;
  utmSource?: string | null;
  utmCampaign?: string | null;
  landingPage?: string | null;
}): Promise<{ saved: boolean; existing?: boolean }> {
  if (!isSupabaseAdminConfigured()) return { saved: false };

  const a = input.answers ?? {};
  const answers: Record<string, string> = {};
  for (const [n, label] of Object.entries(QUESTION_LABELS)) {
    const v = a[n];
    if (typeof v === "string" && v.trim()) answers[label] = v.trim().slice(0, 100);
  }
  const phone = normalizePhone(input.phone);
  const email = normalizeEmail(input.email);
  const comment = input.comment?.trim().slice(0, 2000) || null;

  const license = a["4"] ?? "";
  const licenses = license.includes("大型")
    ? ["大型"]
    : license.includes("準中型")
      ? ["準中型"]
      : license.includes("中型")
        ? ["中型"]
        : license.includes("普通")
          ? ["普通（AT限定可）"]
          : [];
  const style = a["5"] ?? "";
  const jobTypes = style.startsWith("長距離") ? ["長距離"] : style.startsWith("地場") ? ["地場配送"] : [];
  const salary = a["7"] && a["7"] !== "まだ決めていない" ? a["7"] : null;
  const experience = a["2"] ? `正社員経験 ${a["2"]}` : null;

  try {
    const db = createAdminClient();

    const keys = [phone && `phone.eq.${phone}`, email && `email.eq."${email.replace(/"/g, "")}"`].filter(Boolean).join(",");
    if (keys) {
      const { data: found } = await db.from("driver_candidates").select("id").or(keys).neq("status", "withdrawn").limit(1);
      const hit = (found as { id: string }[] | null)?.[0];
      if (hit) {
        const { error } = await db
          .from("driver_candidates")
          .update({ answers, comment, updated_at: new Date().toISOString() })
          .eq("id", hit.id);
        if (!error) return { saved: true, existing: true };
        console.error("[driver-register] candidate update failed:", error.code, error.message);
      }
    }

    const base = {
      full_name: input.name.trim().slice(0, 100),
      phone: phone ?? input.phone.trim().slice(0, 40),
      email: email ?? input.email.trim().slice(0, 200),
      licenses,
      desired_job_types: jobTypes,
      desired_area: a["6"]?.slice(0, 100) ?? null,
      desired_salary_band: salary,
      experience,
      utm_source: input.utmSource ?? null,
      utm_campaign: input.utmCampaign ?? null,
      landing_page: input.landingPage ?? null,
    };
    let { error } = await db.from("driver_candidates").insert({ ...base, status: "pending", source: "driver_lp", answers, comment });
    // migration 017 未適用の間は、公開されない「一時停止」で最低限の項目だけ保存する
    if (error && ["42703", "PGRST204", "23514"].includes(error.code ?? "")) {
      ({ error } = await db.from("driver_candidates").insert({ ...base, status: "paused" }));
    }
    if (error) {
      console.error("[driver-register] candidate insert failed:", error.code, error.message);
      return { saved: false };
    }
    return { saved: true };
  } catch (err) {
    console.error("[driver-register] candidate save failed:", err instanceof Error ? err.message : err);
    return { saved: false };
  }
}
