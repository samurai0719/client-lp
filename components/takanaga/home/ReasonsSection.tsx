import {
  MessageCircle,
  ClipboardList,
  FileText,
  Layers,
  MapPin,
  Phone,
} from "lucide-react";
import AnimateOnScroll from "@/components/takanaga/common/AnimateOnScroll";

const REASONS = [
  {
    icon: MessageCircle,
    num: "01",
    title: "暮らしに合わせた提案",
    body: "今の生活で感じている不便を丁寧にお聞きし、それを解消するための外構リフォームをご提案します。",
  },
  {
    icon: ClipboardList,
    num: "02",
    title: "現地確認に基づく見積もり",
    body: "現場をしっかり確認した上でお見積もりを作成します。見積書の内容についても分かりやすくご説明します。",
  },
  {
    icon: FileText,
    num: "03",
    title: "工事内容を丁寧に説明",
    body: "どのような工事をどういう理由で行うのか、契約前にしっかりご説明し、納得いただいてから進めます。",
  },
  {
    icon: Layers,
    num: "04",
    title: "小規模な工事にも対応",
    body: "駐車場の一部補修やフェンスの新設など、小さな工事のみでもご相談いただけます。",
  },
  {
    icon: MapPin,
    num: "05",
    title: "地域に合わせた迅速な対応",
    body: "岐阜県・愛知県・三重県の東海エリアを中心に対応しているため、現地調査や工事のスケジュール調整がしやすい体制です。",
  },
  {
    icon: Phone,
    num: "06",
    title: "施工後も相談しやすい体制",
    body: "工事後に気になる点があった場合も、まずはご連絡ください。状況を確認の上、丁寧に対応します。",
  },
];

export default function ReasonsSection() {
  return (
    <section
      className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-(--tkn-bg)"
      aria-labelledby="reasons-heading"
    >
      <div className="mx-auto max-w-6xl">
        <AnimateOnScroll variant="up" className="text-center mb-10">
          <p className="tkn-eyebrow justify-center mb-3">Why Choose Us</p>
          <h2
            id="reasons-heading"
            className="text-2xl sm:text-3xl font-bold text-(--tkn-navy-deep) leading-tight"
          >
            選ばれる理由
          </h2>
          <span className="tkn-heading-line mx-auto mt-3" />
        </AnimateOnScroll>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {REASONS.map((reason, i) => {
            const Icon = reason.icon;
            return (
              <AnimateOnScroll key={i} variant="up" delay={i * 80} as="li">
                <div className="tkn-card p-6 h-full group hover:border-(--tkn-blue-bright)">
                  {/* 番号 + アイコン */}
                  <div className="flex items-start gap-3 mb-4">
                    <span
                      className="text-4xl font-black leading-none"
                      style={{ color: "rgba(45,125,210,0.12)" }}
                      aria-hidden
                    >
                      {reason.num}
                    </span>
                    <div className="w-11 h-11 rounded-xl bg-(--tkn-blue-light) flex items-center justify-center shrink-0 group-hover:bg-(--tkn-blue) transition-colors">
                      <Icon size={22} className="text-(--tkn-blue) group-hover:text-white transition-colors" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-(--tkn-navy-deep) mb-2 leading-snug">
                    {reason.title}
                  </h3>
                  <p className="text-sm text-(--tkn-text-muted) leading-relaxed">
                    {reason.body}
                  </p>
                </div>
              </AnimateOnScroll>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
