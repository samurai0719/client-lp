-- ============================================================
-- lead-images ストレージバケットの作成
--
-- 001_initial.sql では lead_images テーブルのみ作成し、実体である
-- Supabase Storage バケットの作成SQLはコメントアウトされたままだった。
-- そのため、問い合わせフォームの写真添付機能は実装されていても
-- アップロード先のバケットが存在せず保存できなかった。
-- このマイグレーションでバケットとRLSポリシーを実際に作成する。
--
-- 適用方法: Supabaseダッシュボード > SQL Editor でこのファイルの内容を実行してください。
-- ============================================================

insert into storage.buckets (id, name, public)
values ('lead-images', 'lead-images', false)
on conflict (id) do nothing;

-- 参照: 管理画面の認証済みユーザーのみ（署名付きURL経由で取得）
drop policy if exists "lead_images_read" on storage.objects;
create policy "lead_images_read" on storage.objects
  for select using (bucket_id = 'lead-images' and auth.role() = 'authenticated');

-- アップロード: サーバー側（service_role、= 各お問い合わせAPI）のみ
drop policy if exists "lead_images_insert" on storage.objects;
create policy "lead_images_insert" on storage.objects
  for insert with check (bucket_id = 'lead-images' and auth.role() = 'service_role');

-- 削除: 管理画面の認証済みユーザーのみ
drop policy if exists "lead_images_delete" on storage.objects;
create policy "lead_images_delete" on storage.objects
  for delete using (bucket_id = 'lead-images' and auth.role() = 'authenticated');
