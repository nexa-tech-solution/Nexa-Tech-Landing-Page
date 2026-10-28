import { env } from "@/config/env";
import { publicClient, unwrap, type ApiResponse } from "@/lib/http";
import { mockMakerForCustomer } from "@/services/rankings/mock/customer-state";
import type {
  Customer,
  CustomerTokens,
  EmailSignInRequest,
  EmailSignUpRequest,
  GoogleLoginRequest,
  ResetPasswordRequest,
} from "./customer-auth.types";

const BASE = "/auth/customer";

// Reads name/email/picture from the Google ID token. Mock mode only: the real
// backend must verify the token's signature, audience and expiry itself.
function mockTokens(idToken: string): CustomerTokens {
  let claims: { sub?: string; email?: string; name?: string; picture?: string } = {};
  try {
    const payload = idToken.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    claims = JSON.parse(decodeURIComponent(escape(atob(payload))));
  } catch {
    // Demo sign-in passes a non-JWT placeholder.
  }
  const customer: Customer = {
    customerId: Number(claims.sub?.slice(-9) ?? 1),
    email: claims.email ?? "demo@nexateam.dev",
    displayName: claims.name ?? "Demo Maker",
    avatarUrl: claims.picture ?? null,
    makerSlug: null,
  };
  customer.makerSlug = mockMakerForCustomer(customer.customerId)?.slug ?? null;
  return {
    tokenType: "Bearer",
    accessToken: `mock.${customer.customerId}`,
    accessTokenExpiresIn: 3600,
    refreshToken: "mock-refresh",
    refreshTokenExpiresIn: 30 * 86400,
    customer,
  };
}

// Mock-only: a stable fake id per email so the same address is the same account.
const mockIdFor = (email: string) => Array.from(email.toLowerCase()).reduce((n, ch) => (n * 31 + ch.charCodeAt(0)) % 900_000_000, 7) + 100;

function mockEmailTokens(email: string, displayName?: string): CustomerTokens {
  const tokens = mockTokens("demo");
  const customerId = mockIdFor(email);
  tokens.customer = {
    customerId,
    email,
    displayName: displayName || email.split("@")[0],
    avatarUrl: null,
    makerSlug: mockMakerForCustomer(customerId)?.slug ?? null,
  };
  tokens.accessToken = `mock.${customerId}`;
  return tokens;
}

const wait = (ms = 500) => new Promise((r) => setTimeout(r, ms));

export const customerAuthApi = {
  // UI-only for now: email and Apple sign-in are mocked until the backend
  // implements the routes in docs/customer-api.md.
  emailSignIn: async (body: EmailSignInRequest): Promise<CustomerTokens> => {
    if (!env.customerApiMock) return publicClient.post<ApiResponse<CustomerTokens>>(`${BASE}/email/login`, body).then(unwrap);
    await wait();
    return mockEmailTokens(body.email);
  },

  // Creates an unverified account; the backend emails a verification link.
  emailSignUp: async (body: EmailSignUpRequest): Promise<void> => {
    if (!env.customerApiMock) {
      await publicClient.post(`${BASE}/email/register`, body);
      return;
    }
    await wait();
  },

  resendVerification: async (email: string): Promise<void> => {
    if (!env.customerApiMock) {
      await publicClient.post(`${BASE}/email/verify/resend`, { email });
      return;
    }
    await wait();
  },

  // Always succeeds so the response never reveals whether an email is registered.
  forgotPassword: async (email: string): Promise<void> => {
    if (!env.customerApiMock) {
      await publicClient.post(`${BASE}/password/forgot`, { email });
      return;
    }
    await wait();
  },

  resetPassword: async (body: ResetPasswordRequest): Promise<void> => {
    if (!env.customerApiMock) {
      await publicClient.post(`${BASE}/password/reset`, body);
      return;
    }
    await wait();
  },

  apple: async (idToken: string): Promise<CustomerTokens> => {
    if (!env.customerApiMock) return publicClient.post<ApiResponse<CustomerTokens>>(`${BASE}/apple`, { idToken }).then(unwrap);
    await wait();
    return mockEmailTokens("apple.user@privaterelay.appleid.com", "Apple User");
  },

  google: async (body: GoogleLoginRequest): Promise<CustomerTokens> =>
    env.customerApiMock
      ? mockTokens(body.idToken)
      : publicClient.post<ApiResponse<CustomerTokens>>(`${BASE}/google`, body).then(unwrap),

  logout: async (refreshToken: string): Promise<void> => {
    if (env.customerApiMock) return;
    await publicClient.post<ApiResponse<null>>(`${BASE}/logout`, { refreshToken });
  },
};
