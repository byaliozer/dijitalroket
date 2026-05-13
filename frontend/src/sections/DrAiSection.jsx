import { motion } from "framer-motion";
import { Search, Compass, Cpu, ShieldCheck, Rocket, TrendingUp } from "lucide-react";

const AI_BG = "https://static.prod-images.emergentagent.com/jobs/4563ce39-d136-4158-943b-98a85fea66a9/images/b3ed469b8f79e4ebb595fdbbb94870e861a74cd69547ee02c1fbeb9b6c4293d4.png";

const STEPS = [
  { icon: Search, num: "01", title: "Analiz", desc: "Şirketinizin ihtiyacını, hedefini ve mevcut sürecini inceleriz." },
  { icon: Compass, num: "02", title: "Planlama", desc: "Kullanıcı rolleri, sayfalar, modüller ve iş akışlarını çıkarırız." },
  { icon: Cpu, num: "03", title: "Üretim", desc: "DR AI destekli modelimizle tasarım, içerik, panel ve görsel üretimini hızlandırırız." },
  { icon: ShieldCheck, num: "04", title: "Test", desc: "Kullanıcı deneyimi, mobil uyumluluk ve temel güvenlik kontrollerini yaparız." },
  { icon: Rocket, num: "05", title: "Yayın", desc: "Projeyi canlıya alır, teslim ve eğitim sürecini tamamlarız." },
  { icon: TrendingUp, num: "06", title: "Gelişim", desc: "Yeni ihtiyaçlara göre sistemi büyütmeye devam ederiz." },
];

export default function DrAiSection() {
  return (
    <section className="section relative overflow-hidden bg-[#0A1F1A] text-white" data-testid="dr-ai-section">
      <div className="absolute inset-0">
        <img src={AI_BG} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-screen" />
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute top-20 right-1/4 h-[360px] w-[360px] rounded-full bg-[#7C3AED]/20 blur-[140px]" />
        <div className="absolute bottom-20 left-1/4 h-[360px] w-[360px] rounded-full bg-[#34D399]/15 blur-[140px]" />
      </div>

      <div className="container-x relative">
        <div className="max-w-3xl">
          <span className="eyebrow-light">DR AI Üretim Sistemi</span>
          <h2 className="mt-3 font-heading font-bold tracking-tight text-3xl sm:text-4xl lg:text-5xl text-white">
            Daha Hızlı, Daha Akıllı,<br />
            <span className="text-gradient">Daha Ölçeklenebilir Projeler</span>
          </h2>
          <p className="mt-5 text-base sm:text-lg leading-relaxed text-white/70 max-w-2xl">
            DR AI, Dijital Roket'in proje geliştirme süreçlerini hızlandıran yapay zeka destekli üretim modelidir.
            Fikir aşamasından çalışan ürüne kadar; analiz, arayüz, içerik, görsel, kullanıcı deneyimi, panel yapısı ve
            dijital akışlar daha hızlı planlanır, üretilir ve yayına hazırlanır.
          </p>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group relative rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl transition-all duration-300 hover:bg-white/[0.06] hover:border-[#34D399]/30 hover:-translate-y-1"
              data-testid={`ai-step-${i}`}
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#059669]/30 to-[#34D399]/30 border border-white/10">
                  <s.icon className="h-5 w-5 text-[#34D399]" />
                </span>
                <span className="text-xs font-mono text-white/30">{s.num}</span>
              </div>
              <h3 className="mt-5 font-heading text-xl font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{s.desc}</p>
              <div className="mt-6 h-px bg-gradient-to-r from-[#34D399]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
