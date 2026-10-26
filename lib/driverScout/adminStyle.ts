import type { RequestStatus } from "./requests";

/** 管理画面の対応状況バッジの色 */
export const REQUEST_STATUS_STYLE: Record<RequestStatus, string> = {
  received: "bg-amber-100 text-amber-800",
  contacting: "bg-blue-100 text-blue-800",
  awaiting_answer: "bg-indigo-100 text-indigo-800",
  scheduling: "bg-violet-100 text-violet-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  declined: "bg-slate-200 text-slate-700",
  unreachable: "bg-rose-100 text-rose-800",
  withdrawn: "bg-slate-100 text-slate-500",
};
