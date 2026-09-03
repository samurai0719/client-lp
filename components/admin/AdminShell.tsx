"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/check";
import {
  Users,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { href: "/admin/leads", label: "顧客", icon: Users, exact: false },
  { href: "/admin/schedule", label: "予定", icon: Calendar, exact: false },
  { href: "/admin/ads", label: "広告", icon: BarChart3, exact: false },
  { href: "/admin/settings", label: "設定", icon: Settings, exact: false },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    router.push("/admin/login");
    router.refresh();
  }

  function isActive(item: (typeof navItems)[number]) {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  const Sidebar = ({ onClose }: { onClose?: () => void }) => (
    <nav className="flex flex-col h-full">
      <div className="p-5 flex items-center justify-between border-b border-[#e7e3d8]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#174f3f] flex items-center justify-center shrink-0">
            <span className="text-white text-sm font-bold">TN</span>
          </div>
          <div>
            <p className="text-sm font-bold text-[#10302a] leading-tight">高長建設</p>
            <p className="text-xs text-[#6b7a73]">顧客管理</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 text-[#6b7a73]">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <ul className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#174f3f] text-white"
                    : "text-[#3d4a45] hover:bg-[#f0ece0]"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="p-3 border-t border-[#e7e3d8]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#6b7a73] hover:bg-red-50 hover:text-red-600 w-full transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          ログアウト
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#f8f6ef] flex">
      {/* デスクトップサイドバー */}
      <aside className="hidden lg:flex lg:flex-col w-56 shrink-0 bg-white border-r border-[#e7e3d8] sticky top-0 h-screen">
        <Sidebar />
      </aside>

      {/* モバイルオーバーレイ */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#e7e3d8] transform transition-transform lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* モバイルヘッダー */}
        <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-[#e7e3d8] px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 text-[#3d4a45] hover:bg-[#f0ece0] rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#174f3f] flex items-center justify-center">
              <span className="text-white text-xs font-bold">TN</span>
            </div>
            <span className="text-sm font-bold text-[#10302a]">高長建設 顧客管理</span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 pb-24 lg:pb-6">{children}</main>

        {/* モバイル下部ナビ */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#e7e3d8] safe-bottom">
          <ul className="flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);
              return (
                <li key={item.href} className="flex-1">
                  <Link
                    href={item.href}
                    className={`flex flex-col items-center gap-0.5 py-2 px-1 text-center transition-colors ${
                      active ? "text-[#174f3f]" : "text-[#8a9a90]"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[10px] font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="h-[env(safe-area-inset-bottom)]" />
        </nav>
      </div>
    </div>
  );
}
