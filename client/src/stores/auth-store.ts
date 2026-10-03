import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AdminUser, AuthTokens } from "@/services/auth/auth.types";

type SessionTokens = Pick<AuthTokens, "tokenType" | "accessToken" | "refreshToken"> & {
  accessTokenExpiresAt: number; // epoch ms
  refreshTokenExpiresAt: number; // epoch ms
};

type AuthState = {
  tokens: SessionTokens | null;
  user: AdminUser | null;
  setSession: (tokens: AuthTokens) => void;
  setUser: (user: AdminUser) => void;
  clearSession: () => void;
};

// sessionStorage: login lasts for the browser session only.
// TODO: move refresh token to an HttpOnly cookie once the backend supports it.
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      tokens: null,
      user: null,
      setSession: (t) => {
        const now = Date.now();
        set({
          tokens: {
            tokenType: t.tokenType,
            accessToken: t.accessToken,
            refreshToken: t.refreshToken,
            accessTokenExpiresAt: now + t.accessTokenExpiresIn * 1000,
            refreshTokenExpiresAt: now + t.refreshTokenExpiresIn * 1000,
          },
          user: t.user,
        });
      },
      setUser: (user) => set({ user }),
      clearSession: () => set({ tokens: null, user: null }),
    }),
    { name: "nexa.admin.session", storage: createJSONStorage(() => sessionStorage) },
  ),
);

export const selectIsAuthenticated = (s: AuthState) => s.tokens !== null;
export const selectUser = (s: AuthState) => s.user;
