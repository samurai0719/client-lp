import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdofyAccess } from "@/lib/auth/adofyCheck";

/**
 * 営業メール管理（ページ・API）用。
 * adofy 管理者（ADOFY_ADMIN_EMAILS の許可リスト）であることを確認できたときだけ
 * service role のDBクライアントを返す。高長建設の /admin にログインできる提携業者は通さない。
 */
export async function getOutreachDb() {
  const supabase = await createClient();
  const access = await requireAdofyAccess(supabase);
  if (!access) return null;
  return { db: createAdminClient(), user: access.user };
}
