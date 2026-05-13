import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Layers, Cpu, Zap } from "lucide-react";

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

export default function Hero() {
  return (
    <section
      data-testid="hero-section"
      className="relative overflow-hidden bg-[#0A1F1A] text-white"
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
        <div className="absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full bg-[#059669]/30 blur-[120px] animate-orb-move" />
        <div className="absolute top-40 -right-32 h-[420px] w-[420px] rounded-full bg-[#34D399]/25 blur-[120px] animate-orb-move" style={{ animationDelay: "4s" }} />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-b from-transparent to-[#0A1F1A]" />
      </div>

      <div className="container-x relative pt-24 pb-24 sm:pt-32 sm:pb-32 lg:pt-40 lg:pb-32 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#34D399] backdrop-blur"
            data-testid="hero-badge"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#34D399] animate-pulse" />
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
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#059669]/30 to-[#34D399]/30 border border-white/10">
                  <m.icon className="h-4 w-4 text-[#34D399]" />
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
          <div className="relative animate-float">
            <div className="absolute -inset-8 rounded-3xl bg-gradient-to-br from-[#059669]/20 via-[#34D399]/10 to-transparent blur-2xl" />
            <div className="relative rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-xl shadow-2xl">
              <img src={DASHBOARD_MOCKUP} alt="DR AI Dashboard" className="rounded-xl w-full" />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden md:flex items-center gap-3 rounded-xl bg-[#0A1F1A]/80 border border-white/10 backdrop-blur-xl px-4 py-3 shadow-2xl">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#059669] to-[#34D399]">
                <Sparkles className="h-4 w-4 text-white" />
              </span>
              <div className="leading-tight">
                <div className="text-xs text-white/50">DR AI</div>
                <div className="text-sm font-semibold">Işık Hızında Üretime<br/>Her Zaman Hazır</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
