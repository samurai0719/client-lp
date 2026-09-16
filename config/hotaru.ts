/**
 * いざかや 蛍（岐阜県各務原市）提案用サイトの設定ファイル
 *
 * 店舗情報・確認状況・画像・文言をこのファイルに集約しています。
 * ページ（app/hotaru）はここを読むだけなので、情報の変更はこのファイルのみで完結します。
 *
 * ■ 確認状況の扱い
 *   `verified: false` の項目は画面に出しません（または「お電話でご確認ください」表示）。
 *   店舗に確認できたら `value` を正しい内容に直し、`verified: true` にすると表示されます。
 *
 * ※ 下記は公開情報（食べログ・エキテン等）の調査結果で、店舗確認済みではありません。
 */

export type Verifiable<T> = {
  /** 表示する値（未確認の間は調査時点の掲載内容） */
  value: T;
  /** 店舗に確認済みなら true。true の項目だけが画面・構造化データに反映される */
  verified: boolean;
  /** 情報の出どころ・食い違いなどのメモ（画面には出さない） */
  note: string;
};

/** 確認済みなら値を、未確認なら null を返す */
export function verifiedValue<T>(item: Verifiable<T>): T | null {
  return item.verified ? item.value : null;
}

export const hotaruConfig = {
  /** 提案段階は true。本番公開が決まったら false にし、下の seo.siteUrl を設定する */
  isProposal: true,

  shop: {
    name: "いざかや 蛍",
    nameKana: "いざかや ほたる",
    logoMain: "蛍",
    logoSub: "いざかや",
    genre: "居酒屋",
    area: "岐阜県各務原市・蘇原",
  },

  contact: {
    /** 表示用 */
    phoneDisplay: "058-382-3834",
    /** tel: リンク用（ハイフンなし） */
    phoneTel: "0583823834",
    /** 構造化データ用（国際表記） */
    phoneIntl: "+81-58-382-3834",
  },

  address: {
    region: "岐阜県",
    locality: "各務原市",
    street: "蘇原栄町4-15",
    /** 一部サイトでは105号室と掲載 */
    room: {
      value: "105号室",
      verified: false,
      note: "一部サイトで「105号室」と掲載。建物名・部屋番号の有無を店舗に確認する。",
    } satisfies Verifiable<string>,
  },

  access: {
    nearestStation: "JR蘇原駅から徒歩約9分",
  },

  /** 営業情報。未確認の間は「お電話でご確認ください」と表示する */
  hours: {
    businessHours: {
      value: "17:00〜23:00",
      verified: false,
      note: "掲載サイトでは17:00〜23:00。ラストオーダー時間も未確認。",
    } satisfies Verifiable<string>,
    regularHoliday: {
      value: "",
      verified: false,
      note: "食べログでは火曜日、エキテンでは日曜日と掲載が食い違う。未確定。",
    } satisfies Verifiable<string>,
    /** 未確認時に表示する文言 */
    unverifiedText: "お電話でご確認ください",
    unverifiedLongText: ["営業時間・定休日は", "お電話でご確認ください"],
  },

  /**
   * 設備・サービス情報。verified: true にした項目だけ「店舗情報」の表に行が追加される。
   * value は確認後の正しい表記に書き換えてから true にすること。
   */
  facilities: [
    {
      label: "席数",
      value: "20席",
      verified: false,
      note: "掲載サイトでは20席。",
    },
    {
      label: "お席",
      value: "カウンター・ソファー席・座敷",
      verified: false,
      note: "掲載サイトではカウンター、ソファー席、座敷ありと掲載。",
    },
    {
      label: "個室",
      value: "",
      verified: false,
      note: "サイトによって「あり／なし」の情報が異なる。",
    },
    {
      label: "駐車場",
      value: "あり",
      verified: false,
      note: "「あり」と掲載。台数・場所は不明。",
    },
    {
      label: "お支払い",
      value: "",
      verified: false,
      note: "現金のみ／カード可など、サイトによって情報が異なる。",
    },
    {
      label: "喫煙",
      value: "全席喫煙可",
      verified: false,
      note: "「全席喫煙可」と掲載されているが、現在の運用は未確認（改正健康増進法の掲示義務にも注意）。",
    },
  ] satisfies (Verifiable<string> & { label: string })[],

  /** 現行メニュー・価格・飲み放題・宴会・貸切条件はすべて未確認のため、サイトには掲載しない */
  menuStatus: {
    menu: { value: "", verified: false, note: "現行メニュー未確認。" },
    prices: { value: "", verified: false, note: "価格未確認。架空の価格は載せない。" },
    allYouCanDrink: { value: "", verified: false, note: "飲み放題の有無・内容未確認。" },
    banquet: { value: "", verified: false, note: "宴会コースの有無・内容未確認。" },
    privateRental: { value: "", verified: false, note: "貸切条件未確認。" },
  } satisfies Record<string, Verifiable<string>>,

  /**
   * 画像はすべて生成画像（実店舗・実際の提供料理の写真ではない）。
   * 原本: public/images/hotaru/original/*.png  配信用: public/images/hotaru/*.jpg
   */
  images: {
    hero: {
      src: "/images/hotaru/hero-yakitori.jpg",
      width: 1536,
      height: 1024,
      alt: "焼き鳥と日本酒のイメージ",
    },
    dishes: {
      src: "/images/hotaru/dashimaki.jpg",
      width: 1536,
      height: 1024,
      alt: "だし巻き卵のイメージ",
    },
    drinks: {
      src: "/images/hotaru/sake.jpg",
      width: 1536,
      height: 1024,
      alt: "徳利とおちょこ、枝豆のイメージ",
    },
    /** 実店舗の写真に差し替えたら false にすると「写真はイメージです」表記が消える */
    isImageOnly: true,
    imageNote: "写真はイメージです",
  },

  /** 画面の文言（改行位置の調整用に句ごとの配列で持つ） */
  copy: {
    hero: {
      eyebrow: "岐阜県各務原市・蘇原",
      catchLines: ["一日の終わりに、", "ほっとひと息。"],
      sub: "今夜は、肩の力を抜いて。",
    },
    about: {
      label: "蛍について",
      heading: ["蘇原で過ごす、", "くつろぎのひととき。"],
      body: [
        ["岐阜県各務原市蘇原栄町にある", "『いざかや 蛍』。"],
        ["ご来店やお席についてのご相談は、", "お電話でお問い合わせください。"],
      ],
    },
    menu: {
      label: "料理とお酒",
      heading: ["今夜の一皿と、", "一杯。"],
      dishes: {
        heading: ["食事も、", "お酒のお供も。"],
        body: "現在のお料理・価格については、お気軽にお問い合わせください。",
      },
      drinks: {
        heading: ["ゆっくり楽しむ、", "一杯の時間。"],
        body: "お飲み物の種類は、お電話または店頭でご確認ください。",
      },
      notice: ["掲載写真はイメージです。", "現在のメニュー・価格は", "店舗へお問い合わせください。"],
    },
    access: {
      label: "アクセス",
      heading: ["店舗情報・", "アクセス"],
      mapButton: "地図で場所を確認する",
    },
    contact: {
      label: "お問い合わせ",
      heading: ["ご来店前のご相談は、", "お電話で。"],
      button: "電話をかける",
      note: ["営業時間・お席・メニューについては、", "店舗へ直接お問い合わせください。"],
    },
  },

  seo: {
    title: "いざかや 蛍｜岐阜県各務原市・蘇原の居酒屋",
    description:
      "岐阜県各務原市蘇原栄町4-15の居酒屋「いざかや 蛍」。JR蘇原駅から徒歩約9分。営業時間・お席・メニューについてはお電話（058-382-3834）でお問い合わせください。",
    /** 本番URLが決まるまで null のまま（canonical / og:url を出さない） */
    siteUrl: null as string | null,
  },
} as const;

