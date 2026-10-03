// TODO: Client-side gate only — replace with real backend auth before exposing real data.
const ADMIN_EMAIL = "admin@nexa.com";
const ADMIN_PASSWORD = "Admin1234";
const SESSION_KEY = "nexa-dashboard-auth";

export function isAuthenticated() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function login(email: string, password: string) {
  if (email.trim().toLowerCase() !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) return false;
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {}
  return true;
}

export function logout() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {}
}
