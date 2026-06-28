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

