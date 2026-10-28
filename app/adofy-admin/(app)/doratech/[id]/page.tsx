import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Mail, Phone } from "lucide-react";
import AdofyAdminShell from "@/components/adofy-admin/AdofyAdminShell";
import { getAuthorizedLeadsDb } from "@/lib/saiyoRescue/adminAccess";
import { formatJst } from "@/lib/saiyoRescue/leads";
import { POSTING_STATUS_LABEL, POSTING_STATUS_STYLE, type PostingRow } from "@/lib/driverCompany/admin";
import { CONSENTS, fromRows, toDisplayRows } from "@/lib/types/driverJobRegistration";

export const dynamic = "force-dynamic";

export const metadata = { title: "求人登録の詳細｜ドラテク" };

/** 1件の求人登録の詳細。入力フォームと同じSTEP・ラベルで全項目を表示する */
export default async function DoratechPostingPage({ params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthorizedLeadsDb();
  if (!auth) notFound();

  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const { data } = await auth.db.from("driver_job_postings").select("*, driver_companies(*)").eq("id", id).maybeSingle();
  if (!data) notFound();

  const posting = data as PostingRow;
  const company = posting.driver_companies;

  // 同じ企業が登録している他の求人（複数職種・複数求人の把握用）
  const { data: siblings } = await auth.db
    .from("driver_job_postings")
    .select("id, job_title, status, created_at")
    .eq("company_id", posting.company_id)
    .neq("id", posting.id)
    .order("created_at", { ascending: false });

  const sections = toDisplayRows(fromRows(company ?? {}, posting));
  const consents = posting.consents ?? {};

  return (
    <AdofyAdminShell>
      <div className="p-4 sm:p-6">
        <Link href="/adofy-admin/doratech/postings" className="mb-3 inline-flex items-center text-sm font-bold text-blue-700">
          <ChevronLeft className="h-4 w-4" />
          一覧へ戻る
        </Link>

        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-500">{formatJst(posting.created_at)} 登録</p>
              <h1 className="mt-1 text-xl font-bold text-slate-900">{company?.company_name ?? "（企業情報なし）"}</h1>
              <p className="mt-1 text-slate-700">{posting.job_title}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-sm font-bold ${POSTING_STATUS_STYLE[posting.status] ?? "bg-slate-100 text-slate-600"}`}>
              {POSTING_STATUS_LABEL[posting.status] ?? posting.status}
            </span>
          </div>

          {company && (
            <div className="mt-4 flex flex-wrap gap-2">
              <a href={`tel:${company.phone}`} className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-800">
                <Phone className="h-4 w-4" />
                {company.phone}
              </a>
              <a href={`mailto:${company.notification_email}`} className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-800">
                <Mail className="h-4 w-4" />
                {company.notification_email}
              </a>
            </div>
          )}

          <dl className="mt-4 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
            <Meta label="メール認証" value={company?.email_verified_at ? `済（${formatJst(company.email_verified_at)}）` : "未認証"} />
            <Meta label="掲載開始" value={posting.published_at ? formatJst(posting.published_at) : "—"} />
            <Meta label="流入元" value={posting.utm_source ?? (posting.referrer ? posting.referrer : "直接アクセス")} />
            <Meta label="キャンペーン" value={(posting.utm_campaign as string | null) ?? "—"} />
          </dl>
        </div>

        {sections.map((s) => (
          <section key={s.step} className="mt-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
            <h2 className="mb-3 text-base font-bold text-slate-900">{s.step}</h2>
            <dl className="divide-y divide-slate-100">
              {s.rows.map((r) => (
                <div key={r.label} className="grid gap-1 py-2 text-sm sm:grid-cols-[200px_1fr] sm:gap-4">
                  <dt className="font-bold text-slate-500">{r.label}</dt>
                  <dd className={`whitespace-pre-wrap break-words ${r.value === "未入力" ? "text-slate-400" : "text-slate-900"}`}>{r.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}

        <section className="mt-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <h2 className="mb-3 text-base font-bold text-slate-900">登録時の同意</h2>
          <ul className="space-y-1 text-sm">
            {CONSENTS.map((c) => (
              <li key={c.key} className={consents[c.key] ? "text-slate-900" : "text-rose-600"}>
                {consents[c.key] ? "✓" : "✗"} {c.label}
              </li>
            ))}
          </ul>
          {posting.consented_at ? (
            <p className="mt-2 text-xs text-slate-500">同意日時：{formatJst(posting.consented_at as string)}</p>
          ) : null}
        </section>

        {siblings && siblings.length > 0 && (
          <section className="mt-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
            <h2 className="mb-3 text-base font-bold text-slate-900">同じ企業の他の求人（{siblings.length}件）</h2>
            <ul className="divide-y divide-slate-100">
              {siblings.map((s) => (
                <li key={s.id as string}>
                  <Link href={`/adofy-admin/doratech/${s.id}`} className="flex items-center gap-2 py-2 text-sm hover:bg-slate-50">
                    <span className="min-w-0 flex-1 truncate font-bold text-slate-800">{s.job_title as string}</span>
                    <span className="text-xs text-slate-500">{formatJst(s.created_at as string, false)}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${POSTING_STATUS_STYLE[s.status as string] ?? "bg-slate-100"}`}>
                      {POSTING_STATUS_LABEL[s.status as string] ?? (s.status as string)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </AdofyAdminShell>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="shrink-0 font-bold text-slate-500">{label}</dt>
      <dd className="min-w-0 truncate text-slate-800">{value}</dd>
    </div>
  );
}
