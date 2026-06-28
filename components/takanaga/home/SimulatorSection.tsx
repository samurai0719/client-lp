import Link from "next/link";
import Image from "next/image";
import { Cpu, ArrowRight } from "lucide-react";
import { siteConfig } from "@/data/takanaga/siteConfig";
import AnimateOnScroll from "@/components/takanaga/common/AnimateOnScroll";

export default function SimulatorSection() {
  return (
    <section
      className="relative overflow-hidden py-16 lg:py-24 px-4 sm:px-6 lg:px-8"
      style={{ background: "linear-gradient(160deg, #0f2744 0%, #1a3d6b 60%, #1d5fa6 100%)" }}
      aria-labelledby="simulator-heading"
    >
      {/* 背景デコ */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="sim-dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1" fill="rgba(255,255,255,0.04)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#sim-dots)" />
        <g stroke="rgba(255,255,255,0.04)" strokeWidth="1" fill="none">
          <circle cx="20%" cy="50%" r="200" />
          <circle cx="20%" cy="50%" r="320" />
        </g>
      </svg>

      <div className="relative mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* テキスト */}
          <AnimateOnScroll variant="right">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-5">
                <Cpu size={28} className="text-white" aria-hidden />
              </div>
              <p className="tkn-eyebrow !text-(--tkn-blue-light) mb-3">AI Simulation</p>
              <h2
                id="simulator-heading"
                className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-4"
              >
                AI外構リフォーム
                <br />シミュレーター
              </h2>
              <p className="text-white/75 text-base leading-relaxed mb-2 max-w-lg">
                ご自宅の外構写真を使って、リフォーム後の完成イメージを確認できます。
              </p>
              <p className="text-white/50 text-xs mb-8">
                ※ AI生成画像はイメージです。実際の施工結果・色・寸法・素材を保証するものではありません。
              </p>
              <Link
                href={siteConfig.externalLinks.simulatorUrl}
                className="tkn-btn-primary !bg-white !text-(--tkn-navy-deep) !text-base !py-4 !px-8"
                style={{ background: "#fff", color: "var(--tkn-navy-deep)" }}
              >
                無料で完成イメージを試す
                <ArrowRight size={18} aria-hidden />
              </Link>
            </div>
          </AnimateOnScroll>

          {/* サンプル画像 */}
          <AnimateOnScroll variant="scale" delay={150}>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/gaikou/works/case2-after.png"
                alt="AIシミュレーション サンプル施工イメージ"
                width={600}
                height={400}
                className="w-full object-cover aspect-[3/2]"
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(15,39,68,0.5) 0%, transparent 60%)" }}
                aria-hidden
              />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <Cpu size={14} className="text-white" aria-hidden />
                  <span className="text-xs text-white font-medium">AI生成イメージ（参考）</span>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
