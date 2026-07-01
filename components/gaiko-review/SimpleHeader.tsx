import { companyInfo } from "@/data/gaiko-review/content";

// 企業広告感の強いコーポレートヘッダーではなく、記事LP用の簡易ヘッダー。
export default function SimpleHeader() {
  return (
    <header
      className="sticky top-0 z-40 border-b"
      style={{ backgroundColor: "rgba(255,253,249,0.92)", borderColor: "#DDD3C2", backdropFilter: "blur(6px)" }}
    >
      <div className="mx-auto max-w-[720px] px-5 sm:px-6 h-14 flex items-center justify-between">
        <span className="text-sm font-bold tracking-wide" style={{ color: "#2E2923" }}>
          {companyInfo.name}
        </span>
        <span className="text-xs" style={{ color: "#879174" }}>
          外構リフォーム体験談
        </span>
      </div>
    </header>
  );
}
