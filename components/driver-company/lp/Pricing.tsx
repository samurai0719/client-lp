import Link from "next/link";
import { CircleCheck, CircleX } from "lucide-react";
import { PATHS, PRICING } from "@/config/driver-company";
import CountUp from "./CountUp";
import { RefundShield } from "./illustrations/scenes";
import { COMPARE_NOTE, COMPARE_ROWS, REFUND_ROWS, ZERO_ITEMS } from "./content";
import { Breakable, CtaBlock, SectionHead } from "./ui";

/** 料金 → 求人媒体との比較 → 早期退職時の返金制度 → CTA */
export default function Pricing() {
  return (
    <section className="dt-section dt-pricing" id="pricing" aria-labelledby="dt-pricing-title">
      <div className="dt-container dt-container--narrow">
        <SectionHead
          eyebrow="PRICE"
          id="dt-pricing-title"
          title={
            <>
              料金は、
              <br />
              <span className="dt-marker">採用できた時だけ。</span>
            </>
          }
        />

        <div className="dt-price">
          <ul className="dt-price__zeros">
            {ZERO_ITEMS.map((label, i) => (
              <li key={label}>
                <span className="dt-price__label">{label}</span>
                <span className="dt-price__zero">
                  <CountUp value={0} from={100000} duration={1000} delay={i * 120} />
                  <small>円</small>
                </span>
              </li>
            ))}
          </ul>

          <div className="dt-price__fee">
            <p className="dt-price__fee-pre">
              <span>入社時</span>
              <span>1名</span>
            </p>
            <p className="dt-price__fee-value">
              <CountUp value={PRICING.successFeeValue} duration={1500} />
              <small>円{PRICING.taxNote}</small>
            </p>
            <p className="dt-price__fee-note">ドラテク経由で応募した方が、実際に入社した場合のみ</p>
          </div>

          <div className="dt-price__copy">
            <p>
              採用できなければ
              <br className="dt-sp-only" />
              <strong>料金はかかりません。</strong>
            </p>
            <p>
              <strong>月額契約もありません。</strong>
            </p>
          </div>
        </div>

        {/* 求人媒体との比較 */}
        <h3 className="dt-subhead">求人媒体との違い</h3>
        <div className="dt-compare" role="table" aria-label="掲載課金型の求人媒体とドラテクの料金比較">
          <div className="dt-compare__row dt-compare__row--head" role="row">
            <span role="columnheader" className="dt-compare__label" />
            <span role="columnheader" className="dt-compare__media">
              掲載課金型の
              <br />
              求人媒体
            </span>
            <span role="columnheader" className="dt-compare__dt">ドラテク</span>
          </div>
          {COMPARE_ROWS.map((r) => (
            <div key={r.label} className="dt-compare__row" role="row">
              <span role="rowheader" className="dt-compare__label">
                {r.label}
              </span>
              <span role="cell" className="dt-compare__media">
                <CircleX aria-hidden="true" />
                {r.media}
              </span>
              <span role="cell" className="dt-compare__dt">
                <CircleCheck aria-hidden="true" />
                <span>
                  <Breakable text={r.doratech} />
                </span>
              </span>
            </div>
          ))}
          <div className="dt-compare__row dt-compare__row--total" role="row">
            <span role="rowheader" className="dt-compare__label">
              採用できた時
            </span>
            <span role="cell" className="dt-compare__media">
              媒体・プランによる
            </span>
            <span role="cell" className="dt-compare__dt">
              1名{PRICING.successFee}
              {PRICING.taxNote}
            </span>
          </div>
        </div>
        <p className="dt-note">{COMPARE_NOTE}</p>

        {/* 早期退職時の返金制度 */}
        <div className="dt-refund">
          <RefundShield className="dt-refund__art" />
          <p className="dt-refund__badge">安心の返金制度</p>
          <h3 className="dt-refund__title">
            早期退職時の
            <br className="dt-sp-only" />
            返金制度あり
          </h3>
          <p className="dt-refund__lead">入社後すぐに退職してしまった場合も、退職までの日数に応じて返金します。</p>
          <ul className="dt-refund__bars">
            {REFUND_ROWS.map((r) => (
              <li key={r.period} className={r.rate === 0 ? "is-none" : undefined}>
                <span className="dt-refund__period">{r.period}</span>
                <span className="dt-refund__track">
                  <span className="dt-refund__fill" style={{ width: `${Math.max(r.rate, 0)}%` }} />
                  <span className="dt-refund__rate">{r.rate === 0 ? "返金なし" : `${r.rate}%返金`}</span>
                </span>
                {r.rate > 0 && <span className="dt-refund__amount">{r.amount.toLocaleString("ja-JP")}円</span>}
              </li>
            ))}
          </ul>
          <p className="dt-note">
            ※実際の契約条件・適用条件に従います。返金の対象・対象外は
            <Link href={PATHS.refundPolicy}>早期退職時返金規程</Link>
            をご確認ください。
          </p>
        </div>

        <CtaBlock
          location="pricing"
          lead={
            <>
              採用できるまで0円。
              <br />
              入社した時だけ<strong>{PRICING.successFee}</strong>。
            </>
          }
        />
      </div>
    </section>
  );
}
