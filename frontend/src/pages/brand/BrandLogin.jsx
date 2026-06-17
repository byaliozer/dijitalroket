import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Sparkles, ArrowRight, X, CheckCircle2 } from "lucide-react";
import { useBrandAuth } from "../../context/BrandAuthContext";
import { brandApi, formatApiError } from "../../lib/api";
import { KVKK_TEXT, TERMS_TEXT } from "../../data/legalTexts";

export default function BrandLogin() {
  const { brand, loading, login } = useBrandAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // login | register | submitted
  const [legal, setLegal] = useState(null); // 'kvkk' | 'terms' | null

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#07111F] text-white/70">Yükleniyor...</div>;
  if (brand) return <Navigate to="/firma/panel" replace />;

  return (
    <div className="min-h-screen bg-[#07111F] text-white flex items-center justify-center px-5 py-10 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[#2563EB]/30 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[#22D3EE]/20 blur-[120px]" />
      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-wide text-[#22D3EE]">
            <Sparkles className="h-3.5 w-3.5" /> DR AI Image Engine 2.0
          </div>
          <h1 className="mt-5 font-heading text-3xl font-extrabold">Marka Portalı</h1>
          <p className="mt-2 text-sm text-white/60">Markanıza özel sosyal medya görsellerini üretmek için giriş yapın veya kayıt olun.</p>
        </div>

        {mode === "login" && <LoginForm login={login} navigate={navigate} onRegister={() => setMode("register")} />}
        {mode === "register" && <RegisterForm onBack={() => setMode("login")} onSuccess={() => setMode("submitted")} openLegal={setLegal} />}
        {mode === "submitted" && <SubmittedScreen onBack={() => setMode("login")} />}
      </div>

      {legal && <LegalModal type={legal} onClose={() => setLegal(null)} />}
    </div>
  );
}

function LoginForm({ login, navigate, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

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
    <>
      <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-7 space-y-4" data-testid="brand-login-form">
        <Input label="E-posta" type="email" value={email} onChange={setEmail} required testid="brand-login-email" placeholder="marka@firma.com" />
        <Input label="Şifre" type="password" value={password} onChange={setPassword} required testid="brand-login-password" placeholder="••••••••" />
        <button disabled={busy} type="submit" data-testid="brand-login-submit" className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1d4ed8] transition disabled:opacity-60">
          {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Giriş yapılıyor</> : <>Giriş Yap <ArrowRight className="h-4 w-4" /></>}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-white/50">
        Henüz hesabınız yok mu?{" "}
        <button onClick={onRegister} data-testid="brand-show-register" className="font-semibold text-[#22D3EE] hover:underline">Kayıt Olun</button>
      </p>
    </>
  );
}

