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
                      {c.key === "name" && <AppsTip />}
                      {c.key === "installs" && <InstallsSourceTip />}
                      {c.key === "growth" && <GrowthTip />}
                      {c.key === "adRevenue" && <AdRevenueTip />}
                      {c.key === "subRevenue" && <SubRevenueTip />}
                      {c.key === "revenue" && <RevenueTip />}
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
                  <div>
                    {a.activeDevices ? (
                      num(a.activeDevices)
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </div>
                  {a.activeUsers > 0 && (
                    <div
                      className="text-[11px] text-gray-400"
                      title="Người dùng hoạt động trung bình mỗi ngày, theo Firebase"
                    >
                      Firebase {num(a.activeUsers)}/ngày
                    </div>
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
function AppsTip() {
  return (
    <InfoTip label="Danh sách ứng dụng">
      <p className="font-semibold text-white">Ứng dụng</p>
      <ul className="mt-1 list-disc space-y-1 pl-4">
        <li>
          Mỗi dòng là một bản app trên một store: cùng một app có bản Google
          Play và bản App Store thì thành hai dòng.
        </li>
        <li>
          App được thêm tự động khi đồng bộ store và có lượt tải. Tên, icon lấy
          từ store.
        </li>
      </ul>
    </InfoTip>
  );
}

function GrowthTip() {
  return (
    <InfoTip label="Cách tính tăng trưởng">
      <p className="font-semibold text-white">Tăng trưởng</p>
      <ul className="mt-1 list-disc space-y-1 pl-4">
        <li>
          So lượt thu nạp của khoảng ngày đang chọn với khoảng ngay trước đó,
          dài bằng nhau (ví dụ 7 ngày này so với 7 ngày trước).
        </li>
        <li>
          <span className="font-medium text-white">%</span> khi kỳ trước có từ
          10 lượt trở lên;{" "}
          <span className="font-medium text-white">±N lượt</span> khi kỳ trước
          quá ít để tính % cho có nghĩa.
        </li>
        <li>
          <span className="font-medium text-white">—</span> = chưa có đủ dữ liệu
          kỳ trước để so (app mới, hoặc store chưa có số những ngày đó).
        </li>
      </ul>
    </InfoTip>
  );
}

function AdRevenueTip() {
  return (
    <InfoTip label="Nguồn doanh thu quảng cáo">
      <p className="font-semibold text-white">Quảng cáo</p>
      <ul className="mt-1 list-disc space-y-1 pl-4">
        <li>
          &ldquo;Thu nhập ước tính&rdquo; (USD) từ AdMob, cộng các ngày trong
          khoảng đang chọn. Ngày tính theo múi giờ của tài khoản AdMob.
        </li>
        <li>
          Số của những ngày gần nhất AdMob còn điều chỉnh. Khi so với AdMob,
          chọn cùng khoảng ngày (&ldquo;7 ngày qua&rdquo; của AdMob không tính
          hôm nay) và đồng bộ lại trước khi so.
        </li>
      </ul>
    </InfoTip>
  );
}

function SubRevenueTip() {
  return (
    <InfoTip label="Nguồn doanh thu RevenueCat">
      <p className="font-semibold text-white">RevenueCat</p>
      <ul className="mt-1 list-disc space-y-1 pl-4">
        <li>
          Doanh thu gói đăng ký và mua trong app (USD) từ biểu đồ Revenue của
          RevenueCat, cộng các ngày trong khoảng đang chọn.
        </li>
        <li>
          <span className="font-medium text-white">—</span> = app không bán gói
          hoặc chưa gắn RevenueCat.
        </li>
      </ul>
    </InfoTip>
  );
}

function RevenueTip() {
  return (
    <InfoTip label="Cách tính tổng doanh thu">
      <p className="font-semibold text-white">Tổng doanh thu</p>
      <ul className="mt-1 list-disc space-y-1 pl-4">
        <li>
          = Quảng cáo + RevenueCat, trong khoảng ngày đang chọn (USD). Bảng mặc
          định sắp xếp theo cột này.
        </li>
      </ul>
    </InfoTip>
  );
}

function ActiveDevicesTip() {
  return (
    <InfoTip label="Nguồn số liệu thiết bị hoạt động">
      <p className="font-semibold text-white">Thiết bị hoạt động lấy từ đâu?</p>
      <ul className="mt-1 list-disc space-y-1 pl-4">
        <li>
          Lấy trực tiếp từ store, trung bình mỗi ngày trong khoảng ngày đang
          chọn (chỉ tính các ngày store đã báo cáo).
        </li>
        <li>
          <span className="font-medium text-white">Google Play:</span> =
          &ldquo;Thiết bị đang hoạt động&rdquo; trong Play Console (số máy đang
          cài app). Báo cáo chậm khoảng 4–5 ngày.
        </li>
        <li>
          <span className="font-medium text-white">App Store:</span> số thiết bị
          có mở app trong ngày, từ báo cáo Analytics của App Store Connect.
          Apple chỉ đếm người dùng đồng ý chia sẻ dữ liệu, nên thấp hơn thực tế.
        </li>
        <li>
          <span className="font-medium text-white">
            &ldquo;Firebase …/ngày&rdquo;
          </span>{" "}
          (dòng nhỏ, chỉ có ở app gắn Firebase) = người dùng hoạt động trung
          bình mỗi ngày theo Firebase; thường khác số của store vì cách đo khác
          nhau.
        </li>
      </ul>
    </InfoTip>
  );
}

function RatingSourceTip() {
  return (
    <InfoTip label="Nguồn số liệu đánh giá">
      <p className="font-semibold text-white">Đánh giá lấy từ đâu?</p>
      <ul className="mt-1 list-disc space-y-1 pl-4">
        <li>
          <span className="font-medium text-white">Google Play:</span> điểm
          trung bình tổng (Total Average Rating) trong báo cáo Ratings của Play
          Console. Google không xuất số lượt đánh giá nên không hiện số trong
          ngoặc.
        </li>
        <li>
          <span className="font-medium text-white">App Store:</span> Apple tính
          điểm riêng cho từng quốc gia; đây là điểm trung bình gộp các quốc gia
          app có lượt tải, (số) = tổng số lượt đánh giá.
        </li>
        <li>
          <span className="font-medium text-white">—</span> = chưa có đánh giá.
          Cập nhật mỗi lần đồng bộ.
        </li>
      </ul>
    </InfoTip>
  );
}

function InstallsSourceTip() {
  return (
    <InfoTip label="Nguồn số liệu lượt thu nạp">
      <p className="font-semibold text-white">Lượt thu nạp lấy từ đâu?</p>
      <ul className="mt-1 list-disc space-y-1 pl-4">
        <li>
          <span className="font-medium text-white">Số lớn</span> = lượt thu nạp
          trong khoảng ngày đang chọn.{" "}
          <span className="font-medium text-white">&ldquo;Tổng&rdquo;</span> =
          từ khi phát hành đến nay, không phụ thuộc khoảng ngày.
        </li>
        <li>
          <span className="font-medium text-white">Google Play:</span> =
          &ldquo;Lượt thu nạp theo thiết bị&rdquo; trong Play Console;
          &ldquo;Tổng&rdquo; = &ldquo;Tổng số lượt cài đặt&rdquo;. Google xuất
          báo cáo chậm khoảng 3–5 ngày, nên các ngày gần nhất tạm hiện 0.
        </li>
        <li>
          <span className="font-medium text-white">App Store:</span> = lượt tải
          lần đầu (First-time downloads) từ báo cáo Sales &amp; Trends, thường
          chậm 1 ngày. Apple chỉ giữ báo cáo ngày trong 365 ngày, nên
          &ldquo;Tổng&rdquo; chỉ đầy đủ với app phát hành chưa quá 1 năm.
        </li>
        <li>
          Play Console mặc định tính 28 ngày gần nhất; dashboard tính theo
          khoảng ngày đang chọn.
        </li>
      </ul>
    </InfoTip>
  );
}
