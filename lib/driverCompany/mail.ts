/**
 * ドラテク 企業登録・求人登録で送るメールの本文。
 *
 * 文面を1か所にまとめ、LP・利用規約と料金や返金条件の表記がずれないようにする。
 * 送信そのものは呼び出し側（Route Handler）が Resend で行う。
 */

import { OPERATOR, PATHS, PRICING, REFUND_TIERS, SERVICE } from "@/config/driver-company";
import { toDisplayRows } from "@/lib/types/driverJobRegistration";

/** 問い合わせ先。未設定なら「求人管理画面から」と案内し、存在しない連絡先は書かない */
function contactLine(): string {
  return OPERATOR.email
    ? `ご不明な点は ${OPERATOR.email} までメールでお問い合わせください。`
    : "ご不明な点は、求人登録フォームの記載内容とあわせてご確認ください。";
}

const refundLines = REFUND_TIERS.map((t) => `  ・${t.label}：${t.refund}`).join("\n");

/* ── 1. メール認証メール ─────────────────────────────────────────────── */

export function verificationSubject(): string {
  return `【${SERVICE.name}】メールアドレスの確認をお願いします`;
}

export function verificationBody(params: {
  companyName: string;
  jobTitle: string;
  verifyUrl: string;
  expiresAt: Date;
}): string {
  const expires = params.expiresAt.toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return [
    `${params.companyName} 採用ご担当者さま`,
    "",
    `${SERVICE.name}へ求人情報をご登録いただき、ありがとうございます。`,
    "",
    "まだ求人は掲載されていません。",
    "下記のURLを開いてメールアドレスの確認を完了すると、求人の掲載と登録ドライバーへの配信が始まります。",
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━",
    params.verifyUrl,
    "━━━━━━━━━━━━━━━━━━━━━━━━",
    "",
    `※ このURLの有効期限は ${expires} です。`,
    "※ 期限を過ぎた場合は、お手数ですが求人情報を再度ご登録ください。",
    "",
    `登録内容：${params.jobTitle}`,
    "",
    "このメールにお心当たりがない場合は、URLを開かずに破棄してください。",
    "URLを開かないかぎり、求人が掲載されることはありません。",
    "",
    contactLine(),
    "",
    SERVICE.name,
    SERVICE.siteUrl,
  ].join("\n");
}

/* ── 2. 求人登録完了メール（メール認証後） ───────────────────────────── */

export function completionSubject(): string {
  return `【${SERVICE.name}】求人登録が完了しました`;
}

/**
 * 求人登録完了メール。
 *
 * 企業管理画面（求人の編集・停止・応募者一覧）はまだ提供していないため、
 * 存在しない管理URLは書かない。代わりに、このメールへ返信すれば編集・停止を
 * 受け付けられるよう、送信時に Reply-To を運営の通知先アドレスに設定している。
 * 管理画面を実装したら manageUrl / editUrl を渡す形に戻すこと。
 */
export function completionBody(params: {
  companyName: string;
  jobTitle: string;
  registeredAt: Date;
  /** 企業管理画面を実装したら渡す。未提供の間は undefined */
  manageUrl?: string;
  editUrl?: string;
}): string {
  const registered = params.registeredAt.toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return [
    `${params.companyName} 採用ご担当者さま`,
    "",
    "メールアドレスの確認が完了し、求人の登録が完了しました。",
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━",
    "■ 登録内容",
    "━━━━━━━━━━━━━━━━━━━━━━━━",
    `会社名　　：${params.companyName}`,
    `求人タイトル：${params.jobTitle}`,
    `登録日時　：${registered}`,
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━",
    "■ 求人の管理",
    "━━━━━━━━━━━━━━━━━━━━━━━━",
    ...(params.manageUrl && params.editUrl
      ? [
          `求人管理　：${params.manageUrl}`,
          `求人編集　：${params.editUrl}`,
          "求人停止　：求人管理画面から「掲載を停止」を選択してください。",
        ]
      : [
          "求人管理画面：準備中です。公開までしばらくお待ちください。",
          "求人の編集・停止：当面のあいだ、このメールへご返信いただければ承ります。",
        ]),
    "　　　　　　募集が終了した求人は、配信を止めるため速やかにご連絡ください。",
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━",
    "■ 料金",
    "━━━━━━━━━━━━━━━━━━━━━━━━",
    `採用成果報酬：採用1名につき ${PRICING.successFee}${PRICING.taxNote}`,
    PRICING.condition,
    PRICING.billingTrigger,
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━",
    "■ 早期退職時の返金制度",
    "━━━━━━━━━━━━━━━━━━━━━━━━",
    refundLines,
    `返金制度には適用条件があります。詳細は早期退職時返金規程（${SERVICE.siteUrl}${PATHS.refundPolicy.replace("/driver", "")}）をご確認ください。`,
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━",
    "■ 応募があった場合の流れ",
    "━━━━━━━━━━━━━━━━━━━━━━━━",
    "1. 求職者がご登録の求人を確認し、本人の意思で応募します。",
    "2. 応募者情報をこのメールアドレスへ自動送信します。",
    "3. 企業さまから応募者へ直接ご連絡ください。",
    "4. 面接・選考・労働条件の確認は、企業さまと応募者が直接行います。",
    "",
    `${SERVICE.name}が応募者との連絡を仲介することはありません。`,
    `${SERVICE.name}から営業電話を行うこともありません。`,
    "",
    contactLine(),
    "",
    SERVICE.name,
    SERVICE.siteUrl,
  ].join("\n");
}

/* ── 3. 運営への通知メール ───────────────────────────────────────────── */

export function adminSubject(companyName: string): string {
  return `【${SERVICE.name}】新しい求人登録（${companyName}）`;
}

export function adminBody(params: {
  values: Record<string, unknown>;
  verified: boolean;
  utm?: Record<string, string | null | undefined>;
  dbFailed?: boolean;
}): string {
  const sections = toDisplayRows(params.values)
    .map(({ step, rows }) =>
      [
        "━━━━━━━━━━━━━━━━━━━━━━━━",
        `■ ${step}`,
        "━━━━━━━━━━━━━━━━━━━━━━━━",
        ...rows.map((r) => `${r.label}：${r.value}`),
        "",
      ].join("\n")
    )
    .join("\n");

  const utm = params.utm ?? {};
  const now = new Date().toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return [
    `${SERVICE.name} 企業向けLPから新しい求人登録が届きました。`,
    params.dbFailed
      ? "\n※ データベースへの保存に失敗しています。このメールの内容を控えてください。\n"
      : "",
    params.verified
      ? "状態：メール認証済み（掲載可）"
      : "状態：メール認証待ち（認証されるまで掲載・配信しません）",
    "",
    sections,
    "━━━━━━━━━━━━━━━━━━━━━━━━",
    "■ 流入情報",
    "━━━━━━━━━━━━━━━━━━━━━━━━",
    `ランディングページ：${utm.landing_page || "未取得"}`,
    `リファラー：${utm.referrer || "未取得"}`,
    `utm_source：${utm.utm_source || "未取得"}`,
    `utm_medium：${utm.utm_medium || "未取得"}`,
    `utm_campaign：${utm.utm_campaign || "未取得"}`,
    "",
    `受信日時：${now}`,
  ].join("\n");
}
