import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "sonner";
import { Rocket, LogIn } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { formatApiError } from "../../lib/api";

export default function AdminLogin() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/admin/dashboard" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Hoş geldiniz");
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1F1A] relative overflow-hidden flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute -top-32 left-1/3 h-[420px] w-[420px] rounded-full bg-[#059669]/25 blur-[120px]" />
      <div className="absolute -bottom-32 right-1/4 h-[420px] w-[420px] rounded-full bg-[#34D399]/20 blur-[120px]" />

      <div className="relative w-full max-w-md" data-testid="admin-login-card">
        <div className="text-center text-white mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#059669] to-[#34D399] shadow-2xl shadow-[#059669]/40">
            <Rocket className="h-7 w-7 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="mt-4 font-heading text-2xl font-extrabold">DR Admin</h1>
          <p className="mt-1 text-sm text-white/60">Dijital Roket yönetim paneli</p>
        </div>

        <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-7 space-y-5">
          <label className="block">
            <span className="block text-xs font-semibold text-white/80 mb-1.5">E-posta</span>
            <input data-testid="admin-email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-white/15 bg-white/5 text-white px-4 py-3 outline-none transition focus:border-[#34D399]/60 focus:bg-white/10" placeholder="admin@dijitalroket.com" />
          </label>
          <label className="block">
            <span className="block text-xs font-semibold text-white/80 mb-1.5">Şifre</span>
            <input data-testid="admin-password" required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-white/15 bg-white/5 text-white px-4 py-3 outline-none transition focus:border-[#34D399]/60 focus:bg-white/10" placeholder="••••••••" />
          </label>
          <button data-testid="admin-submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Giriş yapılıyor..." : <>Giriş Yap <LogIn className="h-4 w-4" /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
