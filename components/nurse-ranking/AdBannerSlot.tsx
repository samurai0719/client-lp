import Image from "next/image";
import { publicImageExists } from "@/lib/nurse-ranking/publicImage";

// 広告バナー枠。config/nurse-ranking.ts の adBanners で画像URL・遷移URL・表示/非表示を管理する。
// 未設定時（enabled: false、または画像ファイル未配置）はレイアウトが崩れない
// プレースホルダーを表示する。CLS防止のため高さを常に予約する。
//
// 注意: heightClassDesktop / heightClassMobile には「lg:h-[90px]」のように
// ブレークポイント接頭辞を含めた完全なクラス名を渡すこと（Tailwindはビルド時に
// ソース中の完全なクラス文字列しか検出できないため、ここで文字列結合はしない）。

type Banner = {
  enabled: boolean;
  desktopImage: string;
  mobileImage?: string;
  href: string;
  alt: string;
};

type AdBannerSlotProps = {
  banner: Banner;
  slotLabel: string;
  sizeLabelDesktop: string;
  sizeLabelMobile?: string;
  /** モバイル幅で予約する高さの完全なクラス名（例: "h-[100px]"） */
  heightClassMobile: string;
  /** デスクトップ幅（lg以上）で予約する高さの完全なクラス名（例: "lg:h-[90px]"） */
  heightClassDesktop: string;
  /** true の場合、モバイル幅では枠自体を非表示にする（サイドバー枠向け） */
  hideOnMobile?: boolean;
  className?: string;
};

export default function AdBannerSlot({
  banner,
  slotLabel,
  sizeLabelDesktop,
  sizeLabelMobile,
  heightClassMobile,
  heightClassDesktop,
  hideOnMobile = false,
  className = "",
}: AdBannerSlotProps) {
  const desktopReady = banner.enabled && !!banner.desktopImage && publicImageExists(banner.desktopImage);
  const mobileImage = banner.mobileImage || banner.desktopImage;
  const mobileReady = banner.enabled && !!mobileImage && publicImageExists(mobileImage);
  const hasAnyImage = desktopReady || mobileReady;

  const mobileVisibility = hideOnMobile ? "hidden" : "block lg:hidden";
  const desktopVisibility = "hidden lg:block";
  const outerVisibility = hideOnMobile ? "hidden lg:block" : "";

  // プレースホルダーは中央揃えのため display:flex が必要。
  // desktopVisibility/mobileVisibility の "block" とは別に、専用の flex 版を用意する
  // （"block" と "flex" を同じ要素に両方指定すると、lg:block が flex を上書きしてしまうため）。
  const mobileFlexVisibility = hideOnMobile ? "hidden" : "flex lg:hidden";
  const desktopFlexVisibility = "hidden lg:flex";

  if (!banner.enabled || !banner.href || !hasAnyImage) {
    return (
      <div className={`${outerVisibility} ${className}`}>
        {/* モバイル用プレースホルダー */}
        <div
          className={`${mobileFlexVisibility} relative w-full ${heightClassMobile} flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-slate-300 bg-slate-100 text-slate-400`}
          aria-label={`${slotLabel}（未設定）`}
        >
          <span className="absolute left-2 top-2 rounded-full bg-slate-300 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
            広告
          </span>
          <span className="text-xs font-medium">広告バナー掲載枠</span>
          {sizeLabelMobile && <span className="text-[10px] text-slate-400">{sizeLabelMobile}</span>}
        </div>
        {/* デスクトップ用プレースホルダー */}
        <div
          className={`${desktopFlexVisibility} relative w-full ${heightClassDesktop} flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-slate-300 bg-slate-100 text-slate-400`}
          aria-label={`${slotLabel}（未設定）`}
        >
          <span className="absolute left-2 top-2 rounded-full bg-slate-300 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
            広告
          </span>
          <span className="text-xs font-medium">広告バナー掲載枠</span>
          <span className="text-[10px] text-slate-400">{sizeLabelDesktop}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${outerVisibility} ${className}`}>
      <a
        href={banner.href}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className="relative block w-full overflow-hidden rounded-xl"
        aria-label={banner.alt || slotLabel}
      >
        <span className="absolute left-2 top-2 z-10 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-semibold text-white">
          広告
        </span>

        {/* モバイル用画像 */}
        <span className={`${mobileVisibility} relative ${heightClassMobile} bg-slate-50`}>
          {mobileReady && (
            <Image
              src={mobileImage}
              alt={banner.alt || slotLabel}
              fill
              sizes="100vw"
              className="object-contain"
            />
          )}
        </span>

        {/* デスクトップ用画像 */}
        <span className={`${desktopVisibility} relative ${heightClassDesktop} bg-slate-50`}>
          {desktopReady && (
            <Image
              src={banner.desktopImage}
              alt={banner.alt || slotLabel}
              fill
              sizes="(min-width: 1024px) 1100px, 100vw"
              className="object-contain"
            />
          )}
        </span>
      </a>
    </div>
  );
}
