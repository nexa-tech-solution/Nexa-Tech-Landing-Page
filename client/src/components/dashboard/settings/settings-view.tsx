import { useState } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { AlertTriangle, Lock, Plus, ShieldCheck } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/layout/dashboard-header";
import {
  useIntegrations,
  type IntegrationProvider,
} from "@/services/integrations";
import { selectUser, useAuthStore } from "@/stores/auth-store";
import { AccountCard } from "./account-card";
import { ConnectionDialog, type DialogState } from "./connection-dialog";
import { cardLayout, cardMotion, rise, stagger } from "./motion";
import { PROVIDERS } from "./providers";

type Filter = IntegrationProvider | "all";

export function SettingsView({ onLogout }: { onLogout: () => void }) {
  const { data, isPending, error, refetch } = useIntegrations();
  const canManage = useAuthStore(selectUser)?.role === "SUPER_ADMIN";
  const [filter, setFilter] = useState<Filter>("all");
  const [dialog, setDialog] = useState<DialogState>(null);

  const legacy = data?.legacy ?? false;
  const items = data?.items ?? [];
  const countOf = (p: IntegrationProvider) =>
    items.filter((i) => i.provider === p).length;
  // Legacy backend stores one connection per provider.
  const isProviderFull = (p: IntegrationProvider) => legacy && countOf(p) > 0;
  const visible =
    filter === "all" ? items : items.filter((i) => i.provider === filter);
  const canAddHere =
    canManage &&
    (filter === "all"
      ? PROVIDERS.some((p) => !isProviderFull(p.id))
      : !isProviderFull(filter));
  const startAdd = () =>
    setDialog(
      filter === "all"
        ? { mode: "pick" }
        : { mode: "create", provider: filter },
    );

  return (
    // "user": honour the OS "reduce motion" setting for every animation below.
    <MotionConfig reducedMotion="user">
      <Tooltip.Provider delayDuration={250} skipDelayDuration={100}>
        <div className="min-h-screen bg-[#f7f8fa] text-[#0d0c22]">
          <DashboardHeader onLogout={onLogout} />
          <motion.main
            variants={stagger(0.07)}
            initial="hidden"
            animate="show"
            className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6"
          >
            <motion.div
              variants={rise}
              className="flex flex-wrap items-end justify-between gap-3"
            >
              <div>
                <h1 className="font-display text-2xl font-bold">
                  Cấu hình nguồn dữ liệu
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Kết nối tài khoản các dịch vụ để backend tự động lấy số liệu.
                  Mỗi dịch vụ có thể có nhiều tài khoản.
                </p>
              </div>
              {canAddHere && (
                <button
                  type="button"
                  onClick={startAdd}
                  className="flex h-9 items-center gap-1.5 rounded-lg bg-[#0d0c22] px-4 text-sm font-semibold text-white transition hover:brightness-125"
                >
                  <Plus size={16} /> Thêm tài khoản
                </button>
              )}
            </motion.div>

            <motion.div
              variants={rise}
              className="flex items-start gap-2.5 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900"
            >
              <ShieldCheck size={18} className="mt-0.5 shrink-0" />
              <p>
                Khoá bí mật chỉ được gửi lên máy chủ và lưu mã hoá, sẽ không bao
                giờ hiển thị lại. Hãy dùng key <b>chỉ đọc (read-only)</b> nếu
                dịch vụ cho phép.
              </p>
            </motion.div>

            {!canManage && (
              <motion.div
                variants={rise}
                className="flex items-start gap-2.5 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600"
              >
                <Lock size={18} className="mt-0.5 shrink-0" />
                <p>
                  Bạn đang xem ở chế độ chỉ đọc. Chỉ tài khoản{" "}
                  <b>SUPER_ADMIN</b> mới được thêm, sửa, kiểm tra, đồng bộ hoặc
                  xoá kết nối.
                </p>
              </motion.div>
            )}
            {legacy && (
              <motion.div
                variants={rise}
                className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
              >
                <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                <p>
                  Backend hiện chỉ hỗ trợ <b>1 tài khoản cho mỗi dịch vụ</b>.
                  Tính năng nhiều tài khoản sẽ tự bật khi backend cập nhật API.
                </p>
              </motion.div>
            )}
            {error && (
              <motion.div
                variants={rise}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
              >
                <AlertTriangle size={18} className="shrink-0" />
                <span className="flex-1">
                  Không tải được danh sách kết nối: {error.message}
                </span>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="rounded-lg border border-amber-300 px-3 py-1 text-xs hover:bg-amber-100"
                >
                  Thử lại
                </button>
              </motion.div>
            )}

            {/* Provider badges (filter) */}
            <motion.nav
              variants={rise}
              aria-label="Lọc theo dịch vụ"
              className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
            >
              <ProviderBadge
                active={filter === "all"}
                onClick={() => setFilter("all")}
                label="Tất cả"
                count={items.length}
              />
              {PROVIDERS.map((p) => (
                <ProviderBadge
                  key={p.id}
                  active={filter === p.id}
                  onClick={() => setFilter(p.id)}
                  label={p.name}
                  count={countOf(p.id)}
                  color={p.color}
                  icon={<p.icon size={14} />}
                />
              ))}
            </motion.nav>

            {/* Account grid */}
            {isPending ? (
              <motion.div
                variants={rise}
                className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
                aria-busy="true"
              >
                {[0, 1, 2].map((n) => (
                  <div
                    key={n}
                    className="h-[188px] animate-pulse rounded-2xl border border-gray-200 bg-white p-4"
                  >
                    <div className="flex gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gray-100" />
                      <div className="flex-1 space-y-2 pt-1">
                        <div className="h-2.5 w-1/3 rounded bg-gray-100" />
                        <div className="h-3 w-2/3 rounded bg-gray-100" />
                      </div>
                    </div>
                    <div className="mt-5 grid grid-cols-2 gap-2">
                      <div className="h-12 rounded-lg bg-gray-50" />
                      <div className="h-12 rounded-lg bg-gray-50" />
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {visible.map((i, index) => {
                    const def = PROVIDERS.find((p) => p.id === i.provider);
                    if (!def) return null;
                    return (
                      <motion.div
                        key={`${i.provider}-${i.key}`}
                        custom={index}
                        {...cardMotion}
                        {...cardLayout}
                      >
                        <AccountCard
                          def={def}
                          integration={i}
                          readOnly={!canManage}
                          onEdit={() =>
                            setDialog({ mode: "edit", integration: i })
                          }
                        />
                      </motion.div>
                    );
                  })}
                  {canAddHere && (
                    <motion.button
                      key={`add-${filter}`}
                      custom={visible.length}
                      {...cardMotion}
                      {...cardLayout}
                      type="button"
                      onClick={startAdd}
                      className="flex min-h-[188px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 text-sm text-gray-400 transition-colors hover:border-gray-300 hover:bg-white hover:text-gray-600"
                    >
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-gray-100">
                        <Plus size={18} />
                      </span>
                      {filter === "all"
                        ? "Thêm tài khoản"
                        : `Thêm tài khoản ${PROVIDERS.find((p) => p.id === filter)?.name}`}
                    </motion.button>
                  )}
                  {!visible.length && !canAddHere && (
                    <motion.p
                      key="empty"
                      {...cardMotion}
                      className="col-span-full py-16 text-center text-sm text-gray-400"
                    >
                      Chưa có tài khoản nào
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.main>
        </div>

        <ConnectionDialog
          state={dialog}
          legacy={legacy}
          isProviderFull={isProviderFull}
          onChange={setDialog}
        />
      </Tooltip.Provider>
    </MotionConfig>
  );
}

function ProviderBadge({
  active,
  onClick,
  label,
  count,
  color = "#0d0c22",
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  color?: string;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "border-[#0d0c22] bg-[#0d0c22] text-white"
          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-[#0d0c22]"
      }`}
    >
      {icon && (
        <span
          className="grid h-5 w-5 place-items-center rounded-full"
          style={{
            background: active ? "rgba(255,255,255,0.15)" : `${color}14`,
            color: active ? "#fff" : color,
          }}
        >
          {icon}
        </span>
      )}
      {label}
      <span
        className={`rounded-full px-1.5 text-[10px] tabular-nums ${active ? "bg-white/20" : "bg-gray-100 text-gray-500"}`}
      >
        {count}
      </span>
    </button>
  );
}
