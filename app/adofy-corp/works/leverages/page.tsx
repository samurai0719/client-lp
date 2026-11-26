import WorkDetail from "@/components/adofy-corp/works/WorkDetail";
import { corpMetadata } from "@/components/adofy-corp/seo";
import { CorpStructuredData, worksBreadcrumb } from "@/components/adofy-corp/StructuredData";

export const metadata = corpMetadata("works/leverages");

export default function LeveragesWorksPage() {
  return (
    <>
      <CorpStructuredData breadcrumb={worksBreadcrumb("works/leverages")} />
      <WorkDetail slug="leverages">
        <h3>職種ごとに、冒頭の一言を変える</h3>
        <p>看護師、施工管理、タクシードライバーでは、転職で重視することが異なります。レバウェル看護では<strong>「14時出勤」「夜勤専従」「年間休日130日」</strong>、レバジョブでは<strong>「土日祝休み」「未経験から転職」</strong>など、職種と働き方に合わせて冒頭の一言を変えた動画を制作しました。</p>
        <h3>最初の数秒で、自分ごとにしてもらう</h3>
        <p>SNSの動画広告は、最初の数秒で見るかどうかが決まります。条件をテロップで大きく見せ、対象の方がすぐに「自分のことだ」と感じられる構成にしています。</p>
      </WorkDetail>
    </>
  );
}
