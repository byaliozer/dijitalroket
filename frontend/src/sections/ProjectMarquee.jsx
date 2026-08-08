import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

export default function ProjectMarquee() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/projects").then((r) => {
      const all = r.data || [];
      const featured = all.filter((p) => p.featured);
      setItems(featured.length ? featured : all);
    }).catch(() => {});
  }, []);

  if (!items.length) return null;
  const loop = [...items, ...items];
  const duration = Math.max(items.length * 6, 24);

  return (
    <section className="bg-[#07111F] border-y border-white/5 py-8 overflow-hidden" data-testid="project-marquee">
      <style>{`
        @keyframes dr-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .dr-marquee-track { animation: dr-marquee linear infinite; width: max-content; }
        .dr-marquee-wrap:hover .dr-marquee-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) { .dr-marquee-track { animation: none; } }
      `}</style>
      <div className="container-x mb-5 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#22D3EE]">
          Öne Çıkan Projeler
        </span>
        <span className="hidden sm:block text-[11px] text-white/30">Durdurmak için üzerine gelin</span>
      </div>
      <div className="dr-marquee-wrap relative">
        <div className="dr-marquee-track flex gap-4 px-6" style={{ animationDuration: `${duration}s` }}>
          {loop.map((p, i) => (
            <Link
              key={i}
              to={`/projeler/${p.slug}`}
              aria-hidden={i >= items.length ? "true" : undefined}
              tabIndex={i >= items.length ? -1 : undefined}
              className="relative w-64 shrink-0 rounded-xl overflow-hidden border border-white/10 bg-white/5 transition hover:border-[#22D3EE]/40 hover:-translate-y-0.5"
              data-testid={`marquee-item-${i}`}
            >
              <div className="relative h-32 overflow-hidden bg-[#0B1728]">
                {p.cover_image && (
                  <img src={p.cover_image} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#07111F] via-[#07111F]/20 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-[#22D3EE]">{p.sector}</div>
                  <div className="text-sm font-semibold text-white leading-snug line-clamp-1">{p.title}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
