// ─────────────────────────────────────────────────────────────────────────────
// 外構CRMを使う会社（高長建設・株式会社イレブン）の判定
//
// 同じ管理画面・同じテーブルを会社ごとに分けて使う。各行の company 列で区別し、
// ログインした人の profiles.company の会社のデータだけを読み書きする。
// （migration 021_eleven_company.sql）
// ─────────────────────────────────────────────────────────────────────────────

import type { SupabaseClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/auth/adminCheck";
import { isAuthBypassEnabled } from "@/lib/auth/bypass";
import { createAdminClient } from "@/lib/supabase/admin";

export const CRM_COMPANIES = {
  takanaga: { name: "高長建設", initials: "TN" },
  eleven: { name: "株式会社イレブン", initials: "11" },
} as const;

export type CrmCompany = keyof typeof CRM_COMPANIES;

/** LP からの問い合わせが入る会社 */
export const DEFAULT_CRM_COMPANY: CrmCompany = "takanaga";

function isCrmCompany(value: unknown): value is CrmCompany {
  return typeof value === "string" && value in CRM_COMPANIES;
}

/** ログインユーザーの会社。プロフィールが無い・不明な会社なら null（どのデータも見せない） */
export async function companyForUser(userId: string): Promise<CrmCompany | null> {
  if (isAuthBypassEnabled()) {
    // ローカル確認用: DEV_ADMIN_COMPANY=eleven でイレブンの画面になる
    const dev = process.env.DEV_ADMIN_COMPANY;
    return isCrmCompany(dev) ? dev : DEFAULT_CRM_COMPANY;
  }
  const { data } = await createAdminClient()
    .from("profiles")
    .select("company")
    .eq("id", userId)
    .maybeSingle();
  return isCrmCompany(data?.company) ? data.company : null;
}

/** requireAdmin に加えて会社も判定する。管理APIはすべてこれを通す */
export async function requireCrmAdmin(
  supabase: SupabaseClient
): Promise<{ user: { id: string }; company: CrmCompany } | null> {
  const admin = await requireAdmin(supabase);
  if (!admin) return null;
  const company = await companyForUser(admin.user.id);
  if (!company) return null;
  return { user: admin.user, company };
}

/** その案件がログイン中の会社のものか（ID直指定で他社の案件を触らせないため） */
export async function leadBelongsTo(
  db: SupabaseClient,
  leadId: string,
  company: CrmCompany
): Promise<boolean> {
  const { data } = await db
    .from("leads")
    .select("id")
    .eq("id", leadId)
    .eq("company", company)
    .maybeSingle();
  return !!data;
}
