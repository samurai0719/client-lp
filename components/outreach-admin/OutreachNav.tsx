"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_BASE } from "@/lib/outreach/constants";

const items = [
  { href: ADMIN_BASE, label: "ダッシュボード", exact: true },
  { href: `${ADMIN_BASE}/companies`, label: "営業先企業" },
  { href: `${ADMIN_BASE}/sources`, label: "営業先の取得" },
  { href: `${ADMIN_BASE}/campaigns`, label: "営業メール" },
  { href: `${ADMIN_BASE}/import`, label: "CSV登録" },
  { href: `${ADMIN_BASE}/settings`, label: "設定" },
];

/** 営業メール管理のサブナビ（スマホでは横スクロール） */
export default function OutreachNav() {
  const pathname = usePathname();
  return (
    <div className="-mx-4 mb-4 flex items-center gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
      <span className="shrink-0 rounded-md bg-amber-50 px-2 py-1 text-xs font-black text-amber-700">ドラテク営業</span>
      {items.map((it) => {
        const active = it.exact ? pathname === it.href : pathname.startsWith(it.href);
        return (
          <Link
            key={it.href}
            href={it.href}
            className={`shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-bold ${
              active ? "bg-[#0a1f4e] text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {it.label}
          </Link>
        );
      })}
    </div>
  );
}
