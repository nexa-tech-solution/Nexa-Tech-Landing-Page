import type { Sql } from "npm:postgres@3.4.5";
import { failure, ok } from "./read-api.ts";

export async function contactWrite(
  sql: Sql,
  path: string,
  request: Request,
): Promise<Response | null> {
  const tag = path.match(/^\/admin\/contact-tags(?:\/(\d+))?$/);
  if (tag && ["POST", "PUT", "DELETE"].includes(request.method)) {
    const id = tag[1] ? Number(tag[1]) : null, t = Date.now();
    if (request.method === "DELETE" && id) {
      const rows =
        await sql`update contact.tags set is_active=false,deleted_at=${t},updated_at=${t},version=version+1 where id=${id} and is_active returning id`;
      return rows.length ? ok(null) : failure(404, "Tag not found");
    }
    const b = await request.json();
    if (
      typeof b.name !== "string" || !b.name.trim() ||
      b.name.trim().length > 40 || !/^#[0-9a-f]{6}$/i.test(b.color ?? "")
    ) return failure(400, "Invalid tag name or color");
    const duplicate =
      await sql`select id from contact.tags where is_active and lower(name)=lower(${b.name.trim()}) and (${id}::bigint is null or id<>${id})`;
    if (duplicate.length) return failure(409, "Tag name already exists");
    if (request.method === "POST" && !id) {
      const [r] =
        await sql`insert into contact.tags(name,color,created_at,updated_at) values(${b.name.trim()},${b.color},${t},${t}) returning id,name,color`;
      return ok({ ...r, id: Number(r.id) });
    }
    if (request.method === "PUT" && id) {
      const [r] =
        await sql`update contact.tags set name=${b.name.trim()},color=${b.color},updated_at=${t},version=version+1 where id=${id} and is_active returning id,name,color`;
      return r ? ok({ ...r, id: Number(r.id) }) : failure(404, "Tag not found");
    }
    return failure(405, "Method not allowed");
  }
  const message = path.match(
    /^\/admin\/contact-messages\/(\d+)(?:\/(status|tags))?$/,
  );
  if (message && ["PUT", "DELETE"].includes(request.method)) {
    const id = Number(message[1]),
      t = Date.now(),
      [existing] =
        await sql`select id from contact.messages where id=${id} and is_active`;
    if (!existing) return failure(404, "Contact not found");
    if (request.method === "DELETE" && !message[2]) {
      await sql`update contact.messages set is_active=false,deleted_at=${t},updated_at=${t},version=version+1 where id=${id}`;
      return ok(null);
    }
    if (request.method !== "PUT") return failure(405, "Method not allowed");
    const b = await request.json();
    if (message[2] === "status") {
      if (!["NEW", "READ", "REPLIED", "ARCHIVED"].includes(b.status)) {
        return failure(400, "Invalid contact status");
      }
      await sql`update contact.messages set status=${b.status},read_at=case when ${b.status}='READ' then coalesce(read_at,${t}) else read_at end,updated_at=${t},version=version+1 where id=${id}`;
      return null;
    }
    if (message[2] === "tags") {
      if (
        !Array.isArray(b.tagIds) || b.tagIds.length > 100 ||
        !b.tagIds.every((v: unknown) =>
          Number.isSafeInteger(v) && Number(v) > 0
        )
      ) return failure(400, "Invalid tag IDs");
      const ids = [...new Set<number>(b.tagIds)];
      await sql.begin(async (tx) => {
        const rows =
          await tx`select id from contact.tags where is_active and id=any(${ids}::bigint[])`;
        if (rows.length !== ids.length) throw new Error("Unknown tag ID");
        await tx`delete from contact.message_tags where message_id=${id}`;
        for (const tagId of ids) {
          await tx`insert into contact.message_tags(message_id,tag_id) values(${id},${tagId})`;
        }
      });
      return null;
    }
  }
  return null;
}
