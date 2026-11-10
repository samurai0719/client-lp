import { NextResponse } from "next/server";
import { listAnonymousProfiles } from "@/lib/driverCandidates/profiles";

/**
 * 公開中の求職者プロフィール（/profiles に出しているものと同じ項目だけ）を返す。
 * 企業向けの無料オンライン相談LPで、ブラウザの「戻る」を押したときのライトボックスに使う。
 * 氏名・連絡先など個人を特定できる情報は listAnonymousProfiles の時点で取得していない。
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** ライトボックスに並べる最大件数 */
const MAX_PROFILES = 6;

export async function GET() {
  const profiles = await listAnonymousProfiles();
  if (profiles === null) {
    return NextResponse.json({ error: "unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
  return NextResponse.json(
    { count: profiles.length, profiles: profiles.slice(0, MAX_PROFILES) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
