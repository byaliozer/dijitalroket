import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { api } from "../lib/api";

export default function CaseStudiesSection({ limit = 4, withHeading = true }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/projects").then((r) => setItems(r.data.slice(0, limit))).catch(() => {});
  }, [limit]);

  return (
    <section className="section bg-white" data-testid="case-studies-section">
      <div className="container-x">
        {withHeading && (
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div className="max-w-2xl">
              <span className="eyebrow">Vaka Çalışmaları</span>
              <h2 className="mt-3 h2-section">Roketlediğimiz Projeler</h2>
              <p className="mt-5 body-lg">
                Fikirleri sadece tasarıma değil, çalışan dijital sistemlere dönüştürüyoruz.
              </p>
            </div>
            <Link to="/projeler" data-testid="case-studies-view-all" className="btn-secondary">
              Tümünü Gör <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {items.map((it, i) => (
            <motion.article
              key={it.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card-elevate overflow-hidden flex flex-col"
              data-testid={`case-card-${it.slug}`}
            >
              {it.cover_image && (
                <div className="relative h-48 overflow-hidden bg-[#F4FAF7]">
                  <img src={it.cover_image} alt={it.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F1A]/40 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                    {(it.tags || []).slice(0, 3).map((t) => (
                      <span key={t} className="rounded-md bg-white/90 backdrop-blur px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#0A1F1A]">{t}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="p-7 flex-1 flex flex-col">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#059669]">{it.sector}</div>
                <h3 className="mt-2 h3-card">{it.title}</h3>
                <dl className="mt-5 space-y-3 text-sm">
                  <div>
                    <dt className="font-semibold text-[#0A1F1A]">İhtiyaç</dt>
                    <dd className="text-[#334155] mt-0.5">{it.need}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-[#0A1F1A]">Çözüm</dt>
                    <dd className="text-[#334155] mt-0.5">{it.solution}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-[#0A1F1A]">Sonuç</dt>
                    <dd className="text-[#334155] mt-0.5">{it.result}</dd>
                  </div>
                </dl>
                <Link to={`/projeler/${it.slug}`} className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#059669] hover:gap-2.5 transition-all">
                  Vakayı incele <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
