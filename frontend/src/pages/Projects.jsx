import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import PageHero from "../components/PageHero";
import SEO from "../components/SEO";
import { api } from "../lib/api";
import FinalCta from "../sections/FinalCta";

const FILTERS = ["Tümü", "Kurumsal Web", "B2B", "AI", "Sosyal Medya", "Spor", "Eğitim", "Sağlık"];

export default function Projects() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("Tümü");

  useEffect(() => {
    api.get("/projects").then((r) => setItems(r.data)).catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    if (filter === "Tümü") return items;
    return items.filter((i) => (i.tags || []).some((t) => t.toLowerCase().includes(filter.toLowerCase())) || i.sector.toLowerCase().includes(filter.toLowerCase()));
  }, [items, filter]);

  return (
    <>
      <SEO
        title="Projeler | Dijital Roket DR AI Çalışmaları"
        description="Web, B2B, AI ve dijital dönüşüm projelerimizden seçtiğimiz vaka çalışmaları."
      />
      <PageHero
        eyebrow="DR AI Çalışmaları"
        title="Roketlediğimiz Projeler"
        subtitle="Fikirleri sadece tasarıma değil, çalışan dijital sistemlere dönüştürüyoruz."
      />

      <section className="section bg-white">
        <div className="container-x">
          <div className="flex flex-wrap gap-2" data-testid="project-filters">
            {FILTERS.map((f) => (
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
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#2563EB]">{it.sector}</span>
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
