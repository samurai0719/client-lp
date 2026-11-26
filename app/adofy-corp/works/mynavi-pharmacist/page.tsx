import WorkDetail from "@/components/adofy-corp/works/WorkDetail";
import { corpMetadata } from "@/components/adofy-corp/seo";
import { CorpStructuredData, worksBreadcrumb } from "@/components/adofy-corp/StructuredData";

export const metadata = corpMetadata("works/mynavi-pharmacist");

export default function MynaviPharmacistWorksPage() {
  return (
    <>
      <CorpStructuredData breadcrumb={worksBreadcrumb("works/mynavi-pharmacist")} />
      <WorkDetail slug="mynavi-pharmacist">
        <h3>競合の多い薬剤師転職市場で、選ばれるために</h3>
        <p>マイナビ薬剤師の集客では、まず「競合サービスが多い中で、どのように選ばれるか」を第一に考えました。</p>
        <p>薬剤師転職の領域は、大手企業を含めて競合が多く、広告費を成果報酬額の範囲内に抑えなければ、成果が発生しても赤字になってしまいます。</p>
        <p>また、国内の薬剤師は<strong>約30万人</strong>と、一般的な転職市場と比べて対象となるユーザーが限られています。そのため、薬剤師全体に向けて同じ広告を配信するのではなく、誰に、どのような価値を届けるのかを明確にする必要がありました。</p>
        <h3>病院薬剤師というターゲットに着目</h3>
        <p>さまざまな広告や訴求を試した中で、私たちは「病院薬剤師」に着目しました。</p>
        <p>病院薬剤師は、他の勤務先で働く薬剤師と比べて、必ずしも給与が高いとは限りません。一方で、勤務終了時間が比較的早く、残業が少ない職場や、休日を確保しやすい職場も多くあります。</p>
        <p>そこで、「転職して年収を上げたい方」を中心に集客するのではなく、<strong>仕事だけでなく、家族との時間や自分の時間も大切にしたい方</strong>に向けた訴求へと切り替えました。</p>
        <h3>年収訴求から、ワークライフバランス訴求へ</h3>
        <p>広告やランディングページでは、給与の高さだけを強調するのではなく、以下のような悩みに寄り添う内容を中心に設計しました。</p>
        <ul>
          <li>残業を減らしたい</li>
          <li>できるだけ早く帰りたい</li>
          <li>休日をしっかり確保したい</li>
          <li>無理なく長く働ける職場を探したい</li>
        </ul>
        <p>病院薬剤師の求人が持つ「働きやすさ」という価値を明確に伝えたことで、年収アップだけを目的とした転職希望者とは異なる層へアプローチできるようになりました。</p>
        <h3>ターゲットを絞ることで、効率的な集客を実現</h3>
        <p>市場全体を広く狙うのではなく、病院薬剤師という領域に絞り、ワークライフバランスを重視する方へ訴求を変更した結果、競合との差別化につながり、効率的な集客を実現できました。</p>
        <blockquote>
          <b>「どのような方に、どのような価値を届ければ選ばれるのか」</b>
          ターゲットと訴求内容を一致させることが、成果につながる重要なポイントとなりました。
        </blockquote>
      </WorkDetail>
    </>
  );
}
