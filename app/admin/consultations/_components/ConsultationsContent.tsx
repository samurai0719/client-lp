"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, ChevronDown, Search } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   adofy 無料相談リードの管理画面。
   データ取得・更新はすべて /api/admin/consultations 経由（管理者認証あり）。
   ═══════════════════════════════════════════════════════════════════════════ */

type Consultation = {
  id: string;
  business_type: string | null;
  company_name: string;
  contact_name: string;
  position: string | null;
  prefecture: string;
  city: string | null;
  industries: string[];
  industry_other: string | null;
  has_website: string | null;
  website_url: string | null;
  consultation_topics: string[];
  consultation_other: string | null;
  current_problems: string[];
  problem_other: string | null;
  selected_plan: string | null;
  desired_timing: string | null;
  phone: string | null;
  email: string | null;
  preferred_contact_method: string | null;
  preferred_contact_time: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  referrer: string | null;
  status: string;
  created_at: string;
};

const STATUS_LABELS: Record<string, string> = {
  new: "新規",
  contacted: "連絡済み",
  in_progress: "商談中",
  won: "受注",
  lost: "失注",
  spam: "迷惑",
};

const STATUS_STYLES: Record<string, string> = {
  new: "bg-orange-100 text-orange-800 border-orange-300",
  contacted: "bg-blue-100 text-blue-800 border-blue-300",
  in_progress: "bg-violet-100 text-violet-800 border-violet-300",
  won: "bg-emerald-100 text-emerald-800 border-emerald-300",
  lost: "bg-slate-100 text-slate-600 border-slate-300",
  spam: "bg-rose-100 text-rose-800 border-rose-300",
};

const L = {
  business: { corporation: "法人", sole: "個人事業主", planned: "開業予定", other: "その他" } as Record<string, string>,
  industry: {
    exterior: "外構・エクステリア", painting: "外壁塗装", roof: "屋根工事", demolition: "解体工事",
    reform: "リフォーム", electric: "電気工事", plumbing: "水道工事", interior: "内装工事",
    scaffold: "足場工事", civil: "造成・土木", builder: "工務店", other: "その他",
  } as Record<string, string>,
  website: { yes: "あり", no: "なし", building: "制作途中", unknown: "分からない" } as Record<string, string>,
  topic: {
    new: "新規制作", renewal: "リニューアル", inquiries: "問い合わせ増", direct: "直接受注",
    recruit: "採用", ads: "Web広告", seo: "SEO", unsure: "相談したい", other: "その他",
  } as Record<string, string>,
  problem: {
    subcontract: "下請け中心", lowprice: "受注単価が安い", noleads: "自社集客できない",
    referral: "紹介依存", nohpinquiry: "HPから問い合わせ無し", norecruit: "応募が来ない",
    nodiff: "差別化できない", noweb: "Webが分からない", other: "その他",
  } as Record<string, string>,
  plan: { start: "スタート(30万)", growth: "集客強化(50万)", max: "MAX(70万)", consult: "相談して決めたい" } as Record<string, string>,
  timing: { asap: "できるだけ早く", "1month": "1ヶ月以内", "3months": "3ヶ月以内", "6months": "半年以内", undecided: "未定" } as Record<string, string>,
  method: { phone: "電話", email: "メール", any: "どちらでも" } as Record<string, string>,
  time: { "9-12": "9-12時", "12-15": "12-15時", "15-18": "15-18時", "18-": "18時以降", any: "いつでも" } as Record<string, string>,
};

