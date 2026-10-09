import type { SupabaseClient } from "@supabase/supabase-js";
import { TABLES } from "./constants";
import type { CompanyRow } from "./companies";
import { getMailProvider } from "./provider";
import { renderEmail, unsubscribeOneClickUrl } from "./render";
import { effectiveLimits, fromAddress, getSettings, replyToAddress, sendReadiness } from "./settings";
import { isSuppressed } from "./suppress";

/**
 * 送信キューの処理。
 *
 *   送信待ち(queued) → 送信中(sending) → 送信成功(sent) → 配信成功(delivered, Webhook)
 *
 * ・1回の呼び出しで時間内に送れるぶんだけ送る（cron / 管理画面から繰り返し呼ぶ）
 * ・取り出しは DB 関数 outreach_claim_sends が 1分/1時間/1日 の上限を守って行う
 * ・送信直前にも配信停止・バウンス・送信お断りを確認し、該当すれば送らない
 * ・テスト送信（100件）が終わったら自動で残りへは進まず「テスト送信完了」で止める
 */

export type CampaignRow = {
  id: string;
  name: string;
  subject: string;
  body: string;
  landing_page_url: string;
  target: { prefectures?: string[] };
  status: string;
  resume_status: string | null;
  test_size: number;
  test_started_at: string | null;
  test_completed_at: string | null;
  rest_started_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
};

export type SendRow = {
  id: string;
  campaign_id: string;
  company_id: string;
  email: string;
  batch: "test" | "rest";
  status: string;
  token: string;
  provider: string | null;
  provider_message_id: string | null;
  rendered_subject: string | null;
  rendered_body: string | null;
  queued_at: string;
  claimed_at: string | null;
  sent_at: string | null;
  delivered_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  click_count: number;
  replied_at: string | null;
  bounced_at: string | null;
  bounce_type: string | null;
  unsubscribed_at: string | null;
  complained_at: string | null;
  error_message: string | null;
};

const STUCK_MINUTES = 15;

/** 送信中のまま止まったもの（実行が途中で切れた等）は、二重送信を避けるため再送せずエラーにする */
async function recoverStuck(db: SupabaseClient) {
  const cutoff = new Date(Date.now() - STUCK_MINUTES * 60_000).toISOString();
  await db
    .from(TABLES.sends)
    .update({ status: "failed", error_message: "送信結果を確認できませんでした（二重送信防止のため再送していません）" })
    .eq("status", "sending")
    .lt("claimed_at", cutoff);
}

/** テスト送信・一斉送信が終わったキャンペーンの状態を進める */
export async function finishCampaigns(db: SupabaseClient) {
  await db.rpc("outreach_fix_queued_status");
  const { data } = await db.from(TABLES.campaigns).select("id,status").in("status", ["test_sending", "sending"]);
  for (const c of (data ?? []) as { id: string; status: string }[]) {
    const { count } = await db
      .from(TABLES.sends)
      .select("id", { count: "exact", head: true })
      .eq("campaign_id", c.id)
      .in("status", ["queued", "sending"]);
    if ((count ?? 0) > 0) continue;
    const now = new Date().toISOString();
    if (c.status === "test_sending") {
      // ここで止める。残りへの送信は管理者が「残りを送信」を押したときだけ
      await db
        .from(TABLES.campaigns)
        .update({ status: "test_completed", test_completed_at: now, updated_at: now })
        .eq("id", c.id)
        .eq("status", "test_sending");
    } else {
      await db
        .from(TABLES.campaigns)
        .update({ status: "completed", completed_at: now, updated_at: now })
        .eq("id", c.id)
        .eq("status", "sending");
    }
  }
}

export type QueueResult = { sent: number; failed: number; skipped: number; blocked?: string[] };

