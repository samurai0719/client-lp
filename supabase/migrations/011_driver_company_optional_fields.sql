-- ============================================================
-- ドラテク 企業登録フォームの簡略化（2026-10-09）に合わせ、
-- 任意入力になった項目の not null を外す。
--
-- 008 を修正前（not null 付き）の内容で適用済みのDB向け。
-- 008 の create table if not exists は既存テーブルを変更しないため、この ALTER が必要。
-- 何度実行しても問題ない。Supabase SQL Editor で実行してください。
-- ============================================================

alter table driver_companies alter column company_name_kana drop not null;
alter table driver_companies alter column representative_name drop not null;
alter table driver_companies alter column postal_code drop not null;
alter table driver_companies alter column business_description drop not null;

alter table driver_job_postings alter column employment_type drop not null;
alter table driver_job_postings alter column work_postal_code drop not null;
alter table driver_job_postings alter column relocation drop not null;
alter table driver_job_postings alter column inexperienced_ok drop not null;
