import { BadgePercent } from "lucide-react";

// 診断ページ内で10%OFF訴求を継続表示する小さなバッジ。
// 文言はLPのCTAクーポン（「ここからご依頼いただいた方だけ お見積もり10%OFF」）と
// 同一条件の訴求のため、割引条件を追加・変更しない。
export default function CouponBadge({ className = "" }: { className?: string }) {
  return (
    <p
      className={`inline-flex items-center justify-center gap-1.5 rounded-full bg-[#fff3e6] border border-[#e8a25a] px-3 py-1.5 text-[11px] sm:text-[12px] font-bold text-[#a85a1f] ${className}`}
    >
      <BadgePercent className="w-3.5 h-3.5 text-[#d9601a] shrink-0" aria-hidden="true" />
      SNS広告限定｜お見積もり10%OFF適用中
    </p>
  );
}
