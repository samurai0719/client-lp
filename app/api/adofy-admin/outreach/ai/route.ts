import { NextResponse } from "next/server";
import { authed, bad, str } from "@/lib/outreach/api";
import { aiConfigured, generateOutreachEmail } from "@/lib/outreach/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** AIで件名・本文の下書きを作る（送信はしない。結果は編集画面に入るだけ） */
export async function POST(req: Request) {
  const a = await authed(req);
  if ("error" in a) return a.error;
  if (!aiConfigured()) return bad("OPENAI_API_KEY が未設定のため、AI文章生成は使えません", 503);
  const b = a.body;
  try {
    const out = await generateOutreachEmail({
      companyName: str(b.companyName, 100),
      prefecture: str(b.prefecture, 10),
      city: str(b.city, 50),
      websiteUrl: str(b.websiteUrl, 300),
      jobType: str(b.jobType, 100),
      tone: str(b.tone, 100),
      template: typeof b.template === "string" ? b.template.slice(0, 4000) : "",
    });
    return NextResponse.json(out);
  } catch (err) {
    console.error("[outreach] ai failed:", err instanceof Error ? err.message : err);
    return bad("文章の生成に失敗しました。時間をおいて再度お試しください", 502);
  }
}
