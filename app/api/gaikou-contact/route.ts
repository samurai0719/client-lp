import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/check";
import {
  findOrCreateCustomer,
  findRecentDuplicateLead,
  nameMismatchNote,
} from "@/lib/crm/customers";
import {
  budgetOptions,
  paymentMethodOptions,
  sizeOptions,
  timingOptions,
  workTypeOptions,
  worryOptions,
  type DiagnosisOption,
} from "@/data/gaikou/diagnosisQuestions";
import { parseJsonOrMultipart } from "@/lib/http/parseRequestBody";
import { uploadLeadImages } from "@/lib/storage/leadImages";

// 診断の回答IDを管理画面用の日本語ラベルへ変換する
// （旧実装は "within-1y" 等の生IDのまま保存され、管理画面で読めなかった）
function labelOf(options: DiagnosisOption[], id: string | null | undefined): string | null {
  if (!id) return null;
  return options.find((o) => o.id === id)?.label ?? id;
}

// お問い合わせ内容を管理者通知メールの本文に整形する
function buildNotificationEmail(
  contact: {
    name: string;
    phone: string;
    email: string;
    contactTime?: string;
    note: string;
    addressDetail: string;
  },
  prefecture: string | null,
  municipality: string | null,
  workTypes: string[],
  estimate: { label: string; works: string[] } | null | undefined,
  now: string,
): string {
  const address = [prefecture, municipality, contact.addressDetail]
    .filter((v) => v && v.trim())
    .join("");
  const lines = [
    "外構プラン無料診断フォームよりお問い合わせを受け付けました。",
    "",
    `受付日時　　：${now}`,
    `お名前　　　：${contact.name} 様`,
    `電話番号　　：${contact.phone}`,
    `メール　　　：${contact.email || "（未入力）"}`,
    `ご住所　　　：${address || "（未入力）"}`,
    `ご希望工事　：${workTypes.length > 0 ? workTypes.join("、") : "（未選択）"}`,
    estimate?.label
      ? `概算目安　　：${estimate.label}（対象：${estimate.works.join("・")}）`
      : null,
    contact.contactTime ? `連絡希望時間：${contact.contactTime}` : null,
    contact.note ? `備考　　　　：${contact.note}` : null,
    "",
    "※詳細は顧客管理システムをご確認ください。",
  ];
  return lines.filter((l) => l !== null).join("\n");
}

const CONSTRUCTION_TYPE_MAP: Record<string, string> = {
  // 外構リフォームの工事内容
  concrete: "駐車場リフォーム",
  "expand-parking": "駐車場リフォーム",
  "garden-to-parking": "駐車場リフォーム",
  carport: "エクステリア（カーポート・フェンスなど）",
  "weed-control": "雑草・庭管理対策",
  "privacy-fence": "フェンス・塀工事",
  "remove-trees-rocks": "植栽工事",
  "turf-tile-deck": "植栽工事",
  "full-renovation": "駐車場リフォーム",
  // 新築外構の工事内容（nc- 接頭辞。ラベルは /api/new-exterior-contact と揃える）
  "nc-parking-concrete": "駐車場コンクリート（新築）",
  "nc-carport": "エクステリア（カーポート・フェンスなど）",
  "nc-gate-post": "門柱・ポスト工事",
  "nc-approach": "アプローチ工事",
  "nc-fence": "フェンス・塀工事",
  "nc-garden": "庭・人工芝工事",
  "nc-full-set": "新築外構一式",
  "nc-undecided": "新築外構（内容未定）",
};

