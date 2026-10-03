import { useState } from "react";
import { ProjectAvatar } from "@/components/nexa/layout";
import { COLORS } from "@/components/dashboard/lib/constants";
import { shortLabel } from "@/components/dashboard/lib/dates";
import { num } from "@/components/dashboard/lib/format";
import { Delta, EmptyState, Panel, Segmented, Sparkline } from "@/components/dashboard/ui";
import type { AppStats } from "@/components/dashboard/lib/types";

type Mode = "up" | "down";

export function GrowthLeaderboard({ apps }: { apps: AppStats[] }) {
  const [mode, setMode] = useState<Mode>("up");
  const list = [...apps].sort((a, b) => (mode === "up" ? b.growth - a.growth : a.growth - b.growth)).slice(0, 6);

  return (
    <Panel
      title="Ứng dụng tăng trưởng"
      subtitle="Xếp hạng theo % thay đổi lượt cài"
      action={
        <Segmented
          value={mode}
          onChange={setMode}
          options={[
            { value: "up", label: "Tăng mạnh" },
            { value: "down", label: "Giảm mạnh" },
          ]}
        />
      }
    >
      {list.length === 0 ? (
        <EmptyState />
      ) : (
        <ol className="space-y-1">
          {list.map((app, i) => (
            <li key={app.project.title} className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-gray-50">
              <span className="w-4 text-xs font-semibold text-gray-400">{i + 1}</span>
              <ProjectAvatar project={app.project} className="h-9 w-9 text-[10px]" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{app.project.title}</div>
                <div className="text-[11px] text-gray-500">{num(app.installs)} lượt cài</div>
              </div>
              <div className="hidden w-20 sm:block">
                <Sparkline
                  data={app.current.map((d) => d.installs)}
                  labels={app.current.map((d) => shortLabel(d.date))}
                  format={(v) => `${num(v)} lượt cài`}
                  color={app.growth >= 0 ? COLORS.installs : "#ef4444"}
                  height={28}
                />
              </div>
              <Delta value={app.growth} />
            </li>
          ))}
        </ol>
      )}
    </Panel>
  );
}
