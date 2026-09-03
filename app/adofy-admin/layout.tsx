import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdofyAccess } from "@/lib/auth/adofyCheck";

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
  const access = await requireAdofyAccess(supabase);
  if (!access) redirect("/admin/login");

  return <div className="min-h-screen bg-slate-50">{children}</div>;
}
