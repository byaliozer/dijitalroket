import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Zap, ArrowRight, Sparkles } from "lucide-react";
import CodeRain from "../components/CodeRain";

export default function VurucuFark() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32" data-testid="vurucu-fark-section">
      {/* Tech background: deep navy + matrix code rain + readability gradient */}
      <div className="absolute inset-0 bg-[#07111F]">
        <CodeRain color="rgba(34,211,238," density={22} />
        {/* Radial fade so center text stays crisp */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(7,17,31,0.92) 0%, rgba(7,17,31,0.75) 45%, rgba(7,17,31,0.35) 80%, transparent 100%)",
          }}
        />
        {/* Subtle accent orbs */}
        <div className="absolute -top-32 left-1/4 h-[420px] w-[420px] rounded-full bg-[#2563EB]/15 blur-[140px]" />
        <div className="absolute -bottom-32 right-1/4 h-[420px] w-[420px] rounded-full bg-[#F97316]/10 blur-[140px]" />
        {/* Horizontal scanlines for tech feel */}
        <div
          className="absolute inset-0 opacity-[0.06] mix-blend-screen"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(34,211,238,0.6) 0px, rgba(34,211,238,0.6) 1px, transparent 1px, transparent 3px)",
          }}
        />
      </div>

      <div className="container-x relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#F97316]/30 bg-[#F97316]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-[#F97316] backdrop-blur">
            <Sparkles className="h-3 w-3" />
            En Vurucu Farkımız
          </span>

          <h2 className="mt-6 font-heading font-extrabold tracking-tight text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05]">
            EN VURUCU<br />
            <span className="text-[#F97316] drop-shadow-[0_0_30px_rgba(249,115,22,0.5)]">FARKIMIZ NEDİR?</span>
          </h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-10 text-lg sm:text-xl leading-[1.75] text-white/85 max-w-3xl mx-auto"
          >
            Patentli yapay zeka teknolojimiz <span className="font-bold text-[#22D3EE]">DR AI</span> sayesinde isteyebileceğiniz bütün
            projeler <span className="font-bold text-[#F97316]">IŞIK HIZINDA</span> yapılır.{" "}
            <span className="font-semibold text-white">1-2 ay süren web siteleri 1 günde, 3-4 ay süren B2B sistemleri 1 haftada</span> gibi.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-6 text-base sm:text-lg leading-[1.85] text-white/75 max-w-3xl mx-auto"
          >
            Ve en güzel kısım ne biliyor musunuz? Sizin bize tasarım ve site içindeki şunlar yazsın bunlar yazsın diye
            düşünmenize bile gerek yok. Öyle harika bir sonuç verecek ki DR AI yapay zekamız,{" "}
            <span className="font-semibold text-white">siz sadece HIZINA VE KALİTESİNE BAYILACAKSINIZ.</span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-6 text-base sm:text-lg text-white/70 max-w-2xl mx-auto"
          >
            Bizimle iletişime geçmekten çekinmeyin, sizin için hemen denemeler yapabiliriz.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="mt-12 flex flex-col sm:flex-row justify-center gap-3"
          >
            <Link to="/proje-talep" data-testid="vurucu-cta-primary" className="btn-primary animate-glow-pulse">
              <Zap className="h-4 w-4" /> Hemen Deneme Yapın
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/iletisim" data-testid="vurucu-cta-secondary" className="btn-ghost-dark">
              İletişime Geçin
            </Link>
          </motion.div>

          {/* Comparison strip */}
          <div className="mt-16 grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { label: "Web Sitesi", classic: "1-2 ay", dr: "1 gün" },
              { label: "B2B Sistem", classic: "3-4 ay", dr: "1 hafta" },
              { label: "Özel Panel", classic: "2-3 ay", dr: "3-5 gün" },
            ].map((c) => (
              <div key={c.label} className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 text-left">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#22D3EE]">{c.label}</div>
                <div className="mt-3 flex items-baseline justify-between gap-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-white/40">Klasik ajans</div>
                    <div className="mt-0.5 text-base font-semibold text-white/55 line-through">{c.classic}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wide text-[#F97316]">DR AI</div>
                    <div className="mt-0.5 font-heading text-xl font-extrabold text-[#F97316]">{c.dr}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
