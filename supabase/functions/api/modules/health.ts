import postgres from "npm:postgres@3.4.5";
import { envelope, response } from "../shared/http.ts";
export async function health() {
  const connectionString = Deno.env.get("NEXA_DATABASE_URL");
  if (!connectionString) {
    return response(503, {
      success: false,
      code: 503,
      errorCode: "CONFIG-503",
      messageCode: "error.config.database-unavailable",
      data: null,
      timestamp: Date.now(),
    });
  }

  const sql = postgres(connectionString, {
    max: 1,
    prepare: false,
    connect_timeout: 10,
    idle_timeout: 5,
  });

  try {
    const [result] = await sql<{ database: string; user_count: number }[]>`
      select current_database() as database,
             (select count(*)::int from iam.users where deleted_at is null) as user_count
    `;
    return response(
      200,
      envelope({
        status: "UP",
        database: result.database,
        users: result.user_count,
      }),
    );
  } catch (error) {
    console.error("health database check failed", error);
    return response(503, {
      success: false,
      code: 503,
      errorCode: "DB-503",
      messageCode: "error.database.unavailable",
      data: null,
      timestamp: Date.now(),
    });
  } finally {
    await sql.end({ timeout: 5 });
  }
}
