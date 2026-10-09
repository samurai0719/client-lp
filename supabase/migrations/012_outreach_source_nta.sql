-- ============================================================
-- 営業先の取得元に「国税庁 法人番号公表サイト（nta）」を追加
-- 何度実行しても問題ない。Supabase SQL Editor で実行してください。
-- ============================================================

alter table outreach_companies drop constraint if exists outreach_companies_source_check;
alter table outreach_companies add constraint outreach_companies_source_check
  check (source in ('nta', 'gbizinfo', 'google_places', 'url_list', 'csv', 'manual'));

-- ── HPのURLをどこで見つけたか ────────────────────────────────
-- chatgpt      … ChatGPT で調べて管理画面から登録（HP上の社名・電話番号で本人確認してから使う）
-- chatgpt_none … ChatGPT で調べたが見つからなかった（同じ会社を何度も調べないため）
alter table outreach_companies add column if not exists website_source text;
create index if not exists outreach_companies_hp_search_idx
  on outreach_companies (crawl_status, prefecture, created_at)
  where website_url is null and email is null;
