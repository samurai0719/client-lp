import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import AdofyAdminShell from "@/components/adofy-admin/AdofyAdminShell";
import { getAuthorizedLeadsDb } from "@/lib/saiyoRescue/adminAccess";
import { formatJst } from "@/lib/saiyoRescue/leads";
import { SHOKUNIN_STATUS_LABEL, SHOKUNIN_STATUS_STYLE, ageOf, type ShokuninRow } from "@/lib/shokuninCandidates/admin";
import ShokuninEditor from "./ShokuninEditor";

export const dynamic = "force-dynamic";
export const metadata = { title: "職人の詳細｜adofy 管理画面" };

export default async function ShokuninDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthorizedLeadsDb();
  if (!auth) notFound();
  const { id } = await params;

  const { data } = await auth.db.from("shokunin_candidates").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const c = data as ShokuninRow;

  const answers: [string, string | null][] = [
    ["今のお気持ち", c.motivation],
    ["転職希望時期", c.desired_timing],
    ["経験職種", c.experienced_trades.join("、")],
    ["建設業の経験", c.experience_years],
    ["希望する仕事", c.desired_trades.join("、")],
    ["現在の状況", c.employment_status],
    ["希望勤務エリア", [c.desired_area, c.desired_prefecture].filter(Boolean).join(" ")],
    ["重視すること", c.top_priority],
    ["希望年収", c.desired_salary],
    ["希望や質問", c.comment],
  ];
  const source: [string, string | null][] = [
    ["utm_source", c.utm_source],
    ["utm_medium", c.utm_medium],
    ["utm_campaign", c.utm_campaign],
    ["utm_content", c.utm_content],
    ["utm_term", c.utm_term],
    ["参照元", c.referrer],
    ["ランディング", c.landing_url],
  ];

  return (
    <AdofyAdminShell>
      <div className="p-4 sm:p-6">
        <Link href="/adofy-admin/shokunin" className="mb-3 inline-flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-slate-800">
          <ChevronLeft className="h-4 w-4" />
          職人の一覧
        </Link>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-bold text-slate-900">{c.name}</h1>
          <span className="text-sm text-slate-500">
            {c.birth_year}年生まれ（{ageOf(c.birth_year)}歳）
          </span>
          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${SHOKUNIN_STATUS_STYLE[c.status] ?? "bg-slate-100"}`}>{SHOKUNIN_STATUS_LABEL[c.status] ?? c.status}</span>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
          <div className="grid content-start gap-4">
            <section className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
              <h2 className="mb-2 text-sm font-black text-slate-700">連絡先</h2>
              <Dl
                rows={[
                  ["電話番号", <a key="tel" href={`tel:${c.phone}`} className="font-bold text-blue-700 underline">{c.phone}</a>],
                  ["メール", c.email],
                  ["連絡希望", c.contact_time],
                  ["住所", [c.postal_code && `〒${c.postal_code}`, c.current_prefecture, c.current_city].filter(Boolean).join(" ")],
                ]}
              />
            </section>
            <section className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
              <h2 className="mb-2 text-sm font-black text-slate-700">登録時の回答</h2>
              <Dl rows={answers} />
            </section>
          </div>

          <div className="grid content-start gap-4">
            <ShokuninEditor id={c.id} status={c.status} memo={c.admin_memo ?? ""} />
            <section className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
              <h2 className="mb-2 text-sm font-black text-slate-700">登録情報</h2>
              <p>登録 {formatJst(c.created_at)}</p>
              <p>更新 {formatJst(c.updated_at)}</p>
              {c.last_contacted_at && <p>最終連絡 {formatJst(c.last_contacted_at)}</p>}
              <p>同意 {formatJst(c.privacy_consent_at)}</p>
              <div className="mt-3 break-all">
                <Dl rows={source.filter(([, v]) => v)} />
              </div>
            </section>
          </div>
        </div>
      </div>
    </AdofyAdminShell>
  );
}

function Dl({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <dl className="grid gap-1.5">
      {rows.map(([k, v]) => (
        <div key={k} className="grid grid-cols-[7rem_1fr] gap-2">
          <dt className="text-slate-500">{k}</dt>
          <dd className="min-w-0 whitespace-pre-wrap break-words text-slate-800">{v || "—"}</dd>
        </div>
      ))}
    </dl>
  );
}
