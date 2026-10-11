import Link from "next/link";
import { AlertCircle, ChevronRight, Download, Search } from "lucide-react";
import AdofyAdminShell from "@/components/adofy-admin/AdofyAdminShell";
import { createAdminClient } from "@/lib/supabase/admin";
import { STATUSES, industryText } from "@/lib/hpDesign/options";
import { STATUS_STYLES, isMissingTable, type HpDesignRequest } from "@/lib/hpDesign/admin";
import { formatJst } from "@/lib/hpDesign/server";
import StatusSelect from "./StatusSelect";

export const dynamic = "force-dynamic";

/* adofy 無料ホームページデザインの申し込み一覧。権限の確認は app/adofy-admin/(app)/layout.tsx で行う */

type Search = { q?: string; status?: string };

export default async function HpDesignListPage({ searchParams }: { searchParams: Promise<Search> }) {
  const { q = "", status = "" } = await searchParams;
  const db = createAdminClient();

  let query = db
    .from("hp_design_requests")
    .select("id, created_at, company_name, company_undecided, industry, industry_other, industry_detail, contact_name, email, phone, status, purchase_requested_at, design_email_status", { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(200);

  if (status && STATUSES.some((s) => s.id === status)) query = query.eq("status", status);
  const term = q.trim().replace(/[%,()]/g, " ").slice(0, 50);
  if (term) {
    const like = `%${term}%`;
    query = query.or(`company_name.ilike.${like},contact_name.ilike.${like},email.ilike.${like},phone.ilike.${like}`);
  }

  const { data, error, count } = await query;
  const rows = (data ?? []) as Pick<
    HpDesignRequest,
    "id" | "created_at" | "company_name" | "company_undecided" | "industry" | "industry_other" | "industry_detail" | "contact_name" | "email" | "phone" | "status" | "purchase_requested_at" | "design_email_status"
  >[];

  const csvHref = `/api/adofy-admin/hp-design/csv${status ? `?status=${encodeURIComponent(status)}` : ""}`;

  return (
    <AdofyAdminShell>
      <div className="p-4 sm:p-6">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900">無料デザイン申し込み</h1>
            <p className="mt-1 text-sm text-slate-500">
              チャットから届いたホームページデザインの申し込み
              {!error && <span className="ml-2 font-semibold text-slate-700">全 {count ?? 0} 件</span>}
            </p>
          </div>
          <a href={csvHref} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">
            <Download className="h-4 w-4" />
            CSVダウンロード
          </a>
        </div>

        <form className="mb-4 flex flex-col gap-2 sm:flex-row" action="/adofy-admin/hp-design">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="会社名・担当者・メール・電話で検索"
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-base outline-none focus:border-slate-500"
            />
          </div>
          <select name="status" defaultValue={status} className="rounded-lg border border-slate-300 px-3 py-2.5 text-base outline-none" aria-label="ステータスで絞り込む">
            <option value="">すべてのステータス</option>
            {STATUSES.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
          <button className="rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-bold text-white">絞り込む</button>
        </form>

        {error ? (
          <p className="flex items-start gap-2 rounded-lg border border-rose-300 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-none" />
            {isMissingTable(error)
              ? "申し込み用のテーブルがまだありません。supabase/migrations/013_hp_design_requests.sql を Supabase の SQL Editor で実行してください。"
              : "データの取得に失敗しました。時間をおいて再読み込みしてください。"}
          </p>
        ) : rows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center">
            <p className="text-sm text-slate-500">該当する申し込みはまだありません。</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {rows.map((r) => (
              <li key={r.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="flex flex-wrap items-center gap-3 p-4">
                  <Link href={`/adofy-admin/hp-design/${r.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate font-bold text-slate-900">
                          {r.company_name ?? (r.company_undecided ? "（会社名未定）" : "—")}
                        </span>
                        {r.purchase_requested_at && (
                          <span className="flex-none rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] font-bold text-white">購入希望あり</span>
                        )}
                        {r.design_email_status === "failed" && (
                          <span className="flex-none rounded-full bg-rose-600 px-2 py-0.5 text-[11px] font-bold text-white">送付失敗</span>
                        )}
                      </span>
                      <span className="mt-0.5 block truncate text-sm font-bold text-slate-800">
                        <span className="mr-1.5 text-[11px] text-slate-400">ご担当者</span>
                        {r.contact_name}
                      </span>
                      <span className="block truncate text-xs text-slate-500">
                        {industryText(r.industry, r.industry_other, r.industry_detail) || "—"} ／ {r.email}
                        {r.phone ? ` ／ ${r.phone}` : ""}
                      </span>
                      <span className="block text-xs text-slate-400">{formatJst(r.created_at)}</span>
                    </span>
                    <ChevronRight className="h-4 w-4 flex-none text-slate-300" />
                  </Link>
                  <StatusSelect id={r.id} value={r.status} className={STATUS_STYLES[r.status] ?? STATUS_STYLES.new} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdofyAdminShell>
  );
}
