-- ============================================================
-- 高長建設 顧客管理CRM — Supabaseマイグレーション
-- Supabase SQL Editor で実行してください
-- ============================================================

-- ── profiles ────────────────────────────────────────────────
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'admin',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── customers ───────────────────────────────────────────────
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  phone_normalized text not null,
  email text,
  postal_code text,
  prefecture text,
  city text,
  address text,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists customers_phone_normalized_idx on customers(phone_normalized);

-- ── leads ───────────────────────────────────────────────────
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete cascade,
  status text not null default 'new' check (status in (
    'new','uncontacted','contacted',
    'site_visit_scheduled','site_visit_completed',
    'estimating','estimate_sent','considering',
    'contracted','under_construction','completed',
    'lost','no_action'
  )),
  work_types text[] not null default '{}',
  design_style text,
  inquiry_message text,
  estimated_amount integer,
  quoted_amount integer,
  contract_amount integer,
  next_action_at timestamptz,
  assigned_user_id uuid references profiles(id),
  source text,
  lost_reason text,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_status_idx on leads(status);
create index if not exists leads_created_at_idx on leads(created_at desc);

-- ── lead_images ─────────────────────────────────────────────
create table if not exists lead_images (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  image_type text not null check (image_type in (
    'original','generated','estimate','construction','completion','other'
  )),
  storage_path text not null,
  original_filename text,
  mime_type text,
  file_size integer,
  created_at timestamptz not null default now()
);

-- ── lead_activities ─────────────────────────────────────────
create table if not exists lead_activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  activity_type text not null check (activity_type in (
    'inquiry_received','call','email','note','status_changed',
    'site_visit','estimate','contract','construction','other'
  )),
  content text not null,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

-- ── lead_notes ──────────────────────────────────────────────
create table if not exists lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  content text not null,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── lead_attribution ────────────────────────────────────────
create table if not exists lead_attribution (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null unique references leads(id) on delete cascade,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  fbclid text,
  gclid text,
  ttclid text,
  landing_page text,
  referrer text,
  device_type text,
  user_agent text,
  created_at timestamptz not null default now()
);

-- ── ad_expenses ─────────────────────────────────────────────
create table if not exists ad_expenses (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  platform text not null check (platform in ('meta','google','tiktok','other')),
  campaign_name text,
  amount integer not null,
  memo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── audit_logs ──────────────────────────────────────────────
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  action text not null,
  target_type text,
  target_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- ── push_subscriptions ──────────────────────────────────────
create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  user_agent text,
  device_name text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── notification_logs ───────────────────────────────────────
create table if not exists notification_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  lead_id uuid references leads(id) on delete cascade,
  notification_type text not null,
  scheduled_key text,
  sent_at timestamptz not null default now(),
  status text not null,
  error_message text
);

create index if not exists notification_logs_dedup_idx
  on notification_logs(lead_id, notification_type, scheduled_key);

-- ============================================================
-- RLS（Row Level Security）
-- ============================================================

alter table profiles enable row level security;
alter table customers enable row level security;
alter table leads enable row level security;
alter table lead_images enable row level security;
alter table lead_activities enable row level security;
alter table lead_notes enable row level security;
alter table lead_attribution enable row level security;
alter table ad_expenses enable row level security;
alter table audit_logs enable row level security;
alter table push_subscriptions enable row level security;
alter table notification_logs enable row level security;

-- profiles: 本人のみ参照・更新
create policy "profiles_select_own" on profiles
  for select using (auth.uid() = id);
create policy "profiles_update_own" on profiles
  for update using (auth.uid() = id);

-- customers: 認証済みユーザーのみ全操作
create policy "customers_all_auth" on customers
  for all using (auth.role() = 'authenticated');

-- leads: 認証済みユーザーのみ全操作
create policy "leads_all_auth" on leads
  for all using (auth.role() = 'authenticated');

-- lead_images: 認証済みユーザーのみ全操作
create policy "lead_images_all_auth" on lead_images
  for all using (auth.role() = 'authenticated');

-- lead_activities: 認証済みユーザーのみ全操作
create policy "lead_activities_all_auth" on lead_activities
  for all using (auth.role() = 'authenticated');

-- lead_notes: 認証済みユーザーのみ全操作
create policy "lead_notes_all_auth" on lead_notes
  for all using (auth.role() = 'authenticated');

-- lead_attribution: 認証済みユーザーのみ全操作
create policy "lead_attribution_all_auth" on lead_attribution
  for all using (auth.role() = 'authenticated');

-- ad_expenses: 認証済みユーザーのみ全操作
create policy "ad_expenses_all_auth" on ad_expenses
  for all using (auth.role() = 'authenticated');

-- audit_logs: 認証済みユーザーは参照のみ（書き込みはservice role）
create policy "audit_logs_select_auth" on audit_logs
  for select using (auth.role() = 'authenticated');

-- push_subscriptions: 本人のみ操作
create policy "push_subscriptions_own" on push_subscriptions
  for all using (auth.uid() = user_id);

-- notification_logs: 認証済みユーザーのみ参照
create policy "notification_logs_select_auth" on notification_logs
  for select using (auth.role() = 'authenticated');

-- Storage bucket: lead-images（private）
-- バケット本体とRLSポリシーの作成は 003_lead_images_storage_bucket.sql で行う。

-- ============================================================
-- profiles への INSERT は Supabase Auth の trigger で自動作成する
-- ============================================================
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, role)
  values (new.id, new.raw_user_meta_data->>'display_name', 'admin')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
