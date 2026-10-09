import CampaignEditor from "@/components/outreach-admin/CampaignEditor";
import { aiConfigured } from "@/lib/outreach/ai";
import { getOutreachDb } from "@/lib/outreach/access";
import { defaultLandingUrl, getSettings, replyToAddress } from "@/lib/outreach/settings";

export const dynamic = "force-dynamic";
export const metadata = { title: "営業メールの作成｜ドラテク営業" };

export default async function NewCampaignPage() {
  const { db } = (await getOutreachDb())!;
  const testRecipient = replyToAddress(await getSettings(db));
  return (
    <div>
      <h1 className="mb-1 text-xl font-bold text-slate-900">営業メールの作成</h1>
      <p className="mb-4 text-sm text-slate-600">
        保存すると下書きになります。送信は、次の画面で「テスト100件送信」→ 結果確認 →「残りを送信」の順に行います。
      </p>
      <CampaignEditor defaultLanding={defaultLandingUrl()} aiEnabled={aiConfigured()} testRecipient={testRecipient} />
    </div>
  );
}
