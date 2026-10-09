/**
 * CSV の読み込み（RFC 4180 相当。ダブルクォート内のカンマ・改行に対応）。
 * Excel で保存した Shift_JIS のCSVはブラウザ側で文字コードを判定して文字列にしてから渡す。
 */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  const s = text.replace(/^﻿/, "");
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (quoted) {
      if (ch === '"') {
        if (s[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += ch;
      continue;
    }
    if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && s[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += ch;
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

/** 見出しの表記ゆれを吸収して項目名に対応付ける */
export const CSV_HEADER_ALIASES: Record<string, string[]> = {
  company_name: ["会社名", "企業名", "社名", "company", "company_name", "法人名"],
  contact_name: ["担当者名", "担当者", "contact", "contact_name"],
  email: ["メールアドレス", "メール", "email", "e-mail", "mail"],
  phone: ["電話番号", "電話", "tel", "phone"],
  prefecture: ["都道府県", "prefecture", "県"],
  city: ["市区町村", "city", "市町村"],
  address: ["住所", "所在地", "address"],
  website_url: ["会社hp", "hp", "ホームページ", "url", "website", "website_url", "サイト"],
  notes: ["備考", "メモ", "notes", "note"],
};

export function mapHeaders(header: string[]): Record<string, number> {
  const map: Record<string, number> = {};
  header.forEach((h, i) => {
    const key = h.trim().toLowerCase().replace(/\s/g, "");
    for (const [field, aliases] of Object.entries(CSV_HEADER_ALIASES)) {
      if (map[field] === undefined && aliases.some((a) => a.toLowerCase() === key)) map[field] = i;
    }
  });
  return map;
}
