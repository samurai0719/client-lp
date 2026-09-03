-- ============================================================
-- adofy のデータを高長建設の管理画面から分離する
-- Supabase SQL Editor で実行してください
-- ============================================================
--
-- 背景:
--   高長建設の管理画面(/admin)には提携先の外構業者もログインする。
--   これまで consultations のRLSは「ログイン済みなら誰でも閲覧可」
--   （auth.role() = 'authenticated'）だったため、
--   提携先から adofy の見込み客が見えてしまう状態だった。
--
--   そこで profiles.adofy_access を追加し、
--   この権限を持つユーザーだけが adofy のデータを扱えるようにする。
-- ============================================================

-- ── 1. 権限カラムを追加（既定は false = 見えない） ──────────
alter table profiles add column if not exists adofy_access boolean not null default false;

-- ── 2. adofy運営者にだけ権限を付与 ──────────────────────────
-- ※ 付与するアドレスはここで指定する。増やす場合は in (...) に追記する。
update profiles p
set adofy_access = true
from auth.users u
where u.id = p.id
  and u.email in ('info@tenshoku-gpt.com');

-- ── 3. 判定用の関数 ─────────────────────────────────────────
create or replace function has_adofy_access()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select adofy_access from profiles where id = auth.uid()),
    false
  );
$$;

-- ── 4. consultations のRLSを権限ベースに張り替える ──────────
drop policy if exists "consultations_select_auth" on consultations;
drop policy if exists "consultations_update_auth" on consultations;

create policy "consultations_select_adofy" on consultations
  for select using (has_adofy_access());

create policy "consultations_update_adofy" on consultations
  for update using (has_adofy_access());

-- ── 5. 対応履歴も同じ条件にする ─────────────────────────────
drop policy if exists "consultation_activities_select_auth" on consultation_activities;
drop policy if exists "consultation_activities_insert_auth" on consultation_activities;
drop policy if exists "consultation_activities_delete_auth" on consultation_activities;

create policy "consultation_activities_select_adofy" on consultation_activities
  for select using (has_adofy_access());

create policy "consultation_activities_insert_adofy" on consultation_activities
  for insert with check (has_adofy_access());

create policy "consultation_activities_delete_adofy" on consultation_activities
  for delete using (has_adofy_access());

-- ── 確認 ────────────────────────────────────────────────────
-- 実行後、下記で権限を持つユーザーを確認できる:
--   select u.email, p.adofy_access from profiles p join auth.users u on u.id = p.id;
