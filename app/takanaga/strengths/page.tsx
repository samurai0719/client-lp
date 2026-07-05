import type { Metadata } from "next";
import {
  MessageCircle, ClipboardList, FileText, Layers, MapPin, Phone,
  Camera, Handshake
} from "lucide-react";
import PageHero from "@/components/takanaga/common/PageHero";
import CTASection from "@/components/takanaga/common/CTASection";
import { siteConfig } from "@/data/takanaga/siteConfig";

export const metadata: Metadata = {
  title: "高長建設が選ばれる理由",
  description: "高長建設が岐阜・愛知・三重で選ばれる理由。現地確認に基づく正確な見積もり・施工会社直接対応・丁寧な工事説明・小規模工事への対応・施工後のアフターフォローをご紹介します。",
  alternates: { canonical: `https://${siteConfig.domain}/strengths` },
};

const STRENGTHS = [
  {
    icon: MessageCircle,
    number: "01",
    title: "暮らしに合わせた提案",
    body: "お客様が今の暮らしの中で感じている不便や悩みをお聞きし、それを解消するためのリフォームをご提案します。デザインや流行だけでなく、日常的な使いやすさを大切にしています。",
  },
  {
    icon: ClipboardList,
    number: "02",
    title: "現地を確認した上でのお見積もり",
    body: "写真やお話だけで概算をお伝えすることはできますが、正確なお見積もりには現地確認が必要です。現場に直接足を運び、地盤の状態・排水の状況・重機の入れるかどうかなどを確認した上でお見積もりします。",
  },
  {
    icon: FileText,
    number: "03",
    title: "工事内容を丁寧に説明",
    body: "なぜこの工事が必要か、どのような手順で進めるかを、お客様に分かりやすくご説明します。見積書の内容についても、ご不明な点があれば遠慮なくご質問ください。",
  },
  {
    icon: Layers,
    number: "04",
    title: "小規模な工事にも対応",
    body: "大規模なリフォームでなくても、駐車場の一部補修・フェンスの一部交換・砂利敷きのみなど、小さな工事でもご相談いただけます。",
  },
  {
    icon: Camera,
    number: "05",
    title: "工事の進捗を報告",
    body: "工事の状況を写真でお伝えするよう心がけています。お客様が工事の進み方を確認しやすい体制を整えています。",
  },
  {
    icon: MapPin,
    number: "06",
    title: "地域に合わせた対応",
    body: "岐阜県・愛知県・三重県の東海エリアを中心に対応しています。地域の気候や土地の特徴を踏まえた提案をすることができます。",
  },
  {
    icon: Phone,
    number: "07",
    title: "施工後も相談しやすい体制",
    body: "工事が完了した後も、気になる点や不具合があればご連絡ください。状況を確認の上、丁寧に対応します。",
  },
  {
    icon: Handshake,
    number: "08",
    title: "納得いただいてから契約",
    body: "お見積もりや工事内容に納得いただいてからご契約をいただきます。お断りいただいても費用は発生しません。他社との比較検討も歓迎しています。",
  },
];

export default function StrengthsPage() {
  return (
    <>
      <PageHero
        eyebrow="Why Choose Us"
        title="選ばれる理由"
        subtitle="高長建設の特徴をご紹介します。"
        path="/strengths"
        breadcrumbs={[{ label: "選ばれる理由" }]}
      />

      <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-(--tkn-bg)">
        <div className="mx-auto max-w-4xl space-y-8">
          {STRENGTHS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.number} className="tkn-card p-6 sm:p-8 flex gap-5 sm:gap-8">
                <div className="shrink-0 text-right">
                  <span className="text-4xl font-black text-(--tkn-blue-light) select-none">
                    {s.number}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-(--tkn-blue-light) flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-(--tkn-blue)" />
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-(--tkn-navy-deep) leading-snug">
                      {s.title}
                    </h2>
                  </div>
                  <p className="text-sm sm:text-base text-(--tkn-text-muted) leading-relaxed">
                    {s.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <CTASection />
    </>
  );
}
