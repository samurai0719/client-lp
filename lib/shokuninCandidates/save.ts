import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/check";
import type { EntryAnswers } from "@/components/shokunin-entry/questions";

/**
 * 建設職人の無料登録を shokunin_candidates に保存する。サーバー専用。
 * 登録しただけでは企業に公開しない（status = 'pending'）。
 * 同じ電話番号の人が既にいれば、新しく作らずに回答を更新する（連打・再登録でも1人1件）。
 */
export type ShokuninRegistration = {
  name: string;
  /** 正規化済み（数字のみ） */
  phone: string;
  email: string;
  birthYear: number;
  contactTime: string;
  comment: string;
  answers: EntryAnswers;
  attribution: Record<"utm_source" | "utm_medium" | "utm_campaign" | "utm_content" | "utm_term" | "fbclid" | "fbc" | "fbp" | "referrer" | "landing_url", string | null>;
};

const UNIQUE_VIOLATION = "23505";

export async function saveShokuninRegistration(r: ShokuninRegistration): Promise<{ saved: boolean; isNew: boolean }> {
  if (!isSupabaseAdminConfigured()) return { saved: false, isNew: false };

  const a = r.answers;
  const profile = {
    motivation: a.motivation,
    desired_timing: a.desiredTiming,
    experienced_trades: a.experiencedTrades,
    experience_years: a.experienceYears,
    desired_trades: a.desiredTrades,
    employment_status: a.employmentStatus,
    postal_code: a.postalCode || null,
    current_prefecture: a.currentPrefecture,
    current_city: a.currentCity || null,
    desired_area: a.desiredArea,
    desired_prefecture: a.desiredPrefecture || null,
    top_priority: a.topPriority,
    desired_salary: a.desiredSalary,
    name: r.name,
    birth_year: r.birthYear,
    email: r.email || null,
    contact_time: r.contactTime || null,
    comment: r.comment || null,
    privacy_consent_at: new Date().toISOString(),
  };

  try {
    const db = createAdminClient();
    const { error } = await db.from("shokunin_candidates").insert({ ...profile, phone: r.phone, ...r.attribution });
    if (!error) return { saved: true, isNew: true };
    if (error.code !== UNIQUE_VIOLATION) {
      console.error("[shokunin-entry] insert failed:", error.code, error.message);
      return { saved: false, isNew: false };
    }

    // 再登録：公開状態と最初の流入元は変えず、回答だけ新しくする
    const { error: updateError } = await db
      .from("shokunin_candidates")
      .update({ ...profile, updated_at: new Date().toISOString() })
      .eq("phone", r.phone)
      .neq("status", "withdrawn");
    if (updateError) {
      console.error("[shokunin-entry] update failed:", updateError.code, updateError.message);
      return { saved: false, isNew: false };
    }
    return { saved: true, isNew: false };
  } catch (err) {
    console.error("[shokunin-entry] save failed:", err instanceof Error ? err.message : err);
    return { saved: false, isNew: false };
  }
}
