export default function Footer() {
  return (
    <footer className="relative bg-[#10302a] text-[#cfe3d6] py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* 会社HPリンク */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6 pb-6 border-b border-[#1f4d3d]">
          <a href="/" className="text-xs text-[#9bb3a8] hover:text-white transition-colors">
            高長建設 公式サイト
          </a>
          <a href="/company" className="text-xs text-[#9bb3a8] hover:text-white transition-colors">
            会社案内
          </a>
          <a href="/works" className="text-xs text-[#9bb3a8] hover:text-white transition-colors">
            施工事例
          </a>
          <a href="/contact" className="text-xs text-[#9bb3a8] hover:text-white transition-colors">
            お問い合わせ
          </a>
          <a href="/privacy" className="text-xs text-[#9bb3a8] hover:text-white transition-colors">
            プライバシーポリシー
          </a>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="font-bold text-white text-sm">高長建設</p>
            <p className="text-xs text-[#9bb3a8] mt-1">岐阜県の外構リフォーム・駐車場コンクリート工事</p>
          </div>
          <p className="text-[11px] text-[#7a9389]">© 2026 高長建設</p>
        </div>
      </div>
    </footer>
  );
}
