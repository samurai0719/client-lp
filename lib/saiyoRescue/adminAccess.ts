import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdofyAccess } from "@/lib/auth/adofyCheck";

/**
 * 管理画面（サーバーコンポーネント・API）用。
 * adofy 管理者（ADOFY_ADMIN_EMAILS の許可リスト）であることを確認できたときだけ
 * service role のDBクライアントを返す。それ以外は null。
 *
 * レイアウト側でも同じ確認をしているが、ページ・APIそれぞれでも必ず確認する
 * （レイアウトのガードだけに頼らない）。
 */
export async function getAuthorizedLeadsDb() {
  const supabase = await createClient();
  const access = await requireAdofyAccess(supabase);
  if (!access) return null;
  return { db: createAdminClient(), user: access.user };
}
