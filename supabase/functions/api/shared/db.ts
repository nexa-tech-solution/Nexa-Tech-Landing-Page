import postgres from "npm:postgres@3.4.5";
export function sqlClient() {
  const url = Deno.env.get("NEXA_DATABASE_URL");
  if (!url) throw new Error("NEXA_DATABASE_URL is missing");
  return postgres(url, {
    max: 1,
    prepare: false,
    connect_timeout: 10,
    idle_timeout: 5,
  });
}
