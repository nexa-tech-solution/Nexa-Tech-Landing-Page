import type { Sql } from "npm:postgres@3.4.5";

type Row = Record<string, any>;
const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};
export const ok = (data: unknown, meta: Row = {}) =>
  new Response(
    JSON.stringify({
      success: true,
      code: 200,
      messageCode: "success.common.loaded",
      data,
      timestamp: Date.now(),
      ...meta,
    }),
    { headers },
  );
export const failure = (status: number, message: string) =>
  new Response(
    JSON.stringify({
      success: false,
      code: status,
      errorCode: `API-${status}`,
      messageCode: "error.api.request",
      message,
      data: null,
      timestamp: Date.now(),
    }),
    { status, headers },
  );
const numeric = new Set([
  "id",
  "sizeBytes",
  "createdAt",
  "updatedAt",
  "readAt",
  "repliedAt",
  "lastActivityAt",
  "subscriptionPrice",
  "rating",
  "reviewCount",
  "crashFreeRate",
  "sortOrder",
  "sentAt",
  "receivedAt",
  "readingMinutes",
]);
const omit = new Set(["version", "deleted_at", "is_active"]);
function camel(r: Row): Row {
  return Object.fromEntries(
    Object.entries(r).filter(([k]) => !omit.has(k)).map(([k, v]) => {
      const key = k.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
      return [key, v == null ? null : numeric.has(key) ? Number(v) : v];
    }),
  );
}
function page(rows: Row[], url: URL) {
  const n = Number(url.searchParams.get("page") ?? 1),
    s = Number(url.searchParams.get("size") ?? 50);
  if (
    !Number.isInteger(n) || n < 1 || !Number.isInteger(s) || s < 1 || s > 1000
  ) return failure(400, "Invalid pagination");
  const totalItems = rows.length;
  return ok(rows.slice((n - 1) * s, n * s), {
    page: n,
    size: s,
    totalItems,
    totalPages: Math.ceil(totalItems / s),
    hasNext: n * s < totalItems,
    hasPrevious: n > 1,
  });
}