export async function processQueue(db: SupabaseClient, opts: { deadline: number }): Promise<QueueResult> {
  const result: QueueResult = { sent: 0, failed: 0, skipped: 0 };
  await recoverStuck(db);

  const settings = await getSettings(db);
  const readiness = sendReadiness(settings);
  const provider = getMailProvider();
  if (!readiness.ready || !provider) {
    await finishCampaigns(db);
    return { ...result, blocked: readiness.problems.length ? readiness.problems : ["メール配信サービスが未設定です"] };
  }
  const from = fromAddress()!;
  const replyTo = replyToAddress(settings);
  const limits = effectiveLimits(settings);
  // 1分あたりの上限に合わせて1通ずつ間隔を空ける（瞬間的にまとめて送らない）
  const gapMs = Math.max(600, Math.ceil(60_000 / Math.max(1, limits.per_minute)));

  const campaigns = new Map<string, CampaignRow>();

  while (Date.now() + gapMs < opts.deadline) {
    const { data: claimed, error } = await db.rpc("outreach_claim_sends", {
      p_max: 1,
      p_per_minute: limits.per_minute,
      p_per_hour: limits.per_hour,
      p_per_day: limits.per_day,
    });
    if (error) {
      console.error("[outreach] claim failed:", error.code, error.message);
      break;
    }
    const send = ((claimed ?? []) as SendRow[])[0];
    if (!send) break; // 送信待ちが無い、または上限に達した

    const outcome = await sendOne(db, send, { campaigns, settings, provider, from, replyTo });
    // 一時的な失敗（レート制限など）は今回の実行をここで終え、次回に回す
    if (outcome === "retry") break;
    result[outcome]++;
    if (outcome === "sent" || outcome === "failed") await sleep(gapMs);
  }

  await finishCampaigns(db);
  return result;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function sendOne(
  db: SupabaseClient,
  send: SendRow,
  ctx: {
    campaigns: Map<string, CampaignRow>;
    settings: Awaited<ReturnType<typeof getSettings>>;
    provider: NonNullable<ReturnType<typeof getMailProvider>>;
    from: string;
    replyTo: string | null;
  }
): Promise<"sent" | "failed" | "skipped" | "retry"> {
  const now = () => new Date().toISOString();

  let campaign = ctx.campaigns.get(send.campaign_id);
  if (!campaign) {
    const { data } = await db.from(TABLES.campaigns).select("*").eq("id", send.campaign_id).single();
    campaign = data as CampaignRow;
    ctx.campaigns.set(send.campaign_id, campaign);
  }
  const { data: companyData } = await db.from(TABLES.companies).select("*").eq("id", send.company_id).single();
  const company = companyData as CompanyRow | null;

  // 送信直前の最終確認
  const skipReason = !company
    ? "企業が削除されています"
    : company.refusal_notice
      ? "HPに送信お断りの表示があります"
      : company.send_blocked
        ? "送信停止に設定されています"
        : ["bounced", "unsubscribed", "replied"].includes(company.outreach_status)
          ? "配信停止・バウンス・返信済みの企業です"
          : company.review_status === "excluded"
            ? "除外に設定されています"
            : (await isSuppressed(db, send.email))
              ? "配信停止リストに登録されています"
              : null;
  if (skipReason) {
    await db.from(TABLES.sends).update({ status: "skipped", error_message: skipReason }).eq("id", send.id);
    return "skipped";
  }

  const mail = renderEmail(campaign, company!, {
    campaignId: campaign.id,
    landingPageUrl: campaign.landing_page_url,
    token: send.token,
    settings: ctx.settings,
  });

  const replyMailto = ctx.replyTo ? `, <mailto:${ctx.replyTo}?subject=unsubscribe>` : "";
  const res = await ctx.provider.send({
    from: ctx.from,
    to: send.email,
    replyTo: ctx.replyTo,
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
    headers: {
      // Gmail / Yahoo のワンクリック配信停止（RFC 8058）
      "List-Unsubscribe": `<${unsubscribeOneClickUrl(send.token)}>${replyMailto}`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
    idempotencyKey: `outreach-${send.id}`,
    tags: { kind: "outreach", campaign: campaign.id.replace(/-/g, "_"), send: send.id.replace(/-/g, "_") },
  });

  // DB容量を抑えるため、本文の全文保存は目視確認に使うテスト送信分だけ。
  // それ以外は件名だけ残し、本文は画面表示のときにテンプレートから作り直す（lib/outreach/sentMail.ts）。
  // 送信開始後はテンプレートを編集できないため、作り直した本文は実際に送ったものと同じになる。
  const keepBody = send.batch === "test";

  if (res.ok) {
    const t = now();
    await db
      .from(TABLES.sends)
      .update({
        status: "sent",
        sent_at: t,
        provider: ctx.provider.name,
        provider_message_id: res.messageId,
        rendered_subject: mail.subject,
        rendered_body: keepBody ? mail.text : null,
        error_message: null,
      })
      .eq("id", send.id);
    await db
      .from(TABLES.companies)
      .update({ outreach_status: "sent", last_sent_at: t, last_error: null, updated_at: t })
      .eq("id", send.company_id)
      .in("outreach_status", ["unsent", "queued", "sent", "delivered", "error"]);
    return "sent";
  }

  if (res.retryable) {
    // 一時的な失敗はキューに戻す（同じ送信IDの冪等キーで送るので二重送信にはならない）
    await db.from(TABLES.sends).update({ status: "queued", claimed_at: null, error_message: res.error }).eq("id", send.id);
    return "retry";
  }

  await db
    .from(TABLES.sends)
    .update({ status: "failed", error_message: res.error, rendered_subject: mail.subject, rendered_body: keepBody ? mail.text : null })
    .eq("id", send.id);
  await db
    .from(TABLES.companies)
    .update({ outreach_status: "error", last_error: res.error, updated_at: now() })
    .eq("id", send.company_id)
    .in("outreach_status", ["unsent", "queued", "sent", "delivered", "error"]);
  return "failed";
}
