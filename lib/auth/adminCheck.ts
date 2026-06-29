import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isAuthBypassEnabled, DEV_ADMIN_USER } from "@/lib/auth/bypass";

export async function requireAdmin(
  supabase: SupabaseClient
): Promise<{ user: { id: string } } | null> {
  // バイパスモード（ローカル / Preview のみ、Production は絶対に通らない）
  if (isAuthBypassEnabled()) {
    return { user: { id: DEV_ADMIN_USER.id } };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return { user };
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
}
