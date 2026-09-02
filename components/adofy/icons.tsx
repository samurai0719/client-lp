import React from "react";
import type { IndustryId, ProblemId, ReasonId } from "./config";

/* ═══════════════════════════════════════════════════════════════════════════
   すべて自作の inline SVG。既製アイコンセットは使用していない。
   data-anim / data-draw 属性が CSS 側のホバー・線描画アニメーションのフックになる。
   装飾目的なので aria-hidden。意味は隣接するテキストが担う。
   ═══════════════════════════════════════════════════════════════════════════ */

/** 線描画アニメーション用に、パスのおおよその長さを CSS変数として渡す */
const len = (n: number) => ({ "--len": n }) as React.CSSProperties;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
  focusable: "false" as const,
};

/* ── 4. お悩みアイコン（64×64） ─────────────────────────────────────────── */

const PROBLEM_ICONS: Record<ProblemId, React.ReactElement> = {
  // 利益が残らない：下降する利益グラフ
  profit: (
    <>
      <path d="M10 10v44h44" opacity="0.45" />
      <path data-anim="draw" style={len(78)} d="M17 20l11 13 9-6 20 21" />
      <path data-anim="fall" d="M57 38v10H47" />
      <circle cx="28" cy="33" r="2.6" fill="currentColor" stroke="none" opacity="0.8" />
      <circle cx="37" cy="27" r="2.6" fill="currentColor" stroke="none" opacity="0.8" />
    </>
  ),

  // 自社集客したい：建物とWeb集客の矢印
  direct: (
    <>
      <path d="M22 54V22l12-8 12 8v32" />
      <path d="M14 54h44" opacity="0.45" />
      <path d="M29 32h4M35 32h4M29 41h4M35 41h4" opacity="0.75" />
      <path data-anim="draw" style={len(44)} d="M8 20c8 0 12 6 12 12" />
      <path d="M16 30l4 3 3-4" />
      <path data-anim="draw" style={len(44)} d="M60 20c-8 0-12 6-12 12" opacity="0.7" />
    </>
  ),

  // 従業員が集まらない：欠けた人物シルエット
  hire: (
    <>
      <circle cx="17" cy="24" r="6" />
      <path d="M7 47c0-6 4.5-10 10-10s10 4 10 10" />
      <circle cx="34" cy="24" r="6" opacity="0.7" />
      <path d="M24 47c0-6 4.5-10 10-10s10 4 10 10" opacity="0.7" />
      {/* 集まらない枠（破線） */}
      <circle cx="51" cy="24" r="6" strokeDasharray="3 4" opacity="0.55" />
      <path d="M41 47c0-6 4.5-10 10-10s10 4 10 10" strokeDasharray="3 4" opacity="0.55" />
      <path data-anim="blink" d="M47 20l8 8M55 20l-8 8" opacity="0.9" />
    </>
  ),

  // 支払金額が安い：請求書と下向き矢印
  price: (
    <>
      <path d="M14 8h26l10 10v30a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4V12a4 4 0 0 1 4-4z" opacity="0.5" />
      <path d="M39 8v11h11" opacity="0.5" />
      <path d="M18 27h16M18 34h12" />
      <path data-anim="fall" d="M45 32v16" />
      <path data-anim="fall" d="M39 42l6 6 6-6" />
    </>
  ),

  // 支払いが遅い：時計と請求書
  payment: (
    <>
      <path d="M12 10h22l8 8v12" opacity="0.5" />
      <path d="M12 10v36a4 4 0 0 0 4 4h10" opacity="0.5" />
      <path d="M19 24h13M19 31h9" />
      <circle cx="42" cy="42" r="14" />
      <path data-anim="spin" d="M42 34v8l6 4" />
    </>
  ),
};

export function ProblemIcon({ id }: { id: ProblemId }) {
  return (
    <svg {...base} className="adf-pcard__icon" viewBox="0 0 64 64">
      {PROBLEM_ICONS[id]}
    </svg>
  );
}

/* ── 6. 選ばれる理由アイコン（100×100・線が描かれる） ───────────────────── */

