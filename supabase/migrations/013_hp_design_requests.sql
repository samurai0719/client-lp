-- ============================================================
-- adofy 無料ホームページデザイン（チャットボット申し込み）
-- Supabase SQL Editor で実行してください
-- ============================================================
--
-- お客様がチャットで答えたヒアリング内容を保存し、
-- 運営者が管理画面（/adofy-admin/hp-design）でデザイン制作〜送付を管理する。
-- 既存の consultations（無料相談フォーム）とは別テーブルにする。

create table if not exists hp_design_requests (
  id uuid primary key default gen_random_uuid(),

  -- 二重送信防止：ブラウザが申し込みごとに1つ発行するID。同じIDの送信は1件にまとめる
  client_submission_id text not null unique,
  -- 「このデザインで購入を希望する」リンク用の推測できないトークン
  public_token text not null unique,

  -- Q1 業種
  industry text not null,
  industry_other text,
  -- 業種の詳しい種類（例：建設・工事 → 外壁・屋根塗装）
  industry_detail text,
  -- Q2 会社名・店舗名（未定可）
  company_name text,
  company_undecided boolean not null default false,
  -- Q3 目的（複数）
  purposes text[] not null default '{}',
  purpose_other text,
  -- Q4 デザインの雰囲気
  design_style text not null,
  -- Q5 メインカラー
  main_color text not null,
  color_other text,
  -- Q6 掲載したい内容（複数）
  contents text[] not null default '{}',
  content_other text,
  -- Q7 現在のホームページ
  has_website text not null,
  website_url text,
  -- Q8 参考サイト
  reference_choice text not null,
  reference_urls text[] not null default '{}',
  -- Q9 写真・ロゴ
  assets_choice text not null,
  -- [{ path, name, size, type }]（実体は Storage の hp-design-uploads バケット）
  uploaded_files jsonb not null default '[]'::jsonb,
  -- Q10 その他の希望
  other_requests text,

  -- 連絡先
  contact_name text not null,
  email text not null,
  phone text,
  consented_at timestamptz not null,

  -- 流入計測
  referrer text,
  landing_page text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  device_type text,

  -- 対応管理
  status text not null default 'new',
  admin_memo text,
  preview_url text,

  -- 申し込み時の自動メール（none / sent / failed）
  customer_ack_status text not null default 'none',
  admin_notice_status text not null default 'none',

  -- デザイン送付メール（none / sending / sent / failed）
  design_email_status text not null default 'none',
  design_email_locked_at timestamptz,
  design_email_sent_at timestamptz,
  design_email_count integer not null default 0,
  design_email_error text,

  -- お客様が「このデザインで購入を希望する」を押した日時（契約ではなく意思表示）
  purchase_requested_at timestamptz,
  purchase_message text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table hp_design_requests drop constraint if exists hp_design_requests_status_check;
alter table hp_design_requests add constraint hp_design_requests_status_check
  check (status in ('new', 'in_production', 'design_ready', 'sent', 'purchased', 'declined'));

alter table hp_design_requests drop constraint if exists hp_design_requests_design_email_status_check;
alter table hp_design_requests add constraint hp_design_requests_design_email_status_check
  check (design_email_status in ('none', 'sending', 'sent', 'failed'));

create index if not exists hp_design_requests_created_at_idx on hp_design_requests (created_at desc);
create index if not exists hp_design_requests_status_idx on hp_design_requests (status);
create index if not exists hp_design_requests_email_idx on hp_design_requests (lower(email));

create or replace function hp_design_requests_touch() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists hp_design_requests_touch on hp_design_requests;
create trigger hp_design_requests_touch
  before update on hp_design_requests
  for each row execute function hp_design_requests_touch();

-- ── メール送信履歴 ─────────────────────────────────────────
create table if not exists hp_design_email_logs (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references hp_design_requests(id) on delete cascade,
  -- ack: お客様への受付確認 / admin_notice: 管理者通知 / design: デザイン送付 / purchase_notice: 購入希望の管理者通知
  kind text not null,
  to_email text not null,
  status text not null,              -- sent / failed
  provider_id text,
  error text,
  created_at timestamptz not null default now()
);

create index if not exists hp_design_email_logs_request_idx
  on hp_design_email_logs (request_id, created_at desc);

-- ── RLS ─────────────────────────────────────────────────────
-- 読み書きはすべてサーバー側APIが service role で行う。
-- ポリシーを作らない＝匿名・一般ログインユーザーからは一切アクセスできない。
alter table hp_design_requests enable row level security;
alter table hp_design_email_logs enable row level security;

-- ── アップロード画像の保存先（非公開バケット） ──────────────
-- 形式とサイズはバケット側でも制限する（APIの検証と二重にする）。
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'hp-design-uploads',
  'hp-design-uploads',
  false,
  10485760,  -- 10MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- storage.objects にも許可ポリシーを作らない。
-- アップロードはAPIが発行する署名付きURL経由、閲覧は管理画面が発行する署名付きURL経由のみ。
