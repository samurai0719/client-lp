import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/check";
import { TABLES } from "@/lib/outreach/constants";
import { findSendByToken, markClicked } from "@/lib/outreach/events";
import { withUtm } from "@/lib/outreach/render";

import { defaultLandingUrl } from "@/lib/outreach/settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 営業メール内のリンク。クリックを記録してから、企業ごとのUTM付きLPへ転送する。
 * トークンが不正でも、LPそのものへは必ず転送する（リンク切れにしない）。
 */
export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  let dest: string = defaultLandingUrl();

  if (isSupabaseAdminConfigured()) {
    try {
      const db = createAdminClient();
      const send = await findSendByToken(db, token);
      if (send) {
        const { data: campaign } = await db
          .from(TABLES.campaigns)
          .select("landing_page_url")
          .eq("id", send.campaign_id)
          .maybeSingle();
        dest = withUtm((campaign as { landing_page_url: string } | null)?.landing_page_url ?? defaultLandingUrl(), send.company_id, send.campaign_id);
        await markClicked(db, send);
      }
    } catch (err) {
      console.error("[outreach] click tracking failed:", err instanceof Error ? err.message : err);
    }
  }

  return NextResponse.redirect(dest, { status: 302, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });
}
