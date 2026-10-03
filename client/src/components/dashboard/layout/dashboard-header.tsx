import { LogOut } from "lucide-react";

export function DashboardHeader({ onLogout }: { onLogout: () => void }) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <img src="/favicon.png" alt="" className="h-7 w-7 rounded-md" />
          <span className="font-display text-lg font-bold">Bảng điều khiển Nexa</span>
          <span className="hidden rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700 sm:inline">
            Dữ liệu mẫu
          </span>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100"
        >
          <LogOut size={14} /> Đăng xuất
        </button>
      </div>
    </header>
  );
}