function RegisterForm({ onBack, onSuccess, openLegal }) {
  const [f, setF] = useState({ full_name: "", phone: "", email: "", password: "", company_name: "", brand_url: "", instagram: "", about: "" });
  const [kvkk, setKvkk] = useState(false);
  const [terms, setTerms] = useState(false);
  const [busy, setBusy] = useState(false);
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!kvkk || !terms) { toast.error("KVKK ve Kullanıcı Sözleşmesi'ni onaylamalısınız."); return; }
    setBusy(true);
    try {
      await brandApi.post("/brand/register", { ...f, kvkk_accepted: kvkk, terms_accepted: terms });
      onSuccess();
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || "Kayıt yapılamadı");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-7 space-y-3.5" data-testid="brand-register-form">
        <div className="text-xs font-semibold text-white/50 uppercase tracking-wide">Zorunlu Bilgiler</div>
        <Input label="Ad Soyad *" value={f.full_name} onChange={set("full_name")} required testid="reg-fullname" />
        <Input label="Telefon *" value={f.phone} onChange={set("phone")} required testid="reg-phone" placeholder="05XX XXX XX XX" />
        <Input label="E-posta *" type="email" value={f.email} onChange={set("email")} required testid="reg-email" />
        <Input label="Şifre * (giriş için)" type="password" value={f.password} onChange={set("password")} required testid="reg-password" placeholder="En az 4 karakter" />

        <div className="pt-1 text-xs font-semibold text-white/50 uppercase tracking-wide">Opsiyonel (sonra Ayarlar'dan da eklenebilir)</div>
        <Input label="Firma / Marka Adı" value={f.company_name} onChange={set("company_name")} testid="reg-company" />
        <Input label="Web Sitesi" value={f.brand_url} onChange={set("brand_url")} testid="reg-website" placeholder="https://..." />
        <Input label="Instagram" value={f.instagram} onChange={set("instagram")} testid="reg-instagram" placeholder="@markaadi" />
        <label className="block">
          <span className="block text-xs font-semibold text-white/70 mb-1.5">Firma Hakkında (ne iş yapıyorsunuz?)</span>
          <textarea
            value={f.about} onChange={(e) => setF((s) => ({ ...s, about: e.target.value }))}
            data-testid="reg-about" rows={2} placeholder="Örn: İlk yardım eğitimleri veren bir merkez..."
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-[#22D3EE] text-white placeholder-white/30 resize-none"
          />
        </label>

        <label className="flex items-start gap-2.5 pt-2 cursor-pointer">
          <input type="checkbox" checked={kvkk} onChange={(e) => setKvkk(e.target.checked)} data-testid="reg-kvkk" className="mt-0.5 h-4 w-4 accent-[#2563EB]" />
          <span className="text-xs text-white/70 leading-relaxed">
            <button type="button" onClick={() => openLegal("kvkk")} className="text-[#22D3EE] hover:underline font-medium">KVKK Aydınlatma Metni</button>'ni okudum ve kabul ediyorum.
          </span>
        </label>
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} data-testid="reg-terms" className="mt-0.5 h-4 w-4 accent-[#2563EB]" />
          <span className="text-xs text-white/70 leading-relaxed">
            <button type="button" onClick={() => openLegal("terms")} className="text-[#22D3EE] hover:underline font-medium">Kullanıcı Sözleşmesi</button>'ni okudum ve kabul ediyorum.
          </span>
        </label>

        <button disabled={busy} type="submit" data-testid="reg-submit" className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1d4ed8] transition disabled:opacity-60">
          {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Gönderiliyor</> : <>Kayıt Ol</>}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-white/50">
        Zaten hesabınız var mı?{" "}
        <button onClick={onBack} data-testid="back-to-login" className="font-semibold text-[#22D3EE] hover:underline">Giriş Yapın</button>
      </p>
    </>
  );
}

function SubmittedScreen({ onBack }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8 text-center" data-testid="register-submitted">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#22D3EE]/15">
        <CheckCircle2 className="h-7 w-7 text-[#22D3EE]" />
      </div>
      <h2 className="mt-5 text-xl font-bold">Firmanız onay bekliyor</h2>
      <p className="mt-3 text-sm text-white/60 leading-relaxed">
        Kaydınız başarıyla alındı. Hesabınız Dijital Roket ekibi tarafından incelenip onaylandığında,
        belirttiğiniz e-posta adresine bilgilendirme gönderilecektir. Onay sonrası e-posta ve şifrenizle giriş yapabilirsiniz.
      </p>
      <button onClick={onBack} className="mt-6 inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2.5 text-sm font-medium hover:bg-white/5">
        Giriş Ekranına Dön
      </button>
    </div>
  );
}

function LegalModal({ type, onClose }) {
  const isKvkk = type === "kvkk";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0c1726] text-white flex flex-col max-h-[85vh]" onClick={(e) => e.stopPropagation()} data-testid="legal-modal">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h3 className="font-bold">{isKvkk ? "KVKK Aydınlatma Metni" : "Kullanıcı Sözleşmesi"}</h3>
          <button onClick={onClose} data-testid="legal-close" className="text-white/50 hover:text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="overflow-y-auto px-6 py-5 text-sm text-white/75 leading-relaxed whitespace-pre-wrap">
          {isKvkk ? KVKK_TEXT : TERMS_TEXT}
        </div>
        <div className="border-t border-white/10 px-6 py-4 text-right">
          <button onClick={onClose} className="rounded-lg bg-[#2563EB] px-5 py-2 text-sm font-semibold hover:bg-[#1d4ed8]">Kapat</button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, type = "text", value, onChange, required, testid, placeholder }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-white/70 mb-1.5">{label}</span>
      <input
        type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)}
        data-testid={testid} placeholder={placeholder}
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-[#22D3EE] text-white placeholder-white/30"
      />
    </label>
  );
}
