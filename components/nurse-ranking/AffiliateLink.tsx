"use client";

import type { ReactNode, MouseEvent } from "react";
import { trackAffiliateClick, type ClickPosition } from "@/lib/analytics/nurseRankingTrack";

// アフィリエイトURLが未設定（"#"）の間はクリックしても遷移させず、
// 開発者がすぐ気づけるようコンソールに警告を出す。
// 本番のアフィリエイトURLが設定され次第、自動的に通常のリンクとして機能する。

type AffiliateLinkProps = {
  href: string;
  service: string;
  rank: 1 | 2 | 3;
  position: ClickPosition;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
};

export default function AffiliateLink({
  href,
  service,
  rank,
  position,
  className,
  children,
  ...aria
}: AffiliateLinkProps) {
  const isPlaceholder = href === "#" || href.trim() === "";

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    if (isPlaceholder) {
      e.preventDefault();
      console.warn(
        `[nurse-ranking] "${service}" のアフィリエイトURLが未設定のため遷移をブロックしました。config/nurse-ranking.ts の affiliateUrl を差し替えてください。`
      );
      return;
    }
    trackAffiliateClick({ service, rank, position });
  }

  return (
    <a
      href={href}
      target={isPlaceholder ? undefined : "_blank"}
      rel={isPlaceholder ? undefined : "sponsored noopener noreferrer"}
      onClick={handleClick}
      data-service={service}
      data-rank={rank}
      data-position={position}
      aria-disabled={isPlaceholder || undefined}
      className={className}
      {...aria}
    >
      {children}
    </a>
  );
}
