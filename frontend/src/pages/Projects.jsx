import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock } from "lucide-react";
import PageHero from "../components/PageHero";
import SEO from "../components/SEO";
import { api } from "../lib/api";
import FinalCta from "../sections/FinalCta";

export default function Projects() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("Tümü");

  useEffect(() => {
    api.get("/projects").then((r) => setItems(r.data)).catch(() => {});
  }, []);

  // Build filter chips dynamically from each project's "Sektör" (sector) value
  const filters = useMemo(() => {
    const seen = [];
    for (const it of items) {
      const s = (it.sector || "").trim();
      if (s && !seen.some((x) => x.toLowerCase() === s.toLowerCase())) seen.push(s);
    }
    return ["Tümü", ...seen];
  }, [items]);

  const filtered = useMemo(() => {
    if (filter === "Tümü") return items;
    return items.filter((i) => (i.sector || "").trim().toLowerCase() === filter.toLowerCase());
  }, [items, filter]);

  return (
    <>
      <SEO
        title="Dijital Roket Projeleri | Web, Yazılım, B2B & AI"
        description="Dijital Roket tarafından geliştirilen kurumsal web sitelerini, B2B sistemlerini, özel yazılım projelerini, yönetim panellerini ve dijital dönüşüm çalışmalarını inceleyin."
      />
      <PageHero
        eyebrow="DR AI Çalışmaları"
        title="Dijital Roket Projeleri"
        subtitle="Fikirleri sadece tasarıma değil, çalışan dijital sistemlere dönüştürüyoruz."
      />

      <section className="section bg-white">
        <div className="container-x">
          <div className="flex flex-wrap gap-2" data-testid="project-filters">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                data-testid={`project-filter-${f}`}
                className={`rounded-full px-4 py-2 text-sm font-medium border transition ${
                  filter === f
                    ? "bg-[#07111F] border-[#07111F] text-white"
                    : "bg-white border-slate-200 text-[#334155] hover:border-[#2563EB]/40"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((it, i) => (
              <motion.article
                key={it.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.06 }}
                className="card-elevate overflow-hidden"
                data-testid={`project-card-${it.slug}`}
              >
                {it.cover_image && (
                  <div className="h-44 overflow-hidden bg-slate-100">
                    <img src={it.cover_image} alt={it.title} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#2563EB]">{it.sector}</span>
                    {it.duration_days ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#22D3EE]/10 px-2.5 py-1 text-[11px] font-semibold text-[#0E7490]" data-testid={`project-duration-${it.slug}`}>
                        <Clock className="h-3 w-3" /> {it.duration_days} günde geliştirildi
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-2 font-heading text-lg font-semibold text-[#07111F] leading-snug">{it.title}</h3>
                  <p className="mt-2 text-sm text-[#334155] leading-relaxed line-clamp-2">{it.need}</p>
                  <Link to={`/projeler/${it.slug}`} className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#2563EB] hover:gap-2 transition-all">
                    Projeyi incele <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.article>
            ))}
            {!filtered.length && <div className="text-sm text-[#334155]">Bu kategori için içerik henüz eklenmedi.</div>}
          </div>
        </div>
      </section>
      <FinalCta />
    </>
  );
}
