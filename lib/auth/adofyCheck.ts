import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isAuthBypassEnabled, DEV_ADMIN_USER } from "@/lib/auth/bypass";

/**
 * adofy の相談データにアクセスしてよいユーザーかを判定する。
 *
 * 高長建設の /admin には提携先の外構業者もログインするため、
 * 「ログイン済みか」だけを見る requireAdmin では adofy 側を守れない。
 * ここでは環境変数のメールアドレス許可リストで明示的に絞る。
 *
 *   ADOFY_ADMIN_EMAILS="info@example.com,other@example.com"
 *
 * DBのカラムではなく環境変数にしているのは、
 * マイグレーションを適用しなくても運用を始められるようにするため。
 * 追加・削除は Vercel の環境変数を変えるだけでよい。
 */
function allowedEmails(): string[] {
  return (process.env.ADOFY_ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export async function requireAdofyAccess(
  supabase: SupabaseClient
): Promise<{ user: { id: string; email: string } } | null> {
  // バイパスはローカル / Preview のみ。Production では絶対に通らない。
  if (isAuthBypassEnabled()) {
    return { user: { id: DEV_ADMIN_USER.id, email: "dev@local" } };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return null;

  const list = allowedEmails();

  // 許可リストが未設定のまま誰でも入れる状態にはしない（安全側に倒す）
  if (list.length === 0) {
    console.error("[adofy] ADOFY_ADMIN_EMAILS が未設定のためアクセスを拒否しました");
    return null;
  }

  if (!list.includes(user.email.toLowerCase())) return null;

  return { user: { id: user.id, email: user.email } };
}

/** 許可リストが未設定かどうか（設定漏れを画面で案内するために使う） */
export function isAdofyAccessConfigured(): boolean {
  return allowedEmails().length > 0;
}

export function forbiddenResponse() {
  // 権限が無いことは伝えるが、内部の構造は明かさない
  return NextResponse.json({ error: "この操作を行う権限がありません" }, { status: 403 });
}
