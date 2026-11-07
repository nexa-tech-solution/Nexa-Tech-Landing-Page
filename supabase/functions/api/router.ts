import { dashboard, pnl } from "./modules/analytics.ts";
import { integrationSync } from "./modules/sync-jobs.ts";
import { readApi } from "./modules/read-api.ts";
import { contactWrite } from "./modules/contact-write.ts";
import { adminWrite } from "./modules/admin-write.ts";
import { media } from "./modules/media.ts";
import { mail } from "./modules/mail.ts";
import { contactSubmit } from "./modules/contact-submit.ts";
import { integrationWrite } from "./modules/integration-write.ts";
import { ingestMetrics, resetExpenses } from "./modules/metrics.ts";
import { authRoute, requireAdmin } from "./modules/auth.ts";
import { expenseRoute } from "./modules/expenses.ts";
import { integrationRoute } from "./modules/integration-read.ts";
import { health } from "./modules/health.ts";
import { sqlClient } from "./shared/db.ts";
import { apiError, envelope, jsonHeaders, response } from "./shared/http.ts";
export async function handleRequest(request: Request) {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: jsonHeaders });
  }

  const pathname = new URL(request.url).pathname.replace(/\/$/, "");
  if (
    request.method === "GET" &&
    (pathname.endsWith("/health") || pathname.endsWith("/api/v1/health"))
  ) {
    return health();
  }

  const functionPrefix = pathname.startsWith("/functions/v1/api")
    ? "/functions/v1/api"
    : pathname === "/api" || pathname.startsWith("/api/")
    ? "/api"
    : "";
  const apiPath = functionPrefix
    ? pathname.slice(functionPrefix.length) || "/"
    : pathname;
  if (
    request.method === "GET" &&
    ["/admin/dashboard", "/admin/reports/pnl"].includes(apiPath)
  ) {
    const auth = await requireAdmin(request);
    if (auth instanceof Response) return auth;
    const sql = sqlClient();
    try {
      const vi = request.headers.get("accept-language")?.startsWith("vi") ??
        false;
      const data = apiPath === "/admin/dashboard"
        ? await dashboard(sql, new URL(request.url), vi)
        : await pnl(sql, new URL(request.url), vi);
      return response(200, envelope(data));
    } catch (error) {
      console.error("analytics failed", error);
      return apiError(400, "ANALYTICS-400", "error.analytics.invalid-request");
    } finally {
      await sql.end({ timeout: 5 });
    }
  }
  const authResponse = await authRoute(request, apiPath);
  if (authResponse) return authResponse;
  if (
    request.method === "POST" &&
    ([
      "/admin/metrics/daily",
      "/admin/metrics/ad-formats",
      "/admin/expenses/reset",
    ].includes(apiPath))
  ) {
    const auth = await requireAdmin(request);
    if (auth instanceof Response) return auth;
    const sql = sqlClient();
    try {
      return apiPath === "/admin/expenses/reset"
        ? await resetExpenses(sql)
        : await ingestMetrics(sql, apiPath, request);
    } catch (e) {
      return apiError(400, "COMMON-400", "error.validation.failed");
    } finally {
      await sql.end({ timeout: 5 });
    }
  }
  if (
    ["POST", "PUT", "DELETE"].includes(request.method) &&
    /^\/admin\/integrations(?:\/\d+)?(?:\/test)?$/.test(apiPath)
  ) {
    const auth = await requireAdmin(request);
    if (auth instanceof Response) return auth;
    const sql = sqlClient();
    try {
      const result = await integrationWrite(sql, apiPath, request, auth.userId);
      if (result) return result;
    } catch (error) {
      return response(400, {
        success: false,
        code: 400,
        errorCode: "INTEGRATION-400",
        message: error instanceof Error
          ? error.message
          : "Integration operation failed",
        data: null,
      });
    } finally {
      await sql.end({ timeout: 5 });
    }
  }
  if (
    (apiPath === "/contact" && request.method === "POST") ||
    /^\/admin\/contact-messages\/(?:inbox\/fetch|mail\/status|\d+\/reply(?:\/preview)?)$/
      .test(apiPath)
  ) {
    let userId = 0;
    if (apiPath.startsWith("/admin/")) {
      const auth = await requireAdmin(request);
      if (auth instanceof Response) return auth;
      userId = auth.userId;
    }
    const sql = sqlClient();
    try {
      const result = apiPath === "/contact"
        ? await contactSubmit(sql, request)
        : await mail(sql, apiPath, request, userId);
      if (result) return result;
    } catch (error) {
      console.error(
        "contact request failed",
        error instanceof Error ? error.name : "error",
      );
      return response(502, {
        success: false,
        code: 502,
        errorCode: "MAIL-502",
        message: error instanceof Error
          ? error.message
          : "Mailbox operation failed",
        data: null,
      });
    } finally {
      await sql.end({ timeout: 5 });
    }
  }
  if (
    ["POST", "PUT", "DELETE"].includes(request.method) &&
    /^\/admin\/(apps|blog\/posts|blog\/authors|media\/images)(\/\d+)?$/.test(
      apiPath,
    )
  ) {
    const auth = await requireAdmin(request);
    if (auth instanceof Response) return auth;
    const sql = sqlClient();
    try {
      const result = await media(sql, apiPath, request) ??
        await adminWrite(sql, apiPath, request);
      if (result) return result;
    } catch (error) {
      console.error("admin write failed", error);
      return response(400, {
        success: false,
        code: 400,
        errorCode: "COMMON-400",
        message: error instanceof Error ? error.message : "Request failed",
        data: null,
      });
    } finally {
      await sql.end({ timeout: 5 });
    }
  }
  if (
    request.method === "POST" &&
    /^\/admin\/integrations\/(?:\d+\/)?sync$/.test(apiPath)
  ) {
    const auth = await requireAdmin(request);
    if (auth instanceof Response) return auth;
    return integrationSync(auth.userId, apiPath);
  }
  if (
    ["PUT", "POST", "DELETE"].includes(request.method) &&
    (/^\/admin\/contact-tags(?:\/\d+)?$/.test(apiPath) ||
      /^\/admin\/contact-messages\/\d+(?:\/(?:status|tags))?$/.test(apiPath))
  ) {
    const auth = await requireAdmin(request);
    if (auth instanceof Response) return auth;
    const sql = sqlClient();
    try {
      const result = await contactWrite(sql, apiPath, request);
      if (result) return result;
      const detail = await readApi(
        sql,
        apiPath.replace(/\/(status|tags)$/, ""),
        new URL(request.url),
        request,
      );
      if (detail) {
        const body = await detail.json();
        return response(detail.status, {
          ...body,
          data: body.data?.message ?? body.data,
        });
      }
    } catch (error) {
      console.error("contact write failed", error);
      return apiError(400, "COMMON-400", "error.validation.failed");
    } finally {
      await sql.end({ timeout: 5 });
    }
  }
  if (
    request.method === "GET" &&
    (apiPath.startsWith("/admin/contact-") ||
      apiPath.startsWith("/admin/apps") || apiPath.startsWith("/admin/blog/") ||
      apiPath.startsWith("/admin/media/") ||
      apiPath.startsWith("/blog/posts") || apiPath === "/reference/countries")
  ) {
    if (apiPath.startsWith("/admin/")) {
      const auth = await requireAdmin(request);
      if (auth instanceof Response) return auth;
    }
    const sql = sqlClient();
    try {
      const result = await readApi(sql, apiPath, new URL(request.url), request);
      if (result) return result;
    } finally {
      await sql.end({ timeout: 5 });
    }
  }
  if (apiPath === "/admin/expenses" || apiPath.startsWith("/admin/expenses/")) {
    const expenses = await expenseRoute(request, apiPath);
    if (expenses) return expenses;
  }
  if (/^\/admin\/integrations(?:\/\d+)?$/.test(apiPath)) {
    const integrations = await integrationRoute(request, apiPath);
    if (integrations) return integrations;
  }

  // The migrated API uses its own tokens and database. Forwarding unported
  // mutations to Spring would either fail JWT verification or write to the
  // wrong database. Report route coverage explicitly until ported.
  if (apiPath.startsWith("/admin/")) {
    const auth = await requireAdmin(request);
    if (auth instanceof Response) return auth;
  }
  return response(404, {
    success: false,
    code: 404,
    errorCode: "API-404",
    messageCode: "error.api.not-found",
    message: `API ${request.method} ${apiPath} không tồn tại.`,
    data: null,
    timestamp: Date.now(),
  });
}
