import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isAuthBypassEnabled, DEV_ADMIN_USER } from "@/lib/auth/bypass";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * adofy の相談データにアクセスしてよいユーザーかを判定する。
 *
 * 既存の requireAdmin は「ログイン済みか」しか見ておらず、
 * 高長建設の管理画面には提携先の外構業者もログインする。
 * そのため adofy 側は profiles.adofy_access が true のユーザーだけに限定する。
 * （DB側でも RLS で同じ条件を掛けているので、二重に守られる）
 */
export async function requireAdofyAccess(
  supabase: SupabaseClient
): Promise<{ user: { id: string } } | null> {
  // バイパスはローカル / Preview のみ。Production では絶対に通らない。
  if (isAuthBypassEnabled()) {
    return { user: { id: DEV_ADMIN_USER.id } };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // 権限の確認は service role で行う（本人のprofilesが読めない設定でも判定できるように）
  const db = createAdminClient();
  const { data, error } = await db
    .from("profiles")
    .select("adofy_access")
    .eq("id", user.id)
    .single();

  if (error || !data?.adofy_access) return null;

  return { user };
}

export function forbiddenResponse() {
  // 権限が無いことは伝えるが、内部の構造は明かさない
  return NextResponse.json({ error: "この操作を行う権限がありません" }, { status: 403 });
}
