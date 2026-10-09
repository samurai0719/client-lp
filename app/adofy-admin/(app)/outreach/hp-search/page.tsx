import HpSearch from "@/components/outreach-admin/HpSearch";
import { getOutreachDb } from "@/lib/outreach/access";
import { TABLES } from "@/lib/outreach/constants";

export const dynamic = "force-dynamic";
export const metadata = { title: "HP探し（ChatGPT）｜ドラテク営業" };

export default async function HpSearchPage() {
  const { db } = (await getOutreachDb())!;
  const c = async (apply: (q: ReturnType<typeof base>) => ReturnType<typeof base>) => (await apply(base())).count ?? 0;
  const base = () => db.from(TABLES.companies).select("id", { count: "exact", head: true });
  const [waiting, registered, matched, mismatch, none] = await Promise.all([
    c((q) => q.is("website_url", null).is("email", null).eq("crawl_status", "no_website").is("website_source", null)),
    c((q) => q.eq("website_source", "chatgpt")),
    c((q) => q.eq("website_source", "chatgpt").eq("email_status", "found")),
    c((q) => q.eq("website_source", "chatgpt_mismatch")),
    c((q) => q.eq("website_source", "chatgpt_none")),
  ]);

  return (
    <div className="max-w-4xl">
      <h1 className="mb-1 text-xl font-bold text-slate-900">HP探し（ChatGPT・手動）</h1>
      <p className="mb-4 text-sm leading-relaxed text-slate-600">
        HPが分からない会社を30社ずつ表示します。指示文ごとコピーしてChatGPTに貼り付け、返ってきた答えをここに貼り付けてください。
        登録したURLは自動でHPを開き、<b>HP上に社名か電話番号があるときだけ</b>採用します（ChatGPTが別の会社のHPを答えることがあるため）。
        その後、HPに公開されている窓口メールアドレスを自動で探します。
      </p>
      <div className="mb-4 grid grid-cols-2 gap-2 text-center text-xs sm:grid-cols-5">
        {[
          ["調べる会社", waiting],
          ["ChatGPTで登録", registered],
          ["うちメール取得", matched],
          ["社名不一致で不採用", mismatch],
          ["見つからず", none],
        ].map(([label, n]) => (
          <div key={label as string} className="rounded-lg border border-slate-200 bg-white p-2.5">
            <p className="font-bold text-slate-500">{label}</p>
            <p className="text-lg font-black text-[#0a1f4e]">{(n as number).toLocaleString()}</p>
          </div>
        ))}
      </div>
      <HpSearch />
    </div>
  );
}
