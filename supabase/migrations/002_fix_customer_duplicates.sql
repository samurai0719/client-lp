-- ─────────────────────────────────────────────────────────────────────────────
-- 002: 顧客の重複データ修復＋再発防止
--
-- 背景:
--   1. 電話番号の正規化が全角数字を除去していたため、全角入力の顧客が
--      phone_normalized = ''（空）となり、別人同士が誤って一致していた。
--   2. phone_normalized にユニーク制約がなく、同時送信で同じ電話番号の
--      顧客が重複作成されていた。
--
-- 実行内容:
--   1) phone_normalized を全件再計算（全角→半角変換に対応）
--   2) 同じ電話番号の重複顧客を最古の1件へ統合（リード付け替え＋論理削除）
--   3) 再発防止のユニーク部分インデックスを作成
--
-- 実行方法: Supabase ダッシュボード → SQL Editor で全文を実行
-- （リードは削除されません。重複顧客は deleted_at が入るだけで復元可能です）
-- ─────────────────────────────────────────────────────────────────────────────

-- 1) 正規化の再計算（全角数字を半角へ変換してから数字以外を除去）
update customers
set phone_normalized = regexp_replace(
      translate(coalesce(phone, ''), '０１２３４５６７８９', '0123456789'),
      '\D', '', 'g'
    );

-- 2) 重複顧客の統合：同じ番号（10桁以上）は最古の顧客を残す
--    2-1. 重複顧客に付いているリードを、残す顧客へ付け替える
with dupes as (
  select id,
         first_value(id) over (
           partition by phone_normalized
           order by created_at asc, id asc
         ) as keep_id
  from customers
  where deleted_at is null
    and char_length(phone_normalized) >= 10
)
update leads l
set customer_id = d.keep_id
from dupes d
where l.customer_id = d.id
  and d.id <> d.keep_id;

--    2-2. リードを失った重複顧客を論理削除（データ自体は残る）
with dupes as (
  select id,
         first_value(id) over (
           partition by phone_normalized
           order by created_at asc, id asc
         ) as keep_id
  from customers
  where deleted_at is null
    and char_length(phone_normalized) >= 10
)
update customers c
set deleted_at = now(),
    updated_at = now()
from dupes d
where c.id = d.id
  and d.id <> d.keep_id;

-- 3) 再発防止：有効な顧客の電話番号（10桁以上）をユニークにする
--    （10桁未満・空の番号は照合対象外のため制約から除外）
create unique index if not exists customers_phone_normalized_unique
  on customers (phone_normalized)
  where deleted_at is null
    and char_length(phone_normalized) >= 10;
