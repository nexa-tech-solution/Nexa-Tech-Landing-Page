import type { Sql } from "npm:postgres@3.4.5";
import sanitizeHtml from "npm:sanitize-html@2.17.0";
import { failure, ok, readApi } from "./read-api.ts";

const required = (b: Record<string, unknown>, key: string, max: number) => {
  const v = b[key];
  if (typeof v !== "string" || !v.trim() || v.length > max) {
    throw new Error(`Invalid ${key}`);
  }
  return v.trim();
};
export async function adminWrite(
  sql: Sql,
  path: string,
  request: Request,
): Promise<Response | null> {
  const match = path.match(
    /^\/admin\/(apps|blog\/posts|blog\/authors|media\/images)(?:\/(\d+))?$/,
  );
  if (!match || !["POST", "PUT", "DELETE"].includes(request.method)) {
    return null;
  }
  const kind = match[1], id = match[2] ? Number(match[2]) : null;
  if (kind === "media/images" && !id) return null;
  const table = ({
    "apps": "catalog.mobile_apps",
    "blog/posts": "content.blog_posts",
    "blog/authors": "content.blog_authors",
    "media/images": "content.media_assets",
  } as const)[kind as "apps"];
  if (!table) return null;
  if (id) {
    const [r] = await sql`select id from ${sql`${sql(table.split(".")[0])}.${
      sql(table.split(".")[1])
    }`} where id=${id} and is_active`;
    if (!r) return failure(404, "Resource not found");
  }
  if (request.method === "DELETE") {
    if (!id) return failure(405, "Resource ID required");
    if (kind === "blog/authors") {
      const used =
        await sql`select id from content.blog_posts where author_id=${id} and is_active limit 1`;
      if (used.length) return failure(409, "Author is used by an active post");
    }
    if (kind === "media/images") return null;
    const t = Date.now();
    await sql`update ${sql`${sql(table.split(".")[0])}.${
      sql(table.split(".")[1])
    }`} set is_active=false,deleted_at=${t},updated_at=${t},version=version+1 where id=${id}`;
    return ok(null);
  }
  const b = await request.json();
  let values: Record<string, any> = {};
  if (kind === "apps") {
    const platform = ["Google Play", "GOOGLE_PLAY"].includes(b.platform)
      ? "GOOGLE_PLAY"
      : ["App Store", "APP_STORE"].includes(b.platform)
      ? "APP_STORE"
      : null;
    if (!platform) throw new Error("Invalid platform");
    values = {
      slug: required(b, "slug", 120),
      title: required(b, "title", 200),
      platform,
      package_name: b.packageName ?? null,
      app_store_id: b.appStoreId ?? null,
      store_url: b.storeUrl ?? null,
      icon_url: b.iconUrl ?? null,
      subscription_price: Number(b.subscriptionPrice ?? 0),
      rating: b.rating ?? null,
      review_count: Number(b.reviewCount ?? 0),
      crash_free_rate: b.crashFreeRate ?? null,
      sort_order: Number(b.sortOrder ?? 0),
    };
  } else if (kind === "blog/authors") {
    values = {
      name: required(b, "name", 100),
      role: required(b, "role", 150),
      avatar: required(b, "avatar", 4000),
      url: b.url ?? null,
    };
  } else if (kind === "blog/posts") {
    const tag = String(b.tag ?? "").toUpperCase(), status = b.status ?? "DRAFT";
    if (
      !["ENGINEERING", "DESIGN", "PRODUCT", "PROCESS"].includes(tag) ||
      !["DRAFT", "PUBLISHED"].includes(status)
    ) throw new Error("Invalid post tag/status");
    const authorId = Number(b.authorId);
    const [author] =
      await sql`select id from content.blog_authors where id=${authorId} and is_active`;
    if (!author) throw new Error("Unknown author");
    const content = sanitizeHtml(required(b, "content", 2000000), {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat([
        "img",
        "figure",
        "figcaption",
        "video",
        "source",
      ]),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        "*": ["class", "data-*"],
        img: ["src", "alt", "width", "height", "loading"],
        video: ["src", "controls", "poster"],
        source: ["src", "type"],
      },
      allowedSchemes: ["http", "https", "mailto"],
      allowProtocolRelative: false,
    });
    values = {
      slug: required(b, "slug", 160),
      title: required(b, "title", 255),
      excerpt: required(b, "excerpt", 1000),
      tag,
      status,
      published_at: b.publishedAt ??
        (status === "PUBLISHED" ? new Date().toISOString().slice(0, 10) : null),
      reading_minutes: Math.max(
        1,
        Math.ceil(
          sanitizeHtml(content, { allowedTags: [], allowedAttributes: {} })
            .split(/\s+/).length / 200,
        ),
      ),
      cover: required(b, "cover", 4000),
      related_project: b.relatedProject ?? null,
      content,
      author_id: authorId,
    };
  } else values = { alt_text: b.altText ?? null };
  const t = Date.now();
  let result;
  if (id) {
    [result] = await sql`update ${sql`${sql(table.split(".")[0])}.${
      sql(table.split(".")[1])
    }`} set ${
      sql({ ...values, updated_at: t })
    },version=version+1 where id=${id} returning id`;
  } else {[result] = await sql`insert into ${sql`${sql(table.split(".")[0])}.${
      sql(table.split(".")[1])
    }`} ${sql({ ...values, created_at: t, updated_at: t })} returning id`;}
  if (kind === "blog/authors") {
    const r = await readApi(
      sql,
      "/admin/blog/authors",
      new URL(request.url),
      request,
    );
    const data = await r!.json();
    return ok(data.data.find((a: any) => a.id === Number(result.id)));
  }
  return readApi(
    sql,
    `/admin/${kind}/${result.id}`,
    new URL(request.url),
    request,
  );
}