export async function readApi(
  sql: Sql,
  path: string,
  url: URL,
  request: Request,
): Promise<Response | null> {
  const search = (url.searchParams.get("searchTerm") ?? "").toLowerCase();
  if (path === "/admin/contact-messages/templates") {
    return ok([
      {
        key: "GENERAL",
        label: "Trả lời chung",
        description: "Thư trả lời cho mọi câu hỏi",
        subject: "Re: Your enquiry to Nexa Tech",
        body:
          "Dear {name},\n\nThank you for reaching out to Nexa Tech.\n\nWe have received your message and appreciate your interest. Please let us know if you have any further questions.\n\nKind regards,",
        ctaLabel: null,
      },
      {
        key: "RECEIVED",
        label: "Đã nhận tin nhắn",
        description: "Xác nhận đã nhận yêu cầu",
        subject: "We have received your message",
        body:
          "Dear {name},\n\nThank you for contacting Nexa Tech. Our team is reviewing your request and will respond within one to two business days.\n\nKind regards,",
        ctaLabel: null,
      },
      {
        key: "PROJECT_INQUIRY",
        label: "Hỏi thêm về dự án",
        description: "Trao đổi yêu cầu dự án",
        subject: "Re: Your project enquiry",
        body:
          "Dear {name},\n\nPlease share your target platforms, project scope, timeline and indicative budget so we can prepare a proposal.\n\nKind regards,",
        ctaLabel: "Schedule a call",
      },
      {
        key: "QUOTE",
        label: "Gửi báo giá",
        description: "Gửi đề xuất dự án",
        subject: "Proposal from Nexa Tech",
        body:
          "Dear {name},\n\nPlease find our proposal below:\n\n- Scope:\n- Timeline:\n- Investment:\n\nKind regards,",
        ctaLabel: "View the proposal",
      },
      {
        key: "SUPPORT",
        label: "Hỗ trợ / báo lỗi",
        description: "Thu thập thông tin lỗi",
        subject: "Re: Your support request",
        body:
          "Dear {name},\n\nPlease provide the app name and version, device and operating system, steps to reproduce the issue and a screenshot if possible.\n\nKind regards,",
        ctaLabel: null,
      },
      {
        key: "FOLLOW_UP",
        label: "Nhắc lại / theo dõi",
        description: "Theo dõi yêu cầu đang chờ",
        subject: "Following up on our previous email",
        body:
          "Dear {name},\n\nWe are following up on our previous email. Please let us know if you have any questions or need further assistance.\n\nKind regards,",
        ctaLabel: null,
      },
    ].map((t) => ({ ...t, accent: "#0d0c22" })));
  }
  if (path === "/reference/countries") {
    const rows =
      await sql`select code,name_en,name_vi,flag from reference.countries where is_active order by sort_order,code`;
    const vi = request.headers.get("accept-language")?.startsWith("vi");
    return ok(
      rows.map((r) => ({
        code: r.code,
        name: vi ? r.name_vi : r.name_en,
        nameEn: r.name_en,
        nameVi: r.name_vi,
        flag: r.flag,
      })),
    );
  }
  if (path === "/admin/contact-tags") {
    const rows =
      await sql`select t.*,count(m.id)::int as message_count from contact.tags t left join contact.message_tags mt on mt.tag_id=t.id left join contact.messages m on m.id=mt.message_id and m.is_active and m.status<>'ARCHIVED' where t.is_active group by t.id order by lower(t.name)`;
    return ok(rows.map(camel));
  }
  if (path === "/admin/contact-messages/unread-count") {
    const [r] =
      await sql`select count(*)::int as n from contact.messages where is_active and status='NEW'`;
    return ok(r.n);
  }
  if (
    path === "/admin/contact-messages" ||
    /^\/admin\/contact-messages\/\d+$/.test(path)
  ) {
    const raw =
      await sql`select * from contact.messages where is_active and deleted_at is null order by last_activity_at desc,id desc`;
    const tags =
      await sql`select mt.message_id,t.id,t.name,t.color from contact.message_tags mt join contact.tags t on t.id=mt.tag_id where t.is_active`;
    const mapped: Row[] = raw.map((r) => ({
      ...camel(r),
      tags: tags.filter((t) => String(t.message_id) === String(r.id)).map(
        (t) => ({ id: Number(t.id), name: t.name, color: t.color }),
      ),
    }));
    if (path === "/admin/contact-messages") {
      const status = url.searchParams.get("status"),
        tag = url.searchParams.get("tagId");
      const rows = mapped.filter((r) =>
        (status ? r.status === status : r.status !== "ARCHIVED") &&
        (!search ||
          `${r.name} ${r.email} ${r.message}`.toLowerCase().includes(search)) &&
        (!tag || r.tags.some((t: Row) => String(t.id) === tag))
      );
      return page(rows, url);
    }
    const id = Number(path.split("/").at(-1)),
      message = mapped.find((r) => r.id === id);
    if (!message) return failure(404, "Contact not found");
    if (message.status === "NEW" && request.method === "GET") {
      const t = Date.now();
      await sql`update contact.messages set status='READ',read_at=${t},updated_at=${t},version=version+1 where id=${id} and status='NEW'`;
      message.status = "READ";
      message.readAt = t;
    }
    const replies =
        await sql`select * from contact.replies where message_id=${id} and is_active order by sent_at,id`,
      followups =
        await sql`select * from contact.followups where message_id=${id} and is_active order by received_at,id`;
    const attachments =
      await sql`select a.* from contact.reply_attachments a join contact.replies r on r.id=a.reply_id where r.message_id=${id}`;
    return ok({
      message,
      followups: followups.map(camel),
      replies: replies.map((r) => ({
        ...camel(r),
        viaGmail: r.sent_by == null,
        attachments: attachments.filter((a) =>
          String(a.reply_id) === String(r.id)
        ).map(camel),
      })),
    });
  }
  if (path === "/admin/apps" || /^\/admin\/apps\/\d+$/.test(path)) {
    const rows =
      await sql`select * from catalog.mobile_apps where is_active and deleted_at is null order by sort_order,id`;
    const mapped: Row[] = rows.map((r) => ({
      ...camel(r),
      platform: r.platform === "GOOGLE_PLAY" ? "Google Play" : "App Store",
    }));
    if (path !== "/admin/apps") {
      return mapped.find((r) => String(r.id) === path.split("/").at(-1))
        ? ok(mapped.find((r) => String(r.id) === path.split("/").at(-1)))
        : failure(404, "App not found");
    }
    return page(
      mapped.filter((r) =>
        !search || `${r.title} ${r.slug}`.toLowerCase().includes(search)
      ),
      url,
    );
  }
  if (path === "/admin/blog/authors") {
    const rows =
      await sql`select * from content.blog_authors where is_active order by name`;
    return ok(rows.map(camel));
  }
  if (
    path === "/admin/blog/posts" || /^\/admin\/blog\/posts\/\d+$/.test(path) ||
    path === "/blog/posts" || path.startsWith("/blog/posts/")
  ) {
    const admin = path.startsWith("/admin/"),
      rows =
        await sql`select p.*,p.published_at::text as published_at from content.blog_posts p where p.is_active and (${admin} or (p.status='PUBLISHED' and p.published_at<=current_date)) order by p.published_at desc nulls last,p.id desc`,
      authors = await sql`select * from content.blog_authors where is_active`;
    const mapped: Row[] = rows.map((r) => {
      const a = authors.find((a) => String(a.id) === String(r.author_id));
      const data = camel(r);
      delete data.authorId;
      return {
        ...data,
        tag: r.tag.charAt(0) + r.tag.slice(1).toLowerCase(),
        author: a ? camel(a) : null,
      };
    });
    const list = path === "/admin/blog/posts" || path === "/blog/posts";
    if (!list) {
      const key = decodeURIComponent(path.split("/").at(-1)!);
      const row = mapped.find((r) =>
        admin ? String(r.id) === key : r.slug === key
      );
      return row ? ok(row) : failure(404, "Post not found");
    }
    const tag = url.searchParams.get("tag"),
      status = url.searchParams.get("status");
    return page(
      mapped.filter((r) =>
        (!search || `${r.title} ${r.excerpt}`.toLowerCase().includes(search)) &&
        (!tag || r.tag.toLowerCase() === tag.toLowerCase()) &&
        (!status || r.status === status)
      ).map((r) => ({ ...r, content: undefined })),
      url,
    );
  }
  if (
    path === "/admin/media/images" || /^\/admin\/media\/images\/\d+$/.test(path)
  ) {
    const rows =
      await sql`select * from content.media_assets where is_active and deleted_at is null order by created_at desc,id desc`;
    const mapped = rows.map(camel);
    if (path !== "/admin/media/images") {
      const row = mapped.find((r) => String(r.id) === path.split("/").at(-1));
      return row ? ok(row) : failure(404, "Image not found");
    }
    const folder = url.searchParams.get("folder"),
      type = url.searchParams.get("contentType");
    return page(
      mapped.filter((r) =>
        (!folder || r.folder === folder) && (!type || r.contentType === type) &&
        (!search ||
          `${r.originalFilename} ${r.altText}`.toLowerCase().includes(search))
      ),
      url,
    );
  }
  return null;
}
