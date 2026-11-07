import type { Sql } from "npm:postgres@3.4.5";
import { Buffer } from "node:buffer";
import nodemailer from "npm:nodemailer@6.10.1";
import { ImapFlow } from "npm:imapflow@1.0.181";
import { simpleParser } from "npm:mailparser@3.7.4";
import sanitizeHtml from "npm:sanitize-html@2.17.0";
import { failure, ok, readApi } from "./read-api.ts";

const escape = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c]!),
  );
function transport() {
  const user = Deno.env.get("MAIL_USERNAME"),
    pass = Deno.env.get("MAIL_PASSWORD");
  if (!user || !pass) throw new Error("SMTP credentials missing");
  return nodemailer.createTransport({
    host: Deno.env.get("MAIL_HOST") ?? "smtp.gmail.com",
    port: Number(Deno.env.get("MAIL_PORT") ?? 465),
    secure: (Deno.env.get("MAIL_PORT") ?? "465") === "465",
    auth: { user, pass },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 30000,
  });
}
function render(body: any) {
  if (
    typeof body.subject !== "string" || !body.subject.trim() ||
    body.subject.length > 255 || /[\r\n]/.test(body.subject) ||
    typeof body.body !== "string" || !body.body.trim() ||
    body.body.length > 200000
  ) throw new Error("Invalid reply subject/body");
  const text = sanitizeHtml(body.body, {
    allowedTags: [],
    allowedAttributes: {},
  });
  if (body.format === "HTML") {
    return {
      subject: body.subject,
      text,
      html: sanitizeHtml(body.body, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([
          "img",
          "table",
          "tbody",
          "tr",
          "td",
          "th",
          "html",
          "head",
          "body",
          "style",
        ]),
        allowedAttributes: {
          "*": ["class", "style"],
          a: ["href", "target"],
          img: ["src", "alt", "width", "height"],
        },
        allowedSchemes: ["http", "https", "mailto"],
      }),
    };
  }
  let html = `<div style="font-family:Arial,sans-serif;line-height:1.6">${
    escape(body.body).replace(/\n/g, "<br>")
  }`;
  if (body.ctaLabel && body.ctaUrl) {
    const url = new URL(body.ctaUrl);
    if (!["https:", "http:", "mailto:"].includes(url.protocol)) {
      throw new Error("Invalid CTA URL");
    }
    html += `<p><a href="${escape(url.href)}">${
      escape(String(body.ctaLabel))
    }</a></p>`;
  }
  return { subject: body.subject, text: body.body, html: html + "</div>" };
}

