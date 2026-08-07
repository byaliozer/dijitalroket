import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";

const ADVANTAGES = [
  "Tek ekip, çoklu dijital çözüm",
  "Sınırsız talep havuzu",
  "Planlı sprint üretimi",
  "Web + yazılım + içerik + görsel tek çatı altında",
  "Hızlı prototip ve hızlı yayın",
  "Sürekli gelişim modeli",
];

export default function RoketPartnerSection() {
  return (
    <section className="section relative overflow-hidden bg-[#07111F] text-white" data-testid="partner-section">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute -top-32 right-1/3 h-[420px] w-[420px] rounded-full bg-[#7C3AED]/20 blur-[130px]" />
        <div className="absolute bottom-0 left-1/4 h-[360px] w-[360px] rounded-full bg-[#2563EB]/20 blur-[130px]" />
      </div>

      <div className="container-x relative grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7">
          <span className="eyebrow-light">Roket Partner Programı</span>
          <h2 className="mt-3 font-heading font-bold tracking-tight text-3xl sm:text-4xl lg:text-5xl text-white">
            Şirketinizin Dijital<br /><span className="text-gradient">Departmanı Gibi Çalışırız</span>
          </h2>
          <p className="mt-5 text-base sm:text-lg leading-relaxed text-white/70 max-w-2xl">
            Roket Partner Programı ile web güncellemeleri, kampanya görselleri, sosyal medya içerikleri, panel
            geliştirmeleri, yeni sayfalar ve dijital fikirleriniz tek bir ekip tarafından düzenli şekilde yönetilir.
          </p>
          <p className="mt-3 text-sm text-white/50 max-w-2xl">
            Kurumsal iş ortaklarımız ay boyunca ihtiyaç duydukları dijital işleri bize iletebilir. Talepler önceliklendirilir,
            sprint planına alınır ve düzenli olarak hayata geçirilir.
          </p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2 max-w-2xl" data-testid="partner-advantages">
            {ADVANTAGES.map((a, i) => (
              <motion.li
                key={a}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3.5 backdrop-blur"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#10B981]/20 text-[#10B981]">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                <span className="text-sm text-white/85">{a}</span>
              </motion.li>
            ))}
          </ul>

          <p className="mt-6 text-xs text-white/40 max-w-xl">
            Teslimatlar proje kapsamı, öncelik ve sprint planına göre sırayla tamamlanır.
          </p>

          <div className="mt-8">
            <Link to="/proje-talep" data-testid="partner-cta" className="btn-primary">
              Roket Partner Görüşmesi Planlayın
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 backdrop-blur-xl">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Aktif Sprint", value: "12" },
                { label: "Aylık Teslim", value: "40+" },
                { label: "Kurumsal Ortak", value: "20+" },
                { label: "Üretim Hızı", value: "10×" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-white/10 bg-[#07111F]/60 p-5 backdrop-blur">
                  <div className="font-heading text-3xl font-extrabold text-white">{s.value}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.15em] text-white/50">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-[#22D3EE]/20 bg-[#22D3EE]/5 p-4">
              <span className="h-2 w-2 rounded-full bg-[#22D3EE] animate-pulse" />
              <span className="text-sm text-white/80">Şu anda sprint kapasitesi açık</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
