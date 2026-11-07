export const env = {
  // Legacy direct endpoint (kept behind the Supabase gateway during the TypeScript migration):
  // "https://nexateam-api.duckdns.org/api/v1"
  apiBaseUrl:
    import.meta.env.VITE_API_BASE_URL ??
    "https://alvemfxvwyeckparkkci.supabase.co/functions/v1/api",
} as const;

// Where to send the user when the session can no longer be refreshed.
export const LOGIN_PATH = "/dashboard";
