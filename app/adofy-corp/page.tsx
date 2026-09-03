import { corpMetadata } from "@/components/adofy-corp/seo";
import HomeContent from "./HomeContent";
import { CorpStructuredData } from "@/components/adofy-corp/StructuredData";

// トップページはアニメーションのためクライアントコンポーネント。
// metadata はサーバー側でしか出せないため、ここで包んでいる。
export const metadata = corpMetadata("home");

export default function AdofyCorpHomePage() {
  return <HomeContent />;
}
