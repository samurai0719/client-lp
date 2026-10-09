import SourceJobForm from "@/components/outreach-admin/SourceJobForm";
import JobActions from "@/components/outreach-admin/JobActions";
import { getOutreachDb } from "@/lib/outreach/access";
import { JOB_STATUS_LABEL, SOURCE_LABEL, TABLES } from "@/lib/outreach/constants";
import { formatJst } from "@/lib/outreach/format";
import { sourceConfigured, type JobRow } from "@/lib/outreach/sources";

export const dynamic = "force-dynamic";
export const metadata = { title: "営業先の取得｜ドラテク営業" };

export default async function SourcesPage() {
  const { db } = (await getOutreachDb())!;
  const { data, error } = await db.from(TABLES.jobs).select("*").order("created_at", { ascending: false }).limit(30);
  const jobs = (data ?? []) as JobRow[];
  const { count: pendingCrawl } = await db.from(TABLES.companies).select("id", { count: "exact", head: true }).eq("crawl_status", "pending");

  return (
    <div>
      <h1 className="mb-1 text-xl font-bold text-slate-900">営業先の取得</h1>
      <p className="mb-4 text-sm leading-relaxed text-slate-600">
        運送会社の情報を自動で集めてDBに登録します。登録後、公式HPを自動で確認し、
        <b>HPに公開されている法人窓口のメールアドレス（info@・recruit@・soumu@ など）だけ</b>を送信候補にします。
        個人名のアドレス・フリーメール・別ドメインのアドレスは集めず、アドレスの推測もしません。
        HPに「営業メールお断り」等の表示がある会社は送信対象から自動で外します。
      </p>

      <ol className="mb-5 grid gap-2 text-xs sm:grid-cols-5">
        {["運送会社情報を取得", "重複を除いてDB登録", "公式HPを確認・公開メール取得", "確認待ち100社を目視確認", "テスト100件 → 残りへ送信"].map((s, i) => (
          <li key={s} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2.5 font-bold text-slate-700">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0a1f4e] text-white">{i + 1}</span>
            {s}
          </li>
        ))}
      </ol>

      <SourceJobForm
        configured={{
          gbizinfo: sourceConfigured("gbizinfo"),
          google_places: sourceConfigured("google_places"),
          url_list: true,
        }}
      />

      <section className="mt-6">
        <h2 className="mb-2 flex flex-wrap items-center gap-2 font-bold text-slate-900">
          取得ジョブ
          <span className="text-xs font-normal text-slate-500">HP確認待ち {(pendingCrawl ?? 0).toLocaleString()}社（自動処理で少しずつ確認します）</span>
        </h2>
        {error && <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">読み込めませんでした。migration 010 を適用してください。</p>}
        {jobs.length === 0 ? (
          <p className="rounded-xl border border-slate-200 bg-white py-8 text-center text-sm text-slate-400">まだ取得ジョブはありません。</p>
        ) : (
          <ul className="space-y-2">
            {jobs.map((j) => {
              const prefs = j.params.prefectures?.length ? j.params.prefectures.join("・") : j.source === "url_list" ? "" : "全国";
              return (
                <li key={j.id} className="rounded-xl border border-slate-200 bg-white p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900">{SOURCE_LABEL[j.source] ?? j.source}</span>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">{JOB_STATUS_LABEL[j.status] ?? j.status}</span>
                    <span className="text-xs text-slate-400">{formatJst(j.created_at)}</span>
                    <JobActions id={j.id} status={j.status} />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {j.source === "url_list" ? `URL ${j.params.urls?.length ?? 0}件` : `${prefs}／${j.params.keywords?.length ? j.params.keywords.join("・") : "既定のキーワード"}`}
                    {j.params.max_companies ? `／上限 ${j.params.max_companies}社` : ""}
                  </p>
                  <p className="mt-1 text-sm text-slate-700">
                    取得 <b>{j.found_count.toLocaleString()}</b>件・新規登録 <b>{j.inserted_count.toLocaleString()}</b>社・重複除外{" "}
                    <b>{j.duplicate_count.toLocaleString()}</b>件
                  </p>
                  {j.last_error && <p className="mt-1 text-xs text-rose-600">{j.last_error}</p>}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
