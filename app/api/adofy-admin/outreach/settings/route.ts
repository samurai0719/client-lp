import { NextResponse } from "next/server";
import { authed, bad, str } from "@/lib/outreach/api";
import { TABLES } from "@/lib/outreach/constants";
import { normalizeEmail } from "@/lib/outreach/normalize";
import { providerLimits } from "@/lib/outreach/settings";

export const dynamic = "force-dynamic";

/** 送信速度・送信者情報の保存。送信速度はメール配信サービスの上限を超えられない */
export async function PATCH(req: Request) {
  const a = await authed(req);
  if ("error" in a) return a.error;
  const b = a.body;
  const p = providerLimits();
  const int = (v: unknown, max: number) => {
    const n = Math.floor(Number(v));
    return Number.isFinite(n) && n >= 1 ? Math.min(n, max) : null;
  };
  const per_minute = int(b.per_minute, p.per_minute);
  const per_hour = int(b.per_hour, p.per_hour);
  const per_day = int(b.per_day, p.per_day);
  const min_days = Math.floor(Number(b.min_days_between_campaigns));
  if (!per_minute || !per_hour || !per_day) return bad("送信速度は1以上の数値で入力してください");
  if (!Number.isFinite(min_days) || min_days < 0 || min_days > 365) return bad("再送までの日数は0〜365で入力してください");

  const sender_email = str(b.sender_email, 200);
  if (sender_email && !normalizeEmail(sender_email)) return bad("連絡先メールアドレスの形式が正しくありません");

  const { error } = await a.db.from(TABLES.settings).upsert({
    id: 1,
    per_minute,
    per_hour,
    per_day,
    min_days_between_campaigns: min_days,
    sender_name: str(b.sender_name, 100),
    sender_address: str(b.sender_address, 200),
    sender_email: sender_email.toLowerCase(),
    sender_phone: str(b.sender_phone, 30),
    updated_at: new Date().toISOString(),
  });
  if (error) return bad("保存に失敗しました", 500);
  return NextResponse.json({ ok: true, clamped: { per_minute, per_hour, per_day } });
}
