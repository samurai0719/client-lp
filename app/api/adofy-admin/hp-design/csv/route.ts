import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdofyAccess, forbiddenResponse } from "@/lib/auth/adofyCheck";
import {
  ASSET_CHOICES, CONTENTS, PURPOSES, REFERENCE_CHOICES, STATUSES, STYLES, WEBSITE_CHOICES,
  colorText, industryText, labelOf, labelsOf,
} from "@/lib/hpDesign/options";
import { formatJst, TABLE } from "@/lib/hpDesign/server";
import type { HpDesignRequest } from "@/lib/hpDesign/admin";

/** 無料デザイン申し込みのCSV（Excelで開けるよう BOM 付き UTF-8） */

export const dynamic = "force-dynamic";

/** CSVの1セル。Excelで数式として実行されないよう、先頭が = + - @ の値は ' を付ける */
function cell(v: unknown): string {
  let s = v === null || v === undefined ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const admin = await requireAdofyAccess(supabase);
  if (!admin) return forbiddenResponse();

  const status = req.nextUrl.searchParams.get("status") ?? "";
  const db = createAdminClient();
  let query = db.from(TABLE).select("*").order("created_at", { ascending: false }).limit(5000);
  if (status && STATUSES.some((s) => s.id === status)) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: "取得に失敗しました" }, { status: 500 });

  const header = [
    "申し込み日時", "ステータス", "会社名・店舗名", "業種", "担当者名", "メールアドレス", "電話番号",
    "目的", "デザインの雰囲気", "メインカラー", "掲載したい内容", "現在のHP", "現在のHPのURL",
    "参考サイト", "参考URL", "写真・ロゴ", "アップロード数", "その他の希望",
    "プレビューURL", "デザイン送付", "送付日時", "購入希望日時", "購入希望メッセージ", "管理メモ",
    "utm_source", "utm_medium", "utm_campaign", "参照元", "ID",
  ];

  const rows = ((data ?? []) as HpDesignRequest[]).map((r) => [
    formatJst(r.created_at),
    labelOf(STATUSES, r.status),
    r.company_name ?? (r.company_undecided ? "未定" : ""),
    industryText(r.industry, r.industry_other, r.industry_detail),
    r.contact_name,
    r.email,
    r.phone ?? "",
    labelsOf(PURPOSES, r.purposes, r.purpose_other),
    labelOf(STYLES, r.design_style),
    colorText(r.main_color, r.color_other),
    labelsOf(CONTENTS, r.contents, r.content_other),
    labelOf(WEBSITE_CHOICES, r.has_website),
    r.website_url ?? "",
    labelOf(REFERENCE_CHOICES, r.reference_choice),
    (r.reference_urls ?? []).join(" "),
    labelOf(ASSET_CHOICES, r.assets_choice),
    (r.uploaded_files ?? []).length,
    r.other_requests ?? "",
    r.preview_url ?? "",
    r.design_email_status,
    r.design_email_sent_at ? formatJst(r.design_email_sent_at) : "",
    r.purchase_requested_at ? formatJst(r.purchase_requested_at) : "",
    r.purchase_message ?? "",
    r.admin_memo ?? "",
    r.utm_source ?? "",
    r.utm_medium ?? "",
    r.utm_campaign ?? "",
    r.referrer ?? "",
    r.id,
  ]);

  const csv = "﻿" + [header, ...rows].map((row) => row.map(cell).join(",")).join("\r\n");
  const date = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="hp-design-requests-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
