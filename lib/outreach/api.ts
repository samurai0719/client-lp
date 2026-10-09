import { NextResponse } from "next/server";
import { forbiddenResponse } from "@/lib/auth/adofyCheck";
import { getOutreachDb } from "./access";
import { PREFECTURE_NAMES } from "./constants";
import { normalizeUrl } from "./normalize";

export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

/** 管理APIの共通処理：権限確認と JSON の読み取り */
export async function authed<T = Record<string, unknown>>(req?: Request) {
  const auth = await getOutreachDb();
  if (!auth) return { error: forbiddenResponse() } as const;
  let body = {} as T;
  if (req && req.method !== "GET" && req.method !== "DELETE") {
    try {
      body = (await req.json()) as T;
    } catch {
      return { error: bad("不正なリクエストです") } as const;
    }
  }
  return { ...auth, body } as const;
}

export function str(v: unknown, max = 300): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/** 営業メールの入力チェック（作成・編集で共通） */
export function campaignFields(b: Record<string, unknown>) {
  const name = str(b.name, 100);
  const subject = str(b.subject, 200);
  const body = typeof b.body === "string" ? b.body.replace(/\r\n/g, "\n").trim().slice(0, 8000) : "";
  const landing = normalizeUrl(str(b.landing_page_url, 500));
  if (!name) return { error: "管理用の名前を入力してください" } as const;
  if (!subject) return { error: "件名を入力してください" } as const;
  if (!body) return { error: "本文を入力してください" } as const;
  if (!landing || !landing.startsWith("https://")) return { error: "LPのURL（https://〜）を入力してください" } as const;
  if (!body.includes("{{landing_page_url}}")) return { error: "本文に {{landing_page_url}} を入れてください（クリック計測とUTMに使います）" } as const;
  const prefectures = Array.isArray(b.prefectures)
    ? b.prefectures.filter((p): p is string => typeof p === "string" && PREFECTURE_NAMES.includes(p))
    : [];
  return { row: { name, subject, body, landing_page_url: landing, target: { prefectures } } } as const;
}
