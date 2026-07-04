import Link from "next/link";
import Image from "next/image";
import { MapPin, ExternalLink } from "lucide-react";
import { siteConfig } from "@/data/takanaga/siteConfig";

const NAV_COLUMNS = [
  {
    heading: "施工について",
    links: [
      { href: "/services", label: "工事内容一覧" },
      { href: "/works", label: "施工事例" },
      { href: "/price", label: "費用目安" },
      { href: "/flow", label: "ご依頼の流れ" },
    ],
  },
  {
    heading: "会社について",
    links: [
      { href: "/company", label: "会社案内" },
      { href: "/strengths", label: "選ばれる理由" },
      { href: "/area", label: "対応地域" },
      { href: "/faq", label: "よくある質問" },
    ],
  },
  {
    heading: "お役立ち",
    links: [
      { href: "/news", label: "お知らせ・コラム" },
      { href: siteConfig.externalLinks.simulatorUrl, label: "AIシミュレーション" },
      { href: "/contact", label: "お問い合わせ" },
      { href: "/privacy", label: "プライバシーポリシー" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="text-white mt-0" style={{ background: "linear-gradient(135deg, #0f2744 0%, #1a3d6b 100%)" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
          {/* ブランド */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <Image
                src="/images/gaikou/logo-transparent.png"
                alt=""
                width={36}
                height={36}
                className="w-9 h-9 object-contain brightness-0 invert"
              />
              <span className="text-lg font-bold tracking-wide">高長建設</span>
            </Link>
            <p className="text-sm text-white/70 leading-relaxed mb-4">
              岐阜県・愛知県・三重県の外構リフォーム専門会社。
              駐車場・カーポート・フェンス・お庭まわりの工事に対応しています。
            </p>
            {siteConfig.company.phone && (
              <a
                href={`tel:${siteConfig.company.phone}`}
                className="text-lg font-bold text-white hover:text-white/80 transition-colors"
              >
                {siteConfig.company.phone}
              </a>
            )}
            {siteConfig.company.businessHours && (
              <p className="text-xs text-white/50 mt-1">{siteConfig.company.businessHours}</p>
            )}
            {siteConfig.company.address && (
              <div className="mt-4">
                {siteConfig.company.googleMapsUrl ? (
                  <Link
                    href={siteConfig.company.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-start gap-1.5 text-xs text-white/60 hover:text-white/90 transition-colors"
                  >
                    <MapPin size={12} className="shrink-0 mt-0.5" aria-hidden />
                    <span>
                      {siteConfig.company.postalCode && `〒${siteConfig.company.postalCode} `}
                      {siteConfig.company.address}
                      <ExternalLink size={10} className="inline ml-1" aria-hidden />
                    </span>
                  </Link>
                ) : (
                  <p className="inline-flex items-start gap-1.5 text-xs text-white/60">
                    <MapPin size={12} className="shrink-0 mt-0.5" aria-hidden />
                    <span>
                      {siteConfig.company.postalCode && `〒${siteConfig.company.postalCode} `}
                      {siteConfig.company.address}
                    </span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* ナビゲーション */}
          {NAV_COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3 className="text-xs font-bold tracking-widest text-white/50 uppercase mb-4">
                {col.heading}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} 高長建設. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              プライバシーポリシー
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
