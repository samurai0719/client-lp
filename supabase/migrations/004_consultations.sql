-- ============================================================
-- adofy 無料相談フォーム — consultations テーブル
-- Supabase SQL Editor で実行してください
-- ============================================================

create table if not exists consultations (
  id uuid primary key default gen_random_uuid(),

  -- STEP 1: 事業形態
  business_type text,

  -- STEP 2: 会社情報
  company_name text not null,
  contact_name text not null,
  position text,
  prefecture text not null,
  city text,

  -- STEP 3: 業種（複数選択）
  industries text[] not null default '{}',
  industry_other text,

  -- STEP 4: 現在のホームページ
  has_website text,
  website_url text,

  -- STEP 5: 相談内容（複数選択）
  consultation_topics text[] not null default '{}',
  consultation_other text,

  -- STEP 6: 現在のお悩み（複数選択）
  current_problems text[] not null default '{}',
  problem_other text,

  -- STEP 7: 希望プラン
  selected_plan text,

  -- STEP 8: 希望時期
  desired_timing text,

  -- STEP 9: 連絡先
  phone text,
  email text,
  preferred_contact_method text,
  preferred_contact_time text,

  -- 同意
  consented_at timestamptz,

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

-- 電話・メールのどちらか一方は必ず入っている状態を DB 側でも担保する
alter table consultations
  drop constraint if exists consultations_contact_required;
alter table consultations
  add constraint consultations_contact_required
  check (
    (phone is not null and length(btrim(phone)) > 0)
    or (email is not null and length(btrim(email)) > 0)
  );

alter table consultations
  drop constraint if exists consultations_status_check;
alter table consultations
  add constraint consultations_status_check
  check (status in ('new', 'contacted', 'in_progress', 'won', 'lost', 'spam'));

create index if not exists consultations_created_at_idx on consultations (created_at desc);
create index if not exists consultations_status_idx on consultations (status);
create index if not exists consultations_utm_source_idx on consultations (utm_source);

-- ── RLS ─────────────────────────────────────────────────────
-- ブラウザからは一切読み書きさせない。
-- 保存はサーバー側APIが service role キーで行う（service role は RLS を迂回する）。
-- 参照は管理画面のログインユーザーのみ。
alter table consultations enable row level security;

drop policy if exists "consultations_select_auth" on consultations;
create policy "consultations_select_auth" on consultations
  for select using (auth.role() = 'authenticated');

drop policy if exists "consultations_update_auth" on consultations;
create policy "consultations_update_auth" on consultations
  for update using (auth.role() = 'authenticated');

-- anon / authenticated からの insert ポリシーは意図的に作らない。
-- ポリシーが無い操作は拒否されるため、匿名の直接書き込みは不可能になる。
