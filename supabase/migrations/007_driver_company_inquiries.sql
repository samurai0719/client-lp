-- ============================================================
-- ドラテク 企業向けLP（/company）— driver_company_inquiries テーブル
-- 運送会社の採用担当者が入力した「求人情報の登録」を保存する
-- Supabase SQL Editor で実行してください
-- ============================================================

create table if not exists driver_company_inquiries (
  id uuid primary key default gen_random_uuid(),

  -- 企業情報（必須）
  company_name text not null,
  contact_name text not null,
  phone text not null,
  email text not null,
  prefecture text not null,

  -- 募集内容
  job_types text[] not null default '{}',
  job_type_other text,
  hiring_count text,
  fleet_description text,

  -- 補足
  message text,

  -- 同意
  consented_at timestamptz not null,

  -- 流入計測
  referrer text,
  landing_page text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,

  -- 対応管理
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table driver_company_inquiries
  drop constraint if exists driver_company_inquiries_status_check;
alter table driver_company_inquiries
  add constraint driver_company_inquiries_status_check
  check (status in ('new', 'contacted', 'in_progress', 'listed', 'won', 'lost', 'spam'));

create index if not exists driver_company_inquiries_created_at_idx
  on driver_company_inquiries (created_at desc);
create index if not exists driver_company_inquiries_status_idx
  on driver_company_inquiries (status);

-- ── RLS ─────────────────────────────────────────────────────
-- consultations と同じ方針。
-- ブラウザからは一切読み書きさせず、保存はサーバー側APIが service role キーで行う
-- （service role は RLS を迂回する）。参照は管理画面のログインユーザーのみ。
alter table driver_company_inquiries enable row level security;

drop policy if exists "driver_company_inquiries_select_auth" on driver_company_inquiries;
create policy "driver_company_inquiries_select_auth" on driver_company_inquiries
  for select using (auth.role() = 'authenticated');

drop policy if exists "driver_company_inquiries_update_auth" on driver_company_inquiries;
create policy "driver_company_inquiries_update_auth" on driver_company_inquiries
  for update using (auth.role() = 'authenticated');

-- anon / authenticated からの insert ポリシーは意図的に作らない。
-- ポリシーが無い操作は拒否されるため、匿名の直接書き込みは不可能になる。
