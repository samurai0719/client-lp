"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, MessageSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/check";

/*
  adofy専用の管理画面の外枠。
  高長建設の AdminShell とは別物にしている（同じ画面から相互に行き来できないようにするため）。
*/
export default function AdofyAdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  async function handleLogout() {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link href="/adofy-admin/consultations" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0b2440] text-sm font-bold text-white">
              ad
            </span>
            <span className="text-sm font-bold text-slate-900">adofy 管理画面</span>
          </Link>

          <nav className="ml-4 flex items-center gap-1">
            <Link
              href="/adofy-admin/consultations"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100"
            >
              <MessageSquare className="h-4 w-4" />
              無料相談
            </Link>
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          >
            <LogOut className="h-4 w-4" />
            ログアウト
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl">{children}</main>
    </div>
  );
}
