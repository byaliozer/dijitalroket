import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  LayoutDashboard, Mail, FileText, FolderOpen, BookOpenText, LogOut, Trash2,
  Plus, Eye, X, ExternalLink,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { api, formatApiError } from "../../lib/api";
import Logo from "../../components/Logo";

const TABS = [
  { id: "overview", label: "Genel Bakış", icon: LayoutDashboard },
  { id: "contacts", label: "İletişim Talepleri", icon: Mail },
  { id: "requests", label: "Proje Brief'leri", icon: FileText },
  { id: "projects", label: "DR AI Çalışmaları", icon: FolderOpen },
  { id: "blog", label: "Blog Yazıları", icon: BookOpenText },
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
          {tab === "projects" && <ProjectsAdmin />}
          {tab === "blog" && <BlogAdmin />}
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

function ProjectsAdmin() {
  const [rows, setRows] = useState([]);
  const [edit, setEdit] = useState(null);
  const load = () => api.get("/admin/projects").then((r) => setRows(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);
  const del = async (id) => { if (!confirm("Silinsin mi?")) return; await api.delete(`/admin/projects/${id}`); toast.success("Silindi"); load(); };

  const save = async (form) => {
    try {
      const payload = { ...form, tags: form.tags ? form.tags.split(",").map((s) => s.trim()).filter(Boolean) : [] };
      if (form.id) await api.put(`/admin/projects/${form.id}`, payload);
      else await api.post("/admin/projects", payload);
      toast.success("Kaydedildi"); setEdit(null); load();
    } catch (err) { toast.error(formatApiError(err.response?.data?.detail)); }
  };

  return (
    <div>
      <div className="mb-5 flex justify-end">
        <button onClick={() => setEdit({ slug: "", title: "", client: "", sector: "", tags: "", need: "", solution: "", result: "", cover_image: "", published: true })} className="btn-primary py-2 text-sm">
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
            <button onClick={() => setEdit({ ...r, tags: (r.tags || []).join(", ") })} className="p-2 rounded hover:bg-slate-100"><Eye className="h-4 w-4" /></button>
            <button onClick={() => del(r.id)} className="p-2 rounded hover:bg-red-50 text-red-600"><Trash2 className="h-4 w-4" /></button>
          </>
        )}
      />
      {edit && <Modal onClose={() => setEdit(null)} title={edit.id ? "Projeyi Düzenle" : "Yeni Proje"}>
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
        <button onClick={() => setEdit({ slug: "", title: "", excerpt: "", content: "", category: "", cover_image: "", read_time: 5, published: true })} className="btn-primary py-2 text-sm">
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
      {edit && <Modal onClose={() => setEdit(null)} title={edit.id ? "Yazıyı Düzenle" : "Yeni Yazı"}>
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
                    {c.render ? c.render(r[c.key]) : (r[c.key] || "-")}
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

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
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

function ProjectForm({ initial, onSubmit }) {
  const [f, setF] = useState(initial);
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(f); }} className="space-y-4">
      <FormInput label="Slug" required value={f.slug} onChange={(v) => setF({ ...f, slug: v })} />
      <FormInput label="Başlık" required value={f.title} onChange={(v) => setF({ ...f, title: v })} />
      <div className="grid sm:grid-cols-2 gap-4">
        <FormInput label="Müşteri" value={f.client} onChange={(v) => setF({ ...f, client: v })} />
        <FormInput label="Sektör" value={f.sector} onChange={(v) => setF({ ...f, sector: v })} />
      </div>
      <FormInput label="Etiketler (virgülle)" value={f.tags} onChange={(v) => setF({ ...f, tags: v })} />
      <FormInput label="Kapak Görsel URL" value={f.cover_image} onChange={(v) => setF({ ...f, cover_image: v })} />
      <FormTextarea label="İhtiyaç" value={f.need} onChange={(v) => setF({ ...f, need: v })} />
      <FormTextarea label="Çözüm" value={f.solution} onChange={(v) => setF({ ...f, solution: v })} />
      <FormTextarea label="Sonuç" value={f.result} onChange={(v) => setF({ ...f, result: v })} />
      <button className="btn-primary">Kaydet</button>
    </form>
  );
}

function BlogForm({ initial, onSubmit }) {
  const [f, setF] = useState(initial);
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(f); }} className="space-y-4">
      <FormInput label="Slug" required value={f.slug} onChange={(v) => setF({ ...f, slug: v })} />
      <FormInput label="Başlık" required value={f.title} onChange={(v) => setF({ ...f, title: v })} />
      <FormInput label="Kategori" value={f.category} onChange={(v) => setF({ ...f, category: v })} />
      <FormInput label="Kapak Görsel URL" value={f.cover_image} onChange={(v) => setF({ ...f, cover_image: v })} />
      <div className="grid sm:grid-cols-2 gap-4">
        <FormInput label="Okuma Süresi (dk)" type="number" value={f.read_time} onChange={(v) => setF({ ...f, read_time: v })} />
        <label className="flex items-center gap-2 mt-7">
          <input type="checkbox" checked={!!f.published} onChange={(e) => setF({ ...f, published: e.target.checked })} />
          <span className="text-sm">Yayında</span>
        </label>
      </div>
      <FormTextarea label="Özet" value={f.excerpt} onChange={(v) => setF({ ...f, excerpt: v })} />
      <FormTextarea label="İçerik" rows={10} value={f.content} onChange={(v) => setF({ ...f, content: v })} />
      <button className="btn-primary">Kaydet</button>
    </form>
  );
}

function FormInput({ label, value, onChange, type = "text", required }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-[#07111F] mb-1">{label}{required && " *"}</span>
      <input type={type} required={required} value={value || ""} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#2563EB]" />
    </label>
  );
}
function FormTextarea({ label, value, onChange, rows = 3 }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-[#07111F] mb-1">{label}</span>
      <textarea rows={rows} value={value || ""} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#2563EB] resize-none" />
    </label>
  );
}
