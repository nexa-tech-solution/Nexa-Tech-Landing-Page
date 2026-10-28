import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Customer, CustomerTokens } from "@/services/customer-auth/customer-auth.types";

type CustomerSession = Pick<CustomerTokens, "accessToken" | "refreshToken"> & {
  accessTokenExpiresAt: number; // epoch ms
};

type CustomerAuthState = {
  session: CustomerSession | null;
  customer: Customer | null;
  // Set when an action needs a signed-in customer; the login dialog reads it.
  loginReason: string | null;
  setSession: (tokens: CustomerTokens) => void;
  clearSession: () => void;
  updateCustomer: (patch: Partial<Customer>) => void;
  requestLogin: (reason: string) => void;
  closeLogin: () => void;
};

// Kept apart from the admin store: customers stay signed in across visits
// (localStorage), admins only for the browser session.
export const useCustomerAuthStore = create<CustomerAuthState>()(
  persist(
    (set) => ({
      session: null,
      customer: null,
      loginReason: null,
      setSession: (t) =>
        set({
          session: {
            accessToken: t.accessToken,
            refreshToken: t.refreshToken,
            accessTokenExpiresAt: Date.now() + t.accessTokenExpiresIn * 1000,
          },
          customer: t.customer,
          loginReason: null,
        }),
      clearSession: () => set({ session: null, customer: null }),
      updateCustomer: (patch) => set((s) => (s.customer ? { customer: { ...s.customer, ...patch } } : s)),
      requestLogin: (reason) => set({ loginReason: reason }),
      closeLogin: () => set({ loginReason: null }),
    }),
    {
      name: "nexa-customer-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: ({ session, customer }) => ({ session, customer }),
    },
  ),
);

// Runs `action` when signed in, otherwise opens the login dialog.
export function requireCustomer(reason: string, action: () => void) {
  const { customer, requestLogin } = useCustomerAuthStore.getState();
  if (customer) action();
  else requestLogin(reason);
}
