import { useRoute } from "wouter";
import { ContactsView, DashboardView, LoginScreen, SettingsView } from "@/components/dashboard";
import { useLogout, useMe } from "@/services/auth";
import { selectIsAuthenticated, useAuthStore } from "@/stores/auth-store";

export default function Dashboard() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  // Validates the stored session on load; an unrecoverable 401 clears the store and shows the login screen.
  useMe();
  const logout = useLogout();
  const [isSettings] = useRoute("/dashboard/settings");
  const [isContacts] = useRoute("/dashboard/contacts");

  if (!isAuthenticated) return <LoginScreen />;

  const onLogout = () => logout.mutate();
  if (isSettings) return <SettingsView onLogout={onLogout} />;
  if (isContacts) return <ContactsView onLogout={onLogout} />;
  return <DashboardView onLogout={onLogout} />;
}
