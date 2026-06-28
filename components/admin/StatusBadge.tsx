import { LEAD_STATUS_LABELS, type LeadStatus } from "@/lib/types/crm";

const statusColors: Record<LeadStatus, string> = {
  new: "bg-blue-100 text-blue-800",
  uncontacted: "bg-red-100 text-red-800",
  contacted: "bg-yellow-100 text-yellow-800",
  site_visit_scheduled: "bg-purple-100 text-purple-800",
  site_visit_completed: "bg-indigo-100 text-indigo-800",
  estimating: "bg-orange-100 text-orange-800",
  estimate_sent: "bg-amber-100 text-amber-800",
  considering: "bg-sky-100 text-sky-800",
  contracted: "bg-green-100 text-green-800",
  under_construction: "bg-teal-100 text-teal-800",
  completed: "bg-emerald-100 text-emerald-800",
  lost: "bg-gray-100 text-gray-600",
  no_action: "bg-slate-100 text-slate-500",
};

export default function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[status] ?? "bg-gray-100 text-gray-600"}`}
    >
      {LEAD_STATUS_LABELS[status] ?? status}
    </span>
  );
}
