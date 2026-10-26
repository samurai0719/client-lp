-- ============================================================
-- ドライバー採用サービス（scout.adofy-site.com）
-- 企業からの「この方と面接を希望する」依頼と、運営の対応状況
-- Supabase SQL Editor で実行してください。何度実行しても問題ありません。
--
-- 運用：企業が求職者を選ぶ → ドラテクが求職者へ連絡し、面接の希望と企業指定の確認事項を聞く
--       → 回答を企業へ伝え、双方の希望日時で面接を調整 → 企業が面接・採用を判断
--
-- 個人情報の扱い：
--   ・求職者の氏名・電話番号は driver_candidates にだけあり、この表には持たない
--     （運営の管理画面でだけ結合して表示する。企業向けの受付状況ページには出さない）
--   ・企業向けの受付状況ページは public_token（推測できない文字列）で開く
--   ・ブラウザから直接は読み書きさせない（RLS有効・ポリシーなし。サーバーの service role だけが扱う）
-- ============================================================

create table if not exists scout_interview_requests (
  id uuid primary key default gen_random_uuid(),

  -- 企業向けの受付状況ページのURLに使う（/requests/<token>）
  public_token text not null,

  -- 対象の求職者
  candidate_id uuid not null references driver_candidates (id) on delete restrict,
  candidate_no text not null,

  -- 依頼した企業（driver_company_inquiries と同じメールアドレスの企業に結びつける）
  company_inquiry_id uuid references driver_company_inquiries (id) on delete set null,
  company_name text not null,
  contact_name text not null,
  phone text not null,
  email text not null,
  prefecture text,
  city text,

  -- 企業が入力した依頼内容
  job_description text not null,          -- 仕事内容
  questions text,                         -- 求職者に確認したいこと（任意）
  company_available_times text,           -- 企業の面接可能日時（任意。運営が追記してもよい）

  -- 運営の対応状況
  status text not null default 'received',
  candidate_answers text,                 -- 求職者の回答（企業へ伝える内容。人物評価・推薦は書かない）
  candidate_available_times text,         -- 求職者の面接可能日時
  interview_at timestamptz,               -- 確定した面接日時
  interview_place text,                   -- 面接の場所・方法
  staff_memo text,                        -- 運営の作業メモ（企業には表示しない）
  status_changed_at timestamptz,
  company_notified_status text,           -- 最後に企業へメールで知らせた状態（同じ知らせを繰り返さない）

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table scout_interview_requests drop constraint if exists scout_interview_requests_status_check;
alter table scout_interview_requests
  add constraint scout_interview_requests_status_check
  check (status in ('received', 'contacting', 'awaiting_answer', 'scheduling', 'confirmed', 'declined', 'unreachable', 'withdrawn'));

create unique index if not exists scout_interview_requests_token_key on scout_interview_requests (public_token);
-- 同じ企業（メールアドレス）から同じ求職者への依頼は1件まで（取り下げたものは除く）
create unique index if not exists scout_interview_requests_dedupe_key
  on scout_interview_requests (lower(email), candidate_id)
  where status <> 'withdrawn';
create index if not exists scout_interview_requests_created_at_idx on scout_interview_requests (created_at desc);
create index if not exists scout_interview_requests_status_idx on scout_interview_requests (status);

alter table scout_interview_requests enable row level security;

-- ── 企業の契約状態 ───────────────────────────────────────────
-- 運営が管理画面で「契約済み」にする。契約済みの企業には、依頼のたびに契約手続きを案内しない
alter table driver_company_inquiries add column if not exists contracted_at timestamptz;

-- ── テスト用の求職者 ─────────────────────────────────────────
-- is_test の求職者は、本番の一覧・待機人数・依頼の対象に出さない（動作確認用）
alter table driver_candidates add column if not exists is_test boolean not null default false;
