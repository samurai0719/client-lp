import Link from "next/link";
import Image from "next/image";
import {
  Car, Warehouse, Fence, DoorOpen, Footprints, Sprout,
  LayoutDashboard, Flower, CircleDot, Droplets, Home, ArrowRight,
} from "lucide-react";
import { visibleServices } from "@/data/takanaga/services";
import AnimateOnScroll from "@/components/takanaga/common/AnimateOnScroll";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  car: Car,
  warehouse: Warehouse,
  fence: Fence,
  "door-open": DoorOpen,
  footprints: Footprints,
  sprout: Sprout,
  "layout-dashboard": LayoutDashboard,
  flower: Flower,
  "circle-dot": CircleDot,
  droplets: Droplets,
  home: Home,
};

// Featured services with images shown larger
const FEATURED_IDS = ["parking", "grass", "fence"];

export default function ServicesSection() {
  const featured = visibleServices.filter((s) => FEATURED_IDS.includes(s.id) && s.image);
  const rest = visibleServices.filter((s) => !FEATURED_IDS.includes(s.id) || !s.image);

  return (
    <section
      className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-(--tkn-bg)"
      aria-labelledby="services-heading"
    >
      <div className="mx-auto max-w-6xl">
        <AnimateOnScroll variant="up" className="text-center mb-10">
          <p className="tkn-eyebrow justify-center mb-3">Services</p>
          <h2
            id="services-heading"
            className="text-2xl sm:text-3xl font-bold text-(--tkn-navy-deep) leading-tight"
          >
            対応している工事
          </h2>
          <span className="tkn-heading-line mx-auto mt-3 mb-4" />
          <p className="text-(--tkn-text-muted) text-sm sm:text-base max-w-xl mx-auto">
            部分的な工事から外構全体のリフォームまで、規模を問わず対応しています。
          </p>
        </AnimateOnScroll>

        {/* 画像付きフィーチャーカード */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {featured.map((service, i) => {
            const Icon = ICON_MAP[service.icon] ?? Home;
            return (
              <AnimateOnScroll key={service.id} variant="scale" delay={i * 100}>
                <div className="tkn-card group overflow-hidden">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={service.image!}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(to top, rgba(15,39,68,0.7) 0%, transparent 60%)" }}
                      aria-hidden
                    />
                    <div className="absolute bottom-0 left-0 p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 rounded-md bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Icon size={14} className="text-white" />
                        </div>
                      </div>
                      <h3 className="text-sm font-bold text-white leading-snug">
                        {service.title}
                      </h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-(--tkn-text-muted) leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>

        {/* アイコンカードグリッド */}
        <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {rest.map((service, i) => {
            const Icon = ICON_MAP[service.icon] ?? Home;
            return (
              <AnimateOnScroll key={service.id} variant="up" delay={i * 60} as="li">
                <div className="tkn-card h-full p-4 hover:border-(--tkn-blue-bright) group">
                  <div className="w-9 h-9 rounded-lg bg-(--tkn-blue-light) flex items-center justify-center mb-3 group-hover:bg-(--tkn-blue) transition-colors">
                    <Icon size={18} className="text-(--tkn-blue) group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xs font-bold text-(--tkn-navy-deep) leading-snug mb-1">
                    {service.title}
                  </h3>
                  <p className="text-[0.6875rem] text-(--tkn-text-muted) leading-relaxed line-clamp-2">
                    {service.description}
                  </p>
                </div>
              </AnimateOnScroll>
            );
          })}
        </ul>

        <AnimateOnScroll variant="fade" delay={100} className="text-center mt-8">
          <Link
            href="/takanaga/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-(--tkn-blue-bright) hover:text-(--tkn-navy) transition-colors"
          >
            工事内容の詳細を見る
            <ArrowRight size={16} aria-hidden />
          </Link>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
