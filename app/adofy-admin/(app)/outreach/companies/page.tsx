import Link from "next/link";
import { Plus, Search } from "lucide-react";
import CompaniesTable from "@/components/outreach-admin/CompaniesTable";
import { getOutreachDb } from "@/lib/outreach/access";
import type { CompanyRow } from "@/lib/outreach/companies";
import { ADMIN_BASE, TABLES, TEST_BATCH_SIZE } from "@/lib/outreach/constants";
import { escapeLike, pgQuote } from "@/lib/outreach/normalize";

export const dynamic = "force-dynamic";
export const metadata = { title: "営業先企業｜ドラテク営業" };

const PAGE_SIZE = 50;

/** 絞り込み（f=...）。key は URL、label は画面表示 */
const FILTERS = [
  { key: "all", label: "全企業" },
  { key: "review", label: "確認待ち" },
  { key: "has_email", label: "メールあり" },
  { key: "no_email", label: "メールなし" },
  { key: "contact_form", label: "問い合わせフォームのみ" },
  { key: "phone_only", label: "電話番号のみ" },
  { key: "unchecked", label: "未確認（HP）" },
  { key: "checked", label: "確認済み（HP）" },
  { key: "approved", label: "送信OK" },
  { key: "excluded", label: "除外" },
  { key: "unsent", label: "未送信" },
  { key: "sent", label: "送信済み" },
  { key: "replied", label: "返信あり" },
  { key: "error", label: "エラー" },
  { key: "unsubscribed", label: "配信停止" },
  { key: "refusal", label: "送信お断り表示" },
  { key: "inquired", label: "問い合わせあり" },
  { key: "contracted", label: "契約" },
] as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyFilter(q: any, f: string) {
  switch (f) {
    case "review":
      return q.eq("email_status", "found").eq("review_status", "pending").eq("refusal_notice", false);
    case "has_email": return q.eq("email_status", "found");
    case "no_email": return q.eq("email_status", "none");
    case "contact_form": return q.neq("email_status", "found").not("contact_form_url", "is", null);
    case "phone_only": return q.neq("email_status", "found").not("phone", "is", null);
    case "unchecked": return q.eq("crawl_status", "pending");
    case "checked": return q.neq("crawl_status", "pending");
    case "approved": return q.eq("review_status", "approved");
    case "excluded": return q.eq("review_status", "excluded");
    case "unsent": return q.eq("email_status", "found").eq("outreach_status", "unsent").neq("review_status", "excluded").eq("refusal_notice", false);
    case "sent": return q.not("last_sent_at", "is", null);
    case "replied": return q.not("replied_at", "is", null);
    case "error": return q.in("outreach_status", ["error", "bounced"]);
    case "unsubscribed": return q.not("unsubscribed_at", "is", null);
    case "refusal": return q.eq("refusal_notice", true);
    case "inquired": return q.not("inquired_at", "is", null);
    case "contracted": return q.not("contracted_at", "is", null);
    default: return q;
  }
}

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ f?: string; q?: string; p?: string }>;
}) {
  const { db } = (await getOutreachDb())!;
  const sp = await searchParams;
  const f = FILTERS.some((x) => x.key === sp.f) ? sp.f! : "all";
  const q = (sp.q ?? "").trim().slice(0, 100);
  const page = Math.max(1, Number(sp.p) || 1);
  const isReview = f === "review";

  let query = db.from(TABLES.companies).select("*", { count: "exact" });
  query = applyFilter(query, f);
  if (q) {
    const like = pgQuote(`%${escapeLike(q)}%`);
    query = query.or(
      ["company_name", "corporate_name", "email", "phone", "prefecture", "city", "address", "website_url"].map((c) => `${c}.ilike.${like}`).join(",")
    );
  }
  // 確認待ちは取得の古い順（最初に取得した企業から確認する）、それ以外は新しい順
  query = isReview
    ? query.order("created_at", { ascending: true })
    : query.order("updated_at", { ascending: false });
  const size = isReview ? TEST_BATCH_SIZE : PAGE_SIZE;
  const from = (page - 1) * size;
  const { data, count, error } = await query.range(from, from + size - 1);
  const rows = (data ?? []) as CompanyRow[];
  const total = count ?? 0;
  const pages = Math.max(1, Math.ceil(total / size));

  const href = (patch: Record<string, string | number | undefined>) => {
    const p = new URLSearchParams();
    const merged = { f, q, p: page, ...patch };
    if (merged.f && merged.f !== "all") p.set("f", String(merged.f));
    if (merged.q) p.set("q", String(merged.q));
    if (merged.p && Number(merged.p) > 1) p.set("p", String(merged.p));
    const s = p.toString();
    return `${ADMIN_BASE}/companies${s ? `?${s}` : ""}`;
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h1 className="text-xl font-bold text-slate-900">営業先企業</h1>
        <span className="text-sm text-slate-500">{total.toLocaleString()}社</span>
        <Link
          href={`${ADMIN_BASE}/sources`}
          className="ml-auto inline-flex items-center gap-1 rounded-lg bg-[#0a1f4e] px-3 py-2 text-sm font-bold text-white"
        >
          <Plus className="h-4 w-4" /> 営業先を取得
        </Link>
      </div>

      <form action={`${ADMIN_BASE}/companies`} className="mb-3 flex gap-2">
        {f !== "all" && <input type="hidden" name="f" value={f} />}
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            name="q"
            defaultValue={q}
            placeholder="会社名・メール・電話・地域で検索"
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-base sm:text-sm"
          />
        </div>
        <button className="shrink-0 rounded-lg bg-slate-800 px-4 text-sm font-bold text-white">検索</button>
      </form>

      <div className="-mx-4 mb-4 flex gap-1.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {FILTERS.map((x) => (
          <Link
            key={x.key}
            href={href({ f: x.key, p: 1 })}
            className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-bold ${
              f === x.key ? "border-[#0a1f4e] bg-[#0a1f4e] text-white" : "border-slate-200 bg-white text-slate-600"
            }`}
          >
            {x.label}
          </Link>
        ))}
      </div>

      {isReview && (
        <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
          <p className="font-bold">送信候補の目視確認（取得の古い順に{TEST_BATCH_SIZE}社ずつ）</p>
          <p className="mt-1 text-xs leading-relaxed">
            メールアドレスが載っていたページを開き、①運送会社であること ②法人の窓口アドレスであること（個人名のアドレスでないこと）
            ③「営業メールお断り」等の記載が無いこと を確認して「送信OK」にしてください。
            テスト送信は「送信OK」の企業にだけ行い、確認していない企業には送りません。
          </p>
        </div>
      )}

      {error ? (
        <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
          読み込めませんでした。migration 010 が適用されているか確認してください。
        </p>
      ) : (
        <CompaniesTable rows={rows} reviewMode={isReview} />
      )}

      {pages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
          {page > 1 && (
            <Link href={href({ p: page - 1 })} className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-bold">
              前へ
            </Link>
          )}
          <span className="text-slate-500">
            {page} / {pages}
          </span>
          {page < pages && (
            <Link href={href({ p: page + 1 })} className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-bold">
              次へ
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
