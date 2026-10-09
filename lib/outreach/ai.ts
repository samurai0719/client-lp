import OpenAI from "openai";
import { PRICING, SERVICE } from "@/config/driver-company";

/**
 * 営業メールの文章生成（AIは文章作成だけに使う。営業先の選定・審査には使わない）。
 * 生成結果はそのまま送らず、必ず管理画面の下書きに入れて人が確認・編集してから使う。
 *
 *   OPENAI_API_KEY      既存の画像生成と同じキー
 *   OUTREACH_AI_MODEL   既定 gpt-5-mini
 */

export type AiInput = {
  companyName?: string;
  prefecture?: string;
  city?: string;
  websiteUrl?: string;
  jobType?: string;
  template?: string;
  tone?: string;
};

export function aiConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

const SYSTEM = `あなたは日本のBtoB営業メールの編集者です。運送会社の採用担当者に送る、短く誠実な案内メールの件名と本文を作ります。

# サービスの事実（これ以外の事実・数字・実績を作らないこと）
- サービス名：${SERVICE.name}（ドライバー求人に特化した求人掲載サービス。人材紹介ではない）
- 初期費用・求人掲載・月額・応募・面接はすべて0円
- ドライバーが実際に入社した場合のみ、${PRICING.successFeeUnit}${PRICING.successFee}の成果報酬
- 企業が自分で求人を登録 → 自動掲載 → 条件の合う登録ドライバーへ自動でメール配信 → 求職者が自分で応募
- 運営者による電話営業・候補者の推薦・スカウト・面接調整は行わない（「ご提案します」「ご紹介します」「お電話します」等は書かない）

# 書き方のルール
- 誇張表現・断定的な効果の約束（「必ず採用できる」等）・導入実績の数字・他社比較は書かない
- 相手の会社について、入力に無い事実（従業員数・困りごと等）を推測して書かない
- 地域名は入力がある場合だけ自然に触れてよい
- 宛名・差し込みは次のプレースホルダをそのまま使う：{{recipient}}（宛名ブロック）、{{landing_page_url}}（LPのURL。本文に必ず1回入れる）
  必要なら {{company_name}} {{prefecture}} {{city}} も使ってよい
- 配信停止の案内・送信者の住所などのフッターはシステムが自動で付けるので本文には書かない。ただし「ご不要の場合は今後お送りしません」の一文は入れる
- 本文は400〜650文字程度、1行は30文字前後で改行し、スマホで読みやすくする
- 件名は35文字以内。「【重要】」「緊急」など開封を煽る表現は使わない

出力はJSONのみ：{"subject": "...", "body": "..."}`;

export async function generateOutreachEmail(input: AiInput): Promise<{ subject: string; body: string }> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const user = [
    input.companyName ? `会社名：${input.companyName}` : "会社名：（指定なし。宛名は {{recipient}} に任せる）",
    input.prefecture ? `地域：${input.prefecture}${input.city ?? ""}` : "",
    input.websiteUrl ? `会社HP：${input.websiteUrl}（URLのみ。内容は推測しないこと）` : "",
    input.jobType ? `募集職種：${input.jobType}` : "",
    input.tone ? `トーン：${input.tone}` : "",
    input.template ? `\n# ベースにするテンプレート（構成と事実はこれに合わせる）\n${input.template}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const res = await client.chat.completions.create({
    model: process.env.OUTREACH_AI_MODEL || "gpt-5-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM },
      { role: "user", content: user },
    ],
  });
  const raw = res.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw) as { subject?: string; body?: string };
  const subject = (parsed.subject ?? "").trim().slice(0, 120);
  let body = (parsed.body ?? "").trim().slice(0, 4000);
  if (!subject || !body) throw new Error("AIの出力が不正です");
  if (!body.includes("{{landing_page_url}}")) body += "\n\n{{landing_page_url}}";
  return { subject, body };
}
