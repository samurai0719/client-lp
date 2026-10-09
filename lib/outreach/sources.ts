import type { SupabaseClient } from "@supabase/supabase-js";
import {
  DEFAULT_GBIZ_KEYWORDS,
  DEFAULT_PLACES_KEYWORDS,
  PREFECTURE_NAMES,
  TABLES,
  prefectureCode,
} from "./constants";
import { insertCompany, type CompanyInput } from "./companies";
import { hasCorpType, normalizeUrl, splitAddress } from "./normalize";

/**
 * 営業先企業の自動取得。
 *
 *   gbizinfo       … 経済産業省 gBizINFO（政府の法人オープンデータ）を法人名キーワード×都道府県で検索。
 *                    公式HPのURLは法人詳細APIで取得する（HP確認の段階で行う）。
 *   google_places  … Google Places API (Text Search) で「運送会社 ○○県」等を検索。
 *                    会社名・住所・電話・公式HPが取れる。
 *   url_list       … 管理者が貼り付けた公式HPのURL一覧を登録する。
 *
 * サーバーレスの実行時間に収まるよう、1回の呼び出しでは「1ページ分」だけ進め、
 * 進捗（cursor）をDBに保存する。cron や管理画面から繰り返し呼ぶと最後まで進む。
 */

export type JobSource = "gbizinfo" | "google_places" | "url_list";

export type JobParams = {
  prefectures?: string[];
  keywords?: string[];
  urls?: string[];
  /** この件数を登録したら止める（取りすぎ防止） */
  max_companies?: number;
};

export type JobRow = {
  id: string;
  source: JobSource;
  params: JobParams;
  cursor: { p?: number; k?: number; page?: number; token?: string | null; i?: number };
  status: string;
  found_count: number;
  inserted_count: number;
  duplicate_count: number;
  last_error: string | null;
  locked_until: string | null;
  created_at: string;
  updated_at: string;
  finished_at: string | null;
};

export function sourceConfigured(source: JobSource): boolean {
  if (source === "gbizinfo") return Boolean(process.env.GBIZINFO_API_TOKEN);
  if (source === "google_places") return Boolean(process.env.GOOGLE_PLACES_API_KEY);
  return true;
}

/* ── gBizINFO ──────────────────────────────────────────────────────── */

const GBIZ_BASE = "https://api.info.gbiz.go.jp/hojin/v2/hojin";
const GBIZ_LIMIT = 100;

type GbizHojin = {
  corporate_number?: string;
  name?: string;
  location?: string;
  company_url?: string | null;
  representative_name?: string | null;
  postal_code?: string | null;
};

/**
 * gBizINFO への負荷を抑えるため、同じ実行環境からのリクエストは1秒に1回までに直列化する
 * （利用申請の「利用予定」にもこの頻度で申告している）。
 */
const GBIZ_MIN_INTERVAL_MS = 1100;
let gbizQueue: Promise<void> = Promise.resolve();
let gbizLastAt = 0;
function gbizThrottle(): Promise<void> {
  const turn = gbizQueue.then(async () => {
    const wait = gbizLastAt + GBIZ_MIN_INTERVAL_MS - Date.now();
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    gbizLastAt = Date.now();
  });
  gbizQueue = turn.catch(() => {});
  return turn;
}

