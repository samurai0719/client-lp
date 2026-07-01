import Link from "next/link";
import { companyInfo } from "@/data/gaiko-review/content";

// 第三者目線の体験談記事という体裁を保つため、社名は出さずリンクのみのシンプルなフッターにする。
export default function SimpleFooter() {
  return (
    <footer className="border-t" style={{ backgroundColor: "#2E2923", borderColor: "#2E2923" }}>
      <div className="mx-auto max-w-[720px] px-5 sm:px-6 py-8 text-center">
        <div className="flex items-center justify-center gap-4 text-xs text-white/60">
          <Link href={companyInfo.privacyPolicyPath} className="hover:text-white/90 transition-colors">
            プライバシーポリシー
          </Link>
          <Link href={companyInfo.contactPath} className="hover:text-white/90 transition-colors">
            お問い合わせ
          </Link>
        </div>
        <p className="mt-4 text-[11px] text-white/35">© {new Date().getFullYear()} All rights reserved.</p>
      </div>
    </footer>
  );
}