async function inbox(sql: Sql, force: boolean) {
  const user = Deno.env.get("MAIL_INBOX_USERNAME"),
    pass = Deno.env.get("MAIL_INBOX_PASSWORD");
  if (!user || !pass) return failure(503, "Mailbox credentials missing");
  const lock = await sql`select pg_try_advisory_lock(19862215) as locked`;
  if (!lock[0].locked) {
    return ok({
      fetched: false,
      complete: false,
      imported: 0,
      skipped: 0,
      replies: 0,
      lastFetchedAt: null,
    });
  }
  const client = new ImapFlow({
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    auth: { user, pass },
    logger: false,
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  });
  let imported = 0, skipped = 0, replies = 0, complete = true;
  const started = Date.now();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    client.close();
  }, 45000);
  try {
    const [last] =
      await sql`select max(imported_at) as t from contact.inbound_emails`;
    if (!force && Number(last?.t) > Date.now() - 120000) {
      return ok({
        fetched: false,
        complete: true,
        imported: 0,
        skipped: 0,
        replies: 0,
        lastFetchedAt: Number(last.t),
      });
    }
    await client.connect();
    await client.mailboxOpen("INBOX", { readOnly: true });
    const uids = await client.search({
      gmraw: "category:primary newer_than:30d",
    }, { uid: true });
    const start = started;
    const knownRows = await sql`select message_id from contact.inbound_emails`;
    const known = new Set(knownRows.map((r) => r.message_id));
    const envelopes: any[] = [];
    if (uids && uids.length) {
      for await (
        const meta of client.fetch(uids.join(","), {
          envelope: true,
          size: true,
        }, { uid: true })
      ) envelopes.push(meta);
    }
    for (const meta of envelopes) {
      const uid = meta.uid;
      if (Date.now() - start > 25000) {
        complete = false;
        break;
      }
      const messageId = meta.envelope?.messageId ??
        `imap:${user}:${client.mailbox && client.mailbox.uidValidity}:${uid}`;
      if (known.has(messageId)) continue;
      if (Number(meta.size) > 20 * 1024 * 1024) {
        skipped++;
        continue;
      }
      const item = await client.fetchOne(uid, { source: true }, { uid: true });
      if (!item || !item.source) continue;
      const email = await simpleParser(item.source);
      const sender = email.from?.value[0];
      if (!sender?.address) continue;
      const t = Date.now(), received = email.date?.getTime() ?? t;
      await sql.begin(async (tx) => {
        await tx`select pg_advisory_xact_lock(hashtext(${messageId}))`;
        const duplicate =
          await tx`select message_id from contact.inbound_emails where message_id=${messageId}`;
        if (duplicate.length) return;
        const automated = email.headers.has("list-unsubscribe") ||
          email.headers.get("auto-submitted") &&
            email.headers.get("auto-submitted") !== "no" ||
          /no[-_.]?reply|mailer-daemon|postmaster/i.test(sender.address!);
        if (automated) {
          await tx`insert into contact.inbound_emails(message_id,from_email,received_at,imported_at) values(${messageId},${sender
            .address!},${received},${t})`;
          skipped++;
          return;
        }
        const refs = [
          email.inReplyTo,
          ...(Array.isArray(email.references)
            ? email.references
            : email.references
            ? [email.references]
            : []),
        ].filter(Boolean) as string[];
        const related = refs.length
          ? await tx`select contact_message_id as id from contact.inbound_emails where message_id=any(${refs}::text[]) and contact_message_id is not null union select r.message_id as id from contact.outbound_emails o join contact.replies r on r.id=o.reply_id where o.message_id=any(${refs}::text[]) limit 1`
          : [];
        const body = (email.text ??
          sanitizeHtml(String(email.html ?? ""), {
            allowedTags: [],
            allowedAttributes: {},
          })).trim();
        let contactId;
        if (related.length) {
          contactId = related[0].id;
          await tx`insert into contact.followups(message_id,body,received_at,created_at,updated_at) values(${contactId},${
            body.slice(0, 20000)
          },${received},${t},${t})`;
          await tx`update contact.messages set status='NEW',last_activity_at=${received},updated_at=${t},version=version+1 where id=${contactId} and is_active`;
        } else {
          const [r] =
            await tx`insert into contact.messages(name,email,message,source_page,status,created_at,updated_at,last_activity_at) values(${
              (sender.name || sender.address!).slice(0, 100)
            },${sender.address!.slice(0, 254)},${
              ((email.subject ?? "") + "\n" + body).slice(0, 5000)
            },'email','NEW',${received},${t},${received}) returning id`;
          contactId = r.id;
        }
        await tx`insert into contact.inbound_emails(message_id,contact_message_id,from_email,received_at,imported_at) values(${messageId},${contactId},${sender
          .address!},${received},${t})`;
        imported++;
      });
    }
    // Import replies written directly in Gmail as well as dashboard replies.
    // Both mailboxes remain read-only; Message-ID makes retries idempotent.
    if (Date.now() - start < 30000) {
      const sentFolder = (await client.list()).find((folder: any) =>
        folder.specialUse === "\\Sent"
      );
      if (sentFolder) {
        await client.mailboxOpen(sentFolder.path, { readOnly: true });
        const sentUids = await client.search({
          since: new Date(Date.now() - 30 * 86400000),
        }, { uid: true });
        const sentKnownRows =
          await sql`select message_id from contact.outbound_emails`;
        const sentKnown = new Set(sentKnownRows.map((r) => r.message_id));
        const sentEnvelopes: any[] = [];
        if (sentUids && sentUids.length) {
          for await (
            const meta of client.fetch(sentUids.join(","), {
              envelope: true,
              size: true,
            }, { uid: true })
          ) sentEnvelopes.push(meta);
        }
        for (const meta of sentEnvelopes) {
          const uid = meta.uid;
          if (Date.now() - start > 35000) {
            complete = false;
            break;
          }
          if (
            !meta?.envelope?.messageId || Number(meta.size) > 20 * 1024 * 1024
          ) continue;
          const mid = meta.envelope.messageId;
          if (sentKnown.has(mid)) continue;
          const item = await client.fetchOne(uid, { source: true }, {
            uid: true,
          });
          if (!item || !item.source) continue;
          const email = await simpleParser(item.source),
            t = Date.now(),
            sentAt = email.date?.getTime() ?? t;
          await sql.begin(async (tx) => {
            await tx`select pg_advisory_xact_lock(hashtext(${mid}))`;
            if (
              (await tx`select message_id from contact.outbound_emails where message_id=${mid}`)
                .length
            ) return;
            let replyId: number | null = null;
            const refs = [
              email.inReplyTo,
              ...(Array.isArray(email.references)
                ? email.references
                : email.references
                ? [email.references]
                : []),
            ].filter(Boolean) as string[];
            if (!email.headers.has("x-nexa-reply") && refs.length) {
              const related =
                await tx`select m.id from contact.messages m where m.is_active and m.id in (select contact_message_id from contact.inbound_emails where message_id=any(${refs}::text[]) union select r.message_id from contact.outbound_emails o join contact.replies r on r.id=o.reply_id where o.message_id=any(${refs}::text[])) limit 1`;
              if (related.length) {
                const body = (email.text ??
                  sanitizeHtml(String(email.html ?? ""), {
                    allowedTags: [],
                    allowedAttributes: {},
                  })).slice(0, 200000);
                const [r] =
                  await tx`insert into contact.replies(message_id,subject,body,status,sent_by,sent_at,created_at,updated_at) values(${
                    related[0].id
                  },${
                    (email.subject ?? "Re:").slice(0, 255)
                  },${body},'SENT',null,${sentAt},${t},${t}) returning id`;
                replyId = Number(r.id);
                for (const a of email.attachments ?? []) {
                  await tx`insert into contact.reply_attachments(reply_id,file_name,content_type,size_bytes) values(${replyId},${
                    (a.filename ?? "attachment").slice(0, 255)
                  },${a.contentType ?? null},${a.size ?? null})`;
                }
                await tx`update contact.messages set replied_at=greatest(coalesce(replied_at,0),${sentAt}),status=case when last_activity_at<=${sentAt} then 'REPLIED' else status end,last_activity_at=greatest(last_activity_at,${sentAt}),updated_at=${t},version=version+1 where id=${
                  related[0].id
                }`;
                replies++;
              }
            }
            await tx`insert into contact.outbound_emails(message_id,reply_id,sent_at,imported_at) values(${mid},${replyId},${sentAt},${t})`;
          });
        }
      }
    } else complete = false;
    return ok({
      fetched: true,
      complete,
      imported,
      skipped,
      replies,
      lastFetchedAt: Date.now(),
    });
  } catch (error) {
    if (!timedOut) throw error;
    return ok({
      fetched: true,
      complete: false,
      imported,
      skipped,
      replies,
      lastFetchedAt: Date.now(),
    });
  } finally {
    try {
      await client.logout();
    } catch {
      client.close();
    }
    clearTimeout(timer);
    await sql`select pg_advisory_unlock(19862215)`;
  }
}

