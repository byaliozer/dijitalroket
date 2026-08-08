import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, ArrowUpRight } from "lucide-react";
import PageHero from "../components/PageHero";
import SEO from "../components/SEO";
import { api } from "../lib/api";

export default function Blog() {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState("Tümü");
  useEffect(() => { api.get("/blog").then((r) => setItems(r.data)).catch(() => {}); }, []);

  const categories = useMemo(() => {
    const set = [];
    items.forEach((p) => { if (p.category && !set.includes(p.category)) set.push(p.category); });
    return ["Tümü", ...set];
  }, [items]);

  const filtered = active === "Tümü" ? items : items.filter((p) => p.category === active);

  return (
    <>
      <SEO page="blog" />
      <PageHero eyebrow="İçgörüler" title="Dijital Dönüşüm Blogu" subtitle="Kurumsal web, B2B, CRM ve AI üretimi üzerine düşünceler." />
      <section className="section bg-white">
        <div className="container-x">
          {categories.length > 1 && (
            <div className="mb-10 flex flex-wrap gap-2" data-testid="blog-category-filters">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setActive(c)}
                  data-testid={`blog-filter-${c === "Tümü" ? "all" : c}`}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    active === c
                      ? "border-[#2563EB] bg-[#2563EB] text-white"
                      : "border-slate-200 bg-[#F8FAFC] text-[#334155] hover:border-[#2563EB]/40 hover:text-[#07111F]"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.06 }}
              className="card-elevate overflow-hidden"
              data-testid={`blog-list-${p.slug}`}
            >
              {p.cover_image && (
                <div className="h-44 overflow-hidden bg-slate-100">
                  <img src={p.cover_image} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                </div>
              )}
              <div className="p-6">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#2563EB]">{p.category}</span>
                <h3 className="mt-2 font-heading text-lg font-semibold text-[#07111F] leading-snug">{p.title}</h3>
                <p className="mt-2 text-sm text-[#334155] leading-relaxed line-clamp-3">{p.excerpt}</p>
                <div className="mt-5 flex items-center justify-between text-xs text-[#334155]/70">
                  <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {p.read_time} dk</span>
                  <Link to={`/blog/${p.slug}`} className="font-semibold text-[#2563EB] inline-flex items-center gap-1 hover:gap-1.5 transition-all">
                    Devamını oku <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
          </div>
        </div>
      </section>
    </>
  );
}
