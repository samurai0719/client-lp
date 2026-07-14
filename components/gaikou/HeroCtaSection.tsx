import DiagnosisLinkButton from "./DiagnosisLinkButton";

// ファーストビュー直下のCTA。スクロールせずに画面内へ収まるよう、
// クーポン＋ボタン＋補足のみのコンパクト構成にする。
export default function HeroCtaSection() {
  return (
    <section className="relative px-4 sm:px-6 pt-4 sm:pt-6 pb-2" aria-label="無料診断への案内">
      <div className="max-w-[26rem] mx-auto">
        {/* 10%OFF訴求（ページ内で最初のCTAにのみ表示する） */}
        <div className="mb-2.5 rounded-xl border-2 border-dashed border-[#d9601a] bg-[#fff7ec] px-4 py-2 text-center shadow-[0_3px_14px_rgba(217,96,26,0.18)]">
          <p className="text-[12px] sm:text-[13px] font-bold text-[#a85a1f] leading-snug">
            <span className="rounded-md bg-[#d9601a] px-1.5 py-0.5 text-[10.5px] font-extrabold text-white mr-1.5">限定</span>
            ここからご依頼いただいた方だけ
            <span className="block sm:inline sm:ml-1 text-[15px] sm:text-[16px] font-extrabold text-[#d9601a]">
              お見積もり<span className="mx-0.5 text-[20px] sm:text-[22px] tracking-tight">10%OFF</span>
            </span>
          </p>
        </div>

        <DiagnosisLinkButton label="1分でうちの概算費用を確認する" className="w-full" />

        <p className="mt-2 text-center text-[12px] sm:text-[13px] font-semibold text-[#6b7a73]">
          無料・契約義務なし・しつこい営業なし
        </p>
      </div>
    </section>
  );
}
