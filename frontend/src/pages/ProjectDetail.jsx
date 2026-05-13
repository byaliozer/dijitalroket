import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "../lib/api";
import SEO from "../components/SEO";
import FinalCta from "../sections/FinalCta";

/**
 * Lightweight markdown renderer for project content.
 * Splits by lines, groups consecutive paragraph lines / bullet lines.
 * Supports: ## H2, ### H3, **bold**, > quote, - bullets.
 */
function renderMarkdown(md) {
  if (!md) return null;
  const lines = md.split(/\r?\n/);
  const out = [];
  let paraBuf = [];
  let listBuf = [];

  const flushPara = () => {
    if (paraBuf.length) {
      const text = paraBuf.join(" ").trim();
      if (text) {
        out.push(
          <p key={`p-${out.length}`} className="mt-4 text-[16px] sm:text-[17px] leading-[1.85] text-[#334155]">
            {inline(text)}
          </p>
        );
      }
      paraBuf = [];
    }
  };
  const flushList = () => {
    if (listBuf.length) {
      out.push(
        <ul key={`ul-${out.length}`} className="mt-3 mb-3 space-y-2 list-disc pl-6 text-[#334155]">
          {listBuf.map((l, i) => (
            <li key={i} className="leading-relaxed text-[16px]">{inline(l)}</li>
          ))}
        </ul>
      );
      listBuf = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { flushPara(); flushList(); continue; }
    if (line.startsWith("## ")) {
      flushPara(); flushList();
      out.push(
        <h2 key={`h2-${out.length}`} className="mt-12 mb-3 font-heading text-2xl sm:text-3xl font-bold text-[#07111F]">
          {line.slice(3).trim()}
        </h2>
      );
      continue;
    }
    if (line.startsWith("### ")) {
      flushPara(); flushList();
      out.push(
        <h3 key={`h3-${out.length}`} className="mt-8 mb-2 font-heading text-lg sm:text-xl font-semibold text-[#07111F]">
          {line.slice(4).trim()}
        </h3>
      );
      continue;
    }
    if (line.startsWith("> ")) {
      flushPara(); flushList();
      out.push(
        <blockquote key={`q-${out.length}`} className="my-6 border-l-4 border-[#2563EB] bg-[#F8FAFC] px-6 py-4 rounded-r-xl">
          <p className="text-[#07111F] italic leading-relaxed">{inline(line.slice(2))}</p>
        </blockquote>
      );
      continue;
    }
    if (line.startsWith("- ")) {
      flushPara();
      listBuf.push(line.slice(2));
      continue;
    }
    flushList();
    paraBuf.push(line);
  }
  flushPara(); flushList();
  return out;
}

// inline: **bold** -> <strong>
function inline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={i} className="font-semibold text-[#07111F]">{p.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [err, setErr] = useState("");
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    api.get(`/projects/${slug}`).then((r) => setItem(r.data)).catch(() => setErr("Proje bulunamadı"));
  }, [slug]);

  if (err) {
    return (
      <div className="container-x py-32 text-center">
        <h1 className="h2-section">Proje bulunamadı</h1>
        <Link to="/projeler" className="mt-6 inline-flex btn-secondary">Projelere dön</Link>
      </div>
    );
  }
  if (!item) return <div className="container-x py-32 text-center text-[#334155]">Yükleniyor...</div>;

  const gallery = item.gallery || [];

  return (
    <>
      <SEO title={`${item.title} | Dijital Roket`} description={item.need} />
      <section className="relative overflow-hidden bg-[#07111F] text-white">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute -top-20 left-1/4 h-[420px] w-[420px] rounded-full bg-[#2563EB]/25 blur-[120px]" />
        <div className="container-x relative pt-24 pb-16">
          <Link to="/projeler" className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Tüm Projeler
          </Link>
          <span className="mt-6 eyebrow-light">{item.sector}</span>
          <h1 className="mt-3 h1-display text-white max-w-4xl">{item.title}</h1>
          <div className="mt-4 flex flex-wrap gap-2">
            {(item.tags || []).map((t) => (
              <span key={t} className="rounded-md border border-white/15 bg-white/5 px-2.5 py-1 text-xs uppercase tracking-wide text-white/70">{t}</span>
            ))}
          </div>
          {item.external_url && (
            <a
              href={item.external_url}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 backdrop-blur px-4 py-2 text-sm text-white hover:bg-white/10 transition"
            >
              <ExternalLink className="h-3.5 w-3.5" /> {item.external_url.replace(/^https?:\/\//, "")}
            </a>
          )}
        </div>
      </section>

      {item.cover_image && (
        <div className="container-x -mt-10">
          <img
            src={item.cover_image}
            alt={item.title}
            className="rounded-2xl border border-slate-200 shadow-xl w-full h-[280px] sm:h-[460px] object-cover bg-[#07111F]"
          />
        </div>
      )}

      {/* Summary cards */}
      <section className="pt-16 pb-8 bg-white">
        <div className="container-x grid gap-6 lg:grid-cols-3">
          {[
            { label: "İhtiyaç", body: item.need },
            { label: "Çözüm", body: item.solution },
            { label: "Sonuç", body: item.result },
          ].map((b) => (
            <div key={b.label} className="card-elevate p-7">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#2563EB]">{b.label}</div>
              <p className="mt-3 text-[15px] leading-relaxed text-[#334155]">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Full content */}
      {item.content && (
        <article className="pb-12 bg-white">
          <div className="container-x max-w-3xl">{renderMarkdown(item.content)}</div>
        </article>
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="pb-20 bg-white" data-testid="project-gallery">
          <div className="container-x">
            <div className="max-w-3xl mb-10">
              <span className="eyebrow">Proje Galerisi</span>
              <h2 className="mt-3 font-heading text-2xl sm:text-3xl font-bold text-[#07111F]">
                Çalışmadan Kareler
              </h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((g, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: (i % 3) * 0.06 }}
                  onClick={() => setLightbox(g)}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-[#F8FAFC] aspect-[4/3] text-left"
                  data-testid={`gallery-item-${i}`}
                >
                  <img
                    src={g.url}
                    alt={g.caption || `${item.title} - görsel ${i + 1}`}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {g.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#07111F]/90 via-[#07111F]/50 to-transparent p-4">
                      <p className="text-sm font-medium text-white leading-snug">{g.caption}</p>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="container-x mb-16 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-3xl border border-slate-200 bg-[#F8FAFC] p-8">
        <div>
          <h3 className="h3-card">Benzer bir proje sizin için de mümkün.</h3>
          <p className="mt-2 text-sm text-[#334155]">Bu vakaya benzer bir ihtiyaç için kapsam sohbeti planlayalım.</p>
        </div>
        <Link to="/proje-talep" className="btn-primary">Projemi Analiz Edin <ArrowRight className="h-4 w-4" /></Link>
      </div>

      <FinalCta />

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setLightbox(null)}
          data-testid="gallery-lightbox"
        >
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.url} alt={lightbox.caption} className="w-full max-h-[80vh] object-contain rounded-xl" />
            {lightbox.caption && (
              <p className="mt-4 text-center text-sm text-white/80">{lightbox.caption}</p>
            )}
            <button
              onClick={() => setLightbox(null)}
              className="mt-3 mx-auto block text-xs text-white/60 hover:text-white"
            >
              Kapatmak için herhangi bir yere tıklayın
            </button>
          </div>
        </div>
      )}
    </>
  );
}