const REASON_ICONS: Record<ReasonId, React.ReactElement> = {
  // 集客経験者が設計：ターゲットと軌道
  planner: (
    <>
      <circle data-draw style={len(220)} cx="50" cy="50" r="34" />
      <circle data-draw style={len(132)} cx="50" cy="50" r="20" opacity="0.7" />
      <circle cx="50" cy="50" r="6" fill="currentColor" stroke="none" />
      <path data-draw style={len(90)} d="M50 8v16M50 76v16M8 50h16M76 50h16" />
      <path data-draw style={len(60)} d="M62 26l24-14-6 12 12-2z" opacity="0.85" />
    </>
  ),

  // 建設業に合わせた文章：原稿と構成
  writing: (
    <>
      <path data-draw style={len(230)} d="M22 12h40a6 6 0 0 1 6 6v70a6 6 0 0 1-6 6H22a6 6 0 0 1-6-6V18a6 6 0 0 1 6-6z" />
      <path data-draw style={len(130)} d="M28 32h28M28 44h28M28 56h18" />
      <path data-draw style={len(70)} d="M56 78l24-24 8 8-24 24-11 3z" />
    </>
  ),

  // スマホからの問い合わせ：端末とタップ
  mobile: (
    <>
      <path data-draw style={len(230)} d="M32 8h32a6 6 0 0 1 6 6v72a6 6 0 0 1-6 6H32a6 6 0 0 1-6-6V14a6 6 0 0 1 6-6z" />
      <path data-draw style={len(40)} d="M42 16h12" opacity="0.7" />
      <path data-draw style={len(110)} d="M36 60h24v14H36z" opacity="0.85" />
      <circle cx="66" cy="66" r="9" fill="currentColor" stroke="none" opacity="0.9" />
      <path d="M62 66l3 3 6-6" stroke="#0b2440" strokeWidth="2.4" />
    </>
  ),

  // 運用を見据える：循環と上昇
  operation: (
    <>
      <path data-draw style={len(190)} d="M84 50a34 34 0 1 1-10-24" />
      <path data-draw style={len(40)} d="M76 10v18H58" />
      <path data-draw style={len(100)} d="M34 62l12-14 10 9 14-19" />
      <circle cx="34" cy="62" r="3.5" fill="currentColor" stroke="none" />
      <circle cx="70" cy="38" r="3.5" fill="currentColor" stroke="none" />
    </>
  ),
};

export function ReasonIcon({ id }: { id: ReasonId }) {
  return (
    <svg {...base} className="adf-rcard__svg" viewBox="0 0 100 100" strokeWidth={2.4}>
      {REASON_ICONS[id]}
    </svg>
  );
}

/* ── 9. 対応業種アイコン（48×48・ホバーで一部が動く） ───────────────────── */

