// ─────────────────────────────────────────────────────────────────────────────
// CRM顧客の照合・作成の共通ロジック
//
// /api/inquiries・/api/gaikou-contact・/api/takanaga-contact の3経路で
// 挙動を統一するためのヘルパー。過去に発生した以下の不具合を防ぐ：
//   1. 名前の扱い：最新のフォーム入力名を顧客名へ反映する（空では上書きしない）。
//      名前が変わった場合は nameMismatchNote で「以前の登録名」をリードに記録し、
//      情報を消さない。※別人の名前に化ける事故は 3 の照合ガードで防いでいる。
//   2. 電話番号の正規化が経路ごとに異なり、同じ番号でも別顧客が作られて重複する
//      → normalizePhone に一本化。
//   3. 桁数が不十分な番号（空文字など）同士が一致して別人の顧客に結合される
//      → 10桁未満は照合対象外とし、常に新規顧客として扱う。
//   4. ほぼ同時の二重送信で顧客・リードが二重に作られる
//      → 顧客はユニーク制約違反時に再取得、リードは直近の同一内容を検出して再利用。
// ─────────────────────────────────────────────────────────────────────────────

import type { SupabaseClient } from "@supabase/supabase-js";
import { normalizePhone } from "../utils/format";

// 日本の電話番号は10〜11桁。これ未満は照合に使わない（誤結合防止）
const MIN_MATCHABLE_DIGITS = 10;

export type CustomerInput = {
  name: string;
  phone: string;
  email?: string | null;
  postalCode?: string | null;
  prefecture?: string | null;
  city?: string | null;
  address?: string | null;
};

export type FindOrCreateCustomerResult =
  | {
      ok: true;
      customerId: string;
      /** 既存顧客に一致した場合 true */
      matchedExisting: boolean;
      /** 一致した既存顧客の登録名（フォーム入力名と異なる場合の記録用） */
      existingName: string | null;
    }
  | { ok: false };

async function findMatchableCustomer(
  db: SupabaseClient,
  phoneNormalized: string
): Promise<{ id: string; name: string | null; email: string | null } | null> {
  const { data } = await db
    .from("customers")
    .select("id, name, email")
    .eq("phone_normalized", phoneNormalized)
    .is("deleted_at", null)
    .order("created_at", { ascending: true })
    .limit(1);
  return data && data.length > 0 ? data[0] : null;
}

export async function findOrCreateCustomer(
  db: SupabaseClient,
  input: CustomerInput
): Promise<FindOrCreateCustomerResult> {
  const phoneNormalized = normalizePhone(input.phone);
  const canMatch = phoneNormalized.length >= MIN_MATCHABLE_DIGITS;

  if (canMatch) {
    const existing = await findMatchableCustomer(db, phoneNormalized);
    if (existing) {
      // 最新の入力を顧客情報へ反映する。ただし空の値で消すことはしない。
      // 名前が変わる場合、以前の名前は呼び出し側が nameMismatchNote でリードに記録する。
      const patch: Record<string, string> = { updated_at: new Date().toISOString() };
      const submittedName = input.name.trim();
      if (submittedName && submittedName !== (existing.name ?? "").trim()) {
        patch.name = submittedName;
      }
      if (input.email) patch.email = input.email;
      await db.from("customers").update(patch).eq("id", existing.id);
      return {
        ok: true,
        customerId: existing.id,
        matchedExisting: true,
        existingName: existing.name ?? null,
      };
    }
  }

  const { data: created, error } = await db
    .from("customers")
    .insert({
      name: input.name.trim(),
      phone: input.phone.trim(),
      phone_normalized: phoneNormalized,
      email: input.email || null,
      postal_code: input.postalCode || null,
      prefecture: input.prefecture || null,
      city: input.city || null,
      address: input.address || null,
    })
    .select("id")
    .single();

  if (!error && created) {
    return { ok: true, customerId: created.id, matchedExisting: false, existingName: null };
  }

  // ユニーク制約違反（並行リクエストが先に作成した）場合は既存を拾い直す
  if (canMatch) {
    const raced = await findMatchableCustomer(db, phoneNormalized);
    if (raced) {
      return { ok: true, customerId: raced.id, matchedExisting: true, existingName: raced.name ?? null };
    }
  }

  console.error("[crm] customer insert failed:", error?.code ?? error);
  return { ok: false };
}

// ── 二重送信によるリード重複の検出 ──────────────────────────────────
// 直近数分以内に「同じ顧客・同じ工事種別・同じ問い合わせ内容」のリードが
// あれば二重送信とみなし、そのリードIDを返す（新規作成しない）。
// 内容が少しでも異なる連続問い合わせは別リードとして通常どおり保存される。
const DUPLICATE_WINDOW_MINUTES = 3;

export async function findRecentDuplicateLead(
  db: SupabaseClient,
  customerId: string,
  workTypes: string[],
  inquiryMessage: string | null
): Promise<string | null> {
  const since = new Date(Date.now() - DUPLICATE_WINDOW_MINUTES * 60_000).toISOString();
  const { data } = await db
    .from("leads")
    .select("id, work_types, inquiry_message")
    .eq("customer_id", customerId)
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(5);

  if (!data) return null;
  const normalizedTypes = JSON.stringify([...workTypes].sort());
  for (const lead of data) {
    const leadTypes = JSON.stringify([...((lead.work_types as string[]) ?? [])].sort());
    if (leadTypes === normalizedTypes && (lead.inquiry_message ?? null) === (inquiryMessage ?? null)) {
      return lead.id;
    }
  }
  return null;
}

// フォーム入力名で顧客名を更新した場合に、以前の名前を問い合わせ内容へ残す注記
// （名前の変更履歴が消えないようにするため）
export function nameMismatchNote(submittedName: string, existingName: string | null): string | null {
  const submitted = submittedName.trim();
  if (!submitted || !existingName || existingName.trim() === submitted) return null;
  return `【お名前を更新】${submitted}（以前の登録名：${existingName.trim()}）`;
}
