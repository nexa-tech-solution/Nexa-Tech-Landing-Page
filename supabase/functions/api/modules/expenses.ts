import { requireAdmin } from "./auth.ts";
import { sqlClient } from "../shared/db.ts";
import { apiError, envelope, now, response } from "../shared/http.ts";
export async function expenseRoute(request: Request, path: string) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  const sql = sqlClient();
  const url = new URL(request.url);
  const map = (r: Record<string, unknown>) => ({
    id: Number(r.id),
    name: r.name,
    category: r.category,
    amount: Number(r.amount),
    date: r.start_date instanceof Date
      ? r.start_date.toISOString().slice(0, 10)
      : r.start_date,
    recurring: r.recurrence,
    note: r.note,
    createdAt: Number(r.created_at),
    updatedAt: Number(r.updated_at),
  });
  try {
    if (path === "/admin/expenses" && request.method === "GET") {
      const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
      const size = Math.min(
        1000,
        Math.max(1, Number(url.searchParams.get("size") ?? 1000)),
      );
      const category = url.searchParams.get("category");
      const recurring = url.searchParams.get("recurring");
      const search = url.searchParams.get("searchTerm");
      const rows =
        await sql`select * from finance.expenses where is_active = true and deleted_at is null
        and (${category}::text is null or category = ${category}) and (${recurring}::text is null or recurrence = ${recurring})
        and (${search}::text is null or lower(name) like '%' || lower(${search}) || '%') order by start_date desc, id desc limit ${size} offset ${
          (page - 1) * size
        }`;
      const [{ count }] = await sql<
        { count: number }[]
      >`select count(*)::int as count from finance.expenses where is_active = true and deleted_at is null
        and (${category}::text is null or category = ${category}) and (${recurring}::text is null or recurrence = ${recurring})
        and (${search}::text is null or lower(name) like '%' || lower(${search}) || '%')`;
      return response(200, {
        ...envelope({}),
        data: rows.map(map),
        page,
        size,
        totalItems: count,
        totalPages: Math.ceil(count / size),
        hasNext: page * size < count,
        hasPrevious: page > 1,
      });
    }
    if (
      (path === "/admin/expenses" && request.method === "POST") ||
      (/^\/admin\/expenses\/\d+$/.test(path) && request.method === "PUT")
    ) {
      const b = await request.json() as Record<string, unknown>;
      const t = now();
      if (
        typeof b.name !== "string" || !b.name.trim() ||
        b.name.trim().length > 200 ||
        !["marketing", "server", "tools", "account", "salary", "other"]
          .includes(String(b.category)) ||
        !["once", "monthly", "yearly"].includes(String(b.recurring)) ||
        typeof b.amount !== "number" || !Number.isFinite(b.amount) ||
        b.amount <= 0 || b.amount > 9999999999.99 ||
        Math.abs(b.amount * 100 - Math.round(b.amount * 100)) > 0.00001 ||
        typeof b.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(b.date) ||
        !Number.isFinite(Date.parse(b.date)) ||
        new Date(b.date).toISOString().slice(0, 10) !== b.date ||
        (b.note != null && (typeof b.note !== "string" || b.note.length > 2000))
      ) return apiError(400, "COMMON-400", "error.validation.failed");
      if (request.method === "PUT") {
        const [updated] =
          await sql`update finance.expenses set name=${b.name.trim()},category=${
            String(b.category)
          },amount=${b.amount},start_date=${b.date},recurrence=${
            String(b.recurring)
          },note=${
            b.note == null ? null : String(b.note)
          },updated_at=${t},version=version+1 where id=${
            Number(path.split("/").at(-1))
          } and is_active and deleted_at is null returning *`;
        return updated
          ? response(200, envelope(map(updated)))
          : apiError(404, "EXPENSE-404", "error.expense.not-found");
      }
      const [row] =
        await sql`insert into finance.expenses (name,category,amount,start_date,recurrence,note,version,created_at,updated_at,is_active)
        values (${String(b.name).trim()},${b.category as string},${b
          .amount as number},${b.date as string},${b.recurring as string},${
          b.note == null ? null : String(b.note)
        },0,${t},${t},true) returning *`;
      return response(200, envelope(map(row)));
    }
    const match = path.match(/^\/admin\/expenses\/(\d+)$/);
    if (match && request.method === "DELETE") {
      const t = now();
      await sql`update finance.expenses set is_active=false, deleted_at=${t}, updated_at=${t}, version=version+1 where id=${
        Number(match[1])
      } and is_active=true`;
      return response(200, envelope({}));
    }
    return null;
  } finally {
    await sql.end({ timeout: 5 });
  }
}
