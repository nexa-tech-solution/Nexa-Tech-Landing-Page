import { API_ERROR_CODES, type ApiError } from "@/lib/http";
import type { IntegrationStatus } from "@/services/integrations";

export const STATUS: Record<
  IntegrationStatus,
  { label: string; className: string; dot: string }
> = {
  NOT_CONFIGURED: {
    label: "Chưa cấu hình",
    className: "bg-gray-100 text-gray-600",
    dot: "bg-gray-300",
  },
  CONNECTED: {
    label: "Đã kết nối",
    className: "bg-green-50 text-green-700",
    dot: "bg-green-500",
  },
  ERROR: {
    label: "Lỗi kết nối",
    className: "bg-red-50 text-red-600",
    dot: "bg-red-500",
  },
};

export const formatTime = (ms: number | null) =>
  ms ? new Date(ms).toLocaleString("vi-VN") : "—";

export function errorMessage(error: ApiError) {
  if (error.errorCode === API_ERROR_CODES.VALIDATION)
    return "Thông tin cấu hình không hợp lệ";
  if (error.status === 403) return "Chỉ SUPER_ADMIN mới được thay đổi cấu hình";
  if (error.errorCode === API_ERROR_CODES.INTEGRATION_DUPLICATE)
    return "Tài khoản này đã được kết nối";
  if (error.errorCode === API_ERROR_CODES.INTEGRATION_NAME_DUPLICATE)
    return "Tên kết nối đã được dùng cho dịch vụ này";
  if (error.errorCode === API_ERROR_CODES.INTEGRATION_SYNC_CONFLICT)
    return "Không thể đồng bộ lúc này (đang tắt, chưa kết nối hoặc đang chạy)";
  if (error.status === 404)
    return "Kết nối không còn tồn tại, danh sách đã được tải lại";
  if (error.errorCode === API_ERROR_CODES.NETWORK)
    return "Không kết nối được máy chủ";
  return error.message || "Thao tác thất bại";
}
