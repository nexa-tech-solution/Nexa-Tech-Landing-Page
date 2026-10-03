import { useState, type FormEvent } from "react";
import { Lock } from "lucide-react";
import { login } from "@/components/dashboard/auth/auth";

const inputClass =
  "mb-4 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#16a34a]/60";

export function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (login(email, password)) onSuccess();
    else setError("Email hoặc mật khẩu không đúng");
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
        <input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} required />
        <label className="mb-1 block text-xs font-medium text-gray-500">Mật khẩu</label>
        <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} required />
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        <button type="submit" className="w-full rounded-lg bg-[#0d0c22] py-2.5 text-sm font-semibold text-white transition hover:brightness-110">
          Đăng nhập
        </button>
      </form>
    </main>
  );
}
