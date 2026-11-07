import type { Sql } from "npm:postgres@3.4.5";
import bcrypt from "npm:bcryptjs@2.4.3";
import { jwtVerify, SignJWT } from "npm:jose@5.9.6";
import { sqlClient } from "../shared/db.ts";
import { apiError, envelope, now, response } from "../shared/http.ts";
const encoder = new TextEncoder();
const ACCESS_TTL = 900, REFRESH_TTL = 604800;
type User = {
  id: number;
  email: string;
  display_name: string;
  role: string;
  last_login_at: number | null;
};
function jwtKey() {
  const secret = Deno.env.get("NEXA_JWT_SECRET");
  if (!secret) throw new Error("NEXA_JWT_SECRET is missing");
  return encoder.encode(secret);
}

const profile = (user: User) => ({
  userId: Number(user.id),
  email: user.email,
  displayName: user.display_name,
  role: user.role,
  lastLoginAt: user.last_login_at == null ? null : Number(user.last_login_at),
});

async function sha256(value: string) {
  const bytes = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function signToken(
  user: User,
  tokenType: "access" | "refresh",
  expiresIn: number,
) {
  return new SignJWT({
    uid: String(user.id),
    email: user.email,
    name: user.display_name,
    role: user.role,
    tokenType,
  })
    .setProtectedHeader({ alg: "HS256" }).setSubject(user.email).setIssuedAt()
    .setExpirationTime(`${expiresIn}s`).setJti(crypto.randomUUID()).sign(
      jwtKey(),
    );
}

async function issueTokens(sql: Sql, user: User, request: Request) {
  const accessToken = await signToken(user, "access", ACCESS_TTL);
  const refreshToken = await signToken(user, "refresh", REFRESH_TTL);
  const timestamp = now();
  await sql`
    insert into iam.sessions (user_id, refresh_token_hash, user_agent, ip_address, expires_at, version, created_at, updated_at, is_active)
    values (${user.id}, ${await sha256(refreshToken)}, ${
    request.headers.get("user-agent")?.slice(0, 512) ?? null
  },
      ${
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim().slice(
      0,
      64,
    ) ?? null
  },
      ${timestamp + REFRESH_TTL * 1000}, 0, ${timestamp}, ${timestamp}, true)`;
  return {
    tokenType: "Bearer",
    accessToken,
    accessTokenExpiresIn: ACCESS_TTL,
    refreshToken,
    refreshTokenExpiresIn: REFRESH_TTL,
    user: profile(user),
  };
}

export async function requireAdmin(
  request: Request,
): Promise<{ userId: number } | Response> {
  const raw = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!raw) return apiError(401, "AUTH-401", "error.auth.unauthorized");
  try {
    const { payload } = await jwtVerify(raw, jwtKey());
    if (payload.tokenType !== "access" || !payload.uid) {
      throw new Error("invalid token type");
    }
    return { userId: Number(payload.uid) };
  } catch {
    return apiError(401, "AUTH-401", "error.auth.unauthorized");
  }
}

export async function authRoute(request: Request, path: string) {
  if (!path.startsWith("/auth/admin/")) return null;
  const sql = sqlClient();
  try {
    if (path === "/auth/admin/login" && request.method === "POST") {
      const body = await request.json() as {
        email?: string;
        password?: string;
      };
      if (!body.email || !body.password) {
        return apiError(400, "AUTH-400", "error.auth.invalid-credentials");
      }
      const [user] = await sql<
        (User & {
          password_hash: string;
          status: string;
          is_active: boolean;
          deleted_at: number | null;
        })[]
      >`
        select id, email, display_name, role, last_login_at, password_hash, status, is_active, deleted_at
        from iam.users where lower(email) = lower(${body.email.trim()}) and is_active = true limit 1`;
      if (
        !user || user.deleted_at != null || user.status !== "active" ||
        !await bcrypt.compare(body.password, user.password_hash)
      ) {
        return apiError(401, "AUTH-401", "error.auth.invalid-credentials");
      }
      const timestamp = now();
      await sql`update iam.users set last_login_at = ${timestamp}, updated_at = ${timestamp}, version = version + 1 where id = ${user.id}`;
      user.last_login_at = timestamp;
      return response(200, envelope(await issueTokens(sql, user, request)));
    }

    if (path === "/auth/admin/refresh" && request.method === "POST") {
      const { refreshToken } = await request.json() as {
        refreshToken?: string;
      };
      if (!refreshToken) {
        return apiError(401, "AUTH-401", "error.auth.refresh-token-invalid");
      }
      const { payload } = await jwtVerify(refreshToken, jwtKey());
      if (payload.tokenType !== "refresh" || !payload.uid) {
        throw new Error("invalid refresh");
      }
      const [session] = await sql<{ id: number; user_id: number }[]>`
        select id, user_id from iam.sessions where refresh_token_hash = ${await sha256(
        refreshToken,
      )}
          and revoked_at is null and deleted_at is null and is_active = true and expires_at > ${now()} limit 1`;
      if (!session || String(session.user_id) !== String(payload.uid)) {
        throw new Error("expired refresh");
      }
      const [user] = await sql<
        User[]
      >`select id, email, display_name, role, last_login_at from iam.users where id = ${session.user_id} and is_active = true and deleted_at is null and status = 'active'`;
      if (!user) throw new Error("missing user");
      const rotated =
        await sql`update iam.sessions set revoked_at = ${now()}, updated_at = ${now()}, version = version + 1 where id = ${session.id} and revoked_at is null returning id`;
      if (!rotated.length) throw new Error("Refresh token already rotated");
      return response(200, envelope(await issueTokens(sql, user, request)));
    }

    if (path === "/auth/admin/logout" && request.method === "POST") {
      const { refreshToken } = await request.json() as {
        refreshToken?: string;
      };
      if (refreshToken) {
        await sql`update iam.sessions set revoked_at = ${now()}, updated_at = ${now()} where refresh_token_hash = ${await sha256(
          refreshToken,
        )} and revoked_at is null`;
      }
      return response(200, envelope({}));
    }

    if (path === "/auth/admin/me" && request.method === "GET") {
      const auth = await requireAdmin(request);
      if (auth instanceof Response) return auth;
      const [user] = await sql<
        User[]
      >`select id, email, display_name, role, last_login_at from iam.users where id = ${auth.userId} and is_active = true and deleted_at is null`;
      return user
        ? response(200, envelope(profile(user)))
        : apiError(404, "AUTH-404", "error.auth.user-not-found");
    }
    return null;
  } catch (error) {
    console.error("auth route failed", error);
    return apiError(401, "AUTH-401", "error.auth.refresh-token-invalid");
  } finally {
    await sql.end({ timeout: 5 });
  }
}
