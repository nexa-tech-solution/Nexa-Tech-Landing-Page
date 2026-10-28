export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "https://nexateam-api.duckdns.org/api/v1",
  // OAuth web client id from Google Cloud Console. Unset = demo sign-in button.
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "",
  // Customer auth, votes and comments are mocked in the browser until the
  // backend ships docs/customer-api.md. Set to "false" to call the real API.
  customerApiMock: import.meta.env.VITE_CUSTOMER_API_MOCK !== "false",
} as const;

// Where to send the user when the session can no longer be refreshed.
export const LOGIN_PATH = "/dashboard";
