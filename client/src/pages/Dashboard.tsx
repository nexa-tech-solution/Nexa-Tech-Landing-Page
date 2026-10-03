import { useState } from "react";
import { DashboardView, LoginScreen, isAuthenticated, logout } from "@/components/dashboard";

export default function Dashboard() {
  const [authed, setAuthed] = useState(isAuthenticated);

  if (!authed) return <LoginScreen onSuccess={() => setAuthed(true)} />;

  return (
    <DashboardView
      onLogout={() => {
        logout();
        setAuthed(false);
      }}
    />
  );
}
