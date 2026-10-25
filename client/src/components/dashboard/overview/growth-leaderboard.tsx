import { useState } from "react";
import { ProjectAvatar } from "@/components/nexa/layout";
import { COLORS } from "@/components/dashboard/lib/constants";
import { shortLabel } from "@/components/dashboard/lib/dates";
import { installChange, num } from "@/components/dashboard/lib/format";
import { EmptyState, InfoTip, InstallDelta, Panel, Segmented, Sparkline } from "@/components/dashboard/ui";
import type { AppStats } from "@/components/dashboard/lib/types";

type Mode = "up" | "down";

// Same threshold as DashboardAssembler.MIN_GROWTH_BASE on the backend.
const MIN_GROWTH_BASE = 10;

export function GrowthLeaderboard({ apps }: { apps: AppStats[] }) {
  const [mode, setMode] = useState<Mode>("up");
  // Apps with a % first, then those whose previous period was too small for one (ranked by the
  // absolute change); apps with no full previous period can't be ranked and are left out.
  const sign = mode === "up" ? 1 : -1;
  const comparable = apps.some((a) => installChange(a) != null);
  const list = apps
    .map((app) => ({ app, change: installChange(app) }))
    .filter((r) => r.change != null && sign * r.change.value > 0)
    .sort((a, b) => {
      if (a.change!.kind !== b.change!.kind) return a.change!.kind === "pct" ? -1 : 1;
      return sign * (b.change!.value - a.change!.value);
    })
    .slice(0, 6);

  return (
    <Panel
      title="Ứng dụng tăng trưởng"
      subtitle="Xếp hạng theo % thay đổi lượt cài"
      info={
        <InfoTip label="Cách tính tăng trưởng">
          <p className="font-semibold text-white">Cách tính</p>
          <ul className="mt-1 list-disc space-y-1 pl-4">
            <li>So sánh lượt cài trong khoảng ngày đang chọn với khoảng liền trước có cùng độ dài (vd. 30 ngày này với 30 ngày trước đó).</li>
            <li>
              Kỳ trước dưới {MIN_GROWTH_BASE} lượt cài thì % không có ý nghĩa (3 → 14 = +367%), nên hiện số lượt chênh lệch, vd. <b>+11 lượt</b>.
            </li>
            <li>Ứng dụng chưa có dữ liệu cho trọn kỳ trước thì không xếp hạng: dữ liệu chỉ có từ ngày kết nối nguồn (App Store, Google Play, Firebase…), nên kỳ trước bị thiếu và % sẽ bị thổi phồng.</li>
          </ul>
          {!comparable && (
            <p className="mt-2 border-t border-white/15 pt-2">
              Hiện chưa ứng dụng nào đủ dữ liệu kỳ trước. Chọn khoảng ngắn hơn (7 hoặc 14 ngày) để xem xếp hạng.
            </p>
          )}
        </InfoTip>
      }
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
        <EmptyState
          text={
            comparable
              ? mode === "up"
                ? "Không có ứng dụng nào tăng lượt cài"
                : "Không có ứng dụng nào giảm lượt cài"
              : "Chưa đủ dữ liệu kỳ trước để so sánh. Chọn khoảng 7 hoặc 14 ngày, hoặc xem ⓘ để biết lý do."
          }
        />
      ) : (
        <ol className="space-y-1">
          {list.map(({ app, change }, i) => (
            <li key={app.slug} className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-gray-50">
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
                  color={change!.value >= 0 ? COLORS.installs : "#ef4444"}
                  height={28}
                />
              </div>
              <InstallDelta change={change} />
            </li>
          ))}
        </ol>
      )}
    </Panel>
  );
}
