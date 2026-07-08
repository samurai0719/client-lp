// 背景装飾：生成りのにじみ（金茶・オリーブ）＋四隅の葉の線画。
// FVクリエイティブの余白装飾を踏襲した、静的で控えめなレイヤー。
export default function NeDecorativeBackground() {
  return (
    <div className="ne-bg-layer" aria-hidden="true">
      <span className="ne-blob ne-blob-1" />
      <span className="ne-blob ne-blob-2" />

      {/* 左上の葉の線画 */}
      <svg
        className="absolute -left-6 top-[16%] w-28 sm:w-36 opacity-[0.16]"
        viewBox="0 0 120 200"
        fill="none"
      >
        <path d="M20 190 C 30 130, 40 80, 70 10" stroke="#5a6b46" strokeWidth="1.5" />
        <path d="M45 100 C 60 92, 72 94, 84 104 C 70 112, 56 110, 45 100 Z" fill="none" stroke="#5a6b46" strokeWidth="1.5" />
        <path d="M40 130 C 26 122, 18 110, 16 96 C 30 102, 38 114, 40 130 Z" fill="none" stroke="#5a6b46" strokeWidth="1.5" />
        <path d="M58 62 C 70 54, 84 54, 96 62 C 84 72, 70 72, 58 62 Z" fill="none" stroke="#5a6b46" strokeWidth="1.5" />
      </svg>

      {/* 右下の葉の線画 */}
      <svg
        className="absolute -right-8 bottom-[8%] w-32 sm:w-40 opacity-[0.14] -scale-x-100"
        viewBox="0 0 120 200"
        fill="none"
      >
        <path d="M20 190 C 30 130, 40 80, 70 10" stroke="#8a9573" strokeWidth="1.5" />
        <path d="M45 100 C 60 92, 72 94, 84 104 C 70 112, 56 110, 45 100 Z" fill="none" stroke="#8a9573" strokeWidth="1.5" />
        <path d="M40 130 C 26 122, 18 110, 16 96 C 30 102, 38 114, 40 130 Z" fill="none" stroke="#8a9573" strokeWidth="1.5" />
      </svg>

      {/* 画面下部にうっすら見える街並みの線画 */}
      <svg
        className="absolute inset-x-0 bottom-0 w-full opacity-[0.07]"
        viewBox="0 0 1200 140"
        preserveAspectRatio="xMidYMax slice"
        fill="none"
        stroke="#5a6b46"
        strokeWidth="2"
      >
        {/* 家1 */}
        <path d="M 80 140 V 90 L 130 55 L 180 90 V 140" />
        <rect x="105" y="100" width="20" height="18" rx="2" />
        {/* 木 */}
        <path d="M 220 140 V 112 M 220 116 C 204 112 198 96 202 82 C 216 86 224 98 220 116 M 220 108 C 236 104 242 90 240 78 C 226 82 218 92 220 108" />
        {/* 家2（大きめ） */}
        <path d="M 300 140 V 80 L 365 40 L 430 80 V 140" />
        <rect x="330" y="95" width="24" height="20" rx="2" />
        <rect x="380" y="100" width="18" height="40" rx="2" />
        {/* フェンス */}
        <path d="M 470 140 V 116 M 500 140 V 116 M 530 140 V 116 M 560 140 V 116 M 462 122 H 568 M 462 134 H 568" />
        {/* 車 */}
        <path d="M 620 140 v -6 a 10 10 0 0 1 10 -10 h 70 a 10 10 0 0 1 10 10 v 6" />
        <path d="M 640 124 c 4 -10 44 -10 48 0" />
        <circle cx="640" cy="138" r="7" />
        <circle cx="692" cy="138" r="7" />
        {/* 家3 */}
        <path d="M 780 140 V 95 L 830 62 L 880 95 V 140" />
        <rect x="812" y="105" width="18" height="35" rx="2" />
        {/* 木2 */}
        <path d="M 930 140 V 105 M 930 110 C 912 105 906 86 912 72 C 928 78 936 90 930 110" />
        {/* 家4 */}
        <path d="M 990 140 V 92 L 1045 58 L 1100 92 V 140" />
        <rect x="1020" y="102" width="22" height="18" rx="2" />
      </svg>
    </div>
  );
}
