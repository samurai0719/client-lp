import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 px-4 py-10 text-center text-slate-400 sm:px-6">
      <p className="text-sm font-semibold text-white">看護師転職サイトおすすめランキング</p>
      <nav className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs" aria-label="法務ページ">
        <Link href="/nurse-ranking/ranking-policy" className="hover:text-white">ランキング・編集方針</Link>
        <Link href="/nurse-ranking/advertising-policy" className="hover:text-white">広告掲載ポリシー</Link>
        <Link href="/nurse-ranking/privacy" className="hover:text-white">プライバシーポリシー</Link>
        <Link href="/nurse-ranking/company" className="hover:text-white">運営者情報</Link>
      </nav>
      <p className="mt-6 text-[11px] text-slate-500">© 2026 看護師転職サイトおすすめランキング</p>
    </footer>
  );
}
