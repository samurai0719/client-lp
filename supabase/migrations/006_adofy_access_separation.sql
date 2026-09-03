-- ============================================================
-- adofy のデータを直接アクセスから守る
-- Supabase SQL Editor で実行してください（任意・推奨）
-- ============================================================
--
-- 背景:
--   consultations のRLSは「ログイン済みなら誰でも閲覧可」だった。
--   高長建設の管理画面には提携先の外構業者もログインするため、
--   その人たちのトークンで adofy の見込み客を直接読めてしまう。
--
--   アプリからの読み書きはすべてサーバー側APIが service role で行い、
--   service role は RLS を迂回する。したがって
--   「ユーザートークンからの直接アクセスは一切許可しない」のが最も安全。
--   ポリシーが1つも無い操作は拒否されるため、許可ポリシーを削除するだけでよい。
-- ============================================================

drop policy if exists "consultations_select_auth" on consultations;
drop policy if exists "consultations_update_auth" on consultations;
drop policy if exists "consultations_select_adofy" on consultations;
drop policy if exists "consultations_update_adofy" on consultations;

drop policy if exists "consultation_activities_select_auth" on consultation_activities;
drop policy if exists "consultation_activities_insert_auth" on consultation_activities;
drop policy if exists "consultation_activities_delete_auth" on consultation_activities;

-- RLS自体は有効なままにする（ポリシーが無い＝全拒否）
alter table consultations enable row level security;
alter table consultation_activities enable row level security;

-- 確認:
--   select tablename, policyname from pg_policies
--   where tablename in ('consultations','consultation_activities');
--   → 0件になっていれば、匿名・一般ログインからは読めない状態。
