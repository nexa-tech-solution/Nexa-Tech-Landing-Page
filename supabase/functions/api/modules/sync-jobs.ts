import postgres from "npm:postgres@3.4.5";
import { type Connection, importAdmob } from "./importers/admob.ts";
import { importFirebase } from "./importers/firebase.ts";
import { importApple, importGooglePlay } from "./importers/stores.ts";
import { importRevenueCat } from "./importers/revenuecat.ts";
declare const EdgeRuntime: { waitUntil(promise: Promise<unknown>): void };
const db = () =>
  postgres(Deno.env.get("NEXA_DATABASE_URL")!, {
    max: 1,
    prepare: false,
    connect_timeout: 10,
    idle_timeout: 5,
  });

async function runJob(jobId: number, connection: Connection) {
  const sql = db();
  try {
    await sql`update integration.jobs set status='RUNNING' where id=${jobId}`;
    const importers = {
      firebase: importFirebase,
      admob: importAdmob,
      google_play: importGooglePlay,
      app_store_connect: importApple,
      revenuecat: importRevenueCat,
    };
    const importer = importers[connection.provider as keyof typeof importers];
    if (!importer) throw new Error("Unknown provider");
    const result = await importer(sql, connection);
    await sql.begin(async (tx) => {
      await tx`update integration.jobs set status='DONE',finished_at=${Date.now()},result_message=${result} where id=${jobId}`;
      await tx`update integration.connections set last_sync_at=${Date.now()},updated_at=${Date.now()},last_error=null where id=${connection.id}`;
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sync failed";
    await sql`update integration.jobs set status='FAILED',finished_at=${Date.now()},error_message=${message} where id=${jobId}`;
  } finally {
    await sql.end({ timeout: 5 });
  }
}

export async function integrationSync(
  userId: number,
  path: string,
): Promise<Response> {
  const id = path.match(/\/integrations\/(\d+)\/sync$/)?.[1];
  const sql = db();
  try {
    const data = await sql.begin(async (tx) => {
      await tx`select pg_advisory_xact_lock(74638102)`;
      await tx`update integration.jobs set status='FAILED',finished_at=${Date.now()},error_message='Sync interrupted or timed out; retry.' where status in ('QUEUED','RUNNING') and started_at < ${
        Date.now() - 180000
      }`;
      const connections =
        await tx`select * from integration.connections where is_active and deleted_at is null and (${
          id ?? null
        }::bigint is null or id=${id ?? null}::bigint) order by id`;
      const queued: { id: number; name: string; jobId: string }[] = [],
        skipped: { id: number; name: string; reason: string }[] = [],
        tasks: { jobId: number; connection: Connection }[] = [];
      for (const c of connections) {
        const reason = !c.enabled
          ? "Connection disabled"
          : !Deno.env.get("INTEGRATION_ENCRYPTION_KEY")
          ? "Missing encryption key"
          : ![
              "admob",
              "firebase",
              "google_play",
              "app_store_connect",
              "revenuecat",
            ].includes(c.provider)
          ? "TypeScript importer for this provider is not deployed yet"
          : null;
        const active =
          await tx`select id from integration.jobs where integration_id=${c.id} and status in ('QUEUED','RUNNING') limit 1`;
        if (reason || active.length) {
          skipped.push({
            id: Number(c.id),
            name: c.name,
            reason: reason ?? "Sync already running",
          });
          continue;
        }
        const [job] =
          await tx`insert into integration.jobs(provider,status,requested_by,started_at,integration_id) values(${c.provider},'QUEUED',${userId},${Date.now()},${c.id}) returning id`;
        queued.push({ id: Number(c.id), name: c.name, jobId: String(job.id) });
        tasks.push({
          jobId: Number(job.id),
          connection: c as unknown as Connection,
        });
      }
      return { queued, skipped, tasks, found: connections.length };
    });
    for (const task of data.tasks) {
      EdgeRuntime.waitUntil(runJob(task.jobId, task.connection));
    }
    const status = id
      ? (data.queued.length ? 200 : data.found ? 409 : 404)
      : 200;
    const payload = id
      ? (data.queued.length
        ? { jobId: data.queued[0].jobId, startedAt: Date.now() }
        : null)
      : { queued: data.queued, skipped: data.skipped };
    return Response.json({
      success: status === 200,
      code: status,
      messageCode: "integration.sync",
      message: data.skipped[0]?.reason,
      data: payload,
      timestamp: Date.now(),
    }, { status, headers: { "Access-Control-Allow-Origin": "*" } });
  } finally {
    await sql.end({ timeout: 5 });
  }
}
