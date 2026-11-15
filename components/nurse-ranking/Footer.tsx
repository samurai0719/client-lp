import Link from "next/link";
import { siteMeta } from "@/config/nurse-ranking";

const LINKS = [
  { href: "/nurse-ranking/company", label: "運営者情報" },
  { href: "/nurse-ranking/privacy", label: "プライバシーポリシー" },
  { href: "/nurse-ranking/advertising-policy", label: "広告掲載方針" },
  { href: "/nurse-ranking/ranking-policy", label: "掲載順位について" },
  // お問い合わせ窓口は運営者情報ページの連絡先を案内する
  { href: "/nurse-ranking/company#contact", label: "お問い合わせ" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#f7c9d8] bg-[#fff6f9] px-4 py-8 text-center">
      <p className="text-[14px] font-black text-slate-800">{siteMeta.siteName}</p>
      <nav className="mx-auto mt-4 flex max-w-[640px] flex-wrap justify-center gap-x-4 gap-y-2.5 text-[12px] text-slate-600" aria-label="サイト情報">
        {LINKS.map((l) => (
          <Link key={l.label} href={l.href} className="underline-offset-2 hover:text-[#e8437a] hover:underline">
            {l.label}
          </Link>
        ))}
      </nav>
      <p className="mt-5 text-[11px] text-slate-400">© 2026 {siteMeta.siteName}</p>
    </footer>
  );
}
