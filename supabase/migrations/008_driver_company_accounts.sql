-- ============================================================
-- ドラテク 企業登録・求人登録（/company/register）
--   driver_companies      企業アカウント
--   driver_job_postings   求人情報
-- Supabase SQL Editor で実行してください
--
-- 007（driver_company_inquiries）は問い合わせ型フォームのテーブルで、
-- 今回の企業登録・求人登録とは別物。007は適用済みなら残して構わない。
-- ============================================================

-- ── 企業アカウント ────────────────────────────────────────────
create table if not exists driver_companies (
  id uuid primary key default gen_random_uuid(),

  company_name text not null,
  company_name_kana text not null,
  corporate_number text,
  representative_name text not null,
  postal_code text not null,
  address_prefecture text not null,
  address text not null,
  website_url text,
  contact_name text not null,
  -- 応募通知先。求人登録の確認メールと応募者情報の送信先
  notification_email text not null,
  phone text not null,
  business_description text not null,
  employee_count text,
  vehicle_count text,

  -- メール認証。認証が終わるまで求人は公開・配信しない
  email_verified_at timestamptz,
  verification_token text,
  verification_expires_at timestamptz,

  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table driver_companies
  drop constraint if exists driver_companies_status_check;
alter table driver_companies
  add constraint driver_companies_status_check
  check (status in ('pending', 'active', 'suspended'));

-- 同じメールアドレスの企業を重複登録させない
create unique index if not exists driver_companies_email_key
  on driver_companies (lower(notification_email));
-- 認証URLの照合に使う
create unique index if not exists driver_companies_token_key
  on driver_companies (verification_token)
  where verification_token is not null;
create index if not exists driver_companies_created_at_idx
  on driver_companies (created_at desc);

-- ── 求人情報 ──────────────────────────────────────────────────
-- 求人の絞り込み・配信条件に使う項目は独立カラム、
-- それ以外（手当・研修制度など表示専用の項目）は details(jsonb) に入れる。
create table if not exists driver_job_postings (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references driver_companies (id) on delete cascade,

  -- 求人基本情報
  job_title text not null,
  job_types text[] not null default '{}',
  job_description text not null,
  hiring_count text not null,
  employment_type text not null,
  work_postal_code text not null,
  work_prefecture text not null,
  work_address text not null,
  relocation text not null,

  -- 勤務条件（配信条件・一覧表示に使うもの）
  working_hours text not null,
  holidays text not null,
  salary_type text not null,
  salary_min integer not null,
  salary_max integer not null,

  -- ドライバー求人詳細（配信条件に使うもの）
  required_licenses text[] not null default '{}',
  preferred_licenses text[] not null default '{}',
  inexperienced_ok text not null,
  distance_type text,

  -- 上記以外の入力項目
  details jsonb not null default '{}'::jsonb,
  -- STEP5 の同意内容（どの条件に同意して登録したかを残す）
  consents jsonb not null default '{}'::jsonb,
  consented_at timestamptz not null,

  -- 掲載管理
  listing_end_date date,
  status text not null default 'pending_verification',
  published_at timestamptz,

  -- 流入計測
  referrer text,
  landing_page text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table driver_job_postings
  drop constraint if exists driver_job_postings_status_check;
alter table driver_job_postings
  add constraint driver_job_postings_status_check
  check (status in ('pending_verification', 'published', 'stopped', 'expired', 'rejected'));

alter table driver_job_postings
  drop constraint if exists driver_job_postings_salary_range_check;
alter table driver_job_postings
  add constraint driver_job_postings_salary_range_check
  check (salary_min >= 0 and salary_max >= salary_min);

create index if not exists driver_job_postings_company_idx
  on driver_job_postings (company_id);
create index if not exists driver_job_postings_status_idx
  on driver_job_postings (status);
create index if not exists driver_job_postings_created_at_idx
  on driver_job_postings (created_at desc);
-- 配信条件（勤務地・免許・職種）での絞り込み用
create index if not exists driver_job_postings_prefecture_idx
  on driver_job_postings (work_prefecture);
create index if not exists driver_job_postings_licenses_idx
  on driver_job_postings using gin (required_licenses);
create index if not exists driver_job_postings_job_types_idx
  on driver_job_postings using gin (job_types);

-- 掲載終了日を過ぎた求人を配信し続けないための判定に使う
create index if not exists driver_job_postings_listing_end_idx
  on driver_job_postings (listing_end_date)
  where listing_end_date is not null;

-- ── RLS ─────────────────────────────────────────────────────
-- consultations / driver_company_inquiries と同じ方針。
-- ブラウザからは一切読み書きさせず、保存はサーバー側APIが service role キーで行う
-- （service role は RLS を迂回する）。参照は管理画面のログインユーザーのみ。
alter table driver_companies enable row level security;
alter table driver_job_postings enable row level security;

drop policy if exists "driver_companies_select_auth" on driver_companies;
create policy "driver_companies_select_auth" on driver_companies
  for select using (auth.role() = 'authenticated');
drop policy if exists "driver_companies_update_auth" on driver_companies;
create policy "driver_companies_update_auth" on driver_companies
  for update using (auth.role() = 'authenticated');

drop policy if exists "driver_job_postings_select_auth" on driver_job_postings;
create policy "driver_job_postings_select_auth" on driver_job_postings
  for select using (auth.role() = 'authenticated');
drop policy if exists "driver_job_postings_update_auth" on driver_job_postings;
create policy "driver_job_postings_update_auth" on driver_job_postings
  for update using (auth.role() = 'authenticated');

-- anon / authenticated からの insert ポリシーは意図的に作らない。
-- ポリシーが無い操作は拒否されるため、匿名の直接書き込みは不可能になる。
