# キミナラ転職LP 画像フォルダ

このフォルダにLPで使用する画像ファイルを保存してください。
ファイルを追加すると、LP上に自動で表示されます。

---

## 配置する画像一覧

### ファーストビュー（背景画像）
| ファイル名 | 用途 | 推奨サイズ |
|---|---|---|
| `fv-desktop.webp` | PC用FV背景画像 | 1920×1080px 以上 |
| `fv-mobile.webp` | スマホ用FV背景画像 | 750×1200px 以上 |

### セクション画像
| ファイル名 | 用途 | 推奨サイズ |
|---|---|---|
| `service-overview.webp` | サービス説明セクション | 1100×400px 程度 |
| `needs-section.webp` | 共感・ニーズセクション | 600×400px 程度 |
| `final-cta.webp` | 最終CTAセクション | 1100×480px 程度 |

### 転職事例カード画像
| ファイル名 | 用途 |
|---|---|
| `case-01-engineer.webp` | 24歳女性 事務職 → エンジニア職 |
| `case-02-marketer.webp` | 27歳女性 広告運用 → SaaSマーケター |
| `case-03-btob-consultant.webp` | 22歳女性 事務職 → BtoBコンサルタント |
| `case-04-hr-consultant.webp` | 27歳男性 メーカー系営業 → 人材コンサルタント |
| `case-05-it-sales.webp` | 24歳男性 未経験 → ITシステム営業 |

推奨サイズ：600×300px 程度（横長）

### カウンセラー紹介画像（丸型表示）
| ファイル名 | 用途 |
|---|---|
| `counselor-01.webp` | 20代転職に強いアドバイザー |
| `counselor-02.webp` | 未経験転職に強いアドバイザー |
| `counselor-03.webp` | IT・営業職に強いアドバイザー |
| `counselor-04.webp` | 女性の転職相談に強いアドバイザー |

推奨サイズ：300×300px（正方形）

---

## LP内での参照パス

```
/images/fv-desktop.webp
/images/fv-mobile.webp
/images/service-overview.webp
/images/needs-section.webp
/images/case-01-engineer.webp
/images/case-02-marketer.webp
/images/case-03-btob-consultant.webp
/images/case-04-hr-consultant.webp
/images/case-05-it-sales.webp
/images/counselor-01.webp
/images/counselor-02.webp
/images/counselor-03.webp
/images/counselor-04.webp
/images/final-cta.webp
```

---

## 注意事項

- フォーマットは `.webp` を推奨（軽量・高品質）
- `.jpg` `.png` に変更する場合は `KiminaraLP.tsx` 内の拡張子も合わせて変更してください
- 画像が未配置の場合はプレースホルダー（薄青背景・点線枠）が表示されます
- FV背景画像が未配置の場合はダークブルー（`#1a2f52`）の背景が表示されます
