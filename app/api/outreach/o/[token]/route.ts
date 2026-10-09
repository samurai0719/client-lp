import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/check";
import { findSendByToken, markOpened } from "@/lib/outreach/events";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 1x1 の透明GIF
const GIF = Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64");

/**
 * 開封計測（参考値）。画像を自動で読み込まない受信環境では記録されず、
 * 逆にセキュリティ製品の自動読み込みで記録されることもあるため、正確な数字としては扱わない。
 */
export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (isSupabaseAdminConfigured()) {
    try {
      const db = createAdminClient();
      const send = await findSendByToken(db, token.replace(/\.gif$/, ""));
      if (send) await markOpened(db, send);
    } catch {
      /* 計測の失敗で画像を返さないことはしない */
    }
  }
  return new Response(new Uint8Array(GIF), {
    headers: { "Content-Type": "image/gif", "Cache-Control": "no-store, max-age=0", "X-Robots-Tag": "noindex" },
  });
}
