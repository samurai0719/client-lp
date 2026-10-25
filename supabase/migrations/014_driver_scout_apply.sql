-- ============================================================
-- ドライバー採用サービス（候補者プロフィール検索）の利用申込み（/driver/scout）
-- 既存の driver_company_inquiries（007）に、申込みフォームの項目を追加する。
-- 既存の行・既存フォーム（求人掲載の問い合わせ）には影響しない（列の追加のみ）。
-- Supabase SQL Editor で実行してください。何度実行しても問題ありません。
--
-- 未適用の間も /api/driver-scout-apply は動く（追加項目を message 列にまとめて保存する）。
-- ============================================================

alter table driver_company_inquiries
  add column if not exists inquiry_type text not null default 'job_posting',
  add column if not exists address_city text,
  add column if not exists licenses text[] not null default '{}',
  add column if not exists hiring_timing text;

create index if not exists driver_company_inquiries_type_idx
  on driver_company_inquiries (inquiry_type);
