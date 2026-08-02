// PR表記付きヘッダー。ページ最上部の見落としにくい位置に PR / 広告 表記を配置する。

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="bg-amber-50 py-1.5 text-center text-[11px] font-medium text-amber-800 border-b border-amber-100">
        [PR] 当サイトはアフィリエイト広告を利用しています
      </div>
      <div className="mx-auto flex max-w-[1100px] items-center justify-between px-4 py-3 sm:px-6">
        <span className="text-sm font-bold tracking-tight text-slate-800 sm:text-base">
          看護師転職サイト
          <span className="text-teal-600">おすすめランキング</span>
        </span>
        <a
          href="#ranking"
          className="rounded-full bg-teal-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-teal-700 sm:text-sm"
        >
          ランキングを見る
        </a>
      </div>
    </header>
  );
}
