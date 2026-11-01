import { useMemo, useState } from "react";
import {
  Apple,
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  Clock,
  Play,
  Search,
} from "lucide-react";
import { ProjectAvatar } from "@/components/nexa/layout";
import { shortLabel } from "@/components/dashboard/lib/dates";
import {
  installChange,
  num,
  percent,
  usd,
} from "@/components/dashboard/lib/format";
import {
  installLags,
  type InstallLag,
} from "@/components/dashboard/lib/install-lag";
import {
  InfoTip,
  InstallDelta,
  Panel,
  Segmented,
  SLIM_SCROLLBAR,
} from "@/components/dashboard/ui";
import type { AppStats, DateRange } from "@/components/dashboard/lib/types";

type SortKey =
  | "name"
  | "installs"
  | "growth"
  | "activeDevices"
  | "adRevenue"
  | "subRevenue"
  | "revenue"
  | "rating"
  | "crashFree";
type TrendFilter = "all" | "up" | "down";

const COLUMNS: Array<{ key: SortKey; label: string }> = [
  { key: "name", label: "Ứng dụng" },
  { key: "installs", label: "Lượt thu nạp" },
  { key: "growth", label: "Tăng trưởng" },
  { key: "activeDevices", label: "Thiết bị HĐ" },
  { key: "adRevenue", label: "Quảng cáo" },
  { key: "subRevenue", label: "RevenueCat" },
  { key: "revenue", label: "Tổng doanh thu" },
  { key: "rating", label: "Đánh giá" },
  // "Không lỗi" (crash-free) is hidden until a source exists (Firebase Crashlytics): Play only
  // publishes it for apps with enough users and App Store Connect has no API for it.
];

// Growth sorts by % where there is one; apps without (tiny or missing previous period) go last.
// Rating / crash-free 0 means "no data from the store" (not a real 0), so those go last too.
const sortValue = (a: AppStats, key: SortKey): string | number | null =>
  key === "name"
    ? a.project.title.toLowerCase()
    : key === "growth"
      ? a.growth
      : key === "activeDevices"
        ? a.activeDevices || null
        : (key === "rating" || key === "crashFree") && !a[key]
          ? null
          : a[key];

const trendOf = (a: AppStats) => {
  const change = installChange(a);
  return change == null ? null : change.value >= 0 ? "up" : "down";
};

