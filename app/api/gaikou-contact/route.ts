import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/check";

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
        constructionTypes: string[];
        worries: string[];
        timing: string | null;
        budget: string | null;
        contact: {
          name: string;
          phone: string;
          email: string;
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
      const phoneNorm = contact.phone.replace(/[^\d]/g, "");

      // 既存顧客チェック → なければ新規作成
      const { data: existing } = await db
        .from("customers")
        .select("id")
        .eq("phone_normalized", phoneNorm)
        .is("deleted_at", null)
        .limit(1);

      let customerId: string | null = null;
      if (existing && existing.length > 0) {
        customerId = existing[0].id;
      } else {
        const { data: newCust, error: custErr } = await db
          .from("customers")
          .insert({
            name: contact.name,
            phone: contact.phone,
            phone_normalized: phoneNorm,
            email: contact.email || null,
            prefecture: answers.prefecture || null,
            city: answers.municipality || null,
            address: contact.addressDetail || null,
          })
          .select("id")
          .single();
        if (custErr || !newCust) {
          console.error("[gaikou-contact] Customer insert failed:", custErr);
        } else {
          customerId = newCust.id;
        }
      }

      if (customerId) {
        const customer = { id: customerId };
        const workTypes = answers.constructionTypes
          .map((t) => CONSTRUCTION_TYPE_MAP[t])
          .filter((v): v is string => Boolean(v));
        const uniqueTypes = [...new Set(workTypes)];
        if (uniqueTypes.length === 0) uniqueTypes.push("その他");

        const notes = [
          contact.note ? `備考：${contact.note}` : null,
          answers.timing ? `希望時期：${answers.timing}` : null,
          answers.budget ? `予算：${answers.budget}` : null,
        ]
          .filter(Boolean)
          .join("\n");

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
