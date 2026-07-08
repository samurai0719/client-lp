"use client";

import { motion } from "framer-motion";
import NeSectionHeading from "./NeSectionHeading";
import { WorryWoman, WorryMan, ThinkingMan, StaffGuide } from "./svg/LineArtPeople";

// お悩みはすべて「線画キャラクター＋吹き出し」の会話形式で見せる（参考LPのスタイル）。
// strong の部分に黄色マーカーが付く。
const WORRIES: Array<{
  lines: [string, string];
  character: "woman" | "man" | "thinking";
  /** キャラクターを右側に置く */
  right?: boolean;
}> = [
  { lines: ["ハウスメーカーの外構見積もりが", "想像よりも高かった…"], character: "woman" },
  { lines: ["駐車場やカーポートの費用感が", "そもそも分からない…"], character: "man", right: true },
  { lines: ["せっかくの新築だから、", "建物に合うおしゃれな外構にしたい"], character: "thinking" },
  { lines: ["予算内でどこまでできるのか", "先に知っておきたい…"], character: "woman", right: true },
  { lines: ["入居日が近づいているのに、", "外構がまだ決まっていない…"], character: "man" },
  { lines: ["門柱・フェンス・庭・アプローチを", "まとめて相談したい"], character: "thinking", right: true },
];

const CHARACTERS = {
  woman: WorryWoman,
  man: WorryMan,
  thinking: ThinkingMan,
};

export default function ProblemsSection() {
  return (
    <section className="relative px-4 sm:px-6 py-16 md:py-24 overflow-hidden bg-white">
      <div className="relative z-10 max-w-xl mx-auto">
        <NeSectionHeading
          eyebrow="お悩み"
          title={
            <>
              <span className="block">新築外構で、こんなお悩みは</span>
              <span className="block">ありませんか？</span>
            </>
          }
          description={"新築を建てた方・建築中の方から、よくいただくお声です"}
        />

        {/* 悩み＝すべてキャラクター×吹き出しの会話形式 */}
        <div className="mt-11 space-y-8">
          {WORRIES.map((worry, i) => {
            const Character = CHARACTERS[worry.character];
            return (
              <motion.div
                key={worry.lines[1]}
                className="flex items-center gap-3 sm:gap-5"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: (i % 2) * 0.08, ease: "easeOut" }}
              >
                {!worry.right && <Character className="w-24 sm:w-32 shrink-0" />}
                <p
                  className={`ne-bubble-soft flex-1 text-[14px] sm:text-[16px] leading-[1.9] ${
                    worry.right ? "ne-soft-tail-r" : "ne-soft-tail-l"
                  }`}
                >
                  {worry.lines[0]}
                  <br />
                  <span className="ne-marker font-bold">{worry.lines[1]}</span>
                </p>
                {worry.right && <Character flip className="w-24 sm:w-32 shrink-0" />}
              </motion.div>
            );
          })}
        </div>

        {/* スタッフの結論 */}
        <div className="mt-12 flex items-center justify-center gap-3 sm:gap-5">
          <p className="ne-bubble-soft ne-soft-tail-r flex-1 text-[15px] sm:text-[16px] leading-[1.9]">
            そのお悩み、外構専門店への
            <span className="ne-marker font-bold text-[#b0502f]">直接相談</span>
            で解決できるかもしれません！
          </p>
          <StaffGuide flip className="w-28 sm:w-36 shrink-0" />
        </div>
      </div>
    </section>
  );
}