export function AppTable({
  apps,
  range,
}: {
  apps: AppStats[];
  range: DateRange;
}) {
  const lags = useMemo(() => installLags(apps, range), [apps, range]);
  const [query, setQuery] = useState("");
  const [trend, setTrend] = useState<TrendFilter>("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({
    key: "revenue",
    dir: "desc",
  });

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return apps
      .filter((a) => !q || a.project.title.toLowerCase().includes(q))
      .filter((a) => trend === "all" || trendOf(a) === trend)
      .sort((a, b) => {
        const va = sortValue(a, sort.key);
        const vb = sortValue(b, sort.key);
        if (va == null || vb == null)
          return va == null ? (vb == null ? 0 : 1) : -1;
        const cmp = va < vb ? -1 : va > vb ? 1 : 0;
        return sort.dir === "asc" ? cmp : -cmp;
      });
  }, [apps, query, trend, sort]);

  const toggleSort = (key: SortKey) =>
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === "asc" ? "desc" : "asc" }
        : { key, dir: key === "name" ? "asc" : "desc" },
    );

  return (
    <Panel
      title="Chi tiết từng ứng dụng"
      subtitle={`Hiển thị ${rows.length} / ${apps.length} ứng dụng · bấm tiêu đề cột để sắp xếp`}
      action={
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative">
            <Search
              size={14}
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
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
      {lags.length > 0 && <InstallLagNotice lags={lags} />}
      {/* Many apps: scroll inside the panel (≈10 rows) with the header pinned. */}
      <div
        className={`-mx-4 max-h-[560px] overflow-auto overscroll-contain sm:-mx-5 ${SLIM_SCROLLBAR}`}
      >
        <table className="w-full min-w-[980px] text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-500">
              {COLUMNS.map((c, i) => {
                const active = sort.key === c.key;
                const Icon = !active
                  ? ChevronsUpDown
                  : sort.dir === "asc"
                    ? ArrowUp
                    : ArrowDown;
                return (
                  <th
                    key={c.key}
                    className={`sticky top-0 z-10 bg-white px-4 py-2.5 font-medium sm:px-5 ${i > 0 ? "text-right" : "text-left"}`}
                  >
                    <span className="inline-flex items-center gap-0.5">
                      {c.key === "installs" && <InstallsSourceTip />}
                      {c.key === "rating" && <RatingSourceTip />}
                      {c.key === "activeDevices" && <ActiveDevicesTip />}
                      <button
                        type="button"
                        onClick={() => toggleSort(c.key)}
                        className={`inline-flex items-center gap-1 hover:text-[#0d0c22] ${active ? "text-[#0d0c22]" : ""}`}
                      >
                        {c.label}
                        <Icon
                          size={12}
                          className={active ? "" : "opacity-40"}
                        />
                      </button>
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr
                key={a.slug}
                className="border-b border-gray-50 last:border-0 hover:bg-gray-50"
              >
                <td className="px-4 py-3 sm:px-5">
                  <div className="flex items-center gap-2.5">
                    <ProjectAvatar
                      project={a.project}
                      className="h-8 w-8 text-[10px]"
                    />
                    <div>
                      <div className="font-medium">{a.project.title}</div>
                      <div className="flex items-center gap-1 text-[11px] text-gray-500">
                        {a.platform === "App Store" ? (
                          <Apple size={11} />
                        ) : (
                          <Play size={11} />
                        )}
                        {a.platform}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-right tabular-nums sm:px-5">
                  <div>{num(a.installs)}</div>
                  {a.installsAllTime != null && (
                    <div
                      className="text-[11px] text-gray-400"
                      title="Tổng từ khi phát hành (không theo khoảng ngày)"
                    >
                      Tổng {num(a.installsAllTime)}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-right sm:px-5">
                  <InstallDelta change={installChange(a)} />
                </td>
                <td className="px-4 py-3 text-right tabular-nums sm:px-5">
                  {a.activeDevices ? (
                    <span
                      title={
                        a.activeUsers > 0
                          ? `Firebase: ${num(a.activeUsers)} người dùng hoạt động/ngày`
                          : undefined
                      }
                    >
                      {num(a.activeDevices)}
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-amber-600 sm:px-5">
                  {usd(a.adRevenue)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-[#f2545b] sm:px-5">
                  {a.subRevenue ? usd(a.subRevenue) : "—"}
                </td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums sm:px-5">
                  {usd(a.revenue)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums sm:px-5">
                  {a.rating > 0 ? (
                    <>
                      ★{" "}
                      {a.rating.toLocaleString("vi-VN", {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      })}
                      {a.reviews > 0 && (
                        <span
                          className="text-gray-400"
                          title="Số lượt đánh giá"
                        >
                          {" "}
                          ({num(a.reviews)})
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={COLUMNS.length}
                  className="py-10 text-center text-sm text-gray-400"
                >
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

// Above the table: which store's installs stop before the end of the selected range, and why.
function InstallLagNotice({ lags }: { lags: InstallLag[] }) {
  return (
    <div className="mb-3 flex gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs leading-relaxed text-amber-900">
      <Clock size={15} className="mt-0.5 shrink-0 text-amber-600" />
      <div className="space-y-1">
        {lags.map((l) => (
          <p key={l.platform}>
            <span className="font-semibold">
              {l.platform}: lượt thu nạp mới có dữ liệu đến{" "}
              {shortLabel(l.lastDay)}.
            </span>{" "}
            {l.platform === "Google Play"
              ? "Google xuất báo cáo lượt thu nạp chậm 3–5 ngày so với Play Console"
              : "App Store Connect chưa có báo cáo cho các ngày gần nhất"}
            , nên {shortLabel(l.missingFrom)}
            {l.missingFrom !== l.missingTo &&
              `–${shortLabel(l.missingTo)}`}{" "}
            đang hiện 0 và sẽ được cập nhật ở lần đồng bộ sau. Tăng trưởng của{" "}
            {l.platform} cũng thấp hơn thực tế vì kỳ này thiếu các ngày đó.
          </p>
        ))}
        <p className="text-amber-800/80">
          So sánh với Play Console: chọn cùng khoảng ngày ở cả hai bên, kết thúc
          trước ngày có dữ liệu cuối cùng.
        </p>
      </div>
    </div>
  );
}

// ⓘ on the "Lượt thu nạp" header: what the numbers are and where each store's come from.
function ActiveDevicesTip() {
  return (
    <InfoTip label="Nguồn số liệu thiết bị hoạt động">
      <p className="mb-1.5 font-semibold text-white">
        Thiết bị hoạt động lấy từ đâu?
      </p>
      <p className="mb-1.5">
        Lấy trực tiếp từ store, trung bình mỗi ngày trong khoảng ngày đang chọn
        (chỉ tính các ngày store đã báo cáo).
      </p>
      <p className="mb-1.5">
        <span className="font-medium text-white">Google Play:</span> =
        &ldquo;Thiết bị đang hoạt động&rdquo; trong Play Console (số máy đang
        cài app). Báo cáo chậm khoảng 4–5 ngày.
      </p>
      <p className="mb-1.5">
        <span className="font-medium text-white">App Store:</span> số thiết bị
        có mở app trong ngày, từ báo cáo Analytics của App Store Connect. Apple
        chỉ đếm người dùng đồng ý chia sẻ dữ liệu, nên thấp hơn thực tế.
      </p>
      <p>
        Đưa chuột lên số để xem người dùng hoạt động từ Firebase (với app có
        gắn Firebase).
      </p>
    </InfoTip>
  );
}

function RatingSourceTip() {
  return (
    <InfoTip label="Nguồn số liệu đánh giá">
      <p className="mb-1.5 font-semibold text-white">Đánh giá lấy từ đâu?</p>
      <p className="mb-1.5">
        <span className="font-medium text-white">Google Play:</span> điểm trung
        bình tổng (Total Average Rating) trong báo cáo Ratings của Play
        Console. Google không xuất số lượt đánh giá nên không hiện số trong
        ngoặc.
      </p>
      <p className="mb-1.5">
        <span className="font-medium text-white">App Store:</span> Apple tính
        điểm riêng cho từng quốc gia; đây là điểm trung bình gộp các quốc gia
        app có lượt tải, (số) = tổng số lượt đánh giá.
      </p>
      <p>
        <span className="font-medium text-white">—</span> = chưa có đánh giá.
        Cập nhật mỗi lần đồng bộ.
      </p>
    </InfoTip>
  );
}

function InstallsSourceTip() {
  return (
    <InfoTip label="Nguồn số liệu lượt thu nạp">
      <p className="mb-1.5 font-semibold text-white">
        Lượt thu nạp lấy từ đâu?
      </p>
      <p className="mb-1.5">
        <span className="font-medium text-white">Số lớn</span> = lượt thu nạp
        trong khoảng ngày đang chọn.{" "}
        <span className="font-medium text-white">&ldquo;Tổng&rdquo;</span> = từ
        khi phát hành đến nay, không phụ thuộc khoảng ngày.
      </p>
      <p className="mb-1.5">
        <span className="font-medium text-white">Google Play:</span> =
        &ldquo;Lượt thu nạp theo thiết bị&rdquo; trong Play Console;
        &ldquo;Tổng&rdquo; = &ldquo;Tổng số lượt cài đặt&rdquo;. Google xuất báo
        cáo chậm khoảng 3–5 ngày, nên các ngày gần nhất tạm hiện 0.
      </p>
      <p className="mb-1.5">
        <span className="font-medium text-white">App Store:</span> = lượt tải
        lần đầu (First-time downloads) từ báo cáo Sales &amp; Trends, thường
        chậm 1 ngày. Apple chỉ giữ báo cáo ngày trong 365 ngày, nên
        &ldquo;Tổng&rdquo; chỉ đầy đủ với app phát hành chưa quá 1 năm.
      </p>
      <p>
        Play Console mặc định tính 28 ngày gần nhất; dashboard tính theo khoảng
        ngày đang chọn.
      </p>
    </InfoTip>
  );
}
