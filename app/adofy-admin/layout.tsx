import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdofyAccess, isAdofyAccessConfigured } from "@/lib/auth/adofyCheck";

export const metadata: Metadata = {
  title: "adofy 管理画面",
  description: "adofyの無料相談・顧客管理",
  robots: { index: false, follow: false },
};

/*
  adofy専用の管理画面。
  高長建設の /admin とは完全に別の入口にしている。
  /admin には提携先の外構業者もログインするため、
  そこから adofy のデータへ到達できてはいけない。
*/
export default async function AdofyAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 未ログインならログイン画面へ
  if (!user) redirect("/admin/login");

  const access = await requireAdofyAccess(supabase);

  // ログイン済みだが権限が無い場合は、
  // ログイン画面へ戻さず理由を表示する（戻されると原因が分からないため）
  if (!access) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center">
          <h1 className="text-lg font-bold text-slate-900">
            この画面を開く権限がありません
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            現在ログイン中のアカウント
            <br />
            <span className="font-bold text-slate-900">{user.email}</span>
            <br />
            には adofy 管理画面の権限が付いていません。
          </p>

          {!isAdofyAccessConfigured() && (
            <p className="mt-4 rounded-lg bg-amber-50 p-3 text-left text-xs leading-relaxed text-amber-900">
              サーバー側の許可リスト（環境変数 <code>ADOFY_ADMIN_EMAILS</code>）が
              未設定です。設定すると、このアカウントで開けるようになります。
            </p>
          )}

          <div className="mt-5 flex flex-col gap-2">
            <Link
              href="/admin"
              className="rounded-lg border border-slate-300 py-2.5 text-sm font-bold text-slate-700"
            >
              高長建設の管理画面へ
            </Link>
            <Link
              href="/admin/login"
              className="rounded-lg py-2 text-sm font-semibold text-slate-500"
            >
              別のアカウントでログイン
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <div className="min-h-screen bg-slate-50">{children}</div>;
}
