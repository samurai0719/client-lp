import { NextResponse } from "next/server";
import { authed, bad } from "@/lib/outreach/api";
import { PREFECTURE_NAMES, TABLES } from "@/lib/outreach/constants";
import { normalizeUrl } from "@/lib/outreach/normalize";
import { sourceConfigured, type JobSource } from "@/lib/outreach/sources";

export const dynamic = "force-dynamic";

/** 営業先の自動取得ジョブを作成 */
export async function POST(req: Request) {
  const a = await authed(req);
  if ("error" in a) return a.error;
  const b = a.body;
  const source = String(b.source ?? "") as JobSource;
  if (!["nta", "gbizinfo", "google_places", "url_list"].includes(source)) return bad("取得元が不正です");
  if (!sourceConfigured(source)) {
    return bad(source === "gbizinfo" ? "GBIZINFO_API_TOKEN が未設定です" : "GOOGLE_PLACES_API_KEY が未設定です");
  }

  const prefectures = Array.isArray(b.prefectures)
    ? b.prefectures.filter((p): p is string => typeof p === "string" && PREFECTURE_NAMES.includes(p))
    : [];
  const keywords = Array.isArray(b.keywords)
    ? b.keywords.map((k) => String(k).trim().slice(0, 30)).filter(Boolean).slice(0, 20)
    : [];
  const urls =
    source === "url_list" && typeof b.urls === "string"
      ? [...new Set(b.urls.split(/\s+/).map((u) => normalizeUrl(u)).filter((u): u is string => Boolean(u)))].slice(0, 5000)
      : [];
  if (source === "url_list" && urls.length === 0) return bad("URLを1件以上入力してください");
  const max = Number(b.max_companies);

  const { data, error } = await a.db
    .from(TABLES.jobs)
    .insert({
      source,
      params: {
        prefectures,
        keywords,
        ...(urls.length ? { urls } : {}),
        ...(Number.isFinite(max) && max > 0 ? { max_companies: Math.floor(max) } : {}),
      },
      status: "queued",
    })
    .select("id")
    .single();
  if (error) return bad("作成に失敗しました。migration 010 が適用されているか確認してください。", 500);
  return NextResponse.json({ id: (data as { id: string }).id });
}
