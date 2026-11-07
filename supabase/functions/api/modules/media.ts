import type { Sql } from "npm:postgres@3.4.5";
import { failure, ok, readApi } from "./read-api.ts";

const BUCKET = "nexa-media";
function storageHeaders() {
  const env = Deno.env.get("SUPABASE_SECRET_KEYS");
  const key = env
    ? Object.values(JSON.parse(env))[0]
    : Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  return {
    apikey: String(key),
    authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? key}`,
  };
}
async function storage(path: string, init: RequestInit = {}) {
  const r = await fetch(`${Deno.env.get("SUPABASE_URL")}/storage/v1/${path}`, {
    ...init,
    headers: { ...storageHeaders(), ...init.headers },
  });
  return r;
}
export async function media(
  sql: Sql,
  path: string,
  request: Request,
): Promise<Response | null> {
  if (path === "/admin/media/images" && request.method === "POST") {
    const form = await request.formData(), file = form.get("file");
    if (!(file instanceof File) || !file.size || file.size > 5 * 1024 * 1024) {
      return failure(400, "Image must be between 1 byte and 5 MB");
    }
    const bytes = new Uint8Array(await file.arrayBuffer());
    let type = "", ext = "";
    if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) {
      type = "image/jpeg";
      ext = "jpg";
    } else if (
      bytes.slice(0, 8).every((v, i) =>
        v === [137, 80, 78, 71, 13, 10, 26, 10][i]
      ) && bytes.length >= 24
    ) {
      type = "image/png";
      ext = "png";
    } else if (
      new TextDecoder().decode(bytes.slice(0, 6)).match(/^GIF8[79]a$/)
    ) {
      type = "image/gif";
      ext = "gif";
    } else if (
      new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" &&
      new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP"
    ) {
      type = "image/webp";
      ext = "webp";
    } else if (
      new TextDecoder().decode(bytes.slice(4, 12)).match(/^ftypavif$/)
    ) {
      type = "image/avif";
      ext = "avif";
    } else return failure(400, "Unsupported image bytes");
    const folder = String(form.get("folder") ?? "blog");
    if (!/^[a-zA-Z0-9_-]{1,40}$/.test(folder)) {
      return failure(400, "Invalid folder");
    }
    const alt = String(form.get("altText") ?? "");
    if (alt.length > 500) return failure(400, "Alt text too long");
    const existing = await storage(`bucket/${BUCKET}`);
    const bucketError = existing.ok
      ? null
      : await existing.json().catch(() => ({}));
    if (
      existing.status === 404 || bucketError?.code === "NoSuchBucket" ||
      String(bucketError?.statusCode) === "404"
    ) {
      const created = await storage("bucket", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          id: BUCKET,
          name: BUCKET,
          public: true,
          file_size_limit: 5242880,
          allowed_mime_types: [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
            "image/avif",
          ],
        }),
      });
      if (!created.ok && created.status !== 409) {
        throw new Error("Cannot create media bucket");
      }
    } else if (!existing.ok) throw new Error("Cannot access media bucket");
    const key = `${folder}/${
      new Date().toISOString().slice(0, 7).replace("-", "/")
    }/${crypto.randomUUID()}.${ext}`;
    const uploaded = await storage(`object/${BUCKET}/${key}`, {
      method: "POST",
      headers: { "content-type": type, "cache-control": "31536000" },
      body: bytes,
    });
    if (!uploaded.ok) throw new Error("Storage upload failed");
    const url = `${
        Deno.env.get("SUPABASE_URL")
      }/storage/v1/object/public/${BUCKET}/${key}`,
      t = Date.now();
    try {
      const [r] =
        await sql`insert into content.media_assets(storage_key,url,folder,content_type,size_bytes,original_filename,alt_text,created_at,updated_at) values(${key},${url},${folder},${type},${file.size},${
          file.name.slice(0, 255)
        },${alt},${t},${t}) returning id`;
      return readApi(
        sql,
        `/admin/media/images/${r.id}`,
        new URL(request.url),
        request,
      );
    } catch (e) {
      await storage(`object/${BUCKET}/${key}`, { method: "DELETE" });
      throw e;
    }
  }
  const match = path.match(/^\/admin\/media\/images\/(\d+)$/);
  if (match && request.method === "DELETE") {
    const [r] = await sql`select * from content.media_assets where id=${
      Number(match[1])
    } and is_active`;
    if (!r) return failure(404, "Image not found");
    const used =
      await sql`select id from content.blog_posts where is_active and (cover=${r.url} or position(${r.url} in content)>0) limit 1`;
    if (used.length) return failure(409, "Image is in use");
    if (
      String(r.url).startsWith(
        `${Deno.env.get("SUPABASE_URL")}/storage/v1/object/public/${BUCKET}/`,
      )
    ) {
      const removed = await storage(`object/${BUCKET}/${r.storage_key}`, {
        method: "DELETE",
      });
      if (!removed.ok && removed.status !== 404) {
        throw new Error("Storage deletion failed");
      }
    }
    const t = Date.now();
    await sql`update content.media_assets set is_active=false,deleted_at=${t},updated_at=${t},version=version+1 where id=${r.id}`;
    return ok(null);
  }
  return null;
}
