import { NextResponse, type NextRequest } from "next/server";
import { sendPushToAll } from "@/lib/push/sendPush";

// 内部サービス用エンドポイント（CRONシークレットで保護）
export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-cron-secret");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, body, url } = await request.json();
  await sendPushToAll({ title, body, url });
  return NextResponse.json({ success: true });
}
