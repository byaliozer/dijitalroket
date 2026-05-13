import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock } from "lucide-react";
import { api } from "../lib/api";

export default function BlogTeasers() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    api.get("/blog?limit=3").then((r) => setItems(r.data)).catch(() => {});
  }, []);

  if (!items.length) return null;

  return (
    <section className="section bg-[#F8FAFC]" data-testid="blog-teasers">
      <div className="container-x">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="max-w-xl">
            <span className="eyebrow">İçgörüler</span>
            <h2 className="mt-3 h2-section">Dijital Dönüşüm Bloğu</h2>
            <p className="mt-5 body-lg">
              Kurumsal web, B2B sistemler, CRM, AI üretimi ve dijital dönüşüm üzerine güncel içgörüler.
            </p>
          </div>
          <Link to="/blog" data-testid="blog-view-all" className="btn-secondary">
            Tüm Yazılar <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="card-elevate overflow-hidden"
              data-testid={`blog-card-${p.slug}`}
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
                  <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {p.read_time} dk okuma</span>
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
  );
}
