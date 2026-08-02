# 看護師転職サイトランキング（/nurse-ranking） 画像フォルダ

## ファーストビュー画像

- 配置パス: `public/images/nurse-ranking-hero.jpg`（このフォルダの1つ上の階層）
- 未配置の場合は、レイアウトが崩れないプレースホルダーが自動的に表示されます。
- PNG形式は、Next.jsの画像最適化（sharp）がパレット圧縮を適用した際に紺色の文字が
  正しく表示されなくなる不具合が確認されたため、写真素材は必ずJPEGで配置すること。
- 見出し・CTA等の文言は画像に焼き込み済みのデザインを採用しているため、画像を差し替える
  場合は `components/nurse-ranking/HeroSection.tsx` 内の `HERO_IMAGE_ALT` も実際の
  デザインに合わせて更新すること。

## 広告バナー画像

このフォルダに広告バナー画像を配置し、`config/nurse-ranking.ts` の `adBanners` に
ファイル名・遷移先URL・alt・表示/非表示を設定してください。

| 用途 | key | PC推奨サイズ | スマホ推奨サイズ |
|---|---|---|---|
| ファーストビュー直下 | `adBanners.top` | 728×90 | 320×100 |
| 3位カード直後 | `adBanners.middle` | 728×90 または 970×250 | 320×100 または 300×250 |
| PC右サイドバー（スマホ非表示） | `adBanners.sidebar` | 300×250 | — |

設定例:

```ts
export const adBanners = {
  top: {
    enabled: true,
    desktopImage: "/images/nurse-ranking/top-728x90.png",
    mobileImage: "/images/nurse-ranking/top-320x100.png",
    href: "https://example.com/",
    alt: "○○の広告",
  },
  // ...
};
```

`enabled: false` のまま、または画像ファイルが未配置の間は「広告バナー掲載枠」という
プレースホルダーが表示され、レイアウトは崩れません。
