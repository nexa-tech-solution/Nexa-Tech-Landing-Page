import { LayoutDashboard, LogOut, Settings2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { selectUser, useAuthStore } from "@/stores/auth-store";

const NAV = [
  { href: "/dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/dashboard/settings", label: "Cấu hình", icon: Settings2 },
];

export function DashboardHeader({ onLogout }: { onLogout: () => void }) {
  const user = useAuthStore(selectUser);
  const [location] = useLocation();
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <img src="/favicon.webp" alt="" className="h-7 w-7 rounded-md" />
          <span className="font-display text-lg font-bold">
            Bảng điều khiển Nexa
          </span>
          <span className="hidden rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700 sm:inline">
            Dữ liệu mẫu
          </span>
          <nav className="ml-2 flex items-center gap-1 sm:ml-4">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = location === href;
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                    active ? "bg-gray-100 text-[#0d0c22]" : "text-gray-500 hover:text-[#0d0c22]"
                  }`}
                >
                  <Icon size={14} />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden text-right leading-tight sm:block">
              <div className="text-sm font-medium">{user.displayName}</div>
              <div className="text-[11px] text-gray-500">{user.email}</div>
            </div>
          )}
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100"
          >
            <LogOut size={14} /> Đăng xuất
          </button>
        </div>
      </div>
    </header>
  );
}
