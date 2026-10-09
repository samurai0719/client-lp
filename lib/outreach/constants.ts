/**
 * ドラテク 営業メール（運送会社向けアウトリーチ）の定数・表示ラベル。
 */

export const TABLES = {
  companies: "outreach_companies",
  jobs: "outreach_source_jobs",
  campaigns: "email_campaigns",
  sends: "email_sends",
  suppressions: "email_suppressions",
  settings: "outreach_settings",
} as const;

/** 管理画面のベースパス（公開URL /admin/outreach は next.config.ts でここへリダイレクト） */
export const ADMIN_BASE = "/adofy-admin/outreach";

export const PREFECTURES = [
  ["01", "北海道"], ["02", "青森県"], ["03", "岩手県"], ["04", "宮城県"], ["05", "秋田県"],
  ["06", "山形県"], ["07", "福島県"], ["08", "茨城県"], ["09", "栃木県"], ["10", "群馬県"],
  ["11", "埼玉県"], ["12", "千葉県"], ["13", "東京都"], ["14", "神奈川県"], ["15", "新潟県"],
  ["16", "富山県"], ["17", "石川県"], ["18", "福井県"], ["19", "山梨県"], ["20", "長野県"],
  ["21", "岐阜県"], ["22", "静岡県"], ["23", "愛知県"], ["24", "三重県"], ["25", "滋賀県"],
  ["26", "京都府"], ["27", "大阪府"], ["28", "兵庫県"], ["29", "奈良県"], ["30", "和歌山県"],
  ["31", "鳥取県"], ["32", "島根県"], ["33", "岡山県"], ["34", "広島県"], ["35", "山口県"],
  ["36", "徳島県"], ["37", "香川県"], ["38", "愛媛県"], ["39", "高知県"], ["40", "福岡県"],
  ["41", "佐賀県"], ["42", "長崎県"], ["43", "熊本県"], ["44", "大分県"], ["45", "宮崎県"],
  ["46", "鹿児島県"], ["47", "沖縄県"],
] as const;

export const PREFECTURE_NAMES: string[] = PREFECTURES.map(([, n]) => n);

export function prefectureCode(name: string): string | undefined {
  return PREFECTURES.find(([, n]) => n === name)?.[0];
}

/** gBizINFO の法人名検索に使う既定キーワード（部分一致） */
export const DEFAULT_GBIZ_KEYWORDS = ["運送", "運輸", "物流", "急便", "陸運", "通運", "輸送", "ロジスティクス", "トランスポート", "配送"];

/** Google Places のテキスト検索に使う既定キーワード */
export const DEFAULT_PLACES_KEYWORDS = ["運送会社", "運輸会社", "物流会社"];

export const SOURCE_LABEL: Record<string, string> = {
  nta: "国税庁 法人番号",
  gbizinfo: "gBizINFO",
  google_places: "Google Places",
  url_list: "URL一覧",
  csv: "CSV",
  manual: "手動",
};

export const CRAWL_STATUS_LABEL: Record<string, string> = {
  pending: "HP未確認",
  checked: "HP確認済み",
  no_website: "HPなし",
  failed: "HP取得失敗",
  blocked: "robots.txtで不可",
};

export const REVIEW_STATUS_LABEL: Record<string, string> = {
  pending: "確認待ち",
  approved: "送信OK",
  excluded: "除外",
};

export const OUTREACH_STATUS_LABEL: Record<string, string> = {
  unsent: "未送信",
  queued: "送信待ち",
  sent: "送信済み",
  delivered: "配信成功",
  bounced: "バウンス",
  error: "エラー",
  replied: "返信あり",
  unsubscribed: "配信停止",
};

export const SEND_STATUS_LABEL: Record<string, string> = {
  queued: "送信待ち",
  sending: "送信中",
  sent: "送信成功",
  delivered: "配信成功",
  bounced: "バウンス",
  failed: "エラー",
  cancelled: "中止",
  skipped: "除外",
};

export const CAMPAIGN_STATUS_LABEL: Record<string, string> = {
  draft: "下書き",
  test_sending: "テスト送信中",
  test_completed: "テスト送信完了",
  sending: "一斉送信中",
  paused: "一時停止中",
  completed: "送信完了",
  cancelled: "送信中止",
};

export const JOB_STATUS_LABEL: Record<string, string> = {
  queued: "待機中",
  running: "取得中",
  paused: "一時停止",
  completed: "完了",
  failed: "失敗",
  cancelled: "中止",
};

export const SUPPRESSION_REASON_LABEL: Record<string, string> = {
  unsubscribe: "配信停止",
  hard_bounce: "ハードバウンス",
  complaint: "迷惑メール報告",
  refused: "送信拒否の申し出",
  site_refusal: "HPに送信お断りの表示",
  manual: "手動登録",
};

export const TEST_BATCH_SIZE = 100;

/** ChatGPT 経由で登録したアドレスの送信停止理由（送信OKにすると解除される） */
export const CHATGPT_BLOCK_REASON = "ChatGPT経由のアドレス（掲載ページを確認して送信OKにしてください）";