async function gbizGet(path: string, params: Record<string, string> = {}): Promise<{ "hojin-infos"?: GbizHojin[]; totalPage?: string }> {
  await gbizThrottle();
  const token = process.env.GBIZINFO_API_TOKEN;
  if (!token) throw new Error("GBIZINFO_API_TOKEN が未設定です");
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${GBIZ_BASE}${path}${qs ? `?${qs}` : ""}`, {
    headers: { "X-hojinInfo-api-token": token, Accept: "application/json" },
    signal: AbortSignal.timeout(20000),
  });
  if (res.status === 404) return { "hojin-infos": [] };
  if (!res.ok) throw new Error(`gBizINFO HTTP ${res.status}`);
  return res.json();
}

/** 法人番号から公式HPのURLを取得する（HP確認の段階で使う） */
export async function gbizLookupWebsite(corporateNumber: string): Promise<string | null> {
  const data = await gbizGet(`/${encodeURIComponent(corporateNumber)}`);
  return normalizeUrl(data["hojin-infos"]?.[0]?.company_url ?? null);
}

async function stepGbiz(job: JobRow): Promise<{ items: CompanyInput[]; next: JobRow["cursor"] | null }> {
  const prefs = job.params.prefectures?.length ? job.params.prefectures : PREFECTURE_NAMES;
  const keywords = job.params.keywords?.length ? job.params.keywords : DEFAULT_GBIZ_KEYWORDS;
  const p = job.cursor.p ?? 0;
  const k = job.cursor.k ?? 0;
  const page = job.cursor.page ?? 1;
  if (p >= prefs.length) return { items: [], next: null };

  const code = prefectureCode(prefs[p]);
  const data = await gbizGet("", {
    name: keywords[k],
    ...(code ? { prefecture: code } : {}),
    exist_flg: "true",
    page: String(page),
    limit: String(GBIZ_LIMIT),
  });
  const list = data["hojin-infos"] ?? [];

  const items: CompanyInput[] = list
    // 株式会社・有限会社等の会社だけ（協同組合・社団法人・官公庁などは対象外）
    .filter((h) => h.name && h.corporate_number && hasCorpType(h.name))
    .map((h) => {
      const addr = splitAddress(h.location);
      return {
        company_name: h.name!,
        corporate_name: h.name!,
        corporate_number: h.corporate_number!,
        prefecture: addr.prefecture ?? prefs[p],
        city: addr.city,
        address: h.location ?? null,
        website_url: h.company_url ?? null,
        source: "gbizinfo",
        source_ref: h.corporate_number!,
        source_job_id: job.id,
      } satisfies CompanyInput;
    });

  const totalPage = Number(data.totalPage ?? 0);
  const hasMore = totalPage ? page < totalPage : list.length >= GBIZ_LIMIT;
  let next: JobRow["cursor"];
  if (hasMore) next = { p, k, page: page + 1 };
  else if (k + 1 < keywords.length) next = { p, k: k + 1, page: 1 };
  else next = { p: p + 1, k: 0, page: 1 };
  return { items, next: next.p! >= prefs.length ? null : next };
}

/* ── Google Places (Text Search, New) ─────────────────────────────── */

type Place = {
  id: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  nationalPhoneNumber?: string;
  websiteUri?: string;
  businessStatus?: string;
  addressComponents?: { longText?: string; types?: string[] }[];
};

async function stepPlaces(job: JobRow): Promise<{ items: CompanyInput[]; next: JobRow["cursor"] | null }> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) throw new Error("GOOGLE_PLACES_API_KEY が未設定です");
  const prefs = job.params.prefectures?.length ? job.params.prefectures : PREFECTURE_NAMES;
  const keywords = job.params.keywords?.length ? job.params.keywords : DEFAULT_PLACES_KEYWORDS;
  const p = job.cursor.p ?? 0;
  const k = job.cursor.k ?? 0;
  if (p >= prefs.length) return { items: [], next: null };

  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.businessStatus,places.addressComponents,nextPageToken",
    },
    body: JSON.stringify({
      textQuery: `${keywords[k]} ${prefs[p]}`,
      languageCode: "ja",
      regionCode: "JP",
      pageSize: 20,
      ...(job.cursor.token ? { pageToken: job.cursor.token } : {}),
    }),
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`Google Places HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = (await res.json()) as { places?: Place[]; nextPageToken?: string };

  const items: CompanyInput[] = (data.places ?? [])
    .filter((pl) => pl.displayName?.text && pl.businessStatus !== "CLOSED_PERMANENTLY")
    .map((pl) => {
      const comp = (t: string) => pl.addressComponents?.find((c) => c.types?.includes(t))?.longText ?? null;
      const address = (pl.formattedAddress ?? "").replace(/^日本、\s*/, "").replace(/^〒\d{3}-\d{4}\s*/, "");
      const split = splitAddress(address);
      return {
        company_name: pl.displayName!.text!,
        prefecture: comp("administrative_area_level_1") ?? split.prefecture ?? prefs[p],
        city: comp("locality") ?? split.city,
        address: address || null,
        phone: pl.nationalPhoneNumber ?? null,
        website_url: pl.websiteUri ?? null,
        source: "google_places",
        source_ref: pl.id,
        source_job_id: job.id,
      } satisfies CompanyInput;
    });

  let next: JobRow["cursor"];
  if (data.nextPageToken) next = { p, k, token: data.nextPageToken };
  else if (k + 1 < keywords.length) next = { p, k: k + 1, token: null };
  else next = { p: p + 1, k: 0, token: null };
  return { items, next: next.p! >= prefs.length ? null : next };
}

