import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function requireAdmin(supabase: SupabaseClient): Promise<{ user: { id: string } } | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return { user };
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
}
