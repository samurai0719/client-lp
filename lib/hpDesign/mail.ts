import { Resend } from "resend";
import {
  ASSET_CHOICES, CONTENTS, PURPOSES, REFERENCE_CHOICES, STYLES, WEBSITE_CHOICES,
  colorText, industryText, labelOf, labelsOf,
} from "./options";
import { formatJst, siteUrl } from "./server";

/**
 * 無料デザイン申し込みのメール。
 *
 * 料金・正式公開の条件は運営者が個別にメールで案内する方針のため、
 * 自動送信するメールには料金を一切書かない。
 */

const SERVICE = "adofy";

export type MailResult = { ok: true; id: string | null } | { ok: false; error: string };

/** 申し込み1件の、メール本文に使う項目 */
export type RequestForMail = {
  id: string;
  public_token: string;
  industry: string;
  industry_other: string | null;
  industry_detail: string | null;
  company_name: string | null;
  company_undecided: boolean;
  purposes: string[];
  purpose_other: string | null;
  design_style: string;
  main_color: string;
  color_other: string | null;
  contents: string[];
  content_other: string | null;
  has_website: string;
  website_url: string | null;
  reference_choice: string;
  reference_urls: string[];
  assets_choice: string;
  uploaded_files: { name: string }[];
  other_requests: string | null;
  contact_name: string;
  email: string;
  phone: string | null;
  created_at: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  referrer: string | null;
};

export function mailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

function fromAddress(): string {
  return process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
}

export function adminAddress(): string {
  return process.env.ADOFY_NOTIFICATION_EMAIL ?? process.env.NOTIFICATION_EMAIL ?? "samurai0719@outlook.jp";
}

/** お客様からの返信の受け先（未設定なら返信先を付けない） */
function replyTo(): string | undefined {
  return process.env.HP_DESIGN_REPLY_TO ?? process.env.ADOFY_NOTIFICATION_EMAIL ?? undefined;
}

async function send(params: {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
  idempotencyKey: string;
}): Promise<MailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: "RESEND_API_KEY が未設定です" };
  try {
    const { data, error } = await new Resend(apiKey).emails.send(
      {
        from: fromAddress(),
        to: params.to,
        subject: params.subject,
        text: params.text,
        ...(params.html ? { html: params.html } : {}),
        ...(params.replyTo ? { replyTo: params.replyTo } : {}),
      },
      // 同じキーの再送は Resend 側で1通にまとめられる（重複送信防止）
      { idempotencyKey: params.idempotencyKey }
    );
    if (error) return { ok: false, error: `${error.name}: ${error.message}` };
    return { ok: true, id: data?.id ?? null };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "unknown error" };
  }
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function companyOf(r: Pick<RequestForMail, "company_name" | "company_undecided">): string {
  return r.company_name ?? (r.company_undecided ? "（会社名未定）" : "—");
}

function greeting(r: RequestForMail): string {
  return r.company_name ? `${r.company_name}\n${r.contact_name} 様` : `${r.contact_name} 様`;
}

/** ヒアリング内容（お客様・管理者の両方に使う） */
export function answerLines(r: RequestForMail): [string, string][] {
  return [
    ["業種", industryText(r.industry, r.industry_other, r.industry_detail)],
    ["会社名・店舗名", companyOf(r)],
    ["ホームページの目的", labelsOf(PURPOSES, r.purposes, r.purpose_other)],
    ["デザインの雰囲気", labelOf(STYLES, r.design_style)],
    ["メインカラー", colorText(r.main_color, r.color_other)],
    ["掲載したい内容", labelsOf(CONTENTS, r.contents, r.content_other)],
    [
      "現在のホームページ",
      `${labelOf(WEBSITE_CHOICES, r.has_website)}${r.website_url ? `（${r.website_url}）` : ""}`,
    ],
    [
      "参考にしたいホームページ",
      r.reference_urls.length > 0
        ? r.reference_urls.join("\n　")
        : labelOf(REFERENCE_CHOICES, r.reference_choice),
    ],
    [
      "写真・ロゴ",
      `${labelOf(ASSET_CHOICES, r.assets_choice)}${r.uploaded_files.length ? `（${r.uploaded_files.length}点アップロード）` : ""}`,
    ],
    ["その他のご希望", r.other_requests ?? "特になし"],
  ];
}