export async function mail(
  sql: Sql,
  path: string,
  request: Request,
  userId: number,
): Promise<Response | null> {
  if (
    path === "/admin/contact-messages/mail/status" && request.method === "GET"
  ) {
    const smtp = transport();
    try {
      await smtp.verify();
      return ok({ smtp: true });
    } finally {
      smtp.close();
    }
  }
  if (
    path === "/admin/contact-messages/inbox/fetch" && request.method === "POST"
  ) {
    return inbox(
      sql,
      new URL(request.url).searchParams.get("force") === "true",
    );
  }
  const match = path.match(
    /^\/admin\/contact-messages\/(\d+)\/reply(\/preview)?$/,
  );
  if (!match || request.method !== "POST") return null;
  const id = Number(match[1]),
    [message] =
      await sql`select * from contact.messages where id=${id} and is_active`;
  if (!message) return failure(404, "Contact not found");
  let input: any, files: File[] = [];
  if (request.headers.get("content-type")?.startsWith("multipart/form-data")) {
    const form = await request.formData(), part = form.get("reply");
    input = JSON.parse(part instanceof Blob ? await part.text() : String(part));
    files = form.getAll("files").filter((f): f is File => f instanceof File);
  } else input = await request.json();
  if (
    files.length > 10 ||
    files.reduce((n, f) => n + f.size, 0) > 18 * 1024 * 1024
  ) return failure(413, "Attachments exceed limits");
  const rendered = render(input);
  if (match[2]) return ok(rendered);
  if (
    message.email.toLowerCase() === Deno.env.get("MAIL_FROM")?.toLowerCase()
  ) return failure(422, "Cannot reply to own mailbox");
  const smtp = transport();
  const refs =
    await sql`select message_id from contact.inbound_emails where contact_message_id=${id} order by received_at desc limit 1`;
  const t = Date.now();
  let status = "SENT",
    error: string | null = null,
    mailId: string | null = null;
  try {
    const sent = await smtp.sendMail({
      from: {
        name: "Nexa Tech",
        address: Deno.env.get("MAIL_FROM") ?? Deno.env.get("MAIL_USERNAME")!,
      },
      to: message.email,
      subject: rendered.subject,
      text: rendered.text,
      html: rendered.html,
      inReplyTo: refs[0]?.message_id,
      references: refs.map((r) => r.message_id),
      headers: { "X-Nexa-Reply": String(id) },
      attachments: await Promise.all(
        files.map(async (f) => ({
          filename: f.name,
          content: Buffer.from(await f.arrayBuffer()),
          contentType: f.type || undefined,
        })),
      ),
    });
    mailId = sent.messageId;
  } catch (e) {
    status = "FAILED";
    error = "SMTP rejected the message";
  } finally {
    smtp.close();
  }
  await sql.begin(async (tx) => {
    const [reply] =
      await tx`insert into contact.replies(message_id,subject,body,status,error,sent_by,sent_at,created_at,updated_at) values(${id},${rendered.subject},${input.body},${status},${error},${userId},${t},${t},${t}) returning id`;
    for (const f of files) {
      await tx`insert into contact.reply_attachments(reply_id,file_name,content_type,size_bytes) values(${reply.id},${
        f.name.slice(0, 255)
      },${f.type || null},${f.size})`;
    }
    if (status === "SENT") {
      await tx`update contact.messages set status='REPLIED',replied_at=${t},last_activity_at=${t},updated_at=${t},version=version+1 where id=${id}`;
      if (mailId) {
        await tx`insert into contact.outbound_emails(message_id,reply_id,sent_at,imported_at) values(${mailId},${reply.id},${t},${t}) on conflict do nothing`;
      }
    }
  });
  if (error) return failure(502, error);
  return readApi(
    sql,
    `/admin/contact-messages/${id}`,
    new URL(request.url),
    request,
  );
}
