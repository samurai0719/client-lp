# 高長建設 コーポレートサイト（+ 複数LP管理プロジェクト）

Next.js 16 / TypeScript / Tailwind CSS v4 で構築しています。

このプロジェクトは複数クライアントのLPとサイトを1つのNext.jsアプリで管理しています。

---

## 高長建設 コーポレートHP（新規）

### ローカルURL

```
http://localhost:3000/takanaga
```

### ページ一覧

| URL | ページ |
|-----|--------|
| `/takanaga` | トップページ |
| `/takanaga/services` | 工事内容 |
| `/takanaga/works` | 施工事例一覧 |
| `/takanaga/works/[slug]` | 施工事例詳細 |
| `/takanaga/strengths` | 選ばれる理由 |
| `/takanaga/price` | 費用目安 |
| `/takanaga/flow` | ご依頼の流れ |
| `/takanaga/company` | 会社案内 |
| `/takanaga/area` | 対応地域 |
| `/takanaga/faq` | よくある質問 |
| `/takanaga/news` | お知らせ・コラム |
| `/takanaga/contact` | お問い合わせ |
| `/takanaga/contact/thanks` | 送信完了 |
| `/takanaga/privacy` | プライバシーポリシー |

### 管理データの場所

| ファイル | 内容 |
|---------|------|
| `data/takanaga/siteConfig.ts` | 会社情報・CTA文言・URL設定 |
| `data/takanaga/works.ts` | 施工事例データ |
| `data/takanaga/services.ts` | 対応工事カテゴリー |
| `data/takanaga/faqs.ts` | よくある質問 |
| `data/takanaga/areas.ts` | 対応地域 |
| `data/takanaga/prices.ts` | 費用目安 |
| `data/takanaga/news.ts` | お知らせ・コラム |

### 会社情報の入力方法

`data/takanaga/siteConfig.ts` の `company` オブジェクトを編集してください。
`null` の項目は画面に表示されません。情報が確定したら値を入力してください。

### ドメイン切り替え方法

広告停止後に `next.config.ts` の以下の行を変更してください：

```ts
// 変更前（広告LP）
destination: "/gaikou",

// 変更後（コーポレートHP）
destination: "/takanaga",
```

### フォーム送信先

1. **Resendメール通知**: `RESEND_API_KEY` と `NOTIFICATION_EMAIL` を `.env.local` に設定
2. **CRM連携**: `CRM_WEBHOOK_URL` を `.env.local` に設定すると自動連携
3. **開発中**: `RESEND_API_KEY` 未設定時はコンソールログ出力のみ

---

## 高長建設 外構LP（既存・広告用）

```
http://localhost:3000/gaikou
```

現在 `takanagakensetu.com` はこのLPに向いています。変更しないでください。


---

## いざかや 蛍（岐阜県各務原市）ホームページ提案

- ローカルURL: `http://localhost:3000/hotaru`（提案段階のため noindex・未デプロイ）
- 店舗情報・確認状況: `config/hotaru.ts`
- 詳細・公開前の確認リスト: [`app/hotaru/README.md`](app/hotaru/README.md)

---

## ドライバー採用サービス（候補者プロフィール検索）企業向けLP

- ローカルURL: `http://localhost:3000/driver/scout`（公開ドメイン未設定・noindex）
- 対象: 愛知県の運送会社の経営者・採用担当者のみ（求職者向けの導線は置かない）
- CTA: すべて「無料で求職者情報を見てみる」→ ページ内の利用申込みフォーム（`#apply`）
- 文言: `components/driver-scout/content.ts`（表現ルールは同ファイル冒頭のコメント）
- 見た目: ドラテク企業向けLPの `app/driver/company/doratech-company.css`（dt-）を共有し、固有部品は `app/driver/scout/scout.css`（ds-）
- FV写真: `public/images/driver/company/hero-pc.webp` / `hero-sp.webp`（AI生成の仮画像。差し替えはこの2ファイルを置き換える）

### フォームの送信先と、必要な設定

送信先は `/api/driver-scout-apply`（`app/api/driver-scout-apply/route.ts`）。
保存と通知のどちらにも失敗した場合は送信失敗を表示し、送れたように見せかけない。

| 設定 | 内容 | 状態 |
|---|---|---|
| Supabase `driver_company_inquiries` | 申込みの保存先（migration 007） | 適用済み |
| `supabase/migrations/014_driver_scout_apply.sql` | 市区町村・免許・採用希望時期・申込み種別の列を追加 | **要適用**（未適用の間は、これらの項目を `message` 列にまとめて保存する） |
| `RESEND_API_KEY` | 運営への通知メール | 本番 Vercel で設定。ローカルは空のため通知は送られない |
| `DORATECH_NOTIFICATION_EMAIL`（なければ `NOTIFICATION_EMAIL` → `ADMIN_NOTIFICATION_EMAIL`） | 通知先メールアドレス | 環境変数で設定 |

### 未実装（LPに書いている仕組みのうち、まだシステムが無いもの）

- 企業アカウントの発行・ログイン
- 匿名プロフィールの検索・閲覧画面
- 企業からの「連絡希望」と、候補者本人の同意による連絡先開示
- 採用決定の記録と成功報酬の請求
