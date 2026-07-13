import { NextResponse } from "next/server";
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

// 診断の回答IDを管理画面用の日本語ラベルへ変換する
// （旧実装は "within-1y" 等の生IDのまま保存され、管理画面で読めなかった）
function labelOf(options: DiagnosisOption[], id: string | null | undefined): string | null {
  if (!id) return null;
  return options.find((o) => o.id === id)?.label ?? id;
}

const CONSTRUCTION_TYPE_MAP: Record<string, string> = {
  concrete: "駐車場リフォーム",
  "expand-parking": "駐車場リフォーム",
  "garden-to-parking": "駐車場リフォーム",
  carport: "エクステリア（カーポート・フェンスなど）",
  "weed-control": "雑草・庭管理対策",
  "privacy-fence": "フェンス・塀工事",
  "remove-trees-rocks": "植栽工事",
  "turf-tile-deck": "植栽工事",
  "full-renovation": "駐車場リフォーム",
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { answers, utm } = body as {
      answers: {
        prefecture: string | null;
        municipality: string | null;
        // 工事種別（new-construction=新築外構 / renovation=外構リフォーム）。旧クライアントは未送信のため任意
        workType?: string | null;
        constructionTypes: string[];
        worries: string[];
        worriesOther?: string;
        size?: string | null;
        timing: string | null;
        budget: string | null;
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
    };

    const { contact } = answers;
    if (!contact.name || !contact.phone) {
      return NextResponse.json({ error: "お名前と電話番号は必須です" }, { status: 400 });
    }

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
        // 工事種別（新築外構/外構リフォーム）はwork_typesの先頭に入れ、管理画面の一覧で見えるようにする
        const workTypeLabel = labelOf(workTypeOptions, answers.workType);
        const workTypes = answers.constructionTypes
          .map((t) => CONSTRUCTION_TYPE_MAP[t])
          .filter((v): v is string => Boolean(v));
        const uniqueTypes = [...new Set([...(workTypeLabel ? [workTypeLabel] : []), ...workTypes])];
        if (uniqueTypes.length === 0) uniqueTypes.push("その他");

        const mismatchNote = customerResult.matchedExisting
          ? nameMismatchNote(contact.name, customerResult.existingName)
          : null;

        // お悩み（「その他」の自由入力があれば併記）
        const worryLabels = answers.worries
          .map((w) => labelOf(worryOptions, w))
          .filter(Boolean);
        if (answers.worries.includes("other") && answers.worriesOther?.trim()) {
          worryLabels.push(`「${answers.worriesOther.trim()}」`);
        }

        const notes = [
          mismatchNote,
          workTypeLabel ? `工事種別：${workTypeLabel}` : null,
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
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[gaikou-contact] Unexpected error:", err);
    return NextResponse.json({ error: "予期しないエラーが発生しました" }, { status: 500 });
  }
}