export type HotaruConfig = typeof hotaruConfig;

/** 画面表示用の住所（部屋番号は確認済みのときだけ付ける） */
export function formatAddress(config: HotaruConfig = hotaruConfig): string {
  const { region, locality, street, room } = config.address;
  const roomText = verifiedValue(room);
  return `${region}${locality}${street}${roomText ? ` ${roomText}` : ""}`;
}

/** Googleマップの住所検索URL（店舗IDやレビューは埋め込まない） */
export function mapSearchUrl(config: HotaruConfig = hotaruConfig): string {
  const { region, locality, street } = config.address;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${region}${locality}${street}`,
  )}`;
}

/** 営業時間・定休日の表示行。両方確認済みのときだけ実際の値を出す */
export function hoursRows(config: HotaruConfig = hotaruConfig): { label: string; value: string }[] {
  const hours = verifiedValue(config.hours.businessHours);
  const holiday = verifiedValue(config.hours.regularHoliday);
  if (hours && holiday) {
    return [
      { label: "営業時間", value: hours },
      { label: "定休日", value: holiday },
    ];
  }
  return [
    { label: "営業時間・定休日", value: config.hours.unverifiedText },
  ];
}

/** 確認済みの設備情報だけを返す */
export function visibleFacilities(config: HotaruConfig = hotaruConfig) {
  return config.facilities.filter((f) => f.verified && f.value);
}
