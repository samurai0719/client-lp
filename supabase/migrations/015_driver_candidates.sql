-- ============================================================
-- ドライバー求職者（候補者プロフィール検索サービスの登録者）
--   求職者向けLP（別LP）から登録された人を保存する。
--   企業向けLP（/driver/scout）は status = 'waiting' の人数を
--   「○人のドライバーが待機中」として表示する。
-- Supabase SQL Editor で実行してください。何度実行しても問題ありません。
--
-- 匿名プロフィールとして企業に見せてよいのは profile 系の列だけ。
-- 氏名・電話・メール・現在の勤務先は、本人が企業と求人内容を確認して
-- 開示に同意した場合にのみ、その企業へ見せる（同意の仕組みは今後のシステムで実装）。
-- ============================================================

create table if not exists driver_candidates (
  id uuid primary key default gen_random_uuid(),

  -- 状態。waiting = 企業からの連絡を待っている（＝LPの「待機中」に数える）
  status text not null default 'waiting',

  -- 匿名プロフィール（企業が閲覧できる情報）
  age_band text,                 -- 例：30代（年齢そのものは出さない）
  desired_prefecture text,
  desired_area text,             -- 例：尾張エリア
  desired_salary_band text,      -- 例：450万〜500万円
  licenses text[] not null default '{}',
  experience text,               -- 例：大型トラック 5年
  desired_job_types text[] not null default '{}',
  change_timing text,            -- 例：3か月以内

  -- 個人を特定できる情報（匿名プロフィールでは表示しない）
  full_name text,
  phone text,
  email text,
  current_employer text,

  -- 流入計測
  utm_source text,
  utm_campaign text,
  landing_page text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table driver_candidates drop constraint if exists driver_candidates_status_check;
alter table driver_candidates
  add constraint driver_candidates_status_check
  check (status in ('waiting', 'paused', 'hired', 'withdrawn'));

create index if not exists driver_candidates_status_idx on driver_candidates (status);
create index if not exists driver_candidates_created_at_idx on driver_candidates (created_at desc);

-- ── RLS ─────────────────────────────────────────────────────
-- ブラウザからは一切読み書きさせない。保存・集計はサーバー側（service role）だけが行う。
alter table driver_candidates enable row level security;

drop policy if exists "driver_candidates_select_auth" on driver_candidates;
create policy "driver_candidates_select_auth" on driver_candidates
  for select using (auth.role() = 'authenticated');
