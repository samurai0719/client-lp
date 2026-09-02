import type { Metadata } from "next";
import "./adofy-corp.css";

export const metadata: Metadata = {
  title: {
    default: "adofy｜岐阜のWebマーケティング・ホームページ制作",
    template: "%s｜adofy",
  },
  description:
    "adofyは岐阜を拠点に、広告運用とホームページ制作で成果につながるWebマーケティングを行っています。",
};

export default function AdofyCorpLayout({ children }: { children: React.ReactNode }) {
  // 地色とトークンをこのスコープ内だけに効かせる（他LPに影響させない）
  return <div className="adofy-corp flex min-h-screen flex-col">{children}</div>;
}
