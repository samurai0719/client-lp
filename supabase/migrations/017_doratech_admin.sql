-- ============================================================
-- ドラテク管理システム（/adofy-admin/doratech）
--   ・求職者：/driver の無料登録をDBに保存し、運営が確認してから公開する
--   ・企業：申込み（driver_company_inquiries）に運営メモ
--   ・面接希望：採用結果・成功報酬の請求／入金の記録
-- Supabase SQL Editor で実行してください。何度実行しても問題ありません。
-- 既存の行は変わりません（列の追加と、状態の選択肢の追加だけ）。
-- ============================================================

-- ── 求職者 ──────────────────────────────────────────────────
alter table driver_candidates
  add column if not exists source text,                          -- driver_lp（/driver の無料登録）/ manual（管理画面で手入力）
  add column if not exists answers jsonb not null default '{}',  -- 登録時の診断回答（設問名 → 回答）
  add column if not exists comment text,                         -- 登録時の「ご希望・ご質問」
  add column if not exists staff_memo text;                      -- 運営メモ（企業には出さない）

-- pending = 登録されたが、運営が本人に確認するまで企業には公開しない
alter table driver_candidates drop constraint if exists driver_candidates_status_check;
alter table driver_candidates
  add constraint driver_candidates_status_check
  check (status in ('pending', 'waiting', 'paused', 'hired', 'withdrawn'));

create index if not exists driver_candidates_email_idx on driver_candidates (lower(email));

-- ── 企業（申込み・問い合わせ） ─────────────────────────────────
alter table driver_company_inquiries add column if not exists staff_memo text;

-- ── 採用結果・成功報酬 ────────────────────────────────────────
alter table scout_interview_requests
  add column if not exists outcome text,                  -- hired（採用決定）/ not_hired（不採用・辞退）
  add column if not exists hired_at date,                 -- 採用決定日
  add column if not exists joined_at date,                -- 入社日
  add column if not exists annual_salary integer,         -- 想定年収（円）
  add column if not exists fee_amount integer,            -- 成功報酬（円）
  add column if not exists invoiced_at date,              -- 請求日
  add column if not exists paid_at date,                  -- 入金日
  add column if not exists billing_memo text;

alter table scout_interview_requests drop constraint if exists scout_interview_requests_outcome_check;
alter table scout_interview_requests
  add constraint scout_interview_requests_outcome_check
  check (outcome is null or outcome in ('hired', 'not_hired'));

create index if not exists scout_interview_requests_outcome_idx on scout_interview_requests (outcome);
