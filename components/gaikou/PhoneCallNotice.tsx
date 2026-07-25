import { PhoneIncoming } from "lucide-react";

// サンクス画面（LP問い合わせ・診断完了）共通：担当者からの折り返し電話番号を明示する案内。
// 「担当者からご連絡します」だけだと知らない番号の着信として出られないお客様が多いため、
// 発信元の番号を事前に伝えて受電率を上げる（2026-07-25 オーナー指示）。
const NOTICE_PHONE_DISPLAY = "090-2346-7395";
const NOTICE_PHONE_TEL = "09023467395";

export default function PhoneCallNotice() {
  return (
    <div className="mt-4 rounded-xl bg-[#eaf3ee] border border-[#2f7d5a]/30 px-4 py-3.5 text-left">
      <p className="flex items-center gap-1.5 text-[12px] font-bold text-[#1f4d3d]">
        <PhoneIncoming className="w-4 h-4 shrink-0" aria-hidden="true" />
        担当者からのお電話について
      </p>
      <p className="mt-1 text-[15px] sm:text-[16px] font-extrabold text-[#10302a]">
        <a href={`tel:${NOTICE_PHONE_TEL}`} className="underline decoration-2 underline-offset-2">
          {NOTICE_PHONE_DISPLAY}
        </a>{" "}
        からご連絡いたします
      </p>
      <p className="mt-1 text-[11.5px] sm:text-xs text-[#6b7a73] leading-relaxed">
        この番号からの着信に、ぜひご対応いただけますようお願いいたします。
      </p>
    </div>
  );
}
