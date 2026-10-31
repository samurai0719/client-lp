-- ============================================================
-- 建設職人の無料登録（/shokunin-entry）
--   ドラテクの driver_candidates とは別テーブル。データを混ぜない。
-- Supabase SQL Editor で実行してください。何度実行しても問題ありません。
--
-- 企業に見せてよいのは匿名プロフィールだけ
-- （年代・居住都道府県・経験職種・経験年数・保有資格・希望職種・希望勤務地・希望年収・転職希望時期）。
-- 氏名・電話・メール・市区町村以下の住所は、本人の同意前に企業へ見せない。
-- ============================================================

create table if not exists shokunin_candidates (
  id uuid primary key default gen_random_uuid(),

  -- pending = 登録直後（企業には非公開）
  status text not null default 'pending',

  motivation text not null,
  desired_timing text not null,
  experienced_trades text[] not null default '{}',
  experience_years text not null,
  qualifications text[] not null default '{}',
  desired_trades text[] not null default '{}',
  employment_status text not null,
  postal_code text,
  current_prefecture text not null,
  current_city text,
  desired_area text not null,
  desired_prefecture text,
  top_priority text not null,
  desired_salary text not null,

  -- 個人を特定できる情報
  name text not null,
  birth_year integer not null,
  phone text not null,               -- 数字のみに正規化して保存
  email text,
  contact_time text,
  comment text,
  privacy_consent_at timestamptz not null,

  -- 流入計測
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  fbclid text,
  fbc text,
  fbp text,
  referrer text,
  landing_url text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table shokunin_candidates drop constraint if exists shokunin_candidates_status_check;
alter table shokunin_candidates
  add constraint shokunin_candidates_status_check
  check (status in ('pending', 'published', 'paused', 'hired', 'withdrawn'));

-- 同じ電話番号の二重登録を防ぐ（連打・同時送信でも1件になる）
create unique index if not exists shokunin_candidates_phone_active_idx
  on shokunin_candidates (phone) where status <> 'withdrawn';
create index if not exists shokunin_candidates_created_at_idx on shokunin_candidates (created_at desc);

-- ── RLS ─────────────────────────────────────────────────────
-- ポリシーは作らない。読み書きはサーバー側（service role）だけが行う。
alter table shokunin_candidates enable row level security;
revoke all on table shokunin_candidates from anon, authenticated;
grant all on table shokunin_candidates to service_role;
