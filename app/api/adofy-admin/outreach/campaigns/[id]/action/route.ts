import { NextResponse } from "next/server";
import { authed, bad, UUID } from "@/lib/outreach/api";
import { TABLES, TEST_BATCH_SIZE } from "@/lib/outreach/constants";
import type { CampaignRow } from "@/lib/outreach/queue";
import { getSettings, sendReadiness } from "@/lib/outreach/settings";

export const dynamic = "force-dynamic";

/**
 * 送信操作。
 *   test      … テスト100件送信（下書きのときだけ。管理者が「送信OK」にした企業から最大100件）
 *   send_rest … 残りを送信（テスト送信完了のときだけ。expected に確認画面で表示した件数を渡す）
 *   pause / resume / cancel
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const a = await authed(req);
  if ("error" in a) return a.error;
  const { id } = await params;
  if (!UUID.test(id)) return bad("不正なIDです");
  const action = String(a.body.action ?? "");
  const now = new Date().toISOString();

  const { data } = await a.db.from(TABLES.campaigns).select("*").eq("id", id).maybeSingle();
  if (!data) return bad("メールが見つかりません", 404);
  const c = data as CampaignRow;

  const transition = async (from: string[], patch: Record<string, unknown>) => {
    const { data: rows } = await a.db
      .from(TABLES.campaigns)
      .update({ ...patch, updated_at: now })
      .eq("id", id)
      .in("status", from)
      .select("id");
    return Boolean(rows?.length);
  };

  if (action === "test" || action === "send_rest") {
    const readiness = sendReadiness(await getSettings(a.db));
    if (!readiness.ready) return bad(`送信できません：${readiness.problems.join(" / ")}`, 409);
  }

  switch (action) {
    case "test": {
      if (c.status !== "draft") return bad("テスト送信は下書きの状態からのみ行えます", 409);
      // 先に状態を変えて二重押しを防ぐ
      if (!(await transition(["draft"], { status: "test_sending", test_started_at: now, test_size: TEST_BATCH_SIZE }))) {
        return bad("状態が変わっています。画面を更新してください", 409);
      }
      const { data: n, error } = await a.db.rpc("outreach_enqueue", { p_campaign_id: id, p_batch: "test", p_limit: TEST_BATCH_SIZE });
      if (error || !n) {
        await transition(["test_sending"], { status: "draft", test_started_at: null });
        return bad(error ? "キューへの登録に失敗しました" : "送信OKの企業がありません。企業一覧の「確認待ち」で送信OKにしてください", 409);
      }
      return NextResponse.json({ ok: true, queued: n });
    }
    case "send_rest": {
      if (c.status !== "test_completed") return bad("テスト送信の完了後にのみ実行できます", 409);
      const { data: eligible } = await a.db.rpc("outreach_count_eligible", { p_campaign_id: id, p_batch: "rest" });
      const expected = Number(a.body.expected);
      // 確認画面で見た件数と大きく違う場合は送らない（その間に大量の企業が追加された等）
      if (!Number.isFinite(expected) || Math.abs(Number(eligible) - expected) > Math.max(10, expected * 0.05)) {
        return bad(`送信対象が ${eligible} 件に変わっています。画面を更新して再度確認してください`, 409);
      }
      if (!(await transition(["test_completed"], { status: "sending", rest_started_at: now }))) {
        return bad("状態が変わっています。画面を更新してください", 409);
      }
      const { data: n, error } = await a.db.rpc("outreach_enqueue", { p_campaign_id: id, p_batch: "rest", p_limit: 100000 });
      if (error) {
        await transition(["sending"], { status: "test_completed", rest_started_at: null });
        return bad("キューへの登録に失敗しました", 500);
      }
      return NextResponse.json({ ok: true, queued: n });
    }
    case "pause":
      if (!(await transition(["test_sending", "sending"], { status: "paused", resume_status: c.status }))) {
        return bad("送信中のときだけ一時停止できます", 409);
      }
      return NextResponse.json({ ok: true });
    case "resume":
      if (!(await transition(["paused"], { status: c.resume_status ?? "sending", resume_status: null }))) {
        return bad("一時停止中のときだけ再開できます", 409);
      }
      return NextResponse.json({ ok: true });
    case "cancel": {
      if (!(await transition(["test_sending", "test_completed", "sending", "paused"], { status: "cancelled", cancelled_at: now }))) {
        return bad("この状態では中止できません", 409);
      }
      await a.db
        .from(TABLES.sends)
        .update({ status: "cancelled", error_message: "送信中止" })
        .eq("campaign_id", id)
        .eq("status", "queued");
      // 送信待ちのまま中止された企業は未送信に戻す
      await a.db.rpc("outreach_fix_queued_status");
      return NextResponse.json({ ok: true });
    }
  }
  return bad("操作が不正です");
}