/* ── URL一覧 ──────────────────────────────────────────────────────── */

const URL_BATCH = 50;

async function stepUrlList(job: JobRow): Promise<{ items: CompanyInput[]; next: JobRow["cursor"] | null }> {
  const urls = job.params.urls ?? [];
  const i = job.cursor.i ?? 0;
  const items: CompanyInput[] = urls
    .slice(i, i + URL_BATCH)
    .map((u) => normalizeUrl(u))
    .filter((u): u is string => Boolean(u))
    .map((u) => ({
      // 会社名はHP確認の段階でページタイトルから補う
      company_name: new URL(u).hostname.replace(/^www\./, ""),
      website_url: u,
      source: "url_list",
      source_ref: u,
      source_job_id: job.id,
    }));
  return { items, next: i + URL_BATCH < urls.length ? { i: i + URL_BATCH } : null };
}

/* ── ジョブを1ステップ進める ───────────────────────────────────────── */

export async function runJobStep(db: SupabaseClient, job: JobRow): Promise<JobRow> {
  // 同時実行防止（cron と管理画面が同時に呼んでも二重に進めない）
  const lockUntil = new Date(Date.now() + 90_000).toISOString();
  const { data: locked } = await db
    .from(TABLES.jobs)
    .update({ locked_until: lockUntil, status: "running", updated_at: new Date().toISOString() })
    .eq("id", job.id)
    .in("status", ["queued", "running"])
    .or(`locked_until.is.null,locked_until.lt.${new Date().toISOString()}`)
    .select("*")
    .maybeSingle();
  if (!locked) return job;
  const current = locked as JobRow;

  try {
    const step =
      current.source === "gbizinfo"
        ? await stepGbiz(current)
        : current.source === "google_places"
          ? await stepPlaces(current)
          : await stepUrlList(current);

    let inserted = 0;
    let duplicate = 0;
    for (const item of step.items) {
      const r = await insertCompany(db, item);
      if (r.result === "inserted") inserted++;
      else if (r.result === "duplicate") duplicate++;
    }

    const totalInserted = current.inserted_count + inserted;
    const reachedMax = current.params.max_companies ? totalInserted >= current.params.max_companies : false;
    const done = step.next === null || reachedMax;
    const patch = {
      cursor: step.next ?? current.cursor,
      found_count: current.found_count + step.items.length,
      inserted_count: totalInserted,
      duplicate_count: current.duplicate_count + duplicate,
      status: done ? "completed" : "running",
      finished_at: done ? new Date().toISOString() : null,
      last_error: null,
      locked_until: null,
      updated_at: new Date().toISOString(),
    };
    const { data } = await db.from(TABLES.jobs).update(patch).eq("id", current.id).select("*").single();
    return (data as JobRow) ?? { ...current, ...patch };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const fatal = /未設定|HTTP 40[13]/.test(msg);
    const patch = {
      status: fatal ? "failed" : "running",
      last_error: msg.slice(0, 300),
      locked_until: null,
      updated_at: new Date().toISOString(),
    };
    await db.from(TABLES.jobs).update(patch).eq("id", current.id);
    return { ...current, ...patch };
  }
}
