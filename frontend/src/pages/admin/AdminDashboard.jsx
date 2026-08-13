import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  LayoutDashboard, Mail, FileText, FolderOpen, BookOpenText, LogOut, Trash2,
  Plus, Eye, X, ExternalLink, Image as ImageIcon, ArrowUp, ArrowDown, Loader2, Settings,
  Sparkles, Zap, Copy, Check, History,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useSiteSettings } from "../../context/SiteSettingsContext";
import { api, formatApiError } from "../../lib/api";
import Logo from "../../components/Logo";
import ImageUploader from "../../components/ImageUploader";

const TABS = [
  { id: "overview", label: "Genel Bakış", icon: LayoutDashboard },
  { id: "contacts", label: "İletişim Talepleri", icon: Mail },
  { id: "requests", label: "Proje Brief'leri", icon: FileText },
  { id: "ai-leads", label: "DR AI Talepleri", icon: Zap },
  { id: "projects", label: "DR AI Çalışmaları", icon: FolderOpen },
  { id: "blog", label: "Blog Yazıları", icon: BookOpenText },
  { id: "brands", label: "Markalar (AI)", icon: Sparkles },
  { id: "settings", label: "Site Ayarları", icon: Settings },
];

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");

  if (loading) return <div className="min-h-screen flex items-center justify-center text-[#334155]">Yükleniyor...</div>;
  if (!user) return <Navigate to="/admin/login" replace />;

  const onLogout = () => { logout(); navigate("/admin/login"); };

  return (
    <div className="min-h-screen bg-[#F8FAFC]" data-testid="admin-dashboard">
      <aside className="fixed inset-y-0 left-0 hidden lg:block w-64 bg-[#07111F] text-white">
        <div className="p-6 border-b border-white/10"><Logo variant="light" /></div>
        <nav className="p-3 space-y-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              data-testid={`admin-tab-${t.id}`}
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                tab === t.id ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 inset-x-0 p-4 border-t border-white/10">
          <Link to="/" className="block text-xs text-white/40 hover:text-white mb-2">← Siteye dön</Link>
          <button onClick={onLogout} data-testid="admin-logout" className="w-full flex items-center gap-2 text-sm text-white/70 hover:text-white">
            <LogOut className="h-4 w-4" /> Çıkış Yap
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200">
          <div className="px-6 lg:px-10 h-16 flex items-center justify-between">
            <div className="lg:hidden"><Logo /></div>
            <h1 className="hidden lg:block font-heading text-xl font-bold text-[#07111F]">
              {TABS.find((t) => t.id === tab)?.label}
            </h1>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-sm text-[#334155]">{user.email}</span>
              <button onClick={onLogout} className="btn-secondary py-2 px-4 text-sm lg:hidden"><LogOut className="h-4 w-4" /></button>
            </div>
          </div>
          <nav className="lg:hidden flex gap-1 overflow-x-auto px-3 py-2 scrollbar-hidden">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium ${tab === t.id ? "bg-[#07111F] text-white" : "text-[#334155]"}`}>
                {t.label}
              </button>
            ))}
          </nav>
        </header>

        <main className="p-6 lg:p-10">
          {tab === "overview" && <Overview />}
          {tab === "contacts" && <Contacts />}
          {tab === "requests" && <Requests />}
          {tab === "ai-leads" && <AiLeadsAdmin />}
          {tab === "projects" && <ProjectsAdmin />}
          {tab === "blog" && <BlogAdmin />}
          {tab === "brands" && <BrandsAdmin />}
          {tab === "settings" && <SettingsAdmin />}
        </main>
      </div>
    </div>
  );
}

function Overview() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api.get("/admin/stats").then((r) => setStats(r.data)).catch(() => {}); }, []);
  const cards = stats ? [
    { label: "Toplam İletişim", value: stats.contacts_total, new: stats.contacts_new },
    { label: "Proje Brief'leri", value: stats.project_requests_total, new: stats.project_requests_new },
    { label: "Blog Yazıları", value: stats.blog_posts },
    { label: "DR AI Çalışmaları", value: stats.case_studies },
  ] : [];
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className="card-elevate p-6">
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#2563EB]">{c.label}</div>
          <div className="mt-3 font-heading text-4xl font-extrabold text-[#07111F]">{c.value}</div>
          {typeof c.new === "number" && c.new > 0 && (
            <div className="mt-2 inline-flex items-center gap-1 rounded-md bg-[#F97316]/10 px-2 py-0.5 text-xs font-semibold text-[#F97316]">
              {c.new} yeni
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Contacts() {
  const [rows, setRows] = useState([]);
  const [view, setView] = useState(null);
  const load = () => api.get("/admin/contacts").then((r) => setRows(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const del = async (id) => {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    await api.delete(`/admin/contacts/${id}`);
    toast.success("Silindi"); load();
  };

  return (
    <div>
      <DataTable
        rows={rows}
        columns={[
          { key: "name", label: "Ad" },
          { key: "company", label: "Firma" },
          { key: "email", label: "E-posta" },
          { key: "project_type", label: "Tür" },
          { key: "created_at", label: "Tarih", render: (v) => new Date(v).toLocaleDateString("tr-TR") },
        ]}
        actions={(r) => (
          <>
            <button onClick={() => setView(r)} className="p-2 rounded hover:bg-slate-100"><Eye className="h-4 w-4" /></button>
            <button onClick={() => del(r.id)} className="p-2 rounded hover:bg-red-50 text-red-600"><Trash2 className="h-4 w-4" /></button>
          </>
        )}
      />
      {view && <Modal onClose={() => setView(null)} title={view.name}>
        <DefList data={view} fields={[
          ["Firma", "company"], ["E-posta", "email"], ["Telefon", "phone"], ["Proje Türü", "project_type"],
          ["Bütçe", "budget"], ["Mesaj", "message"], ["Tarih", "created_at"],
        ]} />
      </Modal>}
    </div>
  );
}

function Requests() {
  const [rows, setRows] = useState([]);
  const [view, setView] = useState(null);
  const load = () => api.get("/admin/project-requests").then((r) => setRows(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);
  const del = async (id) => { if (!confirm("Silinsin mi?")) return; await api.delete(`/admin/project-requests/${id}`); toast.success("Silindi"); load(); };

  return (
    <div>
      <DataTable
        rows={rows}
        columns={[
          { key: "company_name", label: "Firma" },
          { key: "contact_name", label: "İletişim" },
          { key: "email", label: "E-posta" },
          { key: "project_type", label: "Tür" },
          { key: "budget", label: "Bütçe" },
        ]}
        actions={(r) => (
          <>
            <button onClick={() => setView(r)} className="p-2 rounded hover:bg-slate-100"><Eye className="h-4 w-4" /></button>
            <button onClick={() => del(r.id)} className="p-2 rounded hover:bg-red-50 text-red-600"><Trash2 className="h-4 w-4" /></button>
          </>
        )}
      />
      {view && <Modal onClose={() => setView(null)} title={view.company_name}>
        <DefList data={view} fields={[
          ["İletişim", "contact_name"], ["E-posta", "email"], ["Telefon", "phone"],
          ["Mevcut Durum", "current_digital_state"], ["Proje Türü", "project_type"],
          ["Hedefler", "goals"], ["Kullanıcı Rolleri", "user_roles"],
          ["Özellikler", "required_features"], ["Referanslar", "reference_systems"],
          ["Zaman", "timeline"], ["Bütçe", "budget"], ["Notlar", "notes"],
        ]} />
      </Modal>}
    </div>
  );
}

function AiLeadsAdmin() {
  const [rows, setRows] = useState([]);
  const [view, setView] = useState(null);
  const backend = process.env.REACT_APP_BACKEND_URL;
  const media = (u) => (u && u.startsWith("http") ? u : `${backend}${u}`);
  const load = () => api.get("/admin/ai-leads").then((r) => setRows((r.data || []).map((x) => ({ ...x, id: x._id })))).catch(() => {});
  useEffect(() => { load(); }, []);
  const del = async (id) => { if (!confirm("Silinsin mi?")) return; await api.delete(`/admin/ai-leads/${id}`); toast.success("Silindi"); load(); };
  const fmtDate = (iso) => { try { return new Date(iso).toLocaleString("tr-TR"); } catch { return ""; } };

  return (
    <div data-testid="admin-ai-leads">
      {rows.length === 0 && <p className="text-sm text-[#334155]">Henüz DR AI ile Üret talebi gelmedi. Talepler <span className="font-semibold">/dr-ai-ile-uret</span> sayfasından toplanır.</p>}
      <DataTable
        rows={rows}
        columns={[
          { key: "name", label: "Ad Soyad" },
          { key: "company", label: "Şirket" },
          { key: "phone", label: "Telefon" },
          { key: "_bp", label: "Proje", render: (_, r) => r.blueprint?.project_name || "—" },
          { key: "created_at", label: "Tarih", render: (_, r) => fmtDate(r.created_at) },
        ]}
        actions={(r) => (
          <>
            <button onClick={() => setView(r)} className="p-2 rounded hover:bg-slate-100" data-testid={`ai-lead-view-${r.id}`}><Eye className="h-4 w-4" /></button>
            <button onClick={() => del(r.id)} className="p-2 rounded hover:bg-red-50 text-red-600"><Trash2 className="h-4 w-4" /></button>
          </>
        )}
      />
      {view && (
        <Modal onClose={() => setView(null)} title={`${view.name}${view.company ? " · " + view.company : ""}`}>
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div><span className="text-slate-400">Telefon:</span> <span className="font-medium">{view.phone}</span></div>
              <div><span className="text-slate-400">E-posta:</span> <span className="font-medium">{view.email || "—"}</span></div>
              <div className="col-span-2"><span className="text-slate-400">Tarih:</span> {fmtDate(view.created_at)}</div>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">İlk Fikir</div>
              <p className="mt-1 text-slate-700">{view.idea}</p>
            </div>
            {(view.answers || []).length > 0 && (
              <div className="rounded-lg border border-slate-200 p-3">
                <div className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">Soru & Cevaplar</div>
                <ul className="mt-1.5 space-y-1.5">
                  {view.answers.map((a, i) => (
                    <li key={i}><span className="text-slate-500">{a.question}</span><br /><span className="font-medium text-slate-800">{a.answer}</span></li>
                  ))}
                </ul>
              </div>
            )}
            {view.blueprint?.project_name && (
              <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-3">
                <div className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">Project Blueprint</div>
                <div className="mt-1 font-heading text-lg font-bold text-[#0B1B34]">{view.blueprint.project_name}</div>
                <div className="text-slate-500">{view.blueprint.project_type} · {view.blueprint.platform}</div>
                {view.blueprint.description && <p className="mt-1 text-slate-700">{view.blueprint.description}</p>}
                {(view.blueprint.modules || []).length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {view.blueprint.modules.map((m, i) => <span key={i} className="rounded-full bg-white px-2.5 py-1 text-xs text-slate-600 border border-slate-200">{m}</span>)}
                  </div>
                )}
              </div>
            )}
            {(view.mockup_images || []).length > 0 && (
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">Üretilen Örnek Görsel{view.mockup_feedback ? ` · Geri bildirim: ${view.mockup_feedback}` : ""}</div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {view.mockup_images.map((m, i) => (
                    <a key={i} href={media(m)} target="_blank" rel="noreferrer"><img src={media(m)} alt="mockup" className="rounded-lg border border-slate-200" /></a>
                  ))}
                </div>
              </div>
            )}
            {view.note && <div className="rounded-lg border border-slate-200 p-3"><span className="text-slate-400">Not:</span> {view.note}</div>}
          </div>
        </Modal>
      )}
    </div>
  );
}


function ProjectsAdmin() {
  const [rows, setRows] = useState([]);
  const [edit, setEdit] = useState(null);
  const load = () => api.get("/admin/projects").then((r) => setRows(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);
  const del = async (id) => { if (!confirm("Silinsin mi?")) return; await api.delete(`/admin/projects/${id}`); toast.success("Silindi"); load(); };

  const save = async (form) => {
    try {
      const payload = { ...form, tags: Array.isArray(form.tags) ? form.tags : [] };
      if (form.id) await api.put(`/admin/projects/${form.id}`, payload);
      else await api.post("/admin/projects", payload);
      toast.success("Kaydedildi"); setEdit(null); load();
    } catch (err) { toast.error(formatApiError(err.response?.data?.detail)); }
  };

  return (
    <div>
      <div className="mb-5 flex justify-end">
        <button onClick={() => setEdit({ slug: "", title: "", client: "", sector: "", tags: [], need: "", solution: "", result: "", cover_image: "", content: "", gallery: [], faq: [], external_url: "", seo_title: "", seo_description: "", duration_days: null, featured: false, published: true })} className="btn-primary py-2 text-sm">
          <Plus className="h-4 w-4" /> Yeni Proje
        </button>
      </div>
      <DataTable
        rows={rows}
        columns={[
          { key: "title", label: "Başlık" },
          { key: "client", label: "Müşteri" },
          { key: "sector", label: "Sektör" },
          { key: "slug", label: "Slug" },
        ]}
        actions={(r) => (
          <>
            <a href={`/projeler/${r.slug}`} target="_blank" rel="noreferrer" className="p-2 rounded hover:bg-slate-100"><ExternalLink className="h-4 w-4" /></a>
            <button onClick={() => setEdit({ ...r, tags: r.tags || [], gallery: r.gallery || [], faq: r.faq || [] })} className="p-2 rounded hover:bg-slate-100"><Eye className="h-4 w-4" /></button>
            <button onClick={() => del(r.id)} className="p-2 rounded hover:bg-red-50 text-red-600"><Trash2 className="h-4 w-4" /></button>
          </>
        )}
      />
      {edit && <Modal onClose={() => setEdit(null)} title={edit.id ? "Projeyi Düzenle" : "Yeni Proje"} wide>
        <ProjectForm initial={edit} onSubmit={save} />
      </Modal>}
    </div>
  );
}

function BlogAdmin() {
  const [rows, setRows] = useState([]);
  const [edit, setEdit] = useState(null);
  const load = () => api.get("/admin/blog").then((r) => setRows(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);
  const del = async (id) => { if (!confirm("Silinsin mi?")) return; await api.delete(`/admin/blog/${id}`); toast.success("Silindi"); load(); };

  const save = async (form) => {
    try {
      const payload = { ...form, read_time: Number(form.read_time) || 5 };
      if (form.id) await api.put(`/admin/blog/${form.id}`, payload);
      else await api.post("/admin/blog", payload);
      toast.success("Kaydedildi"); setEdit(null); load();
    } catch (err) { toast.error(formatApiError(err.response?.data?.detail)); }
  };

  return (
    <div>
      <div className="mb-5 flex justify-end">
        <button onClick={() => setEdit({ slug: "", title: "", excerpt: "", content: "", category: "", cover_image: "", read_time: 5, tags: [], faq: [], expert_insight: "", project_example: "", methodology: "", sources: [], seo_title: "", seo_description: "", published: true })} className="btn-primary py-2 text-sm">
          <Plus className="h-4 w-4" /> Yeni Yazı
        </button>
      </div>
      <DataTable
        rows={rows}
        columns={[
          { key: "title", label: "Başlık" },
          { key: "category", label: "Kategori" },
          { key: "slug", label: "Slug" },
          { key: "published", label: "Yayında", render: (v) => v ? "Evet" : "Hayır" },
        ]}
        actions={(r) => (
          <>
            <a href={`/blog/${r.slug}`} target="_blank" rel="noreferrer" className="p-2 rounded hover:bg-slate-100"><ExternalLink className="h-4 w-4" /></a>
            <button onClick={() => setEdit(r)} className="p-2 rounded hover:bg-slate-100"><Eye className="h-4 w-4" /></button>
            <button onClick={() => del(r.id)} className="p-2 rounded hover:bg-red-50 text-red-600"><Trash2 className="h-4 w-4" /></button>
          </>
        )}
      />
      {edit && <Modal onClose={() => setEdit(null)} title={edit.id ? "Yazıyı Düzenle" : "Yeni Yazı"} wide>
        <BlogForm initial={edit} onSubmit={save} />
      </Modal>}
    </div>
  );
}

// Reusable bits
function DataTable({ rows, columns, actions }) {
  if (!rows.length) return <div className="card-elevate p-12 text-center text-sm text-[#334155]">Henüz kayıt yok.</div>;
  return (
    <div className="card-elevate overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {columns.map((c) => <th key={c.key} className="text-left font-semibold text-[#07111F] px-5 py-3">{c.label}</th>)}
              {actions && <th className="px-5 py-3 text-right">İşlem</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                {columns.map((c) => (
                  <td key={c.key} className="px-5 py-3 text-[#334155]">
                    {c.render ? c.render(r[c.key], r) : (r[c.key] || "-")}
                  </td>
                ))}
                {actions && <td className="px-5 py-3"><div className="flex justify-end gap-1">{actions(r)}</div></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Modal({ title, children, onClose, wide = false }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className={`bg-white rounded-2xl border border-slate-200 ${wide ? "max-w-4xl" : "max-w-2xl"} w-full max-h-[92vh] overflow-auto`} onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
          <h3 className="font-heading font-bold text-[#07111F]">{title}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function DefList({ data, fields }) {
  return (
    <dl className="space-y-3 text-sm">
      {fields.map(([label, key]) => data[key] && (
        <div key={key}>
          <dt className="text-xs font-bold uppercase tracking-[0.15em] text-[#2563EB]">{label}</dt>
          <dd className="mt-0.5 text-[#334155] whitespace-pre-wrap">{String(data[key])}</dd>
        </div>
      ))}
    </dl>
  );
}

// -----------------------------------------------------------------------------
// Site Settings tab
// -----------------------------------------------------------------------------
function SettingsAdmin() {
  const { settings, refresh } = useSiteSettings();
  const [f, setF] = useState(null);
  const [saving, setSaving] = useState(false);
  const [genFaq, setGenFaq] = useState(false);

  useEffect(() => { if (settings && !f) setF(JSON.parse(JSON.stringify(settings))); }, [settings, f]);

  if (!f) return <div className="text-sm text-[#334155]">Yükleniyor...</div>;

  const set = (patch) => setF((s) => ({ ...s, ...patch }));
  const setPage = (key, patch) =>
    setF((s) => ({ ...s, pages: { ...s.pages, [key]: { ...s.pages?.[key], ...patch } } }));

  const generateHomeFaq = async () => {
    setGenFaq(true);
    try {
      const context = `Firma: Dijital Roket (Bursa merkezli, Türkiye geneli).\nAçıklama: ${f.site_description || ""}\nHakkımızda: ${(f.about_content || "").slice(0, 2000)}\nHizmetler: Kurumsal web, B2B/bayi panelleri, CRM benzeri özel yazılımlar, okul/eğitim yazılımları, e-ticaret, mobil uygulama, sosyal medya içerik üretimi, SEO.`;
      const { data } = await api.post("/admin/generate-faq", { kind: "company", title: "Dijital Roket Kurumsal SSS", context, count: 10 });
      if (data.faq?.length) { set({ home_faq: [...(f.home_faq || []), ...data.faq] }); toast.success(`${data.faq.length} SSS eklendi`); }
      else toast.error("SSS üretilemedi, tekrar deneyin.");
    } catch (err) { toast.error(formatApiError(err.response?.data?.detail) || "SSS üretilemedi."); }
    finally { setGenFaq(false); }
  };

  const save = async (e) => {
    e?.preventDefault();
    setSaving(true);
    try {
      await api.put("/admin/settings", f);
      toast.success("Site ayarları güncellendi");
      await refresh();
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || err.message);
    } finally {
      setSaving(false);
    }
  };

  const pageKeys = [
    ["home", "Ana Sayfa"],
    ["about", "Hakkımızda"],
    ["projects", "Projeler"],
    ["blog", "Blog"],
    ["contact", "İletişim"],
  ];

  return (
    <form onSubmit={save} className="space-y-6 max-w-4xl">
      <FormSection title="Genel SEO" hint="Tüm sitede varsayılan başlık ve açıklama. Belirli sayfa için aşağıdan özelleştirebilirsiniz.">
        <FormInput label="Varsayılan SEO Başlığı" value={f.site_title} onChange={(v) => set({ site_title: v })} />
        <FormTextarea label="Varsayılan Meta Açıklaması" rows={2} value={f.site_description} onChange={(v) => set({ site_description: v })} />
      </FormSection>

      <FormSection title="Favicon ve OG Görseli" hint="Favicon tarayıcı sekmesinde görünür. OG görseli sosyal medyada paylaşıldığında kullanılır.">
        <ImageUploader label="Favicon" value={f.favicon_url} onChange={(v) => set({ favicon_url: v })} />
        <ImageUploader label="OG / Sosyal Medya Görseli" value={f.og_image} onChange={(v) => set({ og_image: v })} />
      </FormSection>

      <FormSection title="Sayfa Bazlı SEO" hint="Sadece o sayfa için başlık ve açıklama. Boş bırakılırsa genel SEO kullanılır.">
        <div className="space-y-4">
          {pageKeys.map(([k, label]) => (
            <div key={k} className="rounded-lg border border-slate-200 p-4">
              <div className="text-xs font-bold uppercase tracking-[0.15em] text-[#2563EB] mb-3">{label}</div>
              <div className="grid sm:grid-cols-2 gap-3">
                <FormInput label="Başlık" value={f.pages?.[k]?.title || ""} onChange={(v) => setPage(k, { title: v })} />
                <FormInput label="Açıklama" value={f.pages?.[k]?.description || ""} onChange={(v) => setPage(k, { description: v })} />
              </div>
            </div>
          ))}
        </div>
      </FormSection>

      <FormSection title="İletişim Bilgileri" hint="Footer ve İletişim sayfasında kullanılır.">
        <div className="grid sm:grid-cols-2 gap-4">
          <FormInput label="Telefon (görünen)" value={f.contact_phone} onChange={(v) => set({ contact_phone: v })} />
          <FormInput label="Telefon (tıklama bağlantısı)" value={f.contact_phone_link} onChange={(v) => set({ contact_phone_link: v })} />
          <FormInput label="E-posta" value={f.contact_email} onChange={(v) => set({ contact_email: v })} />
          <FormInput label="Adres" value={f.contact_address} onChange={(v) => set({ contact_address: v })} />
        </div>
      </FormSection>

      <FormSection title="Sosyal Medya" hint="Footer'da gösterilir. Boş bırakırsanız ikon hiç gösterilmez.">
        <div className="grid sm:grid-cols-3 gap-4">
          <FormInput label="LinkedIn URL" value={f.social_linkedin} onChange={(v) => set({ social_linkedin: v })} />
          <FormInput label="Instagram URL" value={f.social_instagram} onChange={(v) => set({ social_instagram: v })} />
          <FormInput label="Twitter / X URL" value={f.social_twitter} onChange={(v) => set({ social_twitter: v })} />
        </div>
      </FormSection>

      <FormSection title="DR AI Uygulama Linkleri" hint="Footer'daki Google Play / App Store butonlarında kullanılır.">
        <div className="grid sm:grid-cols-2 gap-4">
          <FormInput label="Google Play URL" value={f.app_google_play} onChange={(v) => set({ app_google_play: v })} />
          <FormInput label="App Store URL" value={f.app_app_store} onChange={(v) => set({ app_app_store: v })} />
        </div>
      </FormSection>

      <FormSection title="Hakkımızda Sayfası">
        <div className="grid sm:grid-cols-2 gap-4">
          <FormInput label="Üst Etiket (eyebrow)" value={f.about_eyebrow} onChange={(v) => set({ about_eyebrow: v })} />
          <FormInput label="Sayfa Başlığı" value={f.about_title} onChange={(v) => set({ about_title: v })} />
        </div>
        <ImageUploader label="Hakkımızda Görseli" value={f.about_hero_image} onChange={(v) => set({ about_hero_image: v })} />
        <div>
          <div className="text-xs font-semibold text-[#07111F] mb-1">Hakkımızda İçeriği</div>
          <ContentEditor value={f.about_content} onChange={(v) => set({ about_content: v })} rows={14} />
        </div>
      </FormSection>

      <div className="rounded-xl border border-[#2563EB]/20 bg-[#2563EB]/5 p-4">
        <div className="text-sm font-bold text-[#07111F]">🤖 AEO/GEO — Şirket SSS (Ana Sayfada gösterilir)</div>
        <p className="mt-1 text-xs text-[#334155]">Bu sorular ana sayfada görünür ve FAQPage şeması olarak yapay zekâlara (ChatGPT/Gemini/Claude) sunulur. "Dijital Roket ne yapar?", "Nerede hizmet veriyor?" gibi kurumsal sorularla AI önerilerinde öne çıkarsınız.</p>
      </div>
      <FaqEditor faq={f.home_faq} onChange={(v) => set({ home_faq: v })} onGenerate={generateHomeFaq} generating={genFaq} />

      <div className="sticky bottom-0 -mx-6 lg:-mx-10 px-6 lg:px-10 py-4 bg-white border-t border-slate-200 flex justify-end">
        <button disabled={saving} className="btn-primary">
          {saving ? "Kaydediliyor..." : "Ayarları Kaydet"}
        </button>
      </div>
    </form>
  );
}

function FaqEditor({ faq, onChange, onGenerate, generating }) {
  const list = faq || [];
  const add = () => onChange([...list, { q: "", a: "" }]);
  const upd = (i, patch) => { const c = [...list]; c[i] = { ...c[i], ...patch }; onChange(c); };
  const rem = (i) => { const c = [...list]; c.splice(i, 1); onChange(c); };
  return (
    <FormSection
      title={`Sık Sorulan Sorular (SSS) — ${list.length} soru`}
      hint="AEO/GEO: Bu sorular hem sayfada görünür hem de FAQPage şeması olarak yapay zekâlara (ChatGPT/Gemini/Claude) sunulur. 'AI ile 10 SSS Üret' ile içeriğe göre otomatik soru-cevap oluşturabilirsiniz."
    >
      <div className="mb-3">
        <button
          type="button"
          onClick={onGenerate}
          disabled={generating}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#2563EB] to-[#22D3EE] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-[#2563EB]/25 hover:-translate-y-0.5 transition disabled:opacity-60 disabled:translate-y-0"
          data-testid="ai-generate-faq-btn"
        >
          {generating
            ? <><Loader2 className="h-4 w-4 animate-spin" /> Üretiliyor...</>
            : <><Sparkles className="h-4 w-4" /> AI ile 10 SSS Üret</>}
        </button>
        <span className="ml-3 text-xs text-slate-400">gpt-5.4-mini · içeriğe göre otomatik</span>
      </div>
      {list.length > 0 && (
        <ul className="space-y-3">
          {list.map((item, i) => (
            <li key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2" data-testid={`faq-editor-item-${i}`}>
              <div className="flex items-start gap-2">
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    placeholder="Soru (örn. Okul yazılımını kim yaptırabilir?)"
                    value={item.q || ""}
                    onChange={(e) => upd(i, { q: e.target.value })}
                    className="w-full rounded-md border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-[#2563EB]"
                    data-testid={`faq-question-${i}`}
                  />
                  <textarea
                    placeholder="Cevap (Dijital Roket'i tarif eden, öneren net bir yanıt)"
                    value={item.a || ""}
                    onChange={(e) => upd(i, { a: e.target.value })}
                    rows={3}
                    className="w-full rounded-md border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-[#2563EB]"
                    data-testid={`faq-answer-${i}`}
                  />
                </div>
                <button type="button" onClick={() => rem(i)} className="p-1.5 rounded hover:bg-red-50 text-red-600" data-testid={`faq-remove-${i}`}><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <button type="button" onClick={add} className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50" data-testid="faq-add-btn">
        <Plus className="h-4 w-4" /> Soru Ekle
      </button>
    </FormSection>
  );
}

function ProjectForm({ initial, onSubmit }) {
  const [f, setF] = useState(initial);
  const set = (patch) => setF((s) => ({ ...s, ...patch }));

  const addGalleryImage = (url) => {
    if (!url) return;
    set({ gallery: [...(f.gallery || []), { url, caption: "" }] });
  };
  const updateGalleryItem = (idx, patch) => {
    const copy = [...(f.gallery || [])];
    copy[idx] = { ...copy[idx], ...patch };
    set({ gallery: copy });
  };
  const removeGalleryItem = (idx) => {
    const copy = [...(f.gallery || [])];
    copy.splice(idx, 1);
    set({ gallery: copy });
  };
  const moveGalleryItem = (idx, dir) => {
    const copy = [...(f.gallery || [])];
    const t = idx + dir;
    if (t < 0 || t >= copy.length) return;
    [copy[idx], copy[t]] = [copy[t], copy[idx]];
    set({ gallery: copy });
  };

  const [genFaq, setGenFaq] = useState(false);
  const generateFaq = async () => {
    if (!f.title) { toast.error("Önce proje başlığını girin."); return; }
    setGenFaq(true);
    try {
      const context = `Sektör: ${f.sector || ""}\nMüşteri: ${f.client || ""}\nİhtiyaç: ${f.need || ""}\nÇözüm: ${f.solution || ""}\nSonuç: ${f.result || ""}\nEtiketler: ${(f.tags || []).join(", ")}\nDetay: ${(f.content || "").slice(0, 2500)}`;
      const { data } = await api.post("/admin/generate-faq", { kind: "project", title: f.title, context, count: 10 });
      if (data.faq?.length) { set({ faq: [...(f.faq || []), ...data.faq] }); toast.success(`${data.faq.length} SSS eklendi`); }
      else toast.error("SSS üretilemedi, tekrar deneyin.");
    } catch (err) { toast.error(formatApiError(err.response?.data?.detail) || "SSS üretilemedi."); }
    finally { setGenFaq(false); }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(f); }} className="space-y-5">
      <FormSection title="Temel Bilgiler">
        <div className="grid sm:grid-cols-2 gap-4">
          <FormInput label="Slug" required value={f.slug} onChange={(v) => set({ slug: v })} />
          <FormInput label="Başlık" required value={f.title} onChange={(v) => set({ title: v })} />
          <FormInput label="Müşteri" value={f.client} onChange={(v) => set({ client: v })} />
          <FormInput label="Sektör" value={f.sector} onChange={(v) => set({ sector: v })} />
          <FormInput label="Harici Link (örn. firma sitesi)" value={f.external_url} onChange={(v) => set({ external_url: v })} />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Süre (gün) — kaç günde geliştirildi</label>
            <input
              type="number"
              min="1"
              placeholder="Örn. 6"
              value={f.duration_days ?? ""}
              onChange={(e) => set({ duration_days: e.target.value === "" ? null : parseInt(e.target.value, 10) })}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#2563EB]"
              data-testid="project-duration-input"
            />
          </div>
        </div>
        <div className="mt-4">
          <TagInput label="Etiketler" value={f.tags} onChange={(v) => set({ tags: v })} />
        </div>
      </FormSection>

      <FormSection title="Kapak Görseli">
        <ImageUploader value={f.cover_image} onChange={(v) => set({ cover_image: v })} label="" />
      </FormSection>

      <FormSection title="Özet (Kart Bilgileri)">
        <FormTextarea label="İhtiyaç" value={f.need} onChange={(v) => set({ need: v })} />
        <FormTextarea label="Çözüm" value={f.solution} onChange={(v) => set({ solution: v })} />
        <FormTextarea label="Sonuç" value={f.result} onChange={(v) => set({ result: v })} />
      </FormSection>

      <FormSection title="Detaylı İçerik" hint="Markdown destekli — ## Başlık, ### Alt Başlık, **kalın**, - madde, > alıntı, ![alt](görsel URL'i)">
        <ContentEditor value={f.content} onChange={(v) => set({ content: v })} rows={12} />
      </FormSection>

      <FormSection title={`Proje Galerisi (${(f.gallery || []).length} görsel)`}>
        <ImageUploader value="" onChange={addGalleryImage} label="Yeni görsel ekle" />
        {(f.gallery || []).length > 0 && (
          <ul className="mt-4 space-y-3">
            {f.gallery.map((g, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
                  <img src={g.url} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <input
                    type="text"
                    placeholder="Açıklama (caption)"
                    value={g.caption || ""}
                    onChange={(e) => updateGalleryItem(i, { caption: e.target.value })}
                    className="w-full rounded-md border border-slate-200 px-3 py-1.5 text-xs outline-none focus:border-[#2563EB]"
                  />
                  <input
                    type="text"
                    value={g.url}
                    onChange={(e) => updateGalleryItem(i, { url: e.target.value })}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-[11px] text-slate-500 outline-none truncate"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <button type="button" onClick={() => moveGalleryItem(i, -1)} className="p-1.5 rounded hover:bg-white text-slate-600 disabled:opacity-30" disabled={i === 0}><ArrowUp className="h-3.5 w-3.5" /></button>
                  <button type="button" onClick={() => moveGalleryItem(i, 1)} className="p-1.5 rounded hover:bg-white text-slate-600 disabled:opacity-30" disabled={i === f.gallery.length - 1}><ArrowDown className="h-3.5 w-3.5" /></button>
                  <button type="button" onClick={() => removeGalleryItem(i)} className="p-1.5 rounded hover:bg-red-50 text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </FormSection>

      <FaqEditor faq={f.faq} onChange={(v) => set({ faq: v })} onGenerate={generateFaq} generating={genFaq} />

      <FormSection title="SEO Ayarları" hint="Boş bırakılırsa başlık ve özet otomatik kullanılır.">
        <FormInput label="SEO Başlığı" value={f.seo_title} onChange={(v) => set({ seo_title: v })} />
        <FormTextarea label="SEO Açıklaması" rows={2} value={f.seo_description} onChange={(v) => set({ seo_description: v })} />
      </FormSection>

      <label className="flex items-center gap-2">
        <input type="checkbox" checked={!!f.published} onChange={(e) => set({ published: e.target.checked })} />
        <span className="text-sm">Yayında göster</span>
      </label>

      <label className="flex items-center gap-2 rounded-lg border border-[#2563EB]/25 bg-[#2563EB]/5 px-3 py-2">
        <input type="checkbox" checked={!!f.featured} onChange={(e) => set({ featured: e.target.checked })} data-testid="project-featured-checkbox" />
        <span className="text-sm font-medium text-[#07111F]">⭐ Öne Çıkan — ana sayfada (hero, vitrin ve kayan şeritte) göster</span>
      </label>


      <div className="sticky bottom-0 -mx-6 -mb-6 px-6 py-4 bg-white border-t border-slate-200 flex justify-end">
        <button className="btn-primary">Kaydet</button>
      </div>
    </form>
  );
}

function BlogForm({ initial, onSubmit }) {
  const [f, setF] = useState(initial);
  const set = (patch) => setF((s) => ({ ...s, ...patch }));

  const [genFaq, setGenFaq] = useState(false);
  const generateFaq = async () => {
    if (!f.title) { toast.error("Önce yazı başlığını girin."); return; }
    setGenFaq(true);
    try {
      const context = `Kategori: ${f.category || ""}\nÖzet: ${f.excerpt || ""}\nEtiketler: ${(f.tags || []).join(", ")}\nİçerik: ${(f.content || "").slice(0, 2500)}`;
      const { data } = await api.post("/admin/generate-faq", { kind: "blog", title: f.title, context, count: 10 });
      if (data.faq?.length) { set({ faq: [...(f.faq || []), ...data.faq] }); toast.success(`${data.faq.length} SSS eklendi`); }
      else toast.error("SSS üretilemedi, tekrar deneyin.");
    } catch (err) { toast.error(formatApiError(err.response?.data?.detail) || "SSS üretilemedi."); }
    finally { setGenFaq(false); }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(f); }} className="space-y-5">
      <FormSection title="Temel Bilgiler">
        <div className="grid sm:grid-cols-2 gap-4">
          <FormInput label="Slug" required value={f.slug} onChange={(v) => set({ slug: v })} />
          <FormInput label="Başlık" required value={f.title} onChange={(v) => set({ title: v })} />
          <FormInput label="Kategori" value={f.category} onChange={(v) => set({ category: v })} />
          <FormInput label="Okuma Süresi (dk)" type="number" value={f.read_time} onChange={(v) => set({ read_time: v })} />
        </div>
      </FormSection>

      <FormSection title="Kapak Görseli">
        <ImageUploader value={f.cover_image} onChange={(v) => set({ cover_image: v })} label="" />
      </FormSection>

      <FormSection title="Özet">
        <FormTextarea label="" value={f.excerpt} onChange={(v) => set({ excerpt: v })} rows={3} />
      </FormSection>

      <FormSection title="İçerik" hint="Markdown destekli — ## Başlık, ### Alt Başlık, **kalın**, - madde, > alıntı. Görsel eklemek için aşağıdaki butonu kullanın. HTML etiketleri de desteklenir.">
        <ContentEditor value={f.content} onChange={(v) => set({ content: v })} rows={16} />
      </FormSection>

      <FormSection title="Etiketler & SEO" hint="Etiketler blog filtreleme için, SEO alanları arama motorları için kullanılır.">
        <TagInput label="Etiketler" value={f.tags} onChange={(v) => set({ tags: v })} />
        <FormInput label="SEO Başlığı" value={f.seo_title} onChange={(v) => set({ seo_title: v })} />
        <FormTextarea label="SEO Açıklaması" rows={2} value={f.seo_description} onChange={(v) => set({ seo_description: v })} />
      </FormSection>

      <FormSection title="Dijital Roket Deneyimi (First-Party / E-E-A-T)" hint="Yalnızca GERÇEK bilgi girin. Doldurulan alanlar blog sayfasında 'Dijital Roket Deneyimi' bölümünde görünür ve AI arama motorlarına birinci-el uzmanlık sinyali verir. Boş bırakılan alanlar gizlenir.">
        <FormTextarea label="Uzman Görüşü (expert insight)" rows={3} value={f.expert_insight} onChange={(v) => set({ expert_insight: v })} />
        <FormTextarea label="Gerçek Proje Örneği" rows={3} value={f.project_example} onChange={(v) => set({ project_example: v })} />
        <FormTextarea label="Yöntem / Metodoloji" rows={2} value={f.methodology} onChange={(v) => set({ methodology: v })} />
        <SourcesEditor sources={f.sources || []} onChange={(v) => set({ sources: v })} />
      </FormSection>

      <FaqEditor faq={f.faq} onChange={(v) => set({ faq: v })} onGenerate={generateFaq} generating={genFaq} />

      <label className="flex items-center gap-2">
        <input type="checkbox" checked={!!f.published} onChange={(e) => set({ published: e.target.checked })} />
        <span className="text-sm">Yayında göster</span>
      </label>

      <div className="sticky bottom-0 -mx-6 -mb-6 px-6 py-4 bg-white border-t border-slate-200 flex justify-end">
        <button className="btn-primary">Kaydet</button>
      </div>
    </form>
  );
}

/** Textarea + image upload + markdown toolbar. */
function ContentEditor({ value, onChange, rows = 12 }) {
  const ref = useState(null)[0]; // not used; we use document.activeElement-style insertion via id
  const id = `content-${Math.random().toString(36).slice(2, 8)}`;
  const [uploading, setUploading] = useState(false);
  const [imgSize, setImgSize] = useState(100);
  const inputRef = useState(null)[0];

  const insertAtCursor = (text) => {
    const el = document.getElementById(id);
    if (!el) {
      onChange((value || "") + "\n\n" + text + "\n");
      return;
    }
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    const before = value.slice(0, start);
    const after = value.slice(end);
    const insert = (before.endsWith("\n\n") || before === "" ? "" : before.endsWith("\n") ? "\n" : "\n\n") + text + "\n";
    const next = before + insert + after;
    onChange(next);
    setTimeout(() => {
      el.focus();
      const pos = (before + insert).length;
      el.selectionStart = el.selectionEnd = pos;
    }, 0);
  };

  const wrap = (prefix, suffix = prefix) => {
    const el = document.getElementById(id);
    if (!el) return;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const sel = value.slice(start, end) || "metin";
    const next = value.slice(0, start) + prefix + sel + suffix + value.slice(end);
    onChange(next);
    setTimeout(() => {
      el.focus();
      el.selectionStart = start + prefix.length;
      el.selectionEnd = start + prefix.length + sel.length;
    }, 0);
  };

  const uploadAndInsert = async (file) => {
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) { toast.error("Görsel 8MB'dan büyük olamaz."); return; }
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const { data } = await api.post("/admin/upload", form, { headers: { "Content-Type": "multipart/form-data" } });
      insertAtCursor(imgSize >= 100 ? `![](${data.url})` : `![](${data.url}){w=${imgSize}}`);
      toast.success(`Görsel eklendi (%${imgSize})`);
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5 rounded-t-lg border border-slate-200 border-b-0 bg-slate-50 px-2 py-2">
        <ToolbarBtn onClick={() => insertAtCursor("## Başlık")} title="Başlık (H2)">H2</ToolbarBtn>
        <ToolbarBtn onClick={() => insertAtCursor("### Alt Başlık")} title="Alt Başlık (H3)">H3</ToolbarBtn>
        <ToolbarBtn onClick={() => wrap("**")} title="Kalın"><span className="font-bold">B</span></ToolbarBtn>
        <ToolbarBtn onClick={() => insertAtCursor("- Madde")} title="Madde">• Madde</ToolbarBtn>
        <ToolbarBtn onClick={() => insertAtCursor("> Alıntı")} title="Alıntı">“ Alıntı</ToolbarBtn>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-1 py-1" title="Eklenecek görsel genişliği">
            {[100, 75, 50].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setImgSize(s)}
                data-testid={`content-img-size-${s}`}
                className={`rounded px-2 py-0.5 text-[11px] font-semibold transition ${imgSize === s ? "bg-[#2563EB] text-white" : "text-slate-600 hover:bg-slate-100"}`}
              >
                %{s}
              </button>
            ))}
          </div>
          <label className="inline-flex items-center gap-1.5 cursor-pointer rounded-md border border-[#2563EB]/30 bg-[#2563EB]/8 px-3 py-1.5 text-xs font-semibold text-[#2563EB] hover:bg-[#2563EB]/12">
            {uploading ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Yükleniyor</> : <><ImageIcon className="h-3.5 w-3.5" /> Görsel Ekle</>}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={(e) => { uploadAndInsert(e.target.files?.[0]); e.target.value = ""; }}
            />
          </label>
        </div>
      </div>
      <textarea
        id={id}
        rows={rows}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-b-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#2563EB] resize-y font-mono"
        placeholder="Yazınızı buraya yazın. Markdown sentaksını kullanabilirsiniz veya yukarıdaki butonlardan yararlanabilirsiniz."
      />
    </div>
  );
}

function ToolbarBtn({ onClick, children, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-[#2563EB] hover:text-[#2563EB] transition"
    >
      {children}
    </button>
  );
}

function FormSection({ title, hint, children }) {
  return (
    <div className="rounded-xl border border-slate-200 p-5 bg-white">
      <div className="mb-4">
        <h4 className="font-heading text-sm font-bold uppercase tracking-[0.15em] text-[#2563EB]">{title}</h4>
        {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function FormInput({ label, value, onChange, type = "text", required }) {
  return (
    <label className="block">
      {label && <span className="block text-xs font-semibold text-[#07111F] mb-1">{label}{required && " *"}</span>}
      <input type={type} required={required} value={value || ""} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#2563EB]" />
    </label>
  );
}
function FormTextarea({ label, value, onChange, rows = 3 }) {
  return (
    <label className="block">
      {label && <span className="block text-xs font-semibold text-[#07111F] mb-1">{label}</span>}
      <textarea rows={rows} value={value || ""} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#2563EB] resize-none" />
    </label>
  );
}

function TagInput({ label = "Etiketler", value = [], onChange }) {
  const [input, setInput] = useState("");
  const list = Array.isArray(value) ? value : [];
  const add = (raw) => {
    const t = (raw || "").replace(/,$/, "").trim();
    if (!t) { setInput(""); return; }
    if (!list.includes(t)) onChange([...list, t]);
    setInput("");
  };
  const remove = (i) => onChange(list.filter((_, idx) => idx !== i));
  return (
    <div className="block">
      {label && <span className="block text-xs font-semibold text-[#07111F] mb-1">{label}</span>}
      <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-slate-200 px-2 py-2 focus-within:border-[#2563EB]">
        {list.map((t, i) => (
          <span key={i} data-testid={`tag-chip-${t}`} className="inline-flex items-center gap-1 rounded-md bg-[#2563EB]/10 px-2 py-1 text-xs font-medium text-[#2563EB]">
            {t}
            <button type="button" onClick={() => remove(i)} className="hover:text-[#07111F]"><X className="h-3 w-3" /></button>
          </span>
        ))}
        <input
          value={input}
          data-testid="tag-input"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(input); }
            else if (e.key === "Backspace" && !input && list.length) remove(list.length - 1);
          }}
          onBlur={() => add(input)}
          placeholder="Etiket yazıp Enter'a basın"
          className="flex-1 min-w-[140px] outline-none text-sm px-1 py-0.5"
        />
      </div>
    </div>
  );
}

function SourcesEditor({ sources = [], onChange }) {
  const list = Array.isArray(sources) ? sources : [];
  const update = (i, patch) => onChange(list.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const add = () => onChange([...list, { title: "", url: "" }]);
  const remove = (i) => onChange(list.filter((_, idx) => idx !== i));
  return (
    <div className="block" data-testid="sources-editor">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-[#07111F]">Kaynaklar (opsiyonel)</span>
        <button type="button" onClick={add} data-testid="add-source-btn" className="text-xs font-semibold text-[#2563EB] hover:underline">+ Kaynak ekle</button>
      </div>
      <div className="space-y-2">
        {list.map((s, i) => (
          <div key={i} className="flex gap-2 items-center" data-testid={`source-row-${i}`}>
            <input value={s.title || ""} onChange={(e) => update(i, { title: e.target.value })} placeholder="Kaynak adı / başlık" className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#2563EB]" />
            <input value={s.url || ""} onChange={(e) => update(i, { url: e.target.value })} placeholder="https://..." className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#2563EB]" />
            <button type="button" onClick={() => remove(i)} className="p-1.5 rounded hover:bg-red-50 text-red-600"><X className="h-4 w-4" /></button>
          </div>
        ))}
        {list.length === 0 && <p className="text-xs text-slate-400">Henüz kaynak eklenmedi.</p>}
      </div>
    </div>
  );
}


// -----------------------------------------------------------------------------
// Brands (DR AI Image Engine 2.0) tab
// -----------------------------------------------------------------------------
function BrandsAdmin() {
  const [rows, setRows] = useState([]);
  const [edit, setEdit] = useState(null);
  const [usage, setUsage] = useState(null);
  const [approving, setApproving] = useState(null); // brand pending approval (credits modal)
  const load = () => api.get("/admin/brands").then((r) => setRows(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const del = async (id) => {
    if (!confirm("Bu markayı ve tüm üretim geçmişini silmek istediğinize emin misiniz?")) return;
    await api.delete(`/admin/brands/${id}`);
    toast.success("Marka silindi"); load();
  };

  const reject = async (id) => {
    if (!confirm("Bu başvuruyu reddetmek istediğinize emin misiniz?")) return;
    await api.post(`/admin/brands/${id}/reject`);
    toast.success("Başvuru reddedildi"); load();
  };

  const approve = async (id, credits) => {
    try {
      await api.post(`/admin/brands/${id}/approve`, { credits_total: Number(credits) || 0 });
      toast.success("Firma onaylandı ve bilgilendirme e-postası gönderildi");
      setApproving(null); load();
    } catch (err) { toast.error(formatApiError(err.response?.data?.detail)); }
  };

  const save = async (form) => {
    try {
      const payload = { ...form, credits_total: Number(form.credits_total) || 0 };
      if (form.id) {
        payload.credits_used = Number(form.credits_used) || 0;
        await api.put(`/admin/brands/${form.id}`, payload);
      } else {
        await api.post("/admin/brands", payload);
      }
      toast.success("Kaydedildi"); setEdit(null); load();
    } catch (err) { toast.error(formatApiError(err.response?.data?.detail)); }
  };

  const newBrand = { name: "", slug: "", logo_url: "", brand_url: "", brand_color: "#2563EB", instagram: "", phone: "", about: "", portal_email: "", portal_password: "", credits_total: 25 };

  const pending = rows.filter((r) => r.status === "pending");
  const others = rows.filter((r) => r.status !== "pending");

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="text-sm text-[#334155]">Firmalar <span className="font-semibold">/firma/giris</span> adresinden kayıt olur; onayladığınızda DR AI Image Engine 2.0 ile görsel üretir.</p>
        <button onClick={() => setEdit(newBrand)} data-testid="brand-new-btn" className="btn-primary py-2 text-sm shrink-0">
          <Plus className="h-4 w-4" /> Yeni Marka
        </button>
      </div>

      {pending.length > 0 && (
        <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4" data-testid="pending-section">
          <div className="text-sm font-bold text-amber-800 mb-3">Onay Bekleyen Başvurular ({pending.length})</div>
          <div className="space-y-2">
            {pending.map((r) => (
              <div key={r.id} data-testid="pending-row" className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-white border border-amber-200 px-4 py-3">
                <div className="min-w-0">
                  <div className="font-semibold text-[#07111F]">{r.name} <span className="text-xs font-normal text-slate-400">({r.full_name})</span></div>
                  <div className="text-xs text-slate-500">{r.portal_email} · {r.phone}{r.brand_url ? ` · ${r.brand_url}` : ""}{r.instagram ? ` · ${r.instagram}` : ""}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => setApproving(r)} data-testid="approve-btn" className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700">Onayla</button>
                  <button onClick={() => reject(r.id)} data-testid="reject-btn" className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">Reddet</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <DataTable
        rows={others}
        columns={[
          { key: "name", label: "Marka" },
          { key: "portal_email", label: "Giriş E-postası" },
          { key: "portal_password", label: "Şifre" },
          { key: "credits", label: "Kredi (Ay)", render: (_, r) => `${r.credits_used || 0} / ${r.credits_total || 0}` },
          { key: "status", label: "Durum", render: (v) => (v === "rejected" ? "Reddedildi" : "Onaylı") },
        ]}
        actions={(r) => (
          <>
            <button onClick={() => setUsage(r)} title="Kullanım / Audit" className="p-2 rounded hover:bg-slate-100"><History className="h-4 w-4" /></button>
            <button onClick={() => setEdit({ ...r })} className="p-2 rounded hover:bg-slate-100"><Eye className="h-4 w-4" /></button>
            <button onClick={() => del(r.id)} className="p-2 rounded hover:bg-red-50 text-red-600"><Trash2 className="h-4 w-4" /></button>
          </>
        )}
      />
      {edit && <Modal onClose={() => setEdit(null)} title={edit.id ? "Markayı Düzenle" : "Yeni Marka"} wide>
        <BrandForm initial={edit} onSubmit={save} />
      </Modal>}
      {usage && <Modal onClose={() => setUsage(null)} title={`${usage.name} — Kullanım`} wide>
        <BrandUsage brand={usage} />
      </Modal>}
      {approving && <Modal onClose={() => setApproving(null)} title={`${approving.name} — Onayla`}>
        <ApproveForm brand={approving} onApprove={approve} />
      </Modal>}
    </div>
  );
}

function ApproveForm({ brand, onApprove }) {
  const [credits, setCredits] = useState(25);
  return (
    <form onSubmit={(e) => { e.preventDefault(); onApprove(brand.id, credits); }} className="space-y-4">
      <p className="text-sm text-[#334155]">
        <strong>{brand.name}</strong> ({brand.full_name}) firmasını onaylıyorsunuz. Onaylandığında <strong>{brand.portal_email}</strong> adresine bilgilendirme e-postası gönderilecektir.
      </p>
      <FormInput label="Aylık Kredi" type="number" value={credits} onChange={setCredits} />
      <div className="flex justify-end">
        <button className="btn-primary" data-testid="approve-confirm">Onayla ve E-posta Gönder</button>
      </div>
    </form>
  );
}

function BrandForm({ initial, onSubmit }) {
  const [f, setF] = useState(initial);
  const set = (patch) => setF((s) => ({ ...s, ...patch }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(f); }} className="space-y-5">
      <FormSection title="Marka Bilgileri">
        <div className="grid sm:grid-cols-2 gap-4">
          <FormInput label="Marka Adı" required value={f.name} onChange={(v) => set({ name: v })} />
          <FormInput label="Slug (benzersiz)" required value={f.slug} onChange={(v) => set({ slug: v })} />
          <FormInput label="Marka Web Sitesi" value={f.brand_url} onChange={(v) => set({ brand_url: v })} />
          <FormInput label="Instagram (örn. @markaadi)" value={f.instagram} onChange={(v) => set({ instagram: v })} />
          <FormInput label="Telefon" value={f.phone} onChange={(v) => set({ phone: v })} />
          <label className="block">
            <span className="block text-xs font-semibold text-[#07111F] mb-1">Marka Ana Rengi</span>
            <div className="flex items-center gap-2">
              <input type="color" value={f.brand_color || "#2563EB"} onChange={(e) => set({ brand_color: e.target.value })} className="h-10 w-14 rounded border border-slate-200 cursor-pointer" />
              <input type="text" value={f.brand_color || ""} onChange={(e) => set({ brand_color: e.target.value })} className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#2563EB]" />
            </div>
          </label>
        </div>
      </FormSection>

      <FormSection title="Marka Logosu" hint="Logo, üretilen görsele DR AI tarafından doğrudan yerleştirilir (PNG, şeffaf zemin önerilir). Konum ve boyutu AI özgürce seçer.">
        <ImageUploader value={f.logo_url} onChange={(v) => set({ logo_url: v })} label="" />
      </FormSection>

      <FormSection title="Firma Hakkında" hint="Firmanın ne iş yaptığı / sektörü. AI bu bilgiyi kullanarak sektöre uygun görseller üretir.">
        <FormTextarea label="" rows={3} value={f.about} onChange={(v) => set({ about: v })} />
      </FormSection>

      <FormSection title="Portal Erişimi" hint="Bu bilgiler markaya iletilir. Şifre burada açıkça görünür ve dilediğinizde değiştirebilirsiniz.">
        <div className="grid sm:grid-cols-2 gap-4">
          <FormInput label="Giriş E-postası" required type="email" value={f.portal_email} onChange={(v) => set({ portal_email: v })} />
          <FormInput label="Şifre (görünür)" required value={f.portal_password} onChange={(v) => set({ portal_password: v })} />
        </div>
      </FormSection>

      <FormSection title="Kredi (Aylık)" hint="Marka her ay bu kadar görsel üretebilir. Her üretim 1 kredi düşer; kredi her ay başında sıfırlanır.">
        <div className="grid sm:grid-cols-2 gap-4">
          <FormInput label="Aylık Kredi" type="number" value={f.credits_total} onChange={(v) => set({ credits_total: v })} />
          {f.id != null && (
            <FormInput label="Bu Ay Kullanılan (düzenlenebilir)" type="number" value={f.credits_used} onChange={(v) => set({ credits_used: v })} />
          )}
        </div>
      </FormSection>

      <div className="sticky bottom-0 -mx-6 -mb-6 px-6 py-4 bg-white border-t border-slate-200 flex justify-end">
        <button className="btn-primary" data-testid="brand-save-btn">Kaydet</button>
      </div>
    </form>
  );
}

function BrandUsage({ brand }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    api.get(`/admin/brands/${brand.id}/generations`).then((r) => setData(r.data)).catch(() => setData({ items: [], monthly_summary: [], total: 0 }));
  }, [brand.id]);

  if (!data) return <div className="text-sm text-[#334155]">Yükleniyor...</div>;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 p-4">
        <div className="text-xs font-bold uppercase tracking-[0.15em] text-[#2563EB] mb-3">Aylık Üretim Özeti</div>
        {data.monthly_summary.length === 0 ? (
          <p className="text-sm text-slate-500">Henüz üretim yapılmamış.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {data.monthly_summary.map((m) => (
              <div key={m.month} className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-sm">
                <span className="font-semibold text-[#07111F]">{m.month}</span>
                <span className="ml-2 text-[#2563EB] font-bold">{m.count}</span>
                <span className="text-slate-500"> görsel</span>
              </div>
            ))}
          </div>
        )}
        <p className="mt-3 text-xs text-slate-500">Faturalandırma için: ilgili ayda üretilen toplam görsel sayısını yukarıdan görebilirsiniz.</p>
      </div>

      <div>
        <div className="text-xs font-bold uppercase tracking-[0.15em] text-[#2563EB] mb-3">Üretim Geçmişi ({data.total})</div>
        {data.items.length === 0 ? (
          <p className="text-sm text-slate-500">Kayıt yok.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {data.items.map((g) => (
              <div key={g.id} className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="aspect-square overflow-hidden bg-slate-100">
                  <img src={g.image_url} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="p-2">
                  <p className="line-clamp-2 text-[11px] text-slate-600">{g.prompt}</p>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="uppercase">{g.format}</span>
                    <span>{new Date(g.created_at).toLocaleDateString("tr-TR")}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

