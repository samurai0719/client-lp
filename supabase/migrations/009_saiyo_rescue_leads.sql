-- ============================================================
-- 採用レスキュー 問い合わせ管理 — saiyo_rescue_leads テーブル
-- Supabase SQL Editor で実行してください
--
-- ※ "leads" は外構CRMが既に使用しているため、別名のテーブルにしている。
--
-- セキュリティ方針（consultations と同じ）
--   ・RLSを有効化し、ポリシーは1つも作らない＝匿名・一般ログインからは
--     SELECT / INSERT / UPDATE / DELETE すべて拒否される。
--   ・フォームの保存（INSERT）と管理画面の閲覧・更新（SELECT / UPDATE）は
--     すべてサーバー側API（service role）だけが行う。
--     フォームAPIは送信間隔制限・ハニーポット・入力検証を通ったものだけ INSERT し、
--     管理APIは ADOFY_ADMIN_EMAILS の許可リストに入ったログインユーザーだけが呼べる。
-- ============================================================

create table if not exists saiyo_rescue_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- 必須項目
  company_name text not null,
  contact_name text not null,
  phone text not null,
  email text not null,
  prefecture text not null,
  job_type text not null,

  -- 任意項目
  current_employees text,
  desired_hires text,
  current_job_media text,
  monthly_recruitment_budget text,
  website_url text,
  job_page_url text,
  message text,
  desired_plan text,

  -- 対応管理
  status text not null default 'new',
  assigned_to text,
  memo text,
  next_contact_at timestamptz,

  -- 流入元
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  landing_page text,
  referrer text,
  device_type text
);

alter table saiyo_rescue_leads drop constraint if exists saiyo_rescue_leads_status_check;
alter table saiyo_rescue_leads
  add constraint saiyo_rescue_leads_status_check
  check (status in ('new', 'untouched', 'called', 'meeting_scheduled', 'met', 'quoted', 'won', 'lost', 'hold'));

alter table saiyo_rescue_leads drop constraint if exists saiyo_rescue_leads_device_check;
alter table saiyo_rescue_leads
  add constraint saiyo_rescue_leads_device_check
  check (device_type is null or device_type in ('pc', 'smartphone', 'tablet'));

create index if not exists saiyo_rescue_leads_created_at_idx on saiyo_rescue_leads (created_at desc);
create index if not exists saiyo_rescue_leads_next_contact_idx on saiyo_rescue_leads (next_contact_at);
create index if not exists saiyo_rescue_leads_status_idx on saiyo_rescue_leads (status);

-- updated_at を自動更新
create or replace function saiyo_rescue_leads_touch() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists saiyo_rescue_leads_touch on saiyo_rescue_leads;
create trigger saiyo_rescue_leads_touch
  before update on saiyo_rescue_leads
  for each row execute function saiyo_rescue_leads_touch();

-- RLS：ポリシー無し＝ブラウザ（anon / authenticated）からの直接アクセスはすべて拒否
alter table saiyo_rescue_leads enable row level security;
revoke all on saiyo_rescue_leads from anon, authenticated;

-- 確認:
--   select policyname from pg_policies where tablename = 'saiyo_rescue_leads';  → 0件
