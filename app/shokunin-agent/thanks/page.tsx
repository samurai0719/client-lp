import type { Metadata } from "next";
import { CircleCheck } from "lucide-react";
import "../../saiyo-rescue/saiyo-rescue.css";
import AdofyMetaPixel from "@/components/analytics/AdofyMetaPixel";
import { OPERATOR } from "@/components/saiyo-rescue/config";
import { SERVICE_NAME } from "@/components/shokunin-agent/config";

export const metadata: Metadata = {
  title: `お問い合わせありがとうございます｜${SERVICE_NAME}`,
  robots: { index: false, follow: false },
};

/**
 * 送信完了ページ。
 * Lead イベントはフォーム側で「API成功時に1回だけ」送っている（URL直打ちで二重計測しないため、ここでは送らない）。
 */
export default function ShokuninAgentThanksPage() {
  return (
    <div className="sr-lp sr-thanks">
      <AdofyMetaPixel />
      <main className="sr-thanks__main">
        <div className="sr-thanks__card">
          <CircleCheck aria-hidden="true" className="sr-thanks__icon" />
          <h1 className="sr-thanks__title">お問い合わせありがとうございます。</h1>
          <p className="sr-thanks__text">
            内容を確認後、
            <br className="sr-sp-only" />
            担当者よりご連絡いたします。
          </p>
          <p className="sr-thanks__note">
            ※しばらく経ってもご連絡がない場合は、お手数ですが
            <a href={`mailto:${OPERATOR.email}`}>{OPERATOR.email}</a>
            までご連絡ください。
          </p>
          <a href="/shokunin-agent" className="sr-thanks__back">
            {SERVICE_NAME} トップへ戻る
          </a>
        </div>
      </main>
    </div>
  );
}
