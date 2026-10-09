-- ============================================================
-- 営業先の取得元に「国税庁 法人番号公表サイト（nta）」を追加
-- 何度実行しても問題ない。Supabase SQL Editor で実行してください。
-- ============================================================

alter table outreach_companies drop constraint if exists outreach_companies_source_check;
alter table outreach_companies add constraint outreach_companies_source_check
  check (source in ('nta', 'gbizinfo', 'google_places', 'url_list', 'csv', 'manual'));
