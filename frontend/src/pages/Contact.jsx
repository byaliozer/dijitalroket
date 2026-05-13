import { useState } from "react";
import { toast } from "sonner";
import PageHero from "../components/PageHero";
import SEO from "../components/SEO";
import { api, formatApiError } from "../lib/api";
import { useSiteSettings } from "../context/SiteSettingsContext";
import { Phone, Mail, MapPin, Send, CheckCircle2 } from "lucide-react";

const PROJECT_TYPES = [
  "Kurumsal Web Sitesi",
  "B2B / Bayi Sistemi",
  "CRM Benzeri Sistem",
  "Satış / Teklif Paneli",
  "Sosyal Medya ve İçerik Üretimi",
  "Roket Partner Programı",
  "Diğer",
];

const BUDGETS = ["50.000 TL altı", "50.000 - 150.000 TL", "150.000 - 500.000 TL", "500.000 TL üzeri", "Görüşmek istiyorum"];

export default function Contact() {
  const { settings } = useSiteSettings();
  const [form, setForm] = useState({
    name: "", company: "", phone: "", email: "", project_type: "", budget: "", message: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/contact", form);
      setSent(true);
      toast.success("Talebiniz alındı. En kısa sürede iletişime geçeceğiz.");
      setForm({ name: "", company: "", phone: "", email: "", project_type: "", budget: "", message: "" });
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="İletişim | Dijital Roket" description="Dijital Roket ile iletişime geçin. Bursa merkezli kurumsal dijital dönüşüm ortağınız." />
      <PageHero
        eyebrow="İletişim"
        title="Birlikte Çalışalım"
        subtitle="Projenizi, ihtiyacınızı veya fikrinizi paylaşın. Dijital Roket ekibi en kısa sürede sizinle iletişime geçer."
      />

      <section className="section bg-white">
        <div className="container-x grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-4">
            <InfoCard icon={Phone} title="Telefon" value="0543 793 41 01" href="tel:+905437934101" />
            <InfoCard icon={Mail} title="E-posta" value="info@dijitalroket.com" href="mailto:info@dijitalroket.com" />
            <InfoCard icon={MapPin} title="Adres" value="Bursa, Türkiye" />
          </div>

          <form
            onSubmit={submit}
            data-testid="contact-form"
            className="lg:col-span-3 card-elevate p-7 sm:p-10 space-y-5"
          >
            {sent && (
              <div className="flex items-start gap-3 rounded-xl border border-[#10B981]/30 bg-[#10B981]/8 p-4">
                <CheckCircle2 className="h-5 w-5 text-[#10B981] mt-0.5" />
                <div className="text-sm text-[#07111F]">Talebiniz alındı. Dijital Roket ekibi en kısa sürede sizinle iletişime geçecektir.</div>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Ad Soyad" required>
                <input data-testid="contact-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" placeholder="Adınız Soyadınız" />
              </Field>
              <Field label="Firma Adı">
                <input data-testid="contact-company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="input" placeholder="Şirket adı" />
              </Field>
              <Field label="Telefon">
                <input data-testid="contact-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" placeholder="0 5xx xxx xx xx" />
              </Field>
              <Field label="E-posta" required>
                <input data-testid="contact-email" required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" placeholder="ornek@firma.com" />
              </Field>
              <Field label="Proje Türü">
                <select data-testid="contact-project-type" value={form.project_type} onChange={(e) => setForm({ ...form, project_type: e.target.value })} className="input">
                  <option value="">Seçiniz</option>
                  {PROJECT_TYPES.map((p) => <option key={p}>{p}</option>)}
                </select>
              </Field>
              <Field label="Bütçe Aralığı">
                <select data-testid="contact-budget" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className="input">
                  <option value="">Seçiniz</option>
                  {BUDGETS.map((b) => <option key={b}>{b}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Proje Açıklaması" required>
              <textarea
                data-testid="contact-message"
                required
                minLength={10}
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="input resize-none"
                placeholder="Projenizi, ihtiyaçlarınızı ve hedeflerinizi kısaca anlatın..."
              />
            </Field>

            <button data-testid="contact-submit" disabled={loading} className="btn-primary w-full sm:w-auto">
              {loading ? "Gönderiliyor..." : <>Görüşme Talep Et <Send className="h-4 w-4" /></>}
            </button>
          </form>
        </div>
      </section>

      <style>{`
        .input { width: 100%; border-radius: 0.75rem; border: 1px solid rgb(226 232 240); background: white; padding: 0.75rem 1rem; font-size: 0.9rem; transition: all 0.2s; outline: none; }
        .input:focus { border-color: #2563EB; box-shadow: 0 0 0 4px rgba(37,99,235,0.1); }
      `}</style>
    </>
  );
}

function InfoCard({ icon: Icon, title, value, href }) {
  const inner = (
    <div className="card-elevate p-6 flex items-start gap-4">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563EB]/10 to-[#22D3EE]/10 border border-[#2563EB]/15">
        <Icon className="h-5 w-5 text-[#2563EB]" />
      </span>
      <div>
        <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#2563EB]">{title}</div>
        <div className="mt-1 text-[#07111F] font-semibold">{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href}>{inner}</a> : inner;
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-[#07111F] mb-1.5">{label}{required && <span className="text-[#F97316]"> *</span>}</span>
      {children}
    </label>
  );
}
