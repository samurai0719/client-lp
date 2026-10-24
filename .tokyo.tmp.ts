import { createClient } from "@supabase/supabase-js";
import { runWorker } from "@/lib/outreach/worker";
import { enrichPending } from "@/lib/outreach/enrich";
import { TABLES } from "@/lib/outreach/constants";
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
const JOB = "d4658965-5e25-42eb-a3df-1e50311635c7";
(async () => {
  const end = Date.now() + 180 * 60_000;
  let n = 0;
  while (Date.now() < end) {
    const { data: j } = await db.from(TABLES.jobs).select("status,found_count,inserted_count,duplicate_count,last_error").eq("id", JOB).single();
    if (j!.status === "failed") { console.log("FAILED", j!.last_error); break; }
    const jobDone = j!.status !== "running" && j!.status !== "queued";
    if (!jobDone) await runWorker(db, { budgetMs: 50_000, stages: ["jobs"] });
    const enriched = await enrichPending(db, { limit: 60, deadline: Date.now() + 80_000 });
    const { count: pending } = await db.from(TABLES.companies).select("id", { count: "exact", head: true }).eq("crawl_status", "pending");
    if (n++ % 5 === 0) console.log(new Date().toLocaleTimeString("ja-JP"), JSON.stringify(j), "enriched", enriched, "pending", pending);
    if (jobDone && pending === 0) { console.log("DONE"); break; }
  }
})().catch((e) => { console.error("ERR", e); process.exit(1); });
