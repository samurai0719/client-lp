import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/check";
import { answersToLabeled, type DriverAnswers } from "@/components/driver/questions";

/**
 * 求職者LP（/driver）の無料登録を driver_candidates に保存する。サーバー専用。
 *
 * 登録しただけでは企業に公開しない（status = 'pending'）。運営が本人に確認し、
 * 管理画面で「公開中」にしたときだけ、企業向けの一覧に匿名で載る。
 * 同じ電話番号かメールの人が既にいれば、新しく作らずに回答とコメントを更新する。
 *
 * answers 列には全回答を「日本語の項目名 → 文字列」で保存する（旧形式と同じ形なので管理画面はどちらも表示できる）。
 * 保存できなかったときは false（呼び出し側はメール通知だけで続ける）。
 */
export type DriverRegistration = {
  name: string;
  /** 正規化済み（数字のみ） */
  phone: string;
  /** 空なら未入力 */
  email: string;
  birthYear: number | null;
  contactTime: string;
  comment: string;
  answers: DriverAnswers;
  attribution: { utmSource: string | null; utmCampaign: string | null; landingPage: string | null };
};

/** 生まれ年 → 年代（企業に見せる匿名プロフィールには年齢そのものを出さない） */
export function ageBandFromBirthYear(birthYear: number | null, now = new Date()): string | null {
  if (!birthYear) return null;
  const age = now.getFullYear() - birthYear;
  if (age < 20) return "10代";
  if (age >= 60) return "60代以上";
  return `${Math.floor(age / 10) * 10}代`;
}

/** 登録内容 → driver_candidates の列 */
export function registrationToRow(r: DriverRegistration) {
  const a = r.answers;
  const labeled: Record<string, string> = Object.fromEntries(answersToLabeled(a));
  if (r.birthYear) labeled["生まれ年"] = `${r.birthYear}年`;
  if (r.contactTime) labeled["連絡希望時間帯"] = r.contactTime;

  // 希望勤務地：都道府県まで選んでいればそれ、「現在の住所周辺」ならお住まいの都道府県
  const desiredPrefecture = a.desiredPrefecture || (a.desiredArea === "現在の住所周辺" ? a.currentPrefecture : "") || null;
  const experience = a.driverExperience ? `ドライバー経験 ${a.driverExperience}` : null;

  return {
    full_name: r.name,
    phone: r.phone,
    email: r.email || null,
    age_band: ageBandFromBirthYear(r.birthYear),
    licenses: a.licenses,
    desired_job_types: a.desiredJobTypes.filter((v) => v !== "特に決めていない"),
    desired_prefecture: desiredPrefecture,
    desired_area: a.desiredArea || null,
    desired_salary_band: a.desiredSalary && a.desiredSalary !== "まだ決めていない" ? a.desiredSalary : null,
    experience,
    change_timing: a.desiredTiming || null,
    utm_source: r.attribution.utmSource,
    utm_campaign: r.attribution.utmCampaign,
    landing_page: r.attribution.landingPage,
    answers: labeled,
    comment: r.comment || null,
  };
}

export async function saveDriverRegistration(r: DriverRegistration): Promise<{ saved: boolean; existing?: boolean }> {
  if (!isSupabaseAdminConfigured()) return { saved: false };

  const row = registrationToRow(r);

  try {
    const db = createAdminClient();

    const keys = [`phone.eq.${r.phone}`, r.email && `email.eq."${r.email.replace(/"/g, "")}"`].filter(Boolean).join(",");
    const { data: found } = await db.from("driver_candidates").select("id").or(keys).neq("status", "withdrawn").limit(1);
    const hit = (found as { id: string }[] | null)?.[0];
    if (hit) {
      // 再登録：状態（公開中など）と運営が補った項目は変えず、回答と連絡先の補足だけ新しくする
      const { error } = await db
        .from("driver_candidates")
        .update({ answers: row.answers, comment: row.comment, updated_at: new Date().toISOString() })
        .eq("id", hit.id);
      if (!error) return { saved: true, existing: true };
      console.error("[driver-register] candidate update failed:", error.code, error.message);
    }

    const { error } = await db.from("driver_candidates").insert({ ...row, status: "pending", source: "driver_lp" });
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
