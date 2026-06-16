# キミナラ転職LP 画像フォルダ

このフォルダにLPで使用する画像ファイルを保存してください。
ファイルを追加すると、LP上に自動で表示されます。

---

## 配置する画像一覧

### ファーストビュー（背景画像）
| ファイル名 | 用途 | 推奨サイズ |
|---|---|---|
| `fv-desktop.png` | PC用FV背景画像 | 1920×1080px 以上 |
| `fv-mobile.png` | スマホ用FV背景画像 | 750×1200px 以上 |

### セクション画像
| ファイル名 | 用途 | 推奨サイズ |
|---|---|---|
| `service-overview.png` | サービス説明セクション | 1100×400px 程度 |
| `needs-section.png` | 共感・ニーズセクション | 600×400px 程度 |
| `final-cta.png` | 最終CTAセクション | 1100×480px 程度 |

### 転職事例カード画像
| ファイル名 | 用途 |
|---|---|
| `case-01-engineer.png` | 24歳女性 事務職 → エンジニア職 |
| `case-02-marketer.png` | 27歳女性 広告運用 → SaaSマーケター |
| `case-03-btob-consultant.png` | 22歳女性 事務職 → BtoBコンサルタント |
| `case-04-hr-consultant.png` | 27歳男性 メーカー系営業 → 人材コンサルタント |
| `case-05-it-sales.png` | 24歳男性 未経験 → ITシステム営業 |

推奨サイズ：600×300px 程度（横長）

### カウンセラー紹介画像（丸型表示）
| ファイル名 | 用途 |
|---|---|
| `counselor-01.png` | 20代転職に強いアドバイザー |
| `counselor-02.png` | 未経験転職に強いアドバイザー |
| `counselor-03.png` | IT・営業職に強いアドバイザー |
| `counselor-04.png` | 女性の転職相談に強いアドバイザー |

推奨サイズ：300×300px（正方形）

---

## LP内での参照パス

```
/images/fv-desktop.png
/images/fv-mobile.png
/images/service-overview.png
/images/needs-section.png
/images/case-01-engineer.png
/images/case-02-marketer.png
/images/case-03-btob-consultant.png
/images/case-04-hr-consultant.png
/images/case-05-it-sales.png
/images/counselor-01.png
/images/counselor-02.png
/images/counselor-03.png
/images/counselor-04.png
/images/final-cta.png
```

---

## 注意事項

- フォーマットは `.png` を推奨（軽量・高品質）
- `.jpg` `.png` に変更する場合は `KiminaraLP.tsx` 内の拡張子も合わせて変更してください
- 画像が未配置の場合はプレースホルダー（薄青背景・点線枠）が表示されます
- FV背景画像が未配置の場合はダークブルー（`#1a2f52`）の背景が表示されます
