import { DashboardView, LoginScreen } from "@/components/dashboard";
import { useLogout, useMe } from "@/services/auth";
import { selectIsAuthenticated, useAuthStore } from "@/stores/auth-store";

export default function Dashboard() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  // Validates the stored session on load; an unrecoverable 401 clears the store and shows the login screen.
  useMe();
  const logout = useLogout();

  if (!isAuthenticated) return <LoginScreen />;

  return <DashboardView onLogout={() => logout.mutate()} />;
}
