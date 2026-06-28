---
name: project-crm
description: 高長建設 外構LP用 顧客管理CRM + PWA実装状況
metadata:
  type: project
---

# 高長建設 顧客管理CRM実装

**Why:** 外構LPからの問い合わせを一元管理するCRMと、管理者向けPWAアプリ

## 実装済み

- `/admin` 管理画面（ダッシュボード、顧客一覧、顧客詳細、広告費、スケジュール、設定）
- `/admin/login` Supabase Auth（メール+パスワード）
- `/api/inquiries` 問い合わせ保存API（Supabase + Resend + Push通知）
- `/thanks` 送信完了ページ
- `proxy.ts` 認証ガード（Next.js 16 新名称）
- `public/sw.js` Service Worker（PWA + プッシュ通知受信）
- `public/admin-manifest.json` PWA Manifest
- `public/icons/` PWAアイコン（192/512/apple-touch）
- Supabase未設定時はデモデータ表示（ローカル確認可能）

## 重要事項

- Next.js 16 では middleware.ts → proxy.ts に変更
- Supabase環境変数が未設定でも管理画面が表示される（開発モード）
- 環境変数は `.env.local` に追記済み（値は空のまま）
- SQLマイグレーション: `supabase/migrations/001_initial.sql`
- VAPIDキー生成: `npx web-push generate-vapid-keys`

**How to apply:** Supabase設定や通知実装の継続時に参照
