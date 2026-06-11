import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Sparkles, ArrowRight } from "lucide-react";
import { useBrandAuth } from "../../context/BrandAuthContext";
import { formatApiError } from "../../lib/api";

export default function BrandLogin() {
  const { brand, loading, login } = useBrandAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#07111F] text-white/70">Yükleniyor...</div>;
  if (brand) return <Navigate to="/firma/panel" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await login(email, password);
      toast.success("Giriş başarılı");
      navigate("/firma/panel");
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || "Giriş yapılamadı");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07111F] text-white flex items-center justify-center px-5 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[#2563EB]/30 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[#22D3EE]/20 blur-[120px]" />
      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-wide text-[#22D3EE]">
            <Sparkles className="h-3.5 w-3.5" /> DR AI Image Engine 2.0
          </div>
          <h1 className="mt-5 font-heading text-3xl font-extrabold">Marka Portalı</h1>
          <p className="mt-2 text-sm text-white/60">Markanıza özel sosyal medya görsellerini üretmek için giriş yapın.</p>
        </div>
        <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-7 space-y-4" data-testid="brand-login-form">
          <label className="block">
            <span className="block text-xs font-semibold text-white/70 mb-1.5">E-posta</span>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              data-testid="brand-login-email"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-[#22D3EE] text-white placeholder-white/30"
              placeholder="marka@firma.com"
            />
          </label>
          <label className="block">
            <span className="block text-xs font-semibold text-white/70 mb-1.5">Şifre</span>
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              data-testid="brand-login-password"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-[#22D3EE] text-white placeholder-white/30"
              placeholder="••••••••"
            />
          </label>
          <button
            disabled={busy} type="submit" data-testid="brand-login-submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1d4ed8] transition disabled:opacity-60"
          >
            {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Giriş yapılıyor</> : <>Giriş Yap <ArrowRight className="h-4 w-4" /></>}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-white/40">Erişim bilgilerinizi Dijital Roket ekibinden alabilirsiniz.</p>
      </div>
    </div>
  );
}
