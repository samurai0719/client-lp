import { NextResponse } from "next/server";
import { authed, bad, str, UUID } from "@/lib/outreach/api";
import { CHATGPT_BLOCK_REASON, TABLES } from "@/lib/outreach/constants";
import type { CompanyRow } from "@/lib/outreach/companies";
import { enrichCompany } from "@/lib/outreach/enrich";
import { markReplied, markUnsubscribed } from "@/lib/outreach/events";
import { normalizeEmail } from "@/lib/outreach/normalize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type Params = { params: Promise<{ id: string }> };

/**
 * 企業1件の操作。
 *   review: approved / excluded / pending
 *   action: replied（返信あり）/ unsubscribed（送信拒否の申し出）/ contracted（契約）/ uncontracted / recheck（HP再確認）
 *   send_blocked, notes, contact_name, email（手動修正）
 */
export async function PATCH(req: Request, { params }: Params) {
  const a = await authed(req);
  if ("error" in a) return a.error;
  const { id } = await params;
  if (!UUID.test(id)) return bad("不正なIDです");
  const b = a.body;
  const now = new Date().toISOString();

  const { data: current } = await a.db.from(TABLES.companies).select("*").eq("id", id).maybeSingle();
  if (!current) return bad("企業が見つかりません", 404);
  const company = current as CompanyRow;

  switch (b.action) {
    case "replied":
      await markReplied(a.db, { companyId: id });
      return NextResponse.json({ ok: true });
    case "unsubscribed":
      await markUnsubscribed(a.db, { email: company.email ?? undefined, companyId: id }, "refused");
      return NextResponse.json({ ok: true });
    case "contracted":
    case "uncontracted":
      await a.db
        .from(TABLES.companies)
        .update({ contracted_at: b.action === "contracted" ? now : null, updated_at: now })
        .eq("id", id);
      return NextResponse.json({ ok: true });
    case "recheck":
      await enrichCompany(a.db, { ...company, crawl_status: "pending" });
      return NextResponse.json({ ok: true });
  }

  const patch: Record<string, unknown> = {};
  if ("review" in b) {
    if (!["approved", "excluded", "pending"].includes(String(b.review))) return bad("値が不正です");
    patch.review_status = b.review;
    patch.reviewed_at = b.review === "pending" ? null : now;
    // ChatGPT 経由のアドレスは、目視確認して「送信OK」にした時点で送信停止を解除する
    if (b.review === "approved" && company.send_blocked_reason === CHATGPT_BLOCK_REASON) {
      patch.send_blocked = false;
      patch.send_blocked_reason = null;
    }
  }
  if ("send_blocked" in b) {
    patch.send_blocked = Boolean(b.send_blocked);
    patch.send_blocked_reason = b.send_blocked ? str(b.send_blocked_reason, 200) || "手動で停止" : null;
  }
  if ("notes" in b) patch.notes = str(b.notes, 2000) || null;
  if ("contact_name" in b) patch.contact_name = str(b.contact_name, 60) || null;
  if ("company_name" in b && str(b.company_name, 200)) patch.company_name = str(b.company_name, 200);
  if ("email" in b) {
    const raw = str(b.email, 200);
    const email = raw ? normalizeEmail(raw) : null;
    if (raw && !email) return bad("メールアドレスの形式が正しくありません");
    patch.email = email;
    patch.email_status = email ? "found" : "none";
    patch.email_source_url = email ? "管理画面で手動入力" : null;
  }
  if (Object.keys(patch).length === 0) return bad("変更内容がありません");
  patch.updated_at = now;

  const { error } = await a.db.from(TABLES.companies).update(patch).eq("id", id);
  if (error) return bad(error.code === "23505" ? "同じメールアドレスの企業が既に登録されています" : "更新に失敗しました", 500);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request, { params }: Params) {
  const a = await authed(req);
  if ("error" in a) return a.error;
  const { id } = await params;
  if (!UUID.test(id)) return bad("不正なIDです");
  const { count } = await a.db.from(TABLES.sends).select("id", { count: "exact", head: true }).eq("company_id", id).not("sent_at", "is", null);
  // 送信履歴がある企業は削除させない（重複送信防止の履歴が消えるため）。除外を使う
  if ((count ?? 0) > 0) return bad("送信履歴がある企業は削除できません。「除外」にしてください。", 409);
  await a.db.from(TABLES.companies).delete().eq("id", id);
  return NextResponse.json({ ok: true });
}
