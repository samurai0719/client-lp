import Link from "next/link";
import { siteMeta } from "@/config/nurse-ranking";

/** 高さを抑えたヘッダー。PR表記はサイト名の横に、見落とさない大きさで置く */
export default function Header() {
  return (
    <header className="border-b border-[#f7c9d8] bg-white">
      <div className="mx-auto flex max-w-[860px] items-center justify-between gap-3 px-4 py-2">
        <Link href="/nurse-ranking" className="flex min-w-0 items-center gap-1.5">
          <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-[#e8437a]" aria-hidden="true">
            <path fill="currentColor" d="M12 21s-7.5-4.6-9.6-9.3C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.4h2c.7-1.2 2.2-2.4 4.3-2.4 3.7 0 5.8 3.9 4.3 7.2C19.5 16.4 12 21 12 21z" />
            <path fill="#fff" d="M11 9h2v2.5h2.5v2H13V16h-2v-2.5H8.5v-2H11z" />
          </svg>
          <span className="truncate text-[15px] font-black tracking-tight text-slate-900">{siteMeta.siteName}</span>
        </Link>
        <span className="shrink-0 rounded border border-slate-400 px-1.5 py-0.5 text-[11px] font-bold leading-none text-slate-600">PR</span>
      </div>
      <p className="bg-[#fff1f5] px-4 py-1 text-center text-[11px] text-slate-600">本ページはプロモーション（広告）を含みます</p>
    </header>
  );
}
