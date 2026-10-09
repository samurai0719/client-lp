import {
  CalendarCheck,
  CircleDollarSign,
  ClipboardList,
  Handshake,
  Layers,
  MessagesSquare,
  PiggyBank,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { PRICING } from "@/config/driver-company";
import CountUp from "./CountUp";
import { ZeroRelief } from "./illustrations/scenes";
import { BENEFITS, FEE_FLOW, type BenefitIcon } from "./content";
import { SectionHead } from "./ui";

const ICONS: Record<BenefitIcon, LucideIcon> = {
  zero: CircleDollarSign,
  post: ClipboardList,
  monthly: CalendarCheck,
  interview: Handshake,
  truck: Truck,
  layers: Layers,
  direct: MessagesSquare,
  budget: PiggyBank,
};

/**
 * ドラテクならどう変わるか。
 * 掲載 → 応募 → 面接 が全部0円で、入社した時に初めて料金が発生する、という流れを図で見せる。
 */
export default function Change() {
  return (
    <section className="dt-section dt-change" aria-labelledby="dt-change-title">
      <div className="dt-container dt-container--narrow">
        <SectionHead
          eyebrow="SOLUTION"
          id="dt-change-title"
          title={
            <>
              ドラテクなら、
              <br />
              <span className="dt-marker">採用できるまで0円。</span>
            </>
          }
        />

        <ZeroRelief className="dt-change__art" />

        <ol className="dt-flow" aria-label="料金が発生するまでの流れ">
          {FEE_FLOW.map((f, i) => (
            <li key={f.label} className="dt-flow__step">
              <span className="dt-flow__label">{f.label}</span>
              <span className="dt-flow__price">
                <CountUp value={f.price} from={100000} duration={1000} delay={i * 180} />
                <small>円</small>
              </span>
              <span className="dt-flow__note">{f.note}</span>
            </li>
          ))}
          <li className="dt-flow__step dt-flow__step--hire">
            <span className="dt-flow__label">入社</span>
            <span className="dt-flow__note">ドライバーが実際に入社</span>
          </li>
          <li className="dt-flow__step dt-flow__step--fee">
            <span className="dt-flow__pre">ここで初めて</span>
            <span className="dt-flow__fee">
              <CountUp value={PRICING.successFeeValue} duration={1400} delay={200} />
              <small>円{PRICING.taxNote}</small>
            </span>
            <span className="dt-flow__note">成功報酬（1名あたり）</span>
          </li>
        </ol>

        <div className="dt-change__explain">
          <p>
            求人を掲載しただけでは<strong>料金はかかりません。</strong>
          </p>
          <p>
            応募が来ても<strong>料金はかかりません。</strong>
          </p>
          <p>
            面接しても<strong>料金はかかりません。</strong>
          </p>
          <p>実際にドライバーが入社した時にだけ、成功報酬をいただきます。</p>
        </div>

        <p className="dt-change__emph">
          採用できなければ、
          <br />
          <b>0円</b>です。
        </p>
      </div>

      <div className="dt-container">
        <h3 className="dt-subhead">ドラテクで変わること</h3>
        <ul className="dt-benefits">
          {BENEFITS.map((b) => {
            const Icon = ICONS[b.icon];
            return (
              <li key={b.icon} className="dt-bcard">
                <span className="dt-bcard__icon" aria-hidden="true">
                  <Icon strokeWidth={2.2} />
                </span>
                <p className="dt-bcard__title">
                  {b.title[0]}
                  <br />
                  <strong>{b.title[1]}</strong>
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
