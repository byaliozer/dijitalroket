import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Loader2, Sparkles, LogOut, Download, Copy, Check, Wand2, Image as ImageIcon, History, Zap, RefreshCw,
} from "lucide-react";
import { useBrandAuth } from "../../context/BrandAuthContext";
import { brandApi, formatApiError } from "../../lib/api";

const FORMATS = [
  { id: "post", label: "Gönderi", dim: "1080 × 1350", ratio: "aspect-[4/5]" },
  { id: "story", label: "Hikâye", dim: "1080 × 1920", ratio: "aspect-[9/16]" },
];

const EDIT_SUGGESTIONS = ["Logoyu büyüt", "Logoyu küçült", "Yazıyı değiştir", "Daha minimal yap", "Renkleri canlandır", "Arka planı sadeleştir"];

export default function BrandPortal() {
  const { brand, loading, logout, setBrand, refresh } = useBrandAuth();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [format, setFormat] = useState("post");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);
  const [editText, setEditText] = useState("");
  const resultRef = useRef(null);

  const loadHistory = () => brandApi.get("/brand/generations").then((r) => setHistory(r.data)).catch(() => {});
  useEffect(() => { if (brand) loadHistory(); }, [brand]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#07111F] text-white/70">Yükleniyor...</div>;
  if (!brand) return <Navigate to="/firma/giris" replace />;

  const onLogout = () => { logout(); navigate("/firma/giris"); };

  const remaining = brand.credits_remaining ?? 0;

  const pollJob = (jobId, successLabel) => {
    const started = Date.now();
    const poll = async () => {
      try {
        const { data: job } = await brandApi.get(`/brand/generation/${jobId}`);
        if (job.status === "done") {
          setResult({ id: job.id, image_url: job.image_url, caption: job.caption, format: job.format, prompt: job.prompt });
          setEditText("");
          loadHistory();
          toast.success(successLabel);
          setBusy(false);
          setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
          return;
        }
        if (job.status === "failed") {
          toast.error(job.error || "İşlem başarısız oldu");
          refresh(); // backend refunds the credit on failure
          setBusy(false);
          return;
        }
        if (Date.now() - started > 240000) {
          toast.error("İşlem beklenenden uzun sürdü. Lütfen geçmişi birazdan kontrol edin.");
          refresh();
          setBusy(false);
          return;
        }
        setTimeout(poll, 3000);
      } catch {
        setTimeout(poll, 3000);
      }
    };
    setTimeout(poll, 3000);
  };

  const generate = async () => {
    if (!prompt.trim()) { toast.error("Lütfen bir görsel açıklaması yazın."); return; }
    if (remaining <= 0) { toast.error("Kredi yetersiz. Bu ay için üretim hakkınız doldu."); return; }
    setBusy(true);
    setResult(null);
    setCopied(false);
    try {
      const { data } = await brandApi.post("/brand/generate", { prompt: prompt.trim(), format });
      setBrand({ ...brand, credits_used: brand.credits_total - data.credits_remaining, credits_remaining: data.credits_remaining });
      pollJob(data.job_id, "Görsel üretildi");
    } catch (err) {
      const detail = formatApiError(err.response?.data?.detail);
      toast.error(detail || "Görsel üretilemedi");
      if (err.response?.status === 402) refresh();
      setBusy(false);
    }
  };

  const editImage = async (suggestion) => {
    if (!result?.id) return;
    const instruction = (suggestion || editText).trim();
    if (!instruction) { toast.error("Lütfen bir düzenleme isteği yazın."); return; }
    if (remaining <= 0) { toast.error("Kredi yetersiz. Bu ay için üretim hakkınız doldu."); return; }
    setBusy(true);
    setCopied(false);
    try {
      const { data } = await brandApi.post("/brand/edit", { source_id: result.id, instruction });
      setBrand({ ...brand, credits_used: brand.credits_total - data.credits_remaining, credits_remaining: data.credits_remaining });
      pollJob(data.job_id, "Görsel güncellendi");
    } catch (err) {
      const detail = formatApiError(err.response?.data?.detail);
      toast.error(detail || "Görsel düzenlenemedi");
      if (err.response?.status === 402) refresh();
      setBusy(false);
    }
  };

  const copyCaption = async (text) => {
    try { await navigator.clipboard.writeText(text || ""); setCopied(true); toast.success("Açıklama kopyalandı"); setTimeout(() => setCopied(false), 2000); }
    catch { toast.error("Kopyalanamadı"); }
  };

  const download = async (url, name) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = name || `dr-ai-${Date.now()}.png`;
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(a.href);
    } catch { toast.error("İndirilemedi"); }
  };

  const openHistoryItem = (h) => {
    setResult({ id: h.id, image_url: h.image_url, caption: h.caption, format: h.format, prompt: h.prompt });
    setEditText("");
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const activeRatio = FORMATS.find((f) => f.id === format)?.ratio || "aspect-[4/5]";

  return (
    <div className="min-h-screen bg-[#07111F] text-white">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#07111F]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {brand.logo_url ? (
              <img src={brand.logo_url} alt={brand.name} className="h-9 w-9 rounded-lg object-contain bg-white/10 p-1" />
            ) : (
              <div className="h-9 w-9 rounded-lg bg-[#2563EB] grid place-items-center"><Sparkles className="h-4 w-4" /></div>
            )}
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold" data-testid="brand-name">{brand.name}</div>
              <div className="text-[11px] text-[#22D3EE]">DR AI Image Engine 2.0</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div data-testid="brand-credits" className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold">
              <Zap className="h-3.5 w-3.5 text-[#22D3EE]" />
              <span className={remaining <= 0 ? "text-red-400" : "text-white"}>{remaining}</span>
              <span className="text-white/40">/ {brand.credits_total} kredi</span>
            </div>
            <button onClick={onLogout} data-testid="brand-logout" className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/70 hover:text-white hover:bg-white/5">
              <LogOut className="h-3.5 w-3.5" /> Çıkış
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">
        {/* Generator */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Wand2 className="h-4 w-4 text-[#22D3EE]" /> Yeni Görsel Üret
          </div>
          <p className="mt-1.5 text-xs text-white/50">Logonuz <span className="text-white/80">"{brand.logo_position}"</span> konumuna otomatik yerleştirilir.</p>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            data-testid="brand-prompt-input"
            placeholder="Örn: Yaz indirimi kampanyası, sıcak tonlar, modern tipografi, %50'ye varan indirim yazısı..."
            className="mt-4 w-full rounded-xl border border-white/10 bg-[#07111F] px-4 py-3 text-sm outline-none focus:border-[#22D3EE] resize-none placeholder-white/30"
          />

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {FORMATS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFormat(f.id)}
                  data-testid={`brand-format-${f.id}`}
                  className={`rounded-lg border px-3.5 py-2 text-xs font-medium transition ${
                    format === f.id ? "border-[#2563EB] bg-[#2563EB]/20 text-white" : "border-white/10 text-white/60 hover:bg-white/5"
                  }`}
                >
                  {f.label} <span className="text-white/40">· {f.dim}</span>
                </button>
              ))}
            </div>
            <button
              onClick={generate}
              disabled={busy || remaining <= 0}
              data-testid="brand-generate-btn"
              className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-semibold hover:bg-[#1d4ed8] transition disabled:opacity-50"
            >
              {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Üretiliyor...</> : <><Sparkles className="h-4 w-4" /> Görsel Üret (1 kredi)</>}
            </button>
          </div>
          {remaining <= 0 && (
            <div data-testid="brand-no-credit" className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">
              Bu ay için üretim krediniz doldu. Yeni kredi için Dijital Roket ekibiyle iletişime geçin.
            </div>
          )}
        </section>

        {/* Result */}
        {busy && (
          <div className="mt-8 grid place-items-center rounded-2xl border border-white/10 bg-white/[0.02] py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#22D3EE]" />
            <p className="mt-3 text-sm text-white/50">DR AI Image Engine 2.0 görselinizi hazırlıyor...</p>
            <p className="mt-1 text-xs text-white/30">Bu işlem 1-2 dakika sürebilir, lütfen sayfadan ayrılmayın.</p>
          </div>
        )}

        {result && !busy && (
          <section ref={resultRef} className="mt-8 grid gap-6 md:grid-cols-2" data-testid="brand-result">
            <div className={`overflow-hidden rounded-2xl border border-white/10 bg-black/30 ${FORMATS.find((f) => f.id === result.format)?.ratio || "aspect-[4/5]"} max-h-[70vh]`}>
              <img src={result.image_url} alt="Üretilen görsel" className="h-full w-full object-contain" />
            </div>
            <div className="flex flex-col">
              <div className="text-sm font-semibold flex items-center gap-2"><ImageIcon className="h-4 w-4 text-[#22D3EE]" /> Üretilen Açıklama</div>
              <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed text-white/85 whitespace-pre-wrap" data-testid="brand-caption">
                {result.caption || "Açıklama üretilemedi."}
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button onClick={() => copyCaption(result.caption)} data-testid="brand-copy-caption" className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm font-medium hover:bg-white/5">
                  {copied ? <><Check className="h-4 w-4 text-[#22D3EE]" /> Kopyalandı</> : <><Copy className="h-4 w-4" /> Açıklamayı Kopyala</>}
                </button>
                <button onClick={() => download(result.image_url, `dr-ai-${result.format}.png`)} data-testid="brand-download" className="inline-flex items-center gap-2 rounded-lg bg-[#22D3EE] px-4 py-2.5 text-sm font-semibold text-[#07111F] hover:bg-[#0ea5c4]">
                  <Download className="h-4 w-4" /> Görseli İndir
                </button>
              </div>

              {/* Edit / regenerate panel */}
              <div className="mt-5 border-t border-white/10 pt-4" data-testid="brand-edit-panel">
                <div className="text-xs font-semibold flex items-center gap-2 text-white/80"><Wand2 className="h-3.5 w-3.5 text-[#22D3EE]" /> Bu görseli düzenle / yeniden üret</div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {EDIT_SUGGESTIONS.map((s) => (
                    <button key={s} type="button" onClick={() => editImage(s)} data-testid={`brand-edit-suggestion-${s}`} className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-white/60 hover:text-white hover:border-[#22D3EE] transition">
                      {s}
                    </button>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); editImage(); } }}
                    data-testid="brand-edit-input"
                    placeholder="Örn: logoyu büyüt, yazıyı kaldır, daha minimal yap"
                    className="flex-1 rounded-lg border border-white/10 bg-[#07111F] px-3 py-2 text-sm outline-none focus:border-[#22D3EE] placeholder-white/30"
                  />
                  <button onClick={() => editImage()} data-testid="brand-edit-btn" className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold hover:bg-[#1d4ed8] whitespace-nowrap">
                    <RefreshCw className="h-4 w-4" /> Yeniden Üret
                  </button>
                </div>
                <p className="mt-1.5 text-[11px] text-white/30">Her düzenleme yeni bir görsel üretir ve 1 kredi kullanır.</p>
              </div>
            </div>
          </section>
        )}

        {/* History */}
        {history.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center gap-2 text-sm font-semibold text-white/80"><History className="h-4 w-4" /> Geçmiş Üretimler ({history.length})</div>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {history.map((h) => (
                <div key={h.id} onClick={() => openHistoryItem(h)} className="group cursor-pointer rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden hover:border-[#22D3EE]/50 transition" data-testid="brand-history-item">
                  <div className="aspect-square overflow-hidden bg-black/30">
                    <img src={h.image_url} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="p-3">
                    <p className="line-clamp-2 text-[11px] text-white/60">{h.prompt}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wide text-white/30">{h.format}</span>
                      <button onClick={(e) => { e.stopPropagation(); download(h.image_url, `dr-ai-${h.id}.png`); }} className="text-white/50 hover:text-[#22D3EE]" title="İndir"><Download className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
