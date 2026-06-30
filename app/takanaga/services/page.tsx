import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Car, Warehouse, Fence, DoorOpen, Footprints, Sprout,
  LayoutDashboard, Flower, CircleDot, Droplets, Home, ArrowRight,
} from "lucide-react";
import PageHero from "@/components/takanaga/common/PageHero";
import CTASection from "@/components/takanaga/common/CTASection";
import { visibleServices } from "@/data/takanaga/services";
import { siteConfig } from "@/data/takanaga/siteConfig";

export const metadata: Metadata = {
  title: "工事内容",
  description:
    "高長建設の対応工事一覧。駐車場・カーポート・フェンス・門柱・玄関アプローチ・人工芝・ウッドデッキ・庭リフォームなど、外構まわりの工事に対応しています。",
  alternates: { canonical: `https://${siteConfig.domain}/takanaga/services` },
};

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  car: Car, warehouse: Warehouse, fence: Fence, "door-open": DoorOpen,
  footprints: Footprints, sprout: Sprout, "layout-dashboard": LayoutDashboard,
  flower: Flower, "circle-dot": CircleDot, droplets: Droplets, home: Home,
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="工事内容"
        subtitle="部分的な工事から外構全体のリフォームまで、規模を問わず対応しています。"
        breadcrumbs={[{ label: "工事内容" }]}
      />

      <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-(--tkn-bg)">
        <div className="mx-auto max-w-6xl">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleServices.map((service) => {
              const Icon = ICON_MAP[service.icon] ?? Home;
              return (
                <li key={service.id} className="tkn-card overflow-hidden">
                  {service.image && (
                    <div className="relative aspect-[16/9] bg-(--tkn-warm-gray)">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-(--tkn-blue-light) flex items-center justify-center shrink-0">
                        <Icon size={20} className="text-(--tkn-blue)" />
                      </div>
                      <h2 className="text-base font-bold text-(--tkn-navy-deep)">
                        {service.title}
                      </h2>
                    </div>
                    <p className="text-sm text-(--tkn-text-muted) leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-12 p-6 bg-(--tkn-blue-light) rounded-xl text-center">
            <p className="text-(--tkn-navy-deep) text-base font-semibold mb-2">
              上記以外の工事についてもご相談ください
            </p>
            <p className="text-sm text-(--tkn-text-muted) mb-4">
              掲載していない工事でも、対応できる場合があります。お気軽にお問い合わせください。
            </p>
            <Link href="/contact" className="tkn-btn-primary">
              工事について相談する
              <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
