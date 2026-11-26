import WorkDetail from "@/components/adofy-corp/works/WorkDetail";
import { corpMetadata } from "@/components/adofy-corp/seo";
import { CorpStructuredData, worksBreadcrumb } from "@/components/adofy-corp/StructuredData";

export const metadata = corpMetadata("works/rizap-golf");

export default function RizapGolfWorksPage() {
  return (
    <>
      <CorpStructuredData breadcrumb={worksBreadcrumb("works/rizap-golf")} />
      <WorkDetail slug="rizap-golf" storyTitle="集客戦略" storyKicker="STRATEGY">
        <h3>1. 狙う人：上達に伸び悩んでいるゴルファー</h3>
        <p>
          集客の中心に置いたのは、練習しているのにスコアやショットが思うように良くならない方です。「スライスが直らない」「ドライバーが安定しない」など、悩みがはっきりしている方ほど、上達の手段を探しています。
        </p>

        <h3>2. ゴール：入会ではなく「体験の予約」</h3>
        <p>
          ゴルフスクールは料金が高く、広告を見てすぐに入会を決める方はほとんどいません。そこで広告のゴールを、<strong>「体験レッスン付きゴルフ力診断」の予約</strong>に置きました。まず自分の課題を知ってもらうことを入口にし、入会を決めるのは体験のあとに回しています。
        </p>

        <h3>3. 訴求：3つの切り口で「通う理由」をつくる</h3>
        <ul>
          <li>
            <strong>悩みの解決</strong>：スライスやドライバーなど、具体的な悩みを冒頭で示して「自分のことだ」と感じてもらう
          </li>
          <li>
            <strong>変化の実感</strong>：「たった2ヶ月でこんなに変わったの？」のように、通ったあとの姿を想像してもらう
          </li>
          <li>
            <strong>レッスンへの抵抗をなくす</strong>：「上手い人ほど実はレッスンに通っていたりする。」で、習うことへの気後れを取り除く
          </li>
        </ul>

        <h3>4. 広告の役割分担：動画とバナー</h3>
        <p>
          動画広告は体験談の形にして、悩みに気づいてもらい、続きを見たくなる構成にしました。同じ訴求でもショートとロングの2つの長さを用意し、反応を比べながら使い分けています。バナー広告は変化と安心感を短く伝え、動画を見ていない方にも届く入口にしました。
        </p>

        <h3>5. 記事LP：予約までの不安を順番に解消する</h3>
        <p>広告をクリックした方が迷わず予約まで進めるよう、記事LPの流れを次の順番で設計しました。</p>
        <ul>
          <li>よくある悩みへの共感</li>
          <li>上達しない原因の説明</li>
          <li>RIZAP GOLFのレッスンでの解決方法</li>
          <li>体験レッスン付きゴルフ力診断の内容と当日の流れ</li>
          <li>予約ボタン</li>
        </ul>

        <h3>6. 改善：予約数を基準に、組み合わせを入れ替える</h3>
        <p>
          成果報酬型の運用のため、指標は予約の数に絞りました。訴求・動画の長さ・バナー・LPの組み合わせごとに結果を比べ、予約につながったものに配信を寄せて、反応が弱いものは作り直しています。
        </p>

        <blockquote>
          <b>「誰の、どんな悩みに応えるか」から広告をつくる</b>
          商材の魅力を並べるのではなく、見る人の悩みを入口にして、予約という小さな一歩につなげる。それがこの案件の集客戦略の軸です。
        </blockquote>
      </WorkDetail>
    </>
  );
}
