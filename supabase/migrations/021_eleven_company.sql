-- ============================================================
-- 株式会社イレブン様の顧客管理を追加（高長建設と同じ外構CRMを会社ごとに分ける）
-- Supabase SQL Editor で実行してください（1回だけ。2回目以降はコピー部分は何もしません）
-- ============================================================
--
-- 仕組み:
--   customers / leads / ad_expenses / profiles に company 列を追加する。
--     'takanaga' = 高長建設（既存データはすべてこれ）
--     'eleven'   = 株式会社イレブン
--   管理画面はログインした人の profiles.company の会社のデータだけを表示する。
--   LP からの新しい問い合わせは今までどおり高長建設に入る。
--
-- データコピー:
--   2026-11-26 時点の高長建設の顧客リストを、イレブン様にコピーする。
--   除外: 成約済み（contracted / under_construction / completed）と、
--         営業メールの1件（株式会社Revopp 加藤様）。
--   対応履歴・メモ・流入元・写真もいっしょにコピーする（写真は同じファイルを共有）。
--   高長建設側のデータは変更しない。
-- ============================================================

-- ── 1) 会社の列 ──────────────────────────────────────────────
alter table customers   add column if not exists company text not null default 'takanaga';
alter table leads       add column if not exists company text not null default 'takanaga';
alter table ad_expenses add column if not exists company text not null default 'takanaga';
alter table profiles    add column if not exists company text not null default 'takanaga';

do $$
declare t text;
begin
  foreach t in array array['customers','leads','ad_expenses','profiles'] loop
    if not exists (
      select 1 from pg_constraint where conname = t || '_company_check'
    ) then
      execute format(
        'alter table %I add constraint %I check (company in (''takanaga'',''eleven''))',
        t, t || '_company_check'
      );
    end if;
  end loop;
end $$;

create index if not exists leads_company_created_at_idx on leads(company, created_at desc);
create index if not exists customers_company_phone_idx on customers(company, phone_normalized);

-- 電話番号のユニーク制約は会社ごとにする（同じお客様が両社に存在できるように）
drop index if exists customers_phone_normalized_unique;
create unique index if not exists customers_company_phone_normalized_unique
  on customers (company, phone_normalized)
  where deleted_at is null
    and char_length(phone_normalized) >= 10;

-- ── 2) 直接アクセスを止める（018 と同じ。未適用でも安全側になるよう再実行） ──
-- アプリはサーバー側で service role を使うので、ログインユーザーのトークンからは何も読めなくてよい。
drop policy if exists "customers_all_auth" on customers;
drop policy if exists "leads_all_auth" on leads;
drop policy if exists "lead_images_all_auth" on lead_images;
drop policy if exists "lead_activities_all_auth" on lead_activities;
drop policy if exists "lead_notes_all_auth" on lead_notes;
drop policy if exists "lead_attribution_all_auth" on lead_attribution;
drop policy if exists "ad_expenses_all_auth" on ad_expenses;
drop policy if exists "audit_logs_select_auth" on audit_logs;
drop policy if exists "notification_logs_select_auth" on notification_logs;
drop policy if exists "profiles_update_own" on profiles;
drop policy if exists "lead_images_read" on storage.objects;
drop policy if exists "lead_images_insert" on storage.objects;
drop policy if exists "lead_images_delete" on storage.objects;

-- ── 3) 高長建設の顧客リストをイレブン様へコピー ───────────────────
do $$
begin
  -- すでにコピー済みなら何もしない
  if exists (select 1 from leads where company = 'eleven') then
    raise notice 'イレブンのデータは既にあるため、コピーは行いませんでした';
    return;
  end if;

  create temp table src_leads on commit drop as
    select l.* from leads l
    where l.company = 'takanaga'
      and l.deleted_at is null
      and l.status not in ('contracted', 'under_construction', 'completed')
      and l.id <> 'caa6b5b9-b836-4194-b329-8a198e56aef6';  -- 営業メール（株式会社Revopp 加藤様）

  create temp table map_customers on commit drop as
    select c.id as old_id, gen_random_uuid() as new_id
    from customers c
    where c.id in (select customer_id from src_leads);

  create temp table map_leads on commit drop as
    select l.id as old_id, gen_random_uuid() as new_id from src_leads l;

  insert into customers (id, company, name, phone, phone_normalized, email, postal_code,
                         prefecture, city, address, deleted_at, created_at, updated_at)
  select m.new_id, 'eleven', c.name, c.phone, c.phone_normalized, c.email, c.postal_code,
         c.prefecture, c.city, c.address, c.deleted_at, c.created_at, c.updated_at
  from customers c join map_customers m on m.old_id = c.id;

  -- 担当者は高長建設のアカウントなので外す
  insert into leads (id, company, customer_id, status, work_types, design_style, inquiry_message,
                     estimated_amount, quoted_amount, contract_amount, next_action_at, site_visit_at,
                     assigned_user_id, source, lost_reason, deleted_at, created_at, updated_at)
  select ml.new_id, 'eleven', mc.new_id, l.status, l.work_types, l.design_style, l.inquiry_message,
         l.estimated_amount, l.quoted_amount, l.contract_amount, l.next_action_at, l.site_visit_at,
         null, l.source, l.lost_reason, l.deleted_at, l.created_at, l.updated_at
  from src_leads l
  join map_leads ml on ml.old_id = l.id
  join map_customers mc on mc.old_id = l.customer_id;

  insert into lead_activities (lead_id, activity_type, content, created_by, created_at)
  select ml.new_id, a.activity_type, a.content, a.created_by, a.created_at
  from lead_activities a join map_leads ml on ml.old_id = a.lead_id;

  insert into lead_notes (lead_id, content, created_by, created_at, updated_at)
  select ml.new_id, n.content, n.created_by, n.created_at, n.updated_at
  from lead_notes n join map_leads ml on ml.old_id = n.lead_id;

  insert into lead_attribution (lead_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term,
                                fbclid, gclid, ttclid, landing_page, referrer, device_type, user_agent, created_at)
  select ml.new_id, a.utm_source, a.utm_medium, a.utm_campaign, a.utm_content, a.utm_term,
         a.fbclid, a.gclid, a.ttclid, a.landing_page, a.referrer, a.device_type, a.user_agent, a.created_at
  from lead_attribution a join map_leads ml on ml.old_id = a.lead_id;

  -- 写真は同じファイルを参照する（削除時は、ほかに参照が残っていればファイルを消さない）
  insert into lead_images (lead_id, image_type, storage_path, original_filename, mime_type, file_size, created_at)
  select ml.new_id, i.image_type, i.storage_path, i.original_filename, i.mime_type, i.file_size, i.created_at
  from lead_images i join map_leads ml on ml.old_id = i.lead_id;

  raise notice 'イレブンへ 顧客 % 名・案件 % 件をコピーしました',
    (select count(*) from map_customers), (select count(*) from map_leads);
end $$;

-- 確認:
--   select company, count(*) from leads where deleted_at is null group by company;
--   → takanaga 22 / eleven 20
