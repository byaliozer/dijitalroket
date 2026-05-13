import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, ArrowUpRight } from "lucide-react";
import PageHero from "../components/PageHero";
import SEO from "../components/SEO";
import { api } from "../lib/api";

export default function Blog() {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get("/blog").then((r) => setItems(r.data)).catch(() => {}); }, []);
  return (
    <>
      <SEO title="Blog | Dijital Roket İçgörüler" description="Dijital dönüşüm, AI, kurumsal web, B2B sistemler ve CRM üzerine içgörüler." />
      <PageHero eyebrow="İçgörüler" title="Dijital Dönüşüm Blogu" subtitle="Kurumsal web, B2B, CRM ve AI üretimi üzerine düşünceler." />
      <section className="section bg-white">
        <div className="container-x grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => (
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
      </section>
    </>
  );
}