export async function POST(req: Request) {
  try {
    const { body, files } = await parseJsonOrMultipart<Record<string, unknown>>(req);
    // worries/budget/paymentMethod は旧4〜8問フォーマットの互換用（新UIでは送信されない）
    const { answers, utm, estimate } = body as {
      answers: {
        prefecture: string | null;
        municipality: string | null;
        // 工事種別（new-construction=新築外構 / renovation=外構リフォーム）。旧クライアントは未送信のため任意
        workType?: string | null;
        constructionTypes: string[];
        worries?: string[];
        worriesOther?: string;
        size?: string | null;
        timing?: string | null;
        budget?: string | null;
        paymentMethod?: string | null;
        contact: {
          name: string;
          phone: string;
          email: string;
          contactTime?: string;
          note: string;
          addressDetail: string;
        };
      };
      utm?: Record<string, string>;
      /** 診断STEP4で表示した概算目安（リード情報に添付する） */
      estimate?: { label: string; works: string[] } | null;
    };

    const { contact } = answers;
    if (!contact.name || !contact.phone) {
      return NextResponse.json({ error: "お名前と電話番号は必須です" }, { status: 400 });
    }

    // 工事種別（新築外構/外構リフォーム）はwork_typesの先頭に入れ、管理画面の一覧で見えるようにする
    // メール通知でも使うためブロック外で算出する
    const workTypeLabel = labelOf(workTypeOptions, answers.workType);
    const uniqueTypes = [
      ...new Set([
        ...(workTypeLabel ? [workTypeLabel] : []),
        ...answers.constructionTypes
          .map((t) => CONSTRUCTION_TYPE_MAP[t])
          .filter((v): v is string => Boolean(v)),
      ]),
    ];
    if (uniqueTypes.length === 0) uniqueTypes.push("その他");

    if (isSupabaseAdminConfigured()) {
      const db = createAdminClient();

      // 顧客の照合・作成（名前は上書きしない共通ロジック。正規化も統一）
      const customerResult = await findOrCreateCustomer(db, {
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        prefecture: answers.prefecture,
        city: answers.municipality,
        address: contact.addressDetail,
      });

      if (!customerResult.ok) {
        console.error("[gaikou-contact] Customer insert failed");
      }

      if (customerResult.ok) {
        const customer = { id: customerResult.customerId };

        const mismatchNote = customerResult.matchedExisting
          ? nameMismatchNote(contact.name, customerResult.existingName)
          : null;

        // お悩み（旧フォーマット互換。「その他」の自由入力があれば併記）
        const worries = answers.worries ?? [];
        const worryLabels = worries.map((w) => labelOf(worryOptions, w)).filter(Boolean);
        if (worries.includes("other") && answers.worriesOther?.trim()) {
          worryLabels.push(`「${answers.worriesOther.trim()}」`);
        }

        const notes = [
          mismatchNote,
          workTypeLabel ? `工事種別：${workTypeLabel}` : null,
          estimate?.label
            ? `概算目安：${estimate.label}（対象：${estimate.works.join("・")}）※現地調査後に正式見積もり`
            : null,
          contact.note ? `備考：${contact.note}` : null,
          worryLabels.length > 0 ? `お悩み：${worryLabels.join("、")}` : null,
          answers.size ? `希望の広さ：${labelOf(sizeOptions, answers.size)}` : null,
          answers.timing ? `希望時期：${labelOf(timingOptions, answers.timing)}` : null,
          answers.budget ? `予算：${labelOf(budgetOptions, answers.budget)}` : null,
          answers.paymentMethod ? `支払い方法：${labelOf(paymentMethodOptions, answers.paymentMethod)}` : null,
          contact.contactTime ? `連絡しやすい時間帯：${contact.contactTime}` : null,
        ]
          .filter(Boolean)
          .join("\n");

        // 二重送信（同じ内容の直近リード）は新規作成しない
        const duplicateLeadId = await findRecentDuplicateLead(db, customer.id, uniqueTypes, notes || null);
        if (duplicateLeadId) {
          if (files.length > 0) {
            await uploadLeadImages(db, duplicateLeadId, files, "original").catch((err) =>
              console.error("[gaikou-contact] duplicate lead image upload failed:", err)
            );
          }
          return NextResponse.json({ success: true, duplicate: true });
        }

        const { data: lead, error: leadErr } = await db
          .from("leads")
          .insert({
            customer_id: customer.id,
            status: "new",
            work_types: uniqueTypes,
            inquiry_message: notes || null,
            source: utm?.utm_source || "lp",
          })
          .select("id")
          .single();

        if (leadErr) {
          console.error("[gaikou-contact] Lead insert failed:", leadErr);
        } else if (lead) {
          await db.from("lead_activities").insert({
            lead_id: lead.id,
            activity_type: "inquiry_received",
            content: "外構プラン無料診断フォームよりお問い合わせを受け付けました",
          });

          if (utm && Object.keys(utm).length > 0) {
            await db.from("lead_attribution").insert({
              lead_id: lead.id,
              utm_source: utm.utm_source || null,
              utm_medium: utm.utm_medium || null,
              utm_campaign: utm.utm_campaign || null,
              landing_page: utm.landing_page || null,
            });
          }

          if (files.length > 0) {
            await uploadLeadImages(db, lead.id, files, "original").catch((err) =>
              console.error("[gaikou-contact] image upload failed:", err)
            );
          }
        }
      }
    }

    // 管理者への通知メール（info.ryuya@gmail.com 等へ顧客情報を送信）
    // 二重送信の場合は上で早期 return 済みなのでここには来ない
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const now = new Date().toLocaleString("ja-JP", {
        timeZone: "Asia/Tokyo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
      const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
      // 常に info.ryuya@gmail.com へ送信。NOTIFICATION_EMAIL が設定されていれば併せて送る
      const recipients = [
        ...new Set(
          ["info.ryuya@gmail.com", process.env.NOTIFICATION_EMAIL].filter(
            (v): v is string => Boolean(v),
          ),
        ),
      ];
      const resend = new Resend(apiKey);
      await resend.emails
        .send({
          from: fromEmail,
          to: recipients,
          subject: `【外構LP】${contact.name} 様よりお問い合わせ`,
          text: buildNotificationEmail(
            contact,
            answers.prefecture,
            answers.municipality,
            uniqueTypes,
            estimate,
            now,
          ),
        })
        .catch((err) => {
          // メール失敗でも CRM 保存は完了しているため問い合わせ自体は成功扱い
          console.error("[gaikou-contact] Notify email failed:", err);
        });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[gaikou-contact] Unexpected error:", err);
    return NextResponse.json({ error: "予期しないエラーが発生しました" }, { status: 500 });
  }
}
