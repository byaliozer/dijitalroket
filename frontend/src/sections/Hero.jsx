import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Layers, Cpu, Zap, Clock, ArrowUpRight } from "lucide-react";
import { api } from "../lib/api";

const HERO_BG = "https://static.prod-images.emergentagent.com/jobs/4563ce39-d136-4158-943b-98a85fea66a9/images/0c107f763e768d30c0b3ee5f6ce696642c4455d1ca466a00b36446cf22b3f389.png";
const DASHBOARD_MOCKUP = "https://static.prod-images.emergentagent.com/jobs/4563ce39-d136-4158-943b-98a85fea66a9/images/e4e280432bf2c274958cd8cce8cc9f2b90889996c11e6f863d26e6b7cdfe661d.png";

const METRICS = [
  { icon: Zap, text: "1 günde yayına alınabilen kurumsal web site hizmeti. Üstelik tasarım ve yazılımda SINIRSIZ değişiklik hakkına sahipsiniz." },
  { icon: Cpu, text: "İstediğiniz herhangi bir projenin prototipini aynı gün hazırlayıp sunabiliriz." },
  { icon: Sparkles, text: "Şirketinizin verimliliğini artıracak, tasarruf etmenizi sağlayacak yazılımlara 1 günde ulaşabilirsiniz." },
  { icon: Layers, text: "Şirketinizin Web sitesi + Şirket İçi Yönetim Paneli + Otomasyonlar + Müşteri Panelleri ve daha fazlasını tek çatı altında topluyoruz. Evet, yine IŞIK HIZINDA!" },
];

// Wraps key phrases with an orange accent span.
function highlight(text) {
  const parts = text.split(/(IŞIK HIZINDA|SINIRSIZ)/g);
  return parts.map((p, idx) =>
    p === "IŞIK HIZINDA" || p === "SINIRSIZ" ? (
      <span key={idx} className="font-semibold text-[#F97316]">{p}</span>
    ) : (
      <span key={idx}>{p}</span>
    )
  );
}

function HeroShowcase() {
  const [items, setItems] = useState([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    api.get("/projects").then((r) => {
      const all = r.data || [];
      const featured = all.filter((p) => p.featured);
      setItems((featured.length ? featured : all).slice(0, 8));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (items.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % items.length), 4200);
    return () => clearInterval(t);
  }, [items.length]);

  // Fallback to the static mockup if there are no projects yet
  if (!items.length) {
    return (
      <div className="relative animate-float">
        <div className="absolute -inset-8 rounded-3xl bg-gradient-to-br from-[#2563EB]/20 via-[#22D3EE]/10 to-transparent blur-2xl" />
        <div className="relative rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-xl shadow-2xl">
          <img src={DASHBOARD_MOCKUP} alt="DR AI Dashboard" className="rounded-xl w-full" />
        </div>
      </div>
    );
  }

  const p = items[idx];

  return (
    <div className="relative animate-float" data-testid="hero-project-showcase">
      <div className="absolute -inset-8 rounded-3xl bg-gradient-to-br from-[#2563EB]/20 via-[#22D3EE]/10 to-transparent blur-2xl" />
      <div className="relative rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-xl shadow-2xl">
        <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#07111F]/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#22D3EE] backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-[#22D3EE] animate-pulse" /> Son Projelerimiz
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={p.slug}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.6 }}
          >
            <Link to={`/projeler/${p.slug}`} data-testid="hero-project-link" className="block group">
              <div className="relative h-56 sm:h-64 overflow-hidden rounded-xl bg-[#0B1728]">
                {p.cover_image ? (
                  <img src={p.cover_image} alt={p.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full items-center justify-center text-white/30">Görsel yok</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#07111F] via-[#07111F]/30 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-5">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#22D3EE]">
                    <span>{p.sector}</span>
                    {p.duration_days ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-white/80">
                        <Clock className="h-3 w-3" /> {p.duration_days} günde
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-1.5 font-heading text-lg font-bold text-white leading-snug line-clamp-2">{p.title}</h3>
                  <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-white/90 group-hover:gap-2 transition-all">
                    Projeyi incele <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
      {items.length > 1 && (
        <div className="mt-4 flex justify-center gap-1.5" data-testid="hero-showcase-dots">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Proje ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === idx ? "w-6 bg-[#22D3EE]" : "w-1.5 bg-white/25 hover:bg-white/40"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Hero() {
  return (
    <section
      data-testid="hero-section"
      className="relative overflow-hidden bg-[#07111F] text-white"
    >
      {/* Background layers */}
      <div className="absolute inset-0">
        <img
          src={HERO_BG}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="absolute inset-0 bg-hero-radial" />
        <div className="absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full bg-[#2563EB]/30 blur-[120px] animate-orb-move" />
        <div className="absolute top-40 -right-32 h-[420px] w-[420px] rounded-full bg-[#22D3EE]/25 blur-[120px] animate-orb-move" style={{ animationDelay: "4s" }} />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-b from-transparent to-[#07111F]" />
      </div>

      <div className="container-x relative pt-24 pb-24 sm:pt-32 sm:pb-32 lg:pt-40 lg:pb-32 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#22D3EE] backdrop-blur"
            data-testid="hero-badge"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#22D3EE] animate-pulse" />
            Dijital Roket Patentli Yapay Zeka Sistemi · DR AI
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-6 h1-display text-white"
            data-testid="hero-title"
          >
            Şirketinizin İhtiyaçlarını <span className="text-gradient">DR AI</span> sayesinde{" "}
            <span className="text-[#F97316] drop-shadow-[0_0_25px_rgba(249,115,22,0.45)]">IŞIK HIZINDA</span> hayata geçiriyoruz.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-white/70"
          >
            Şaka yapmıyoruz. İstediğiniz herhangi bir web sitesini, şirketinize özel paneller, iş akışları, verimlilik
            artırma, B2B/B2C sistemler, CRM gibi iş takip araçları, kurumunuzun sosyal medya yönetimi ve aklınıza
            gelebilecek bütün projeleri <span className="font-semibold text-[#F97316]">IŞIK HIZINDA</span> hayata
            geçirebiliyoruz.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-3 text-sm text-white/55 max-w-2xl"
          >
            Mesela B2B sistemlerini size özel geliştirmek için ajanslar en az 3-4 ay süre verirken biz Patentli DR AI
            teknolojimiz sayesinde <span className="font-semibold text-[#F97316]">2 günde</span> teslim edebiliyoruz.
            Üstelik <span className="font-semibold text-white">SINIRSIZ değişiklik</span> hakkına sahipsiniz.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8 flex flex-col sm:flex-row gap-3"
          >
            <Link to="/proje-talep" data-testid="hero-cta-primary" className="btn-primary animate-glow-pulse">
              Projemi Analiz Edin
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/kurumsal-cozumler" data-testid="hero-cta-secondary" className="btn-ghost-dark">
              Kurumsal Çözümleri İnceleyin
            </Link>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl"
            data-testid="hero-metrics"
          >
            {METRICS.map((m, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3.5 backdrop-blur">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#2563EB]/30 to-[#22D3EE]/30 border border-white/10">
                  <m.icon className="h-4 w-4 text-[#22D3EE]" />
                </span>
                <span className="text-sm text-white/80 leading-snug">{highlight(m.text)}</span>
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="lg:col-span-5 relative"
          data-testid="hero-mockup"
        >
          <HeroShowcase />
        </motion.div>
      </div>
    </section>
  );
}
