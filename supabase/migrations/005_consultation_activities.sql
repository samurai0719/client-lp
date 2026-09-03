-- ============================================================
-- adofy 無料相談 — 対応履歴・メモ
-- Supabase SQL Editor で実行してください
-- ============================================================

-- 1件の相談に対する「やったこと」と「メモ」を時系列で残す。
-- 高長建設CRMでは lead_activities と lead_notes に分かれているが、
-- adofy側は種別カラムで区別する1テーブルにまとめる（画面が1つの時系列で足りるため）。
create table if not exists consultation_activities (
  id uuid primary key default gen_random_uuid(),
  consultation_id uuid not null references consultations(id) on delete cascade,

  -- note        : 自由メモ
  -- call        : 電話した
  -- email       : メールを送った
  -- meeting     : 打ち合わせ・オンライン相談
  -- quote       : 見積を送った
  -- status      : ステータスを変更した（自動記録）
  activity_type text not null default 'note',

  content text not null,

  -- 誰が記録したか（管理者アカウント）
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table consultation_activities
  drop constraint if exists consultation_activities_type_check;
alter table consultation_activities
  add constraint consultation_activities_type_check
  check (activity_type in ('note', 'call', 'email', 'meeting', 'quote', 'status'));

create index if not exists consultation_activities_consultation_idx
  on consultation_activities (consultation_id, created_at desc);

-- ── RLS ─────────────────────────────────────────────────────
-- 相談本体と同じ方針。ブラウザからの直接操作は許可せず、
-- 参照・追加は管理画面にログインしたユーザーのみ。
-- 書き込みは実際にはサーバー側APIが service role で行う。
alter table consultation_activities enable row level security;

drop policy if exists "consultation_activities_select_auth" on consultation_activities;
create policy "consultation_activities_select_auth" on consultation_activities
  for select using (auth.role() = 'authenticated');

drop policy if exists "consultation_activities_insert_auth" on consultation_activities;
create policy "consultation_activities_insert_auth" on consultation_activities
  for insert with check (auth.role() = 'authenticated');

drop policy if exists "consultation_activities_delete_auth" on consultation_activities;
create policy "consultation_activities_delete_auth" on consultation_activities
  for delete using (auth.role() = 'authenticated');

-- ── 相談本体に「次にやること」を持たせる ────────────────────
-- 予定管理（別途実装予定）とも共有する項目。
alter table consultations add column if not exists next_action text;
alter table consultations add column if not exists next_action_at timestamptz;

create index if not exists consultations_next_action_at_idx
  on consultations (next_action_at)
  where next_action_at is not null;
