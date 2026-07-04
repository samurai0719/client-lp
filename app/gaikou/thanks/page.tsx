import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Phone } from "lucide-react";
import TakanagaMetaPixel from "@/components/analytics/TakanagaMetaPixel";

// /gaikou LP最下部の問い合わせフォーム専用のサンクスページ。
// 共用の /thanks と分離し、このフォーム経由のCVをURL単位で計測できるようにする。
export const metadata: Metadata = {
  title: "ご相談ありがとうございます｜高長建設",
  description: "ご相談ありがとうございます。内容を確認のうえ、担当者よりご連絡いたします。",
  robots: { index: false, follow: false },
};

export default function GaikouThanksPage() {
  return (
    <div className="min-h-screen bg-[#fdfbf6] flex items-center justify-center px-4 py-16">
      <TakanagaMetaPixel />
      <div className="max-w-lg w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-[#eaf3ee] flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-[#2f7d5a]" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-[#10302a]">
            ご相談ありがとうございます
          </h1>
          <p className="text-[#3d4a45] leading-relaxed">
            内容を確認のうえ、担当者よりご連絡いたします。<br />
            お急ぎの場合は、お電話でもお問い合わせいただけます。
          </p>
        </div>

        <a
          href="tel:0582-37-5050"
          className="inline-flex items-center gap-2.5 px-6 py-4 rounded-2xl bg-[#174f3f] text-white font-semibold hover:bg-[#1f6450] transition-colors"
        >
          <Phone className="w-5 h-5" />
          お電話でのお問い合わせ
        </a>

        <div>
          <Link
            href="/takanaga"
            className="text-sm text-[#2f7d5a] hover:underline"
          >
            ← トップページへ戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
