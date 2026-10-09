/** 営業メールの既定テンプレートと差し込み項目（クライアントからも読むため、サーバー専用の処理は置かない） */

export const PLACEHOLDERS = [
  { key: "{{recipient}}", label: "宛名（会社名＋ご担当者様）" },
  { key: "{{company_name}}", label: "会社名" },
  { key: "{{contact_name}}", label: "担当者名" },
  { key: "{{prefecture}}", label: "都道府県" },
  { key: "{{city}}", label: "市区町村" },
  { key: "{{landing_page_url}}", label: "LPのURL（クリック計測・UTM付き）" },
] as const;

export const DEFAULT_SUBJECT = "ドライバー採用についてご相談です｜ドラテク";

export const DEFAULT_BODY = `{{recipient}}

突然のご連絡失礼いたします。

運送会社様向けのドライバー採用サービス
「ドラテク」を運営しております。

ドラテクは、

・初期費用0円
・求人掲載0円
・月額0円
・応募0円
・面接0円

でご利用いただけます。

実際にドライバーが入社した場合のみ、
1名25万円の成功報酬となります。

ドライバー採用でお困りでしたら、
一度詳細をご覧いただければ幸いです。

{{landing_page_url}}

ご不要の場合は、
今後ご案内をお送りいたしません。
（下記の配信停止URLから、または本メールへのご返信でお知らせください）

ドラテク
運営：adofy`;