const map = (dict: Record<string, string>, v: string | null) => (v ? dict[v] ?? v : "—");
const mapAll = (dict: Record<string, string>, arr: string[], other?: string | null) =>
  [...arr.map((v) => (v === "other" && other ? `その他(${other})` : dict[v] ?? v))].join("、") || "—";

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function ConsultationsContent() {
  const [rows, setRows] = useState<Consultation[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ per_page: "50" });
      if (search) params.set("q", search);
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/admin/consultations?${params}`);
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error ?? "取得に失敗しました");
        setRows([]);
        return;
      }
      const j = await res.json();
      setRows(j.consultations ?? []);
      setTotal(j.total ?? 0);
    } catch {
      setError("通信エラーが発生しました");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const t = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [load, search]);

  const changeStatus = async (id: string, status: string) => {
    setSavingId(id);
    // 先に画面へ反映し、失敗したら元に戻す
    const prev = rows;
    setRows((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));
    try {
      const res = await fetch("/api/admin/consultations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) {
        setRows(prev);
        setError("ステータスの更新に失敗しました");
      }
    } catch {
      setRows(prev);
      setError("通信エラーで更新できませんでした");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-slate-900">adofy 無料相談</h1>
        <p className="mt-1 text-sm text-slate-500">
          建設業向けホームページ制作の相談フォームから届いたリード
          {!loading && <span className="ml-2 font-semibold text-slate-700">全 {total} 件</span>}
        </p>
      </div>

      {/* 検索・絞り込み */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="会社名・担当者・電話・メールで検索"
            className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-base outline-none focus:border-slate-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2.5 text-base outline-none focus:border-slate-500"
          aria-label="ステータスで絞り込む"
        >
          <option value="">すべてのステータス</option>
          {Object.entries(STATUS_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
      </div>

      {error && (
        <p className="mb-4 flex items-center gap-2 rounded-lg border border-rose-300 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
          <AlertCircle className="h-4 w-4 flex-none" />
          {error}
        </p>
      )}

      {loading ? (
        <p className="py-16 text-center text-sm text-slate-500">読み込み中...</p>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center">
          <p className="text-sm text-slate-500">該当する相談はまだありません。</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {rows.map((r) => {
            const open = openId === r.id;
            return (
              <li key={r.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="flex flex-wrap items-center gap-3 p-4">
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : r.id)}
                    aria-expanded={open}
                    className="flex flex-1 items-center gap-3 text-left"
                  >
                    <ChevronDown
                      className={`h-4 w-4 flex-none text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
                    />
                    <span className="min-w-0">
                      <span className="block truncate font-bold text-slate-900">{r.company_name}</span>
                      <span className="block truncate text-xs text-slate-500">
                        {r.contact_name} ／ {r.prefecture}{r.city ?? ""} ／ {formatDateTime(r.created_at)}
                      </span>
                    </span>
                  </button>

                  <select
                    value={r.status}
                    disabled={savingId === r.id}
                    onChange={(e) => changeStatus(r.id, e.target.value)}
                    aria-label={`${r.company_name} のステータス`}
                    className={`rounded-full border px-3 py-1.5 text-xs font-bold outline-none ${STATUS_STYLES[r.status] ?? STATUS_STYLES.new}`}
                  >
                    {Object.entries(STATUS_LABELS).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>

                {open && (
                  <dl className="grid gap-x-6 gap-y-3 border-t border-slate-200 bg-slate-50 p-4 text-sm sm:grid-cols-2">
                    <Row label="事業形態" value={map(L.business, r.business_type)} />
                    <Row label="担当者" value={`${r.contact_name}${r.position ? `（${r.position}）` : ""}`} />
                    <Row label="電話" value={r.phone ? <a className="text-blue-700 underline" href={`tel:${r.phone}`}>{r.phone}</a> : "—"} />
                    <Row label="メール" value={r.email ? <a className="text-blue-700 underline" href={`mailto:${r.email}`}>{r.email}</a> : "—"} />
                    <Row label="希望連絡方法" value={`${map(L.method, r.preferred_contact_method)} / ${map(L.time, r.preferred_contact_time)}`} />
                    <Row label="業種" value={mapAll(L.industry, r.industries, r.industry_other)} />
                    <Row label="現在のHP" value={r.website_url ? <a className="text-blue-700 underline" href={r.website_url} target="_blank" rel="noopener noreferrer">{map(L.website, r.has_website)}（{r.website_url}）</a> : map(L.website, r.has_website)} />
                    <Row label="相談内容" value={mapAll(L.topic, r.consultation_topics, r.consultation_other)} />
                    <Row label="お悩み" value={mapAll(L.problem, r.current_problems, r.problem_other)} />
                    <Row label="希望プラン" value={map(L.plan, r.selected_plan)} />
                    <Row label="希望時期" value={map(L.timing, r.desired_timing)} />
                    <Row
                      label="流入元"
                      value={
                        r.utm_source
                          ? `${r.utm_source} / ${r.utm_medium ?? "—"} / ${r.utm_campaign ?? "—"}`
                          : r.referrer || "直接アクセス"
                      }
                    />
                  </dl>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-bold text-slate-500">{label}</dt>
      <dd className="mt-0.5 break-words text-slate-800">{value}</dd>
    </div>
  );
}