const FOOTER = ["", "──────────────", "adofy｜ホームページ制作", siteUrl()];

/* ── お客様：受付確認 ─────────────────────────────────────────────────── */

export function sendCustomerAck(r: RequestForMail): Promise<MailResult> {
  const answers = answerLines(r).map(([k, v]) => `・${k}：${v}`);
  const text = [
    greeting(r),
    "",
    `この度は${SERVICE}の「ホームページを無料で作る」にお申し込みいただき、ありがとうございます。`,
    "以下の内容で受け付けました。",
    "",
    "ご回答いただいた内容をもとに、ホームページを制作いたします。",
    "完成しましたら、このメールアドレスにお知らせいたします。楽しみにお待ちください。",
    "",
    "※完成のお知らせが迷惑メールフォルダに振り分けられることがあります。",
    "　このメールを「迷惑メールではない」に設定しておくと、確実に受け取れます。",
    "",
    "※無料でご提供するのは、ホームページのデザイン案の作成とご確認までです。",
    "",
    "■ ご回答内容",
    ...answers,
    "",
    "内容の追加・変更や、写真・ロゴを後から送りたい場合は、このメールにご返信ください。",
    "このメールにお心当たりがない場合は、お手数ですが破棄してください。",
    ...FOOTER,
  ].join("\n");

  return send({
    to: r.email,
    subject: `【${SERVICE}】ホームページ無料作成のお申し込みを受け付けました`,
    text,
    replyTo: replyTo(),
    idempotencyKey: `hp-design-ack-${r.id}`,
  });
}

/* ── 管理者：新規申し込み通知 ─────────────────────────────────────────── */

export function adminRequestUrl(id: string): string {
  return `${siteUrl()}/adofy-admin/hp-design/${id}`;
}

export function sendAdminNotice(r: RequestForMail): Promise<MailResult> {
  const answers = answerLines(r).map(([k, v]) => `${k}：${v}`);
  const source = r.utm_source
    ? [r.utm_source, r.utm_medium, r.utm_campaign].filter(Boolean).join(" / ")
    : r.referrer ?? "直接";
  const text = [
    "【adofy】ホームページ無料作成の申し込みが届きました。",
    "",
    `申し込み日時：${formatJst(r.created_at)}`,
    `会社名・店舗名：${companyOf(r)}`,
    `ご担当者：${r.contact_name}`,
    `メール：${r.email}`,
    `電話番号：${r.phone ?? "未入力"}`,
    "",
    "▼ 管理画面で確認する",
    adminRequestUrl(r.id),
    "",
    "━━━━━━━━━━━━━━━━━━━━",
    ...answers,
    "",
    `流入元：${source}`,
  ].join("\n");

  return send({
    to: adminAddress(),
    subject: `【adofy】ホームページ無料作成の申し込み：${companyOf(r)}（${r.contact_name} 様）`,
    text,
    replyTo: r.email,
    idempotencyKey: `hp-design-admin-${r.id}`,
  });
}

/* ── お客様：デザイン送付 ─────────────────────────────────────────────── */

export function purchaseUrl(token: string): string {
  return `${siteUrl()}/free-design/purchase?t=${encodeURIComponent(token)}`;
}

export function designEmailPreview(r: RequestForMail, previewUrl: string, message: string): { subject: string; text: string } {
  const text = [
    greeting(r),
    "",
    `${SERVICE}です。お待たせいたしました。`,
    "ご回答いただいた内容をもとに、ホームページのデザインが完成しました。",
    "下記のURLからご確認ください。",
    "",
    "■ デザインのプレビュー",
    previewUrl,
    ...(message ? ["", message] : []),
    "",
    "■ このデザインで進めたい場合",
    "下記のページから「このデザインで購入を希望する」とお知らせください。",
    purchaseUrl(r.public_token),
    "",
    "ご希望をいただいた後、正式な制作・公開に必要な料金と契約条件をメールでご案内します。",
    "その内容をご確認いただくまで、お支払いや契約が発生することはありません。",
    "",
    "気に入らなかった場合や、今回は見送る場合は、このままお返事いただかなくても問題ありません。",
    "修正のご要望やご質問は、このメールにご返信ください。",
    ...FOOTER,
  ].join("\n");
  return { subject: `【${SERVICE}】ホームページのデザインが完成しました`, text };
}

