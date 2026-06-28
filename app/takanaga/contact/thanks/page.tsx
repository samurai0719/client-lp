import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { siteConfig } from "@/data/takanaga/siteConfig";

export const metadata: Metadata = {
  title: "お問い合わせ受付完了",
  description: "お問い合わせを受け付けました。担当者よりご連絡いたします。",
  robots: { index: false, follow: false },
};

export default function ThanksPage() {
  return (
    <div className="flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-(--tkn-bg)">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-(--tkn-blue-light) flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={32} className="text-(--tkn-blue)" />
        </div>
        <h1 className="text-2xl font-bold text-(--tkn-navy-deep) mb-3">
          お問い合わせを受け付けました
        </h1>
        <p className="text-(--tkn-text-muted) text-base leading-relaxed mb-8">
          内容を確認の上、担当者よりご連絡いたします。
          返信には数日いただく場合がございます。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/takanaga" className="tkn-btn-primary">
            トップページへ
            <ArrowRight size={16} aria-hidden />
          </Link>
          <Link href="/takanaga/works" className="tkn-btn-outline">
            施工事例を見る
          </Link>
        </div>
      </div>
    </div>
  );
}
