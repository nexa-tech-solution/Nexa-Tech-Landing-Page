import { useMemo, useState } from "react";
import { Apple, ArrowDown, ArrowUp, ChevronsUpDown, Play, Search } from "lucide-react";
import { ProjectAvatar } from "@/components/nexa/layout";
import { num, percent, usd } from "./format";
import { Delta, Panel, Segmented } from "./ui";
import type { AppStats } from "./types";

type SortKey = "name" | "installs" | "growth" | "activeUsers" | "adRevenue" | "subRevenue" | "revenue" | "rating" | "crashFree";
type TrendFilter = "all" | "up" | "down";

const COLUMNS: Array<{ key: SortKey; label: string }> = [
  { key: "name", label: "Ứng dụng" },
  { key: "installs", label: "Lượt cài" },
  { key: "growth", label: "Tăng trưởng" },
  { key: "activeUsers", label: "Người dùng HĐ/ngày" },
  { key: "adRevenue", label: "Quảng cáo" },
  { key: "subRevenue", label: "RevenueCat" },
  { key: "revenue", label: "Tổng doanh thu" },
  { key: "rating", label: "Đánh giá" },
  { key: "crashFree", label: "Không lỗi" },
];

const sortValue = (a: AppStats, key: SortKey) => (key === "name" ? a.project.title.toLowerCase() : a[key]);

export function AppTable({ apps }: { apps: AppStats[] }) {
  const [query, setQuery] = useState("");
  const [trend, setTrend] = useState<TrendFilter>("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "revenue", dir: "desc" });

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return apps
      .filter((a) => !q || a.project.title.toLowerCase().includes(q))
      .filter((a) => trend === "all" || (trend === "up" ? a.growth >= 0 : a.growth < 0))
      .sort((a, b) => {
        const va = sortValue(a, sort.key);
        const vb = sortValue(b, sort.key);
        const cmp = va < vb ? -1 : va > vb ? 1 : 0;
        return sort.dir === "asc" ? cmp : -cmp;
      });
  }, [apps, query, trend, sort]);

  const toggleSort = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: key === "name" ? "asc" : "desc" }));

  return (
    <Panel
      title="Chi tiết từng ứng dụng"
      subtitle={`Hiển thị ${rows.length} / ${apps.length} ứng dụng · bấm tiêu đề cột để sắp xếp`}
      action={
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative">
            <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm ứng dụng..."
              className="h-8 w-48 rounded-lg border border-gray-200 pl-8 pr-2 text-xs outline-none focus:border-gray-400"
            />
          </label>
          <Segmented
            value={trend}
            onChange={setTrend}
            options={[
              { value: "all", label: "Tất cả" },
              { value: "up", label: "Đang tăng" },
              { value: "down", label: "Đang giảm" },
            ]}
          />
        </div>
      }
    >
      <div className="-mx-4 overflow-x-auto sm:-mx-5">
        <table className="w-full min-w-[980px] text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-500">
              {COLUMNS.map((c, i) => {
                const active = sort.key === c.key;
                const Icon = !active ? ChevronsUpDown : sort.dir === "asc" ? ArrowUp : ArrowDown;
                return (
                  <th key={c.key} className={`px-4 py-2.5 font-medium sm:px-5 ${i > 0 ? "text-right" : "text-left"}`}>
                    <button
                      type="button"
                      onClick={() => toggleSort(c.key)}
                      className={`inline-flex items-center gap-1 hover:text-[#0d0c22] ${active ? "text-[#0d0c22]" : ""}`}
                    >
                      {c.label}
                      <Icon size={12} className={active ? "" : "opacity-40"} />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.project.title} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3 sm:px-5">
                  <div className="flex items-center gap-2.5">
                    <ProjectAvatar project={a.project} className="h-8 w-8 text-[10px]" />
                    <div>
                      <div className="font-medium">{a.project.title}</div>
                      <div className="flex items-center gap-1 text-[11px] text-gray-500">
                        {a.platform === "App Store" ? <Apple size={11} /> : <Play size={11} />}
                        {a.platform}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-right tabular-nums sm:px-5">{num(a.installs)}</td>
                <td className="px-4 py-3 text-right sm:px-5"><Delta value={a.growth} /></td>
                <td className="px-4 py-3 text-right tabular-nums sm:px-5">{num(a.activeUsers)}</td>
                <td className="px-4 py-3 text-right tabular-nums text-amber-600 sm:px-5">{usd(a.adRevenue)}</td>
                <td className="px-4 py-3 text-right tabular-nums text-[#f2545b] sm:px-5">{a.subRevenue ? usd(a.subRevenue) : "—"}</td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums sm:px-5">{usd(a.revenue)}</td>
                <td className="px-4 py-3 text-right tabular-nums sm:px-5">
                  ★ {a.rating.toLocaleString("vi-VN")} <span className="text-gray-400">({num(a.reviews)})</span>
                </td>
                <td className={`px-4 py-3 text-right tabular-nums sm:px-5 ${a.crashFree < 98.5 ? "text-red-600" : "text-gray-700"}`}>
                  {percent(a.crashFree)}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="py-10 text-center text-sm text-gray-400">
                  Không tìm thấy ứng dụng phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
