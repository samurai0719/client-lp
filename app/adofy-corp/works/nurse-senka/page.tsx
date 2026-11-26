import WorkDetail from "@/components/adofy-corp/works/WorkDetail";
import { corpMetadata } from "@/components/adofy-corp/seo";
import { CorpStructuredData, worksBreadcrumb } from "@/components/adofy-corp/StructuredData";

export const metadata = corpMetadata("works/nurse-senka");

export default function NurseSenkaWorksPage() {
  return (
    <>
      <CorpStructuredData breadcrumb={worksBreadcrumb("works/nurse-senka")} />
      <WorkDetail slug="nurse-senka">
        <h3>働き方ごとに訴求を分ける</h3>
        <p>看護師の転職理由は、休みの多さ、夜勤の有無、初めての転職への不安など、人によって異なります。そこで<strong>「週休3日」「初めての転職」「施設訪問看護」</strong>のように、働き方ごとに動画広告とバナーを分けて制作しました。</p>
        <h3>看護師の目線で語る動画</h3>
        <p>動画は、看護師が自分の働き方を話す形にしています。条件を並べるだけでなく、転職したあとの毎日を想像しやすくしました。</p>
        <h3>比べて選べるLP</h3>
        <p>広告から移るLPでは、転職サイトを比べながら選べる構成にし、登録までの流れをわかりやすくしています。</p>
        <blockquote>
          <b>一つの広告で全員を狙わない</b>
          働き方の希望ごとに訴求を分けることで、見る人が「自分のことだ」と感じられる広告を目指しました。
        </blockquote>
      </WorkDetail>
    </>
  );
}