export function sendDesignEmail(
  r: RequestForMail,
  previewUrl: string,
  message: string,
  attempt: string
): Promise<MailResult> {
  const { subject, text } = designEmailPreview(r, previewUrl, message);
  const btn = (href: string, label: string, bg: string, color: string) =>
    `<a href="${esc(href)}" style="display:inline-block;padding:14px 28px;border-radius:999px;background:${bg};color:${color};font-weight:bold;text-decoration:none">${esc(label)}</a>`;

  const html = `<!doctype html><html><body style="margin:0;background:#f7f7f5;font-family:'Hiragino Sans','Yu Gothic',sans-serif;color:#1f2937">
<div style="max-width:560px;margin:0 auto;padding:24px 16px">
<div style="background:#fff;border-radius:16px;padding:28px 24px;line-height:1.8;font-size:15px">
<p style="margin:0 0 16px;white-space:pre-line">${esc(greeting(r))}</p>
<p style="margin:0 0 16px">${SERVICE}です。お待たせいたしました。<br>ご回答いただいた内容をもとに、ホームページのデザインが完成しました。</p>
<p style="margin:24px 0;text-align:center">${btn(previewUrl, "デザインを見る", "#facc15", "#1f2937")}</p>
<p style="margin:0 0 16px;font-size:13px;color:#6b7280;word-break:break-all">${esc(previewUrl)}</p>
${message ? `<p style="margin:0 0 16px;white-space:pre-line">${esc(message)}</p>` : ""}
<hr style="border:none;border-top:1px solid #eee;margin:24px 0">
<p style="margin:0 0 12px;font-weight:bold">このデザインで進めたい場合</p>
<p style="margin:24px 0;text-align:center">${btn(purchaseUrl(r.public_token), "このデザインで購入を希望する", "#1f2937", "#ffffff")}</p>
<p style="margin:0 0 12px;font-size:13px;color:#4b5563">ご希望をいただいた後、正式な制作・公開に必要な料金と契約条件をメールでご案内します。その内容をご確認いただくまで、お支払いや契約が発生することはありません。</p>
<p style="margin:0;font-size:13px;color:#4b5563">気に入らなかった場合や、今回は見送る場合は、このままお返事いただかなくても問題ありません。修正のご要望やご質問は、このメールにご返信ください。</p>
</div>
<p style="text-align:center;font-size:12px;color:#9ca3af;margin-top:16px">adofy｜ホームページ制作</p>
</div></body></html>`;

  return send({
    to: r.email,
    subject,
    text,
    html,
    replyTo: replyTo(),
    // 同じ回の再試行は1通にまとめ、管理者が「再送」した回は別の1通として送る
    idempotencyKey: `hp-design-design-${r.id}-${attempt}`,
  });
}

/* ── 管理者：購入希望の通知 ───────────────────────────────────────────── */

export function sendPurchaseNotice(r: RequestForMail, message: string | null): Promise<MailResult> {
  const text = [
    "【adofy】お客様から「このデザインで購入を希望する」の連絡が届きました。",
    "",
    `会社名・店舗名：${companyOf(r)}`,
    `ご担当者：${r.contact_name}`,
    `メール：${r.email}`,
    `電話番号：${r.phone ?? "未入力"}`,
    `メッセージ：${message || "なし"}`,
    "",
    "料金と契約条件をメールでご案内してください（自動では送信していません）。",
    "",
    "▼ 管理画面で確認する",
    adminRequestUrl(r.id),
  ].join("\n");

  return send({
    to: adminAddress(),
    subject: `【adofy】購入希望：${companyOf(r)}（${r.contact_name} 様）`,
    text,
    replyTo: r.email,
    idempotencyKey: `hp-design-purchase-${r.id}`,
  });
}
