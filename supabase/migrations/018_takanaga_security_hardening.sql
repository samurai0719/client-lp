-- ============================================================
-- 高長建設 CRM のセキュリティ強化
-- Supabase SQL Editor で実行してください。
-- ============================================================
--
-- 背景:
--   顧客系テーブルのRLSは「ログイン済みなら全件読み書き可」だった。
--   Supabase の新規登録が有効な間は、誰でもアカウントを作って
--   公開されている anon key で顧客情報へ直接アクセスできてしまう。
--
--   アプリの読み書きはすべてサーバー側APIが service role で行い、
--   service role は RLS を迂回する。ブラウザからテーブルは参照していないため、
--   ユーザートークンからの直接アクセスは一切許可しない（006 と同じ方針）。
-- ============================================================

drop policy if exists "customers_all_auth" on customers;
drop policy if exists "leads_all_auth" on leads;
drop policy if exists "lead_images_all_auth" on lead_images;
drop policy if exists "lead_activities_all_auth" on lead_activities;
drop policy if exists "lead_notes_all_auth" on lead_notes;
drop policy if exists "lead_attribution_all_auth" on lead_attribution;
drop policy if exists "ad_expenses_all_auth" on ad_expenses;
drop policy if exists "audit_logs_select_auth" on audit_logs;
drop policy if exists "notification_logs_select_auth" on notification_logs;

-- プロフィールの更新もサーバー側のみとする
drop policy if exists "profiles_update_own" on profiles;

-- 顧客の添付写真も service role（サーバーが発行する署名付きURL）経由のみ
drop policy if exists "lead_images_read" on storage.objects;
drop policy if exists "lead_images_insert" on storage.objects;
drop policy if exists "lead_images_delete" on storage.objects;

-- ── レート制限（lib/security/rateLimit.ts） ─────────────────────
create table if not exists api_rate_limits (
  key text primary key,
  count integer not null,
  reset_at timestamptz not null
);

alter table api_rate_limits enable row level security;

-- 窓内の累計回数を返す（上限との比較はアプリ側）
create or replace function check_rate_limit(p_key text, p_window_seconds integer)
returns integer language plpgsql security definer set search_path = '' as $$
declare
  current_count integer;
begin
  -- 期限切れの行が溜まらないよう、呼び出しのついでに少しずつ掃除する
  if random() < 0.01 then
    delete from public.api_rate_limits where reset_at < now();
  end if;

  insert into public.api_rate_limits as r (key, count, reset_at)
  values (p_key, 1, now() + make_interval(secs => p_window_seconds))
  on conflict (key) do update set
    count = case when r.reset_at <= now() then 1 else r.count + 1 end,
    reset_at = case when r.reset_at <= now() then excluded.reset_at else r.reset_at end
  returning count into current_count;

  return current_count;
end;
$$;

revoke all on function check_rate_limit(text, integer) from public, anon, authenticated;
grant execute on function check_rate_limit(text, integer) to service_role;

-- 確認:
--   select tablename, policyname from pg_policies
--   where tablename in ('customers','leads','lead_images','lead_activities','lead_notes',
--                       'lead_attribution','ad_expenses','audit_logs','notification_logs');
--   → 0件になっていれば、ユーザートークンからは読めない状態。
