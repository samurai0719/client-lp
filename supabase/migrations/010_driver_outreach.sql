-- ============================================================
-- ドラテク 営業メール（運送会社向けアウトリーチ）
--   outreach_companies     営業先企業（自動取得・CSV・手動）
--   outreach_source_jobs   営業先の自動取得ジョブ（gBizINFO / Google Places / URL一覧）
--   email_campaigns        営業メール（テンプレート兼キャンペーン）
--   email_sends            送信キュー兼送信履歴（company_id × email × campaign_id）
--   email_suppressions     配信停止・バウンス・送信拒否のリスト
--   outreach_settings      送信速度・送信者情報（1行だけ）
--
-- Supabase SQL Editor で実行してください。
-- 007 / 008（driver_company_inquiries / driver_companies）が未適用でも実行できます。
-- ============================================================

-- ── 営業先企業 ────────────────────────────────────────────────
create table if not exists outreach_companies (
  id uuid primary key default gen_random_uuid(),

  company_name text not null,
  -- 法人名（登記上の名称。gBizINFO など公的データから取れた場合）
  corporate_name text,
  corporate_number text,
  -- 重複判定用に正規化した会社名（法人格・空白・記号を除いたもの）
  name_key text not null default '',
  contact_name text,

  prefecture text,
  city text,
  address text,
  phone text,
  -- 数字だけにした電話番号（重複判定用）
  phone_key text,

  website_url text,
  -- 公式HPのホスト名（www. を除く）。無料ホームページサービス等の共有ドメインは入れない
  domain text,
  -- 公開メールアドレス。公式HP上に掲載されている法人向けアドレスだけを入れる（推測で作らない）
  email text,
  -- そのメールアドレスが載っていたページ
  email_source_url text,
  contact_form_url text,
  company_profile_url text,

  -- 取得元: gbizinfo / google_places / url_list / csv / manual
  source text not null,
  -- 取得元側のID（法人番号・place_id など）
  source_ref text,
  source_job_id uuid,
  fetched_at timestamptz not null default now(),
  last_checked_at timestamptz,

  -- 公式HPの確認状況: pending（未確認）/ checked / no_website / failed / blocked（robots.txt で不可）
  crawl_status text not null default 'pending',
  crawl_error text,
  -- メール: unchecked / found / none
  email_status text not null default 'unchecked',
  -- HPに「広告・営業メールお断り」等の表示があった（特定電子メール法上、送信不可）
  refusal_notice boolean not null default false,

  -- 管理者の目視確認: pending（確認待ち）/ approved（送信OK）/ excluded（除外）
  review_status text not null default 'pending',
  reviewed_at timestamptz,
  -- 送信可否（管理者が手動で止めた場合など）
  send_blocked boolean not null default false,
  send_blocked_reason text,

  -- 送信状況: unsent / queued / sent / delivered / bounced / error / replied / unsubscribed
  outreach_status text not null default 'unsent',
  last_sent_at timestamptz,
  opened_at timestamptz,
  clicked_at timestamptz,
  replied_at timestamptz,
  unsubscribed_at timestamptz,
  bounced_at timestamptz,
  last_error text,

  -- 問い合わせ・契約への紐付け
  linked_inquiry_id uuid,
  linked_driver_company_id uuid,
  linked_job_posting_id uuid,
  inquired_at timestamptz,
  contracted_at timestamptz,

  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table outreach_companies drop constraint if exists outreach_companies_source_check;
alter table outreach_companies add constraint outreach_companies_source_check
  check (source in ('gbizinfo', 'google_places', 'url_list', 'csv', 'manual'));
alter table outreach_companies drop constraint if exists outreach_companies_crawl_status_check;
alter table outreach_companies add constraint outreach_companies_crawl_status_check
  check (crawl_status in ('pending', 'checked', 'no_website', 'failed', 'blocked'));
alter table outreach_companies drop constraint if exists outreach_companies_email_status_check;
alter table outreach_companies add constraint outreach_companies_email_status_check
  check (email_status in ('unchecked', 'found', 'none'));
alter table outreach_companies drop constraint if exists outreach_companies_review_status_check;
alter table outreach_companies add constraint outreach_companies_review_status_check
  check (review_status in ('pending', 'approved', 'excluded'));
alter table outreach_companies drop constraint if exists outreach_companies_outreach_status_check;
alter table outreach_companies add constraint outreach_companies_outreach_status_check
  check (outreach_status in ('unsent', 'queued', 'sent', 'delivered', 'bounced', 'error', 'replied', 'unsubscribed'));

-- 重複登録を防ぐ（メール・ドメイン・電話番号・取得元ID のどれかが同じなら同一企業）
create unique index if not exists outreach_companies_email_key
  on outreach_companies (lower(email)) where email is not null;
create unique index if not exists outreach_companies_domain_key
  on outreach_companies (domain) where domain is not null;
create unique index if not exists outreach_companies_phone_key
  on outreach_companies (phone_key) where phone_key is not null;
create unique index if not exists outreach_companies_source_ref_key
  on outreach_companies (source, source_ref) where source_ref is not null;
create index if not exists outreach_companies_name_key_idx
  on outreach_companies (name_key, prefecture);
create index if not exists outreach_companies_corporate_number_idx
  on outreach_companies (corporate_number) where corporate_number is not null;
create index if not exists outreach_companies_crawl_idx
  on outreach_companies (crawl_status, created_at);
create index if not exists outreach_companies_review_idx
  on outreach_companies (review_status, email_status, created_at);
create index if not exists outreach_companies_outreach_status_idx
  on outreach_companies (outreach_status);
create index if not exists outreach_companies_created_at_idx
  on outreach_companies (created_at desc);

-- ── 営業先の自動取得ジョブ ────────────────────────────────────
create table if not exists outreach_source_jobs (
  id uuid primary key default gen_random_uuid(),
  -- gbizinfo / google_places / url_list
  source text not null,
  -- 検索条件（都道府県・キーワード・URL一覧など）
  params jsonb not null default '{}'::jsonb,
  -- 進捗位置（何番目の条件の何ページ目か）
  cursor jsonb not null default '{}'::jsonb,
  -- queued / running / paused / completed / failed / cancelled
  status text not null default 'queued',
  found_count integer not null default 0,
  inserted_count integer not null default 0,
  duplicate_count integer not null default 0,
  last_error text,
  locked_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  finished_at timestamptz
);

alter table outreach_source_jobs drop constraint if exists outreach_source_jobs_status_check;
alter table outreach_source_jobs add constraint outreach_source_jobs_status_check
  check (status in ('queued', 'running', 'paused', 'completed', 'failed', 'cancelled'));
create index if not exists outreach_source_jobs_status_idx
  on outreach_source_jobs (status, created_at);

-- ── 営業メール（キャンペーン） ────────────────────────────────
create table if not exists email_campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subject text not null,
  body text not null,
  landing_page_url text not null,
  -- 送信対象の絞り込み（都道府県など）
  target jsonb not null default '{}'::jsonb,
  -- draft / test_sending / test_completed / sending / paused / completed / cancelled
  status text not null default 'draft',
  -- 一時停止から再開したときに戻す状態（test_sending / sending）
  resume_status text,
  test_size integer not null default 100,
  test_started_at timestamptz,
  test_completed_at timestamptz,
  rest_started_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table email_campaigns drop constraint if exists email_campaigns_status_check;
alter table email_campaigns add constraint email_campaigns_status_check
  check (status in ('draft', 'test_sending', 'test_completed', 'sending', 'paused', 'completed', 'cancelled'));
create index if not exists email_campaigns_created_at_idx
  on email_campaigns (created_at desc);

-- ── 送信キュー兼送信履歴 ──────────────────────────────────────
create table if not exists email_sends (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references email_campaigns (id) on delete cascade,
  company_id uuid not null references outreach_companies (id) on delete cascade,
  email text not null,
  -- test（初回テスト）/ rest（残り）
  batch text not null default 'rest',
  -- queued（送信待ち）/ sending（送信中）/ sent（送信成功）/ delivered（配信成功）
  -- bounced / failed（エラー）/ cancelled / skipped（送信直前に除外）
  status text not null default 'queued',
  -- 配信停止・クリック計測用のランダムトークン（推測できないID）
  token text not null default replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', ''),
  provider text,
  provider_message_id text,
  -- 実際に送った件名・本文（後から文面を確認できるように残す）
  rendered_subject text,
  rendered_body text,
  queued_at timestamptz not null default now(),
  claimed_at timestamptz,
  sent_at timestamptz,
  delivered_at timestamptz,
  opened_at timestamptz,
  clicked_at timestamptz,
  click_count integer not null default 0,
  replied_at timestamptz,
  bounced_at timestamptz,
  bounce_type text,
  unsubscribed_at timestamptz,
  complained_at timestamptz,
  error_message text,
  created_at timestamptz not null default now()
);

alter table email_sends drop constraint if exists email_sends_status_check;
alter table email_sends add constraint email_sends_status_check
  check (status in ('queued', 'sending', 'sent', 'delivered', 'bounced', 'failed', 'cancelled', 'skipped'));
alter table email_sends drop constraint if exists email_sends_batch_check;
alter table email_sends add constraint email_sends_batch_check
  check (batch in ('test', 'rest'));

-- 同じキャンペーンで同じアドレス・同じ企業へ二度送らない
create unique index if not exists email_sends_campaign_email_key
  on email_sends (campaign_id, lower(email));
create unique index if not exists email_sends_campaign_company_key
  on email_sends (campaign_id, company_id);
create unique index if not exists email_sends_token_key on email_sends (token);
create index if not exists email_sends_queue_idx on email_sends (status, queued_at);
create index if not exists email_sends_claimed_at_idx on email_sends (claimed_at) where claimed_at is not null;
create index if not exists email_sends_company_idx on email_sends (company_id);
create index if not exists email_sends_provider_id_idx on email_sends (provider_message_id) where provider_message_id is not null;

-- ── 配信停止リスト ────────────────────────────────────────────
create table if not exists email_suppressions (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  -- unsubscribe（配信停止）/ hard_bounce / complaint（迷惑メール報告）
  -- refused（送信拒否の申し出）/ site_refusal（HPに営業メールお断りの表示）/ manual
  reason text not null,
  note text,
  created_at timestamptz not null default now()
);
create unique index if not exists email_suppressions_email_key on email_suppressions (lower(email));

-- ── 設定（1行だけ） ───────────────────────────────────────────
create table if not exists outreach_settings (
  id integer primary key default 1 check (id = 1),
  per_minute integer not null default 10,
  per_hour integer not null default 200,
  per_day integer not null default 100,
  -- 同じ企業へ別のキャンペーンを送るまでの最低日数
  min_days_between_campaigns integer not null default 30,
  sender_name text not null default '',
  sender_address text not null default '',
  sender_email text not null default '',
  sender_phone text not null default '',
  updated_at timestamptz not null default now()
);
insert into outreach_settings (id) values (1) on conflict (id) do nothing;

-- ── 送信キューへの投入 ────────────────────────────────────────
-- 送信対象の判定をDB側で一括して行う（数千件でも1回のSQLで済ませるため）。
--   p_batch = 'test' … 管理者が「送信OK」にした企業だけ（目視確認なしでは送らない）
--   p_batch = 'rest' … 「除外」以外の企業
-- 共通で除外するもの：メールなし・HPに送信お断り表示・手動停止・配信停止/バウンス/返信済み・
-- 配信停止リスト掲載・このキャンペーンで送信済み・別キャンペーンで最近送ったばかり
create or replace function outreach_enqueue(p_campaign_id uuid, p_batch text, p_limit integer)
returns integer
language plpgsql
as $$
declare
  v_target jsonb;
  v_prefs text[];
  v_min_days integer;
  v_count integer;
begin
  select target into v_target from email_campaigns where id = p_campaign_id;
  if not found then
    raise exception 'campaign not found';
  end if;
  select min_days_between_campaigns into v_min_days from outreach_settings where id = 1;
  v_min_days := coalesce(v_min_days, 30);

  if jsonb_typeof(v_target -> 'prefectures') = 'array' and jsonb_array_length(v_target -> 'prefectures') > 0 then
    select array_agg(x) into v_prefs from jsonb_array_elements_text(v_target -> 'prefectures') as x;
  end if;

  with candidates as (
    select distinct on (lower(c.email)) c.id, c.email, c.reviewed_at, c.created_at
    from outreach_companies c
    where c.email is not null
      and c.email_status = 'found'
      and c.refusal_notice = false
      and c.send_blocked = false
      and c.outreach_status not in ('bounced', 'unsubscribed', 'replied')
      and c.contracted_at is null
      and (case when p_batch = 'test' then c.review_status = 'approved' else c.review_status <> 'excluded' end)
      and (v_prefs is null or c.prefecture = any (v_prefs))
      and not exists (select 1 from email_suppressions s where lower(s.email) = lower(c.email))
      and not exists (
        select 1 from email_sends e
        where e.campaign_id = p_campaign_id and (e.company_id = c.id or lower(e.email) = lower(c.email))
      )
      and not exists (
        select 1 from email_sends e
        where e.campaign_id <> p_campaign_id
          and (e.company_id = c.id or lower(e.email) = lower(c.email))
          and e.status in ('queued', 'sending', 'sent', 'delivered')
          and coalesce(e.sent_at, e.queued_at) > now() - make_interval(days => v_min_days)
      )
    order by lower(c.email), c.reviewed_at nulls last, c.created_at
  ), picked as (
    select * from candidates
    order by reviewed_at nulls last, created_at
    limit p_limit
  ), inserted as (
    insert into email_sends (campaign_id, company_id, email, batch, status)
    select p_campaign_id, picked.id, lower(picked.email), p_batch, 'queued' from picked
    on conflict do nothing
    returning company_id
  ), marked as (
    update outreach_companies c set outreach_status = 'queued', updated_at = now()
    from inserted where c.id = inserted.company_id and c.outreach_status = 'unsent'
    returning c.id
  )
  select count(*) into v_count from inserted;
  return v_count;
end;
$$;

-- 投入予定件数（確認画面に「残り◯件に送信します」と出すため）
create or replace function outreach_count_eligible(p_campaign_id uuid, p_batch text)
returns integer
language plpgsql
stable
as $$
declare
  v_target jsonb;
  v_prefs text[];
  v_min_days integer;
  v_count integer;
begin
  select target into v_target from email_campaigns where id = p_campaign_id;
  select min_days_between_campaigns into v_min_days from outreach_settings where id = 1;
  v_min_days := coalesce(v_min_days, 30);
  if jsonb_typeof(v_target -> 'prefectures') = 'array' and jsonb_array_length(v_target -> 'prefectures') > 0 then
    select array_agg(x) into v_prefs from jsonb_array_elements_text(v_target -> 'prefectures') as x;
  end if;

  select count(distinct lower(c.email)) into v_count
  from outreach_companies c
  where c.email is not null
    and c.email_status = 'found'
    and c.refusal_notice = false
    and c.send_blocked = false
    and c.outreach_status not in ('bounced', 'unsubscribed', 'replied')
    and c.contracted_at is null
    and (case when p_batch = 'test' then c.review_status = 'approved' else c.review_status <> 'excluded' end)
    and (v_prefs is null or c.prefecture = any (v_prefs))
    and not exists (select 1 from email_suppressions s where lower(s.email) = lower(c.email))
    and not exists (
      select 1 from email_sends e
      where e.campaign_id = p_campaign_id and (e.company_id = c.id or lower(e.email) = lower(c.email))
    )
    and not exists (
      select 1 from email_sends e
      where e.campaign_id <> p_campaign_id
        and (e.company_id = c.id or lower(e.email) = lower(c.email))
        and e.status in ('queued', 'sending', 'sent', 'delivered')
        and coalesce(e.sent_at, e.queued_at) > now() - make_interval(days => v_min_days)
    );
  return v_count;
end;
$$;

-- ── 送信キューからの取り出し（レート制限つき） ─────────────────
-- 複数の実行（cron と管理画面）が同時に呼んでも、advisory lock で直列化し、
-- 直近1分・1時間・24時間の送信数（送信中を含む）が上限を超えないぶんだけ取り出す。
-- 上限値はアプリ側で「管理画面の設定」と「メール配信サービスの上限（環境変数）」の
-- 小さいほうに丸めてから渡す。
create or replace function outreach_claim_sends(
  p_max integer, p_per_minute integer, p_per_hour integer, p_per_day integer
)
returns setof email_sends
language plpgsql
as $$
declare
  v_min integer;
  v_hour integer;
  v_day integer;
  v_allow integer;
begin
  perform pg_advisory_xact_lock(hashtext('outreach_claim_sends'));

  select
    count(*) filter (where claimed_at > now() - interval '1 minute'),
    count(*) filter (where claimed_at > now() - interval '1 hour'),
    count(*)
  into v_min, v_hour, v_day
  from email_sends
  where claimed_at > now() - interval '24 hours'
    and status not in ('queued', 'cancelled', 'skipped');

  v_allow := least(p_max, p_per_minute - v_min, p_per_hour - v_hour, p_per_day - v_day);
  if v_allow is null or v_allow <= 0 then
    return;
  end if;

  return query
  update email_sends e
  set status = 'sending', claimed_at = now()
  where e.id in (
    select s.id
    from email_sends s
    join email_campaigns c on c.id = s.campaign_id
    where s.status = 'queued'
      and (
        (c.status = 'test_sending' and s.batch = 'test')
        or (c.status = 'sending')
      )
    order by s.batch = 'test' desc, s.queued_at, s.id
    limit v_allow
    for update of s skip locked
  )
  returning e.*;
end;
$$;

-- ── 「送信待ち」のまま残った企業の状態を戻す ─────────────────
-- 送信中止・送信直前の除外などで、実際には送られなかった企業を「未送信」に戻す。
create or replace function outreach_fix_queued_status()
returns integer
language sql
as $$
  with fixed as (
    update outreach_companies c
    set outreach_status = case when c.last_sent_at is null then 'unsent' else 'sent' end,
        updated_at = now()
    where c.outreach_status = 'queued'
      and not exists (
        select 1 from email_sends e
        where e.company_id = c.id and e.status in ('queued', 'sending')
      )
    returning 1
  )
  select count(*)::integer from fixed;
$$;

-- ── RLS ─────────────────────────────────────────────────────
-- 他のテーブルと同じ方針。ブラウザからは一切読み書きさせず、
-- 管理画面のAPI（adofy 管理者のみ）が service role キーで操作する。
-- ポリシーを1つも作らないため、anon / authenticated からは読み書きできない。
alter table outreach_companies enable row level security;
alter table outreach_source_jobs enable row level security;
alter table email_campaigns enable row level security;
alter table email_sends enable row level security;
alter table email_suppressions enable row level security;
alter table outreach_settings enable row level security;

revoke all on function outreach_enqueue(uuid, text, integer) from public, anon, authenticated;
revoke all on function outreach_count_eligible(uuid, text) from public, anon, authenticated;
revoke all on function outreach_fix_queued_status() from public, anon, authenticated;
revoke all on function outreach_claim_sends(integer, integer, integer, integer) from public, anon, authenticated;