const INDUSTRY_ICONS: Record<IndustryId, React.ReactElement> = {
  // 外構・エクステリア：門柱＋フェンス＋植栽
  exterior: (
    <>
      <path d="M4 42h40" />
      <path d="M8 42V22h7v20" />
      <path d="M8 27h7" />
      <path d="M22 42V30h18v12M22 35h18" opacity="0.8" />
      <path data-anim="lift" d="M36 30c0-5 3-8 3-8s3 3 3 8-3 6-3 6-3-1-3-6z" />
    </>
  ),

  // 外壁塗装：壁とローラー（ローラーが動く）
  painting: (
    <>
      <path d="M6 40V14h20v26" opacity="0.75" />
      <path d="M6 22h20M16 14v26" opacity="0.5" />
      <g data-anim="roller">
        <rect x="28" y="12" width="14" height="8" rx="2" />
        <path d="M35 20v6h-6v14" />
      </g>
      <path d="M26 40h6" opacity="0.6" />
    </>
  ),

  // 屋根工事：屋根の線が描かれる
  roof: (
    <>
      <path data-anim="rooftrace" d="M4 26L24 8l20 18" strokeWidth="2.4" />
      <path d="M9 26v16h30V26" opacity="0.8" />
      <path d="M19 42V32h10v10" opacity="0.6" />
      <path d="M12 22l8 8M20 18l8 8M28 14l8 8" opacity="0.4" />
    </>
  ),

  // 解体工事：ショベルカーのアームが動く
  demolition: (
    <>
      <path d="M6 40h36" />
      <rect x="6" y="28" width="14" height="9" rx="2" />
      <circle cx="11" cy="40" r="3" opacity="0.7" />
      <circle cx="19" cy="40" r="3" opacity="0.7" />
      <g data-anim="arm">
        <path d="M18 30l10-14 8 4" />
        <path d="M34 20l4 8-7 3-3-7z" />
      </g>
    </>
  ),

  // リフォーム：家と循環（家が少し傾く）
  reform: (
    <>
      <g data-anim="tilt">
        <path d="M10 40V24l14-11 14 11v16" />
        <path d="M19 40V29h10v11" opacity="0.7" />
      </g>
      <path d="M6 44h36" opacity="0.5" />
      <path d="M32 10a9 9 0 0 1 6 8" opacity="0.75" />
      <path d="M38 12v6h-6" opacity="0.75" />
    </>
  ),

  // 電気工事：配線が点灯する
  electric: (
    <>
      <path d="M14 8v10M28 8v10" />
      <path d="M9 18h24v6a12 12 0 0 1-12 12 12 12 0 0 1-12-12z" />
      <path d="M21 36v6" />
      <path data-anim="spark" d="M36 14l-5 9h6l-5 9" strokeWidth="2.4" />
      <path d="M36 14l-5 9h6l-5 9" opacity="0.25" />
    </>
  ),

  // 水道工事：水滴が落ちる
  plumbing: (
    <>
      <path d="M8 14h10v8H8z" />
      <path d="M18 18h12v10" />
      <path d="M26 28h8" />
      <path data-anim="drop" d="M30 32c0 0-3 3.6-3 5.6a3 3 0 0 0 6 0c0-2-3-5.6-3-5.6z" fill="currentColor" stroke="none" />
      <path d="M12 40h24" opacity="0.5" />
    </>
  ),

  // 内装工事：床材がスライドする
  interior: (
    <>
      <path d="M6 12h36v28H6z" opacity="0.75" />
      <path d="M6 28h36" opacity="0.5" />
      <g data-anim="slide">
        <path d="M10 32h12M24 32h14M10 36h8M20 36h18" />
      </g>
      <path d="M12 16h8v8h-8z" opacity="0.6" />
      <path d="M28 16h10v8H28z" opacity="0.35" />
    </>
  ),

  // 足場工事：足場が持ち上がる
  scaffold: (
    <>
      <path d="M8 42V10M20 42V10M32 42V10M44 42V10" opacity="0.8" />
      <g data-anim="lift">
        <path d="M8 18h36M8 30h36" />
      </g>
      <path d="M8 10h36" opacity="0.6" />
      <path d="M8 18l12 12M20 18l12 12" opacity="0.35" />
    </>
  ),

  // 造成工事：地面をならす
  grading: (
    <>
      <path d="M4 38h40" />
      <g data-anim="slide">
        <path d="M8 32h24l-4-8H12z" />
      </g>
      <path d="M4 30c6-6 12-6 18-2" opacity="0.4" />
      <path d="M34 22V8M30 12l4-4 4 4" opacity="0.7" />
      <circle cx="34" cy="30" r="3" opacity="0.6" />
    </>
  ),
};

export function IndustryIcon({ id }: { id: IndustryId }) {
  return (
    <svg {...base} className="adf-ind__icon" viewBox="0 0 48 48">
      {INDUSTRY_ICONS[id]}
    </svg>
  );
}

/* ── 8. 返金保証バッジ（MAXプラン） ─────────────────────────────────────── */

export function GuaranteeBadge() {
  return (
    <svg className="adf-badge-svg" viewBox="0 0 100 100" fill="none" aria-hidden="true" focusable="false">
      <path
        data-draw
        d="M50 6l11 8 13.5-2 4.5 13 11.5 7.5-4 13 4 13-11.5 7.5-4.5 13L61 78l-11 8-11-8-13.5 2-4.5-13L9.5 59.5l4-13-4-13L21 26l4.5-13L39 15z"
        stroke="#f26a1b"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="50" cy="46" r="24" fill="rgba(242,106,27,0.12)" />
      <text
        x="50"
        y="41"
        textAnchor="middle"
        fill="#f26a1b"
        fontSize="15"
        fontWeight="800"
      >
        全額
      </text>
      <text
        x="50"
        y="57"
        textAnchor="middle"
        fill="#f26a1b"
        fontSize="13"
        fontWeight="800"
      >
        返金保証
      </text>
    </svg>
  );
}
