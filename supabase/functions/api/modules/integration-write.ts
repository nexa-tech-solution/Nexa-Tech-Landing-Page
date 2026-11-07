import type { Sql } from "npm:postgres@3.4.5";
import { type Connection, credentials } from "./importers/admob.ts";
import { appleToken, googleToken } from "./importers/stores.ts";
import { failure, ok } from "./read-api.ts";

const definitions: Record<string, { config: string[]; secrets: string[] }> = {
  admob: {
    config: ["publisherId", "clientId"],
    secrets: ["clientSecret", "refreshToken"],
  },
  firebase: { config: ["ga4PropertyId"], secrets: ["serviceAccountJson"] },
  google_play: { config: ["reportsBucket"], secrets: ["serviceAccountJson"] },
  app_store_connect: {
    config: ["issuerId", "keyId", "vendorNumber"],
    secrets: ["privateKey"],
  },
  revenuecat: { config: ["projectId"], secrets: ["secretApiKey"] },
};
async function encrypt(value: string) {
  const raw = Deno.env.get("INTEGRATION_ENCRYPTION_KEY");
  if (!raw) throw new Error("Missing integration encryption key");
  const key = await crypto.subtle.importKey(
      "raw",
      Uint8Array.from(atob(raw), (c) => c.charCodeAt(0)),
      "AES-GCM",
      false,
      ["encrypt"],
    ),
    iv = crypto.getRandomValues(new Uint8Array(12)),
    cipher = new Uint8Array(
      await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        new TextEncoder().encode(value),
      ),
    ),
    packed = new Uint8Array(iv.length + cipher.length);
  packed.set(iv);
  packed.set(cipher, 12);
  return btoa(String.fromCharCode(...packed));
}
export async function testConnection(c: Connection) {
  const config = JSON.parse(c.config_json), secrets = await credentials(c);
  let url = "", token = "";
  if (c.provider === "google_play") {
    token = await googleToken(
      secrets.serviceAccountJson,
      "https://www.googleapis.com/auth/devstorage.read_only",
    );
    url = `https://storage.googleapis.com/storage/v1/b/${
      encodeURIComponent(
        config.reportsBucket.replace(/^gs:\/\//, "").replace(/\/$/, ""),
      )
    }/o?maxResults=1`;
  } else if (c.provider === "firebase") {
    token = await googleToken(
      secrets.serviceAccountJson,
      "https://www.googleapis.com/auth/analytics.readonly",
    );
    url = `https://analyticsadmin.googleapis.com/v1beta/properties/${
      encodeURIComponent(config.ga4PropertyId.replace(/^properties\//, ""))
    }/dataStreams?pageSize=1`;
  } else if (c.provider === "app_store_connect") {
    token = await appleToken(config, secrets);
    url = "https://api.appstoreconnect.apple.com/v1/apps?limit=1";
  } else if (c.provider === "revenuecat") {
    token = secrets.secretApiKey;
    url = `https://api.revenuecat.com/v2/projects/${
      encodeURIComponent(config.projectId)
    }/apps?limit=1`;
  } else if (c.provider === "admob") {
    const r = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: config.clientId,
        client_secret: secrets.clientSecret,
        refresh_token: secrets.refreshToken,
      }),
      signal: AbortSignal.timeout(20000),
    });
    if (!r.ok) {
      throw new Error(`Google OAuth refused credentials (${r.status})`);
    }
    token = (await r.json()).access_token;
    url = `https://admob.googleapis.com/v1/accounts/${
      encodeURIComponent(config.publisherId.replace(/^accounts\//, ""))
    }`;
  } else throw new Error("Unknown provider");
  const r = await fetch(url, {
    headers: { authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(20000),
  });
  if (!r.ok) throw new Error(`Provider access check failed (HTTP ${r.status})`);
  await r.body?.cancel();
  return {
    ok: true,
    message: "Connection verified with provider",
    checkedAt: Date.now(),
  };
}

