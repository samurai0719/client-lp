import { Resend } from "resend";
import { PLAN_LABEL, formatJst, isKensetsuLead, type LeadInsert } from "./leads";

/**
 * 採用レスキュー 新規問い合わせの通知。
 *
 * 通知チャネルは「環境変数が設定されているものだけ」送る。
 * 失敗しても例外を投げず、受付処理は止めない。
 *
 *   メール   : RESEND_API_KEY ＋ 送信先 SAIYO_RESCUE_NOTIFICATION_EMAIL
 *              （未設定なら ADOFY_NOTIFICATION_EMAIL → NOTIFICATION_EMAIL）
 *   Slack    : SAIYO_RESCUE_SLACK_WEBHOOK_URL   （Incoming Webhook）
 *   Discord  : SAIYO_RESCUE_DISCORD_WEBHOOK_URL
 *   LINE     : SAIYO_RESCUE_LINE_CHANNEL_ACCESS_TOKEN ＋ SAIYO_RESCUE_LINE_TO（Messaging API の push）
 *
 * チャネルを増やすときは CHANNELS に1つ関数を足すだけでよい。
 */

export type LeadNotice = {
  id: string | null;
  row: LeadInsert;
  createdAt: Date;
  /** DB保存に失敗した場合 true（件名で手動登録を促す） */
  dbFailed?: boolean;
};

/** 管理画面のURL（メール内リンク用） */
export function adminLeadUrl(id: string | null): string {
  const base = (process.env.SAIYO_RESCUE_SITE_URL ?? "https://saiyo.adofy-site.com").replace(/\/$/, "");
  return id ? `${base}/adofy-admin/saiyo-rescue/leads/${id}` : `${base}/adofy-admin/saiyo-rescue/leads`;
}

/** 件名・本文の見出し。建設業LP経由は一目で分かるよう別の見出しにする */
function brand(n: LeadNotice): string {
  return isKensetsuLead(n.row) ? "【採用レスキュー｜建設業LP】" : "【採用レスキュー】";
}

function summaryLines(n: LeadNotice): string[] {
  const r = n.row;
  return [
    `会社名：${r.company_name}`,
    `担当者：${r.contact_name}`,
    `電話番号：${r.phone}`,
    `メール：${r.email}`,
    `採用職種：${r.job_type}`,
    `都道府県：${r.prefecture}`,
    `問い合わせ日時：${formatJst(n.createdAt.toISOString())}`,
  ];
}

function detailLines(n: LeadNotice): string[] {
  const r = n.row;
  const v = (s: string | null) => s ?? "—";
  return [
    `現在の採用人数：${v(r.current_employees)}`,
    `希望採用人数：${v(r.desired_hires)}`,
    `現在の求人媒体：${v(r.current_job_media)}`,
    `月間採用広告費：${v(r.monthly_recruitment_budget)}`,
    `ホームページ：${v(r.website_url)}`,
    `求人ページ：${v(r.job_page_url)}`,
    `希望プラン：${r.desired_plan ? PLAN_LABEL[r.desired_plan] ?? r.desired_plan : "—"}`,
    `相談内容：${v(r.message)}`,
    "",
    `流入元：${[r.utm_source, r.utm_medium, r.utm_campaign].filter(Boolean).join(" / ") || (r.referrer ? `参照元 ${r.referrer}` : "直接")}`,
    `端末：${v(r.device_type)}`,
  ];
}

async function sendEmail(n: LeadNotice): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;
  const to =
    process.env.SAIYO_RESCUE_NOTIFICATION_EMAIL ??
    process.env.ADOFY_NOTIFICATION_EMAIL ??
    process.env.NOTIFICATION_EMAIL ??
    "info@tenshoku-gpt.com";
  const from = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
  const subject = n.dbFailed
    ? `${brand(n)}新規問い合わせ【要手動登録】${n.row.company_name} 様`
    : `${brand(n)}新規問い合わせ：${n.row.company_name} 様`;

  const text = [
    `${brand(n)}新規問い合わせ`,
    "",
    ...summaryLines(n),
    "",
    "▼ 管理画面で確認する",
    adminLeadUrl(n.id),
    "",
    "━━━━━━━━━━━━━━━━━━━━",
    ...detailLines(n),
    ...(n.dbFailed ? ["", "※データベースへの保存に失敗したため、管理画面に表示されません。手動で登録してください。"] : []),
  ].join("\n");

  try {
    const { error } = await new Resend(apiKey).emails.send({ from, to, replyTo: n.row.email, subject, text });
    if (error) {
      console.error("[saiyo-rescue notify] email error:", error.name);
      return false;
    }
    return true;
  } catch (e) {
    console.error("[saiyo-rescue notify] email exception:", e instanceof Error ? e.message : e);
    return false;
  }
}

function shortText(n: LeadNotice): string {
  return [`${brand(n)}新規問い合わせ`, ...summaryLines(n), adminLeadUrl(n.id)].join("\n");
}

async function postJson(url: string, body: unknown, headers: Record<string, string> = {}): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function sendSlack(n: LeadNotice): Promise<boolean> {
  const url = process.env.SAIYO_RESCUE_SLACK_WEBHOOK_URL;
  return url ? postJson(url, { text: shortText(n) }) : false;
}

async function sendDiscord(n: LeadNotice): Promise<boolean> {
  const url = process.env.SAIYO_RESCUE_DISCORD_WEBHOOK_URL;
  return url ? postJson(url, { content: shortText(n).slice(0, 1900) }) : false;
}

async function sendLine(n: LeadNotice): Promise<boolean> {
  const token = process.env.SAIYO_RESCUE_LINE_CHANNEL_ACCESS_TOKEN;
  const to = process.env.SAIYO_RESCUE_LINE_TO;
  if (!token || !to) return false;
  return postJson(
    "https://api.line.me/v2/bot/message/push",
    { to, messages: [{ type: "text", text: shortText(n) }] },
    { Authorization: `Bearer ${token}` },
  );
}

const CHANNELS: Record<string, (n: LeadNotice) => Promise<boolean>> = {
  email: sendEmail,
  slack: sendSlack,
  discord: sendDiscord,
  line: sendLine,
};

/** すべてのチャネルへ送る。どれか1つでも届けば true */
export async function notifyNewLead(n: LeadNotice): Promise<{ delivered: boolean; email: boolean }> {
  const entries = Object.entries(CHANNELS);
  const results = await Promise.all(entries.map(([, fn]) => fn(n)));
  const byName = Object.fromEntries(entries.map(([k], i) => [k, results[i]]));
  return { delivered: results.some(Boolean), email: Boolean(byName.email) };
}
