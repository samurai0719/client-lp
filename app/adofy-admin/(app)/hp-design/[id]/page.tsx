/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import AdofyAdminShell from "@/components/adofy-admin/AdofyAdminShell";
import { createAdminClient } from "@/lib/supabase/admin";
import { UPLOAD_BUCKET } from "@/lib/hpDesign/options";
import { EMAIL_KIND_LABELS, type HpDesignEmailLog, type HpDesignRequest } from "@/lib/hpDesign/admin";
import { answerLines } from "@/lib/hpDesign/mail";
import { formatJst } from "@/lib/hpDesign/server";
import StatusSelect from "../StatusSelect";
import DetailActions from "./DetailActions";

export const dynamic = "force-dynamic";

/* 権限の確認は app/adofy-admin/(app)/layout.tsx で行っている */
export default async function HpDesignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const db = createAdminClient();
  const [{ data }, { data: logs }] = await Promise.all([
    db.from("hp_design_requests").select("*").eq("id", id).maybeSingle(),
    db.from("hp_design_email_logs").select("id, kind, to_email, status, error, created_at").eq("request_id", id).order("created_at", { ascending: false }),
  ]);
  if (!data) notFound();
  const r = data as HpDesignRequest;

  // 画像は非公開バケットにあるため、1時間だけ有効な署名付きURLで表示する
  const files = r.uploaded_files ?? [];
  const signed = files.length
    ? (await db.storage.from(UPLOAD_BUCKET).createSignedUrls(files.map((f) => f.path), 60 * 60)).data ?? []
    : [];

  const company = r.company_name ?? (r.company_undecided ? "（会社名未定）" : "—");

  return (
    <AdofyAdminShell>
      <div className="p-4 sm:p-6">
        <Link href="/adofy-admin/hp-design" className="mb-4 inline-flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-slate-800">
          <ArrowLeft className="h-4 w-4" />
          申し込み一覧へ
        </Link>

        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900">{company}</h1>
            <p className="mt-1 text-sm text-slate-500">申し込み日時：{formatJst(r.created_at)}</p>
          </div>
          <StatusSelect id={r.id} value={r.status} />
        </div>

        {r.purchase_requested_at && (
          <div className="mb-5 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900">
            <p className="font-bold">お客様から購入希望が届いています（{formatJst(r.purchase_requested_at)}）</p>
            {r.purchase_message && <p className="mt-1 whitespace-pre-wrap">{r.purchase_message}</p>}
            <p className="mt-2 text-xs">料金と契約条件をメールでご案内し、合意を確認してから「購入済み」に変更してください。</p>
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            <Section title="連絡先">
              <Dl rows={[
                ["ご担当者", r.contact_name],
                ["メール", <a key="m" href={`mailto:${r.email}`} className="text-blue-700 underline">{r.email}</a>],
                ["電話番号", r.phone ? <a key="p" href={`tel:${r.phone}`} className="text-blue-700 underline">{r.phone}</a> : "未入力"],
                ["同意日時", formatJst(r.consented_at)],
              ]} />
            </Section>

            <Section title="ヒアリング内容">
              <Dl rows={answerLines(r).map(([k, v]) => [k, v])} />
            </Section>

            <Section title="URL">
              <div className="space-y-2 text-sm">
                <p className="font-bold text-slate-500">現在のホームページ</p>
                {r.website_url ? <ExtLink href={r.website_url} /> : <p className="text-slate-400">なし</p>}
                <p className="pt-2 font-bold text-slate-500">参考にしたいホームページ</p>
                {r.reference_urls?.length ? r.reference_urls.map((u) => <ExtLink key={u} href={u} />) : <p className="text-slate-400">なし</p>}
              </div>
            </Section>

            <Section title={`アップロード画像（${files.length}点）`}>
              {files.length === 0 ? (
                <p className="text-sm text-slate-400">アップロードはありません。</p>
              ) : (
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {files.map((f, i) => {
                    const url = signed[i]?.signedUrl;
                    const previewable = !/heic|heif/i.test(f.type);
                    return (
                      <li key={f.path} className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                        {url && previewable ? (
                          <a href={url} target="_blank" rel="noopener noreferrer">
                            <img src={url} alt={f.name} className="aspect-square w-full object-cover" loading="lazy" />
                          </a>
                        ) : (
                          <div className="flex aspect-square items-center justify-center text-xs text-slate-400">{previewable ? "表示できません" : "HEIC（ダウンロードして確認）"}</div>
                        )}
                        <div className="flex items-center justify-between gap-2 p-2 text-xs">
                          <span className="truncate">{f.name}</span>
                          {url && <a href={`${url}&download=${encodeURIComponent(f.name)}`} className="flex-none font-bold text-blue-700">保存</a>}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Section>

            <Section title="流入元">
              <Dl rows={[
                ["UTM", [r.utm_source, r.utm_medium, r.utm_campaign, r.utm_content, r.utm_term].filter(Boolean).join(" / ") || "なし"],
                ["参照元", r.referrer || "直接"],
                ["着地ページ", r.landing_page || "—"],
                ["端末", r.device_type || "—"],
              ]} />
            </Section>
          </div>

          <div className="space-y-4">
            <DetailActions
              id={r.id}
              email={r.email}
              initialMemo={r.admin_memo ?? ""}
              initialPreviewUrl={r.preview_url ?? ""}
              designEmailStatus={r.design_email_status}
              designEmailSentAt={r.design_email_sent_at ? formatJst(r.design_email_sent_at) : null}
              designEmailCount={r.design_email_count}
              designEmailError={r.design_email_error}
            />

            <Section title="メール送信履歴">
              {!logs?.length ? (
                <p className="text-sm text-slate-400">まだ送信履歴はありません。</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {(logs as HpDesignEmailLog[]).map((l) => (
                    <li key={l.id} className="rounded-lg border border-slate-200 p-2.5">
                      <p className="flex items-center justify-between gap-2">
                        <span className="font-bold">{EMAIL_KIND_LABELS[l.kind] ?? l.kind}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${l.status === "sent" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                          {l.status === "sent" ? "送信済み" : "失敗"}
                        </span>
                      </p>
                      <p className="text-xs text-slate-500">{formatJst(l.created_at)} ／ {l.to_email}</p>
                      {l.error && <p className="mt-1 break-all text-xs text-rose-700">{l.error}</p>}
                    </li>
                  ))}
                </ul>
              )}
            </Section>
          </div>
        </div>
      </div>
    </AdofyAdminShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="mb-3 text-sm font-bold text-slate-900">{title}</h2>
      {children}
    </section>
  );
}

function Dl({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <dl className="divide-y divide-slate-100 text-sm">
      {rows.map(([k, v]) => (
        <div key={k} className="grid grid-cols-[8.5rem_1fr] gap-3 py-2">
          <dt className="font-bold text-slate-500">{k}</dt>
          <dd className="whitespace-pre-wrap break-words text-slate-900">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function ExtLink({ href }: { href: string }) {
  // 保存時に http(s) のみ許可しているが、表示時も念のため確認する
  const safe = /^https?:\/\//i.test(href);
  return safe ? (
    <a href={href} target="_blank" rel="noopener noreferrer nofollow" className="block break-all text-blue-700 underline">
      {href}
    </a>
  ) : (
    <span className="block break-all">{href}</span>
  );
}
