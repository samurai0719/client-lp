import Link from "next/link";

export type DoratechSection = "home" | "candidates" | "companies" | "interviews" | "billing" | "postings";

const ITEMS: [DoratechSection, string, string][] = [
  ["home", "/adofy-admin/doratech", "ホーム"],
  ["candidates", "/adofy-admin/doratech/candidates", "求職者"],
  ["companies", "/adofy-admin/doratech/companies", "企業"],
  ["interviews", "/adofy-admin/doratech/interviews", "面接希望"],
  ["billing", "/adofy-admin/doratech/billing", "成約・請求"],
  ["postings", "/adofy-admin/doratech/postings", "求人登録"],
];

/** ドラテク管理のサブナビ */
export default function DoratechNav({ current }: { current: DoratechSection }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <span className="mr-1 rounded-md bg-amber-100 px-2 py-1 text-xs font-black text-amber-800">ドラテク</span>
      {ITEMS.map(([key, href, label]) => (
        <Link
          key={key}
          href={href}
          className={`rounded-lg px-3 py-2 text-sm font-bold ${current === key ? "bg-[#0a1f4e] text-white" : "text-slate-600 hover:bg-slate-100"}`}
        >
          {label}
        </Link>
      ))}
      <Link href="/adofy-admin/outreach" className="rounded-lg px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100">
        営業メール
      </Link>
    </div>
  );
}
