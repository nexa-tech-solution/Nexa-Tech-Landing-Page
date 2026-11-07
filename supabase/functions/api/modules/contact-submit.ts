import type { Sql } from "npm:postgres@3.4.5";
import { failure, ok } from "./read-api.ts";
export async function contactSubmit(sql: Sql, request: Request) {
  const b = await request.json();
  if (b.website) return ok(null);
  if (
    typeof b.name !== "string" || !b.name.trim() || b.name.length > 100 ||
    typeof b.email !== "string" || b.email.length > 254 ||
    !/^\S+@\S+\.\S+$/.test(b.email) || typeof b.message !== "string" ||
    !b.message.trim() || b.message.length > 5000 ||
    (b.page != null && (typeof b.page !== "string" || b.page.length > 255))
  ) return failure(400, "Invalid contact form");
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown",
    digest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(ip),
    ),
    hash = Array.from(new Uint8Array(digest)).map((b) =>
      b.toString(16).padStart(2, "0")
    ).join(""),
    t = Date.now(),
    window = Math.floor(t / 600000) * 600000;
  const [limit] =
    await sql`insert into contact.rate_limits(ip_hash,window_start,hits) values(${hash},${window},1) on conflict(ip_hash,window_start) do update set hits=contact.rate_limits.hits+1 returning hits`;
  if (limit.hits > 5) {
    return failure(429, "Too many contact requests; retry in 10 minutes");
  }
  await sql`delete from contact.rate_limits where window_start<${
    window - 3600000
  }`;
  await sql`insert into contact.messages(name,email,message,source_page,status,created_at,updated_at,last_activity_at) values(${b.name.trim()},${b.email.trim()},${b.message.trim()},${
    b.page ?? null
  },'NEW',${t},${t},${t})`;
  return ok(null);
}
