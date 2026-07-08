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
  parkingCountOptions,
  regionOptions,
  statusOptions,
  timingOptions,
  type DiagnosisOption,
} from "@/data/new-exterior/diagnosisQuestions";

// 新築外構LP（/new-exterior/diagnosis）の診断フォーム送信先。
// 保存の流れは /api/gaikou-contact と同じ実装方針
// （顧客照合→重複リード排除→リード作成→アクティビティ・計測情報の記録）で、
// lp_type: new_exterior が分かる形でリードへ記録する。

const LP_TYPE = "new_exterior";
const LP_LABEL = "新築外構LP";

// 診断の回答IDを管理画面用の日本語ラベルへ変換する
function labelOf(options: DiagnosisOption[], id: string | null | undefined): string | null {
  if (!id) return null;
  return options.find((o) => o.id === id)?.label ?? id;
}

// 診断の工事内容ID → 管理画面の工事種別ラベル
const CONSTRUCTION_TYPE_MAP: Record<string, string> = {
  "parking-concrete": "駐車場コンクリート（新築）",
  carport: "エクステリア（カーポート・フェンスなど）",
  "gate-post": "門柱・ポスト工事",
  approach: "アプローチ工事",
  fence: "フェンス・塀工事",
  garden: "庭・人工芝工事",
  "full-set": "新築外構一式",
  undecided: "新築外構（内容未定）",
};

const REGION_PREFECTURE: Record<string, string> = {
  gifu: "岐阜県",
  aichi: "愛知県",
  mie: "三重県",
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { answers, utm, simulatorEstimate } = body as {
      lpType?: string;
      answers: {
        region: string | null;
        status: string | null;
        constructionTypes: string[];
        parkingCount: string | null;
        budget: string | null;
        timing: string | null;
        contact: {
          name: string;
          phone: string;
          email: string;
          address: string;
          note: string;
        };
      };
      utm?: Record<string, string>;
      simulatorEstimate?: { label: string; works: string[] } | null;
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
        prefecture: REGION_PREFECTURE[answers.region ?? ""] ?? null,
        city: null,
        address: contact.address,
      });

      if (!customerResult.ok) {
        console.error("[new-exterior-contact] Customer insert failed");
      }

      if (customerResult.ok) {
        const customer = { id: customerResult.customerId };
        const workTypes = answers.constructionTypes
          .map((t) => CONSTRUCTION_TYPE_MAP[t])
          .filter((v): v is string => Boolean(v));
        const uniqueTypes = [...new Set(workTypes)];
        if (uniqueTypes.length === 0) uniqueTypes.push("新築外構（内容未定）");

        const mismatchNote = customerResult.matchedExisting
          ? nameMismatchNote(contact.name, customerResult.existingName)
          : null;

        const notes = [
          `【LP種別】${LP_LABEL}（lp_type: ${LP_TYPE}）`,
          mismatchNote,
          answers.region ? `お住まいの地域：${labelOf(regionOptions, answers.region)}` : null,
          answers.status ? `現在の状況：${labelOf(statusOptions, answers.status)}` : null,
          answers.parkingCount
            ? `駐車場の希望台数：${labelOf(parkingCountOptions, answers.parkingCount)}`
            : null,
          answers.budget ? `希望予算：${labelOf(budgetOptions, answers.budget)}` : null,
          answers.timing ? `工事希望時期：${labelOf(timingOptions, answers.timing)}` : null,
          contact.address ? `住所・市区町村：${contact.address}` : null,
          simulatorEstimate
            ? `【シミュレーション概算】${simulatorEstimate.label}（対象：${simulatorEstimate.works.join("・")}）※現地調査後に正式見積もり`
            : null,
          contact.note ? `備考：${contact.note}` : null,
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
            source: utm?.utm_source || "new-exterior-lp",
          })
          .select("id")
          .single();

        if (leadErr) {
          console.error("[new-exterior-contact] Lead insert failed:", leadErr);
        } else if (lead) {
          await db.from("lead_activities").insert({
            lead_id: lead.id,
            activity_type: "inquiry_received",
            content: `${LP_LABEL}の無料診断フォームよりお問い合わせを受け付けました`,
          });

          if (utm && Object.keys(utm).length > 0) {
            await db.from("lead_attribution").insert({
              lead_id: lead.id,
              utm_source: utm.utm_source || null,
              utm_medium: utm.utm_medium || null,
              utm_campaign: utm.utm_campaign || null,
              landing_page: utm.landing_page || "/new-exterior",
            });
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[new-exterior-contact] Unexpected error:", err);
    return NextResponse.json({ error: "予期しないエラーが発生しました" }, { status: 500 });
  }
}
