import type { Metadata } from "next";
import "../../adofy/adofy.css";
import "../contact.css";
import AdofyMetaPixel from "@/components/analytics/AdofyMetaPixel";
import LpInsightTracker, { ADOFY_LP_PROJECT_ID } from "@/components/analytics/LpInsightTracker";
import { ContactHeader, ThanksBody } from "@/components/adofy/contact/ContactChrome";

export const metadata: Metadata = {
  title: "無料相談を受け付けました｜adofy",
  description: "無料相談のお申し込みを受け付けました。内容を確認後、ご希望の連絡方法にてご連絡いたします。",
  robots: { index: false, follow: false },
};

export default function ThanksPage() {
  return (
    <div className="adf-lp adf-contact">
      <AdofyMetaPixel />
      <LpInsightTracker projectId={ADOFY_LP_PROJECT_ID} />
      <ContactHeader />
      <main className="adf-contact__main adf-contact__main--thanks">
        <ThanksBody />
      </main>
    </div>
  );
}
