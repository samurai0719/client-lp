-- ============================================================
-- 職人の管理画面（/adofy-admin/shokunin）用
--   運営メモ・最終連絡日時の列と、対応状況の値を追加する。
-- Supabase SQL Editor で実行してください。何度実行しても問題ありません。
-- ============================================================

alter table shokunin_candidates add column if not exists admin_memo text;
alter table shokunin_candidates add column if not exists last_contacted_at timestamptz;

alter table shokunin_candidates drop constraint if exists shokunin_candidates_status_check;
alter table shokunin_candidates
  add constraint shokunin_candidates_status_check
  check (status in ('pending', 'contacted', 'interview', 'published', 'paused', 'hired', 'withdrawn'));
