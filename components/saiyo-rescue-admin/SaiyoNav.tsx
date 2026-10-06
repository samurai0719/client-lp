import Link from "next/link";

/** 採用レスキュー管理のサブナビ */
export default function SaiyoNav({ current }: { current: "dashboard" | "leads" }) {
  const item = (href: string, label: string, active: boolean) => (
    <Link
      href={href}
      className={`rounded-lg px-3 py-2 text-sm font-bold ${active ? "bg-[#0a1f4e] text-white" : "text-slate-600 hover:bg-slate-100"}`}
    >
      {label}
    </Link>
  );
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <span className="mr-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-black text-blue-700">採用レスキュー</span>
      {item("/adofy-admin/saiyo-rescue", "ダッシュボード", current === "dashboard")}
      {item("/adofy-admin/saiyo-rescue/leads", "問い合わせ一覧", current === "leads")}
    </div>
  );
}
