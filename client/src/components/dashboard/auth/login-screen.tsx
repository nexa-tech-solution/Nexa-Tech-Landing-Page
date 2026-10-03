import { useState, type FormEvent } from "react";
import { Loader2, Lock } from "lucide-react";
import { API_ERROR_CODES, type ApiError } from "@/lib/http";
import { useLogin } from "@/services/auth";

const inputClass =
  "mb-4 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#16a34a]/60 disabled:bg-gray-50";

function loginErrorMessage(error: ApiError) {
  switch (error.errorCode) {
    case API_ERROR_CODES.INVALID_CREDENTIALS:
      return "Email hoặc mật khẩu không đúng";
    case API_ERROR_CODES.VALIDATION:
      return "Thông tin đăng nhập không hợp lệ";
    case API_ERROR_CODES.FORBIDDEN:
    case API_ERROR_CODES.FORBIDDEN_ROLE:
      return "Tài khoản không có quyền truy cập";
    case API_ERROR_CODES.NETWORK:
      return "Không kết nối được máy chủ, vui lòng thử lại";
    default:
      return "Đăng nhập thất bại, vui lòng thử lại";
  }
}

// Session state lives in the auth store; the page re-renders once login succeeds.
export function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    login.mutate({ email: email.trim(), password });
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f8fa] px-4 text-[#0d0c22]">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-green-50 text-[#16a34a]">
            <Lock size={18} />
          </span>
          <div>
            <h1 className="font-display text-xl font-bold">Bảng điều khiển Nexa</h1>
            <p className="text-sm text-gray-500">Đăng nhập quản trị</p>
          </div>
        </div>
        <label className="mb-1 block text-xs font-medium text-gray-500">Email</label>
        <input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} disabled={login.isPending} required />
        <label className="mb-1 block text-xs font-medium text-gray-500">Mật khẩu</label>
        <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} disabled={login.isPending} required />
        {login.error && (
          <p role="alert" className="mb-4 text-sm text-red-600">
            {loginErrorMessage(login.error)}
          </p>
        )}
        <button
          type="submit"
          disabled={login.isPending}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0d0c22] py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-70"
        >
          {login.isPending && <Loader2 size={16} className="animate-spin" />}
          {login.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
    </main>
  );
}
