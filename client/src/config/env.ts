export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api/v1",
} as const;

// Where to send the user when the session can no longer be refreshed.
export const LOGIN_PATH = "/dashboard";
