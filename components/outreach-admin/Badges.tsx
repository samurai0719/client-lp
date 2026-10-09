import {
  CAMPAIGN_STATUS_LABEL,
  CRAWL_STATUS_LABEL,
  OUTREACH_STATUS_LABEL,
  REVIEW_STATUS_LABEL,
  SEND_STATUS_LABEL,
} from "@/lib/outreach/constants";

const TONE: Record<string, string> = {
  gray: "bg-slate-100 text-slate-600",
  blue: "bg-blue-50 text-blue-700",
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-800",
  red: "bg-rose-50 text-rose-700",
  purple: "bg-violet-50 text-violet-700",
};

function Badge({ label, tone }: { label: string; tone: keyof typeof TONE }) {
  return <span className={`inline-block whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-bold ${TONE[tone]}`}>{label}</span>;
}

export function OutreachStatusBadge({ status }: { status: string }) {
  const tone = ({ unsent: "gray", queued: "blue", sent: "blue", delivered: "green", bounced: "red", error: "red", replied: "purple", unsubscribed: "amber" } as const)[status] ?? "gray";
  return <Badge label={OUTREACH_STATUS_LABEL[status] ?? status} tone={tone} />;
}

export function SendStatusBadge({ status }: { status: string }) {
  const tone = ({ queued: "gray", sending: "blue", sent: "blue", delivered: "green", bounced: "red", failed: "red", cancelled: "gray", skipped: "amber" } as const)[status] ?? "gray";
  return <Badge label={SEND_STATUS_LABEL[status] ?? status} tone={tone} />;
}

export function CampaignStatusBadge({ status }: { status: string }) {
  const tone = ({ draft: "gray", test_sending: "blue", test_completed: "amber", sending: "blue", paused: "amber", completed: "green", cancelled: "red" } as const)[status] ?? "gray";
  return <Badge label={CAMPAIGN_STATUS_LABEL[status] ?? status} tone={tone} />;
}

export function ReviewBadge({ status }: { status: string }) {
  const tone = ({ pending: "amber", approved: "green", excluded: "gray" } as const)[status] ?? "gray";
  return <Badge label={REVIEW_STATUS_LABEL[status] ?? status} tone={tone} />;
}

export function CrawlBadge({ status, hasEmail }: { status: string; hasEmail: boolean }) {
  if (hasEmail) return <Badge label="メールあり" tone="green" />;
  if (status === "pending") return <Badge label={CRAWL_STATUS_LABEL.pending} tone="gray" />;
  if (status === "checked") return <Badge label="メールなし" tone="gray" />;
  return <Badge label={CRAWL_STATUS_LABEL[status] ?? status} tone={status === "failed" ? "red" : "gray"} />;
}