export async function integrationWrite(
  sql: Sql,
  path: string,
  request: Request,
  userId: number,
): Promise<Response | null> {
  const match = path.match(/^\/admin\/integrations(?:\/(\d+))?(\/test)?$/);
  if (!match || !["POST", "PUT", "DELETE"].includes(request.method)) {
    return null;
  }
  const id = match[1] ? Number(match[1]) : null;
  let existing: any = null;
  if (id) {
    [existing] =
      await sql`select * from integration.connections where id=${id} and is_active`;
    if (!existing) return failure(404, "Integration not found");
  }
  if (match[2] && existing && request.method === "POST") {
    try {
      const result = await testConnection(existing);
      await sql`update integration.connections set status='CONNECTED',last_checked_at=${result.checkedAt},last_error=null,updated_at=${result.checkedAt} where id=${id}`;
      return ok(result);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Provider check failed",
        t = Date.now();
      await sql`update integration.connections set status='ERROR',last_error=${message},last_checked_at=${t},updated_at=${t} where id=${id}`;
      return ok({ ok: false, message, checkedAt: t });
    }
  }
  if (request.method === "DELETE" && id) {
    const active =
      await sql`select id from integration.jobs where integration_id=${id} and status in ('RUNNING','QUEUED')`;
    if (active.length) {
      return failure(409, "Wait for the active sync to finish");
    }
    const t = Date.now();
    await sql`update integration.connections set is_active=false,deleted_at=${t},updated_at=${t},version=version+1 where id=${id}`;
    return ok(null);
  }
  if ((request.method === "POST" && !id) || (request.method === "PUT" && id)) {
    const b = await request.json(),
      provider = existing?.provider ?? b.provider,
      definition = definitions[provider];
    if (!definition) return failure(400, "Unknown provider");
    if (
      typeof b.name !== "string" || !b.name.trim() || b.name.length > 100 ||
      typeof b.enabled !== "boolean" || !b.config ||
      typeof b.config !== "object"
    ) return failure(400, "Invalid integration input");
    const config: Record<string, string> = {};
    for (const key of definition.config) {
      if (typeof b.config[key] !== "string" || !b.config[key].trim()) {
        return failure(400, `Missing config: ${key}`);
      }
      config[key] = b.config[key].trim();
    }
    const encrypted = existing ? JSON.parse(existing.secrets_ciphertext) : {};
    for (const key of definition.secrets) {
      if (b.secrets?.[key] != null) {
        if (typeof b.secrets[key] !== "string" || !b.secrets[key].trim()) {
          return failure(400, `Invalid secret: ${key}`);
        }
        encrypted[key] = await encrypt(b.secrets[key].trim());
      }
      if (!encrypted[key]) return failure(400, `Missing secret: ${key}`);
    }
    const configJson = JSON.stringify(config),
      secretsJson = JSON.stringify(encrypted),
      fingerprint = Array.from(
        new Uint8Array(
          await crypto.subtle.digest(
            "SHA-256",
            new TextEncoder().encode(provider + configJson),
          ),
        ),
      ).map((x) => x.toString(16).padStart(2, "0")).join(""),
      t = Date.now();
    let result;
    const candidate = {
      provider,
      config_json: configJson,
      secrets_ciphertext: secretsJson,
    } as Connection;
    await testConnection(candidate);
    if (id) {
      [result] =
        await sql`update integration.connections set name=${b.name.trim()},enabled=${b.enabled},config_json=${configJson},secrets_ciphertext=${secretsJson},account_fingerprint=${fingerprint},status='CONNECTED',last_error=null,last_checked_at=${t},updated_at=${t},version=version+1 where id=${id} returning id`;
    } else {[result] =
        await sql`insert into integration.connections(provider,name,enabled,status,config_json,secrets_ciphertext,account_fingerprint,last_checked_at,created_at,updated_at) values(${provider},${b.name.trim()},${b.enabled},'CONNECTED',${configJson},${secretsJson},${fingerprint},${t},${t},${t}) returning id`;}
    await sql`insert into integration.audit_log(provider,action,actor_user_id,created_at,integration_id) values(${provider},${
      id ? "UPDATE" : "CREATE"
    },${userId},${t},${result.id})`;
    return ok({
      id: Number(result.id),
      provider,
      name: b.name.trim(),
      enabled: b.enabled,
      status: "CONNECTED",
      config,
      secrets: Object.fromEntries(
        definition.secrets.map((key) => [key, { configured: true }]),
      ),
      lastCheckedAt: t,
      lastSyncAt: existing?.last_sync_at ?? null,
      lastError: null,
      syncStatus: null,
      syncMessage: null,
    });
  }
  return failure(405, "Method not allowed");
}
