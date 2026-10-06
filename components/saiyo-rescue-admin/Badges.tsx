import {
  SOURCE_LABEL,
  SOURCE_STYLE,
  STATUS_LABEL,
  STATUS_STYLE,
  classifySource,
  type LeadRow,
  type LeadStatus,
} from "@/lib/saiyoRescue/leads";

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-bold ${STATUS_STYLE[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}

export function SourceBadge({ lead }: { lead: Pick<LeadRow, "utm_source" | "referrer" | "landing_page" | "utm_campaign"> }) {
  const key = classifySource(lead);
  return (
    <span
      title={lead.utm_campaign ? `キャンペーン：${lead.utm_campaign}` : undefined}
      className={`inline-flex items-center whitespace-nowrap rounded-md px-2 py-0.5 text-[11px] font-bold ring-1 ${SOURCE_STYLE[key]}`}
    >
      {SOURCE_LABEL[key]}
    </span>
  );
}
