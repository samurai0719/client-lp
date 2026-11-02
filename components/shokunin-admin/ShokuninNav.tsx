import Link from "next/link";

/** 職人採用エージェント管理のサブナビ */
export default function ShokuninNav({ current }: { current: "candidates" | "companies" }) {
  const item = (href: string, label: string, active: boolean) => (
    <Link href={href} className={`rounded-lg px-3 py-2 text-sm font-bold ${active ? "bg-[#0a1f4e] text-white" : "text-slate-600 hover:bg-slate-100"}`}>
      {label}
    </Link>
  );
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <span className="mr-1 rounded-md bg-orange-50 px-2 py-1 text-xs font-black text-orange-700">職人採用エージェント</span>
      {item("/adofy-admin/shokunin", "職人登録", current === "candidates")}
      {item("/adofy-admin/shokunin/companies", "企業の問い合わせ", current === "companies")}
    </div>
  );
}
