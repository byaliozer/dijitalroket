import { useState } from "react";
import { toast } from "sonner";
import PageHero from "../components/PageHero";
import SEO from "../components/SEO";
import { api, formatApiError } from "../lib/api";
import { Send, CheckCircle2 } from "lucide-react";

const PROJECT_TYPES = [
  "Kurumsal Web Sitesi", "B2B / Bayi Sistemi", "CRM Benzeri Sistem",
  "Satış / Teklif Paneli", "Yönetici Dashboard", "Sosyal Medya ve İçerik Üretimi",
  "Özel Panel ve Otomasyon", "Roket Partner Programı", "Diğer",
];
const BUDGETS = ["50.000 TL altı", "50.000 - 150.000 TL", "150.000 - 500.000 TL", "500.000 TL üzeri", "Görüşmek istiyorum"];
const TIMELINES = ["Acil (1-2 hafta)", "1 ay içinde", "1-3 ay", "3+ ay", "Esnek"];

export default function ProjectRequest() {
  const [form, setForm] = useState({
    company_name: "", contact_name: "", email: "", phone: "",
    current_digital_state: "", project_type: "", goals: "",
    user_roles: "", required_features: "", reference_systems: "",
    timeline: "", budget: "", notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/project-request", form);
      setSent(true);
      toast.success("Proje brief'iniz alındı. Ekibimiz inceleyip dönüş yapacak.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Proje Talep Formu | Dijital Roket" description="Detaylı proje brief'inizi paylaşın." />
      <PageHero
        eyebrow="Proje Talep Formu"
        title="Detaylı Proje Brief'inizi Paylaşın"
        subtitle="Aşağıdaki formu doldurarak projenizin kapsamını netleştirmemize yardımcı olun."
      />

      <section className="section bg-white">
        <div className="container-x max-w-4xl">
          {sent ? (
            <div className="card-elevate p-12 text-center" data-testid="request-success" role="status" aria-live="polite">
              <CheckCircle2 className="mx-auto h-14 w-14 text-[#10B981]" />
              <h2 className="mt-6 h2-section">Talebiniz Alındı</h2>
              <p className="mt-3 body-lg max-w-lg mx-auto">
                Dijital Roket ekibi brief'inizi inceleyip en kısa sürede sizinle iletişime geçecektir.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} data-testid="request-form" className="card-elevate p-7 sm:p-10 space-y-6">
              <Section title="1. Firma Bilgileri">
                <div className="grid sm:grid-cols-2 gap-5">
                  <F label="Firma Adı" required><input data-testid="req-company" required aria-required="true" autoComplete="organization" value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} className="input" /></F>
                  <F label="İletişim Kişisi" required><input data-testid="req-contact" required aria-required="true" autoComplete="name" value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} className="input" /></F>
                  <F label="E-posta" required><input data-testid="req-email" required aria-required="true" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" /></F>
                  <F label="Telefon"><input data-testid="req-phone" type="tel" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" /></F>
                </div>
              </Section>

              <Section title="2. Mevcut Dijital Durum">
                <F label="Şu an kullandığınız sistemler, web sitesi durumu, mevcut süreçler">
                  <textarea data-testid="req-current" rows={3} value={form.current_digital_state} onChange={(e) => setForm({ ...form, current_digital_state: e.target.value })} className="input resize-none" />
                </F>
              </Section>

              <Section title="3. İstenen Proje Türü">
                <F label="Proje türü" required>
                  <select data-testid="req-type" required value={form.project_type} onChange={(e) => setForm({ ...form, project_type: e.target.value })} className="input">
                    <option value="">Seçiniz</option>
                    {PROJECT_TYPES.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </F>
              </Section>

              <Section title="4. Hedefler">
                <F label="Bu projeyle ulaşmak istediğiniz hedefler">
                  <textarea data-testid="req-goals" rows={3} value={form.goals} onChange={(e) => setForm({ ...form, goals: e.target.value })} className="input resize-none" />
                </F>
              </Section>

              <Section title="5. Kullanıcı Rolleri">
                <F label="Sistemde kimler bulunacak? (Admin, satış ekibi, bayi, müşteri vb.)">
                  <textarea data-testid="req-roles" rows={2} value={form.user_roles} onChange={(e) => setForm({ ...form, user_roles: e.target.value })} className="input resize-none" />
                </F>
              </Section>

              <Section title="6. Gerekli Özellikler">
                <F label="Olmazsa olmaz özellikler ve modüller">
                  <textarea data-testid="req-features" rows={3} value={form.required_features} onChange={(e) => setForm({ ...form, required_features: e.target.value })} className="input resize-none" />
                </F>
              </Section>

              <Section title="7. Referanslar">
                <F label="Örnek aldığınız siteler / sistemler">
                  <textarea data-testid="req-refs" rows={2} value={form.reference_systems} onChange={(e) => setForm({ ...form, reference_systems: e.target.value })} className="input resize-none" />
                </F>
              </Section>

              <Section title="8. Zaman & Bütçe">
                <div className="grid sm:grid-cols-2 gap-5">
                  <F label="Zaman beklentisi">
                    <select data-testid="req-timeline" value={form.timeline} onChange={(e) => setForm({ ...form, timeline: e.target.value })} className="input">
                      <option value="">Seçiniz</option>
                      {TIMELINES.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </F>
                  <F label="Bütçe aralığı">
                    <select data-testid="req-budget" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className="input">
                      <option value="">Seçiniz</option>
                      {BUDGETS.map((b) => <option key={b}>{b}</option>)}
                    </select>
                  </F>
                </div>
              </Section>

              <Section title="9. Ek Notlar">
                <F label="Eklemek istediğiniz başka bir şey">
                  <textarea data-testid="req-notes" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input resize-none" />
                </F>
              </Section>

              <button data-testid="req-submit" disabled={loading} className="btn-primary w-full sm:w-auto">
                {loading ? "Gönderiliyor..." : <>Brief'i Gönder <Send className="h-4 w-4" /></>}
              </button>
            </form>
          )}
        </div>
      </section>

      <style>{`
        .input { width: 100%; border-radius: 0.75rem; border: 1px solid rgb(226 232 240); background: white; padding: 0.75rem 1rem; font-size: 0.9rem; transition: all 0.2s; outline: none; }
        .input:focus { border-color: #2563EB; box-shadow: 0 0 0 4px rgba(37,99,235,0.1); }
      `}</style>
    </>
  );
}

function Section({ title, children }) {
  return (
    <fieldset className="border-l-2 border-[#2563EB]/20 pl-5 border-t-0 border-r-0 border-b-0">
      <legend className="text-xs font-bold uppercase tracking-[0.18em] text-[#2563EB] mb-3 px-0">{title}</legend>
      {children}
    </fieldset>
  );
}

function F({ label, required, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-[#07111F] mb-1.5">{label}{required && <span className="text-[#F97316]"> *</span>}</span>
      {children}
    </label>
  );
}
