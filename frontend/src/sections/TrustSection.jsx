import { motion } from "framer-motion";
import { Check } from "lucide-react";

const ITEMS = [
  "Kapsam ve hedef analizi",
  "Kullanıcı rolleri ve yetki yapısı",
  "Mobil uyumluluk",
  "Yönetim paneli mantığı",
  "Temel güvenlik yaklaşımı",
  "Yayın öncesi test",
  "Eğitim ve teslim süreci",
  "Bakım ve sürekli geliştirme",
];

export default function TrustSection() {
  return (
    <section className="section bg-[#F4FAF7]" data-testid="trust-section">
      <div className="container-x grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5">
          <span className="eyebrow">Güven ve Süreç</span>
          <h2 className="mt-3 h2-section">
            Hızlıyız,<br />
            <span className="text-[#059669]">Ama Plansız Değiliz</span>
          </h2>
          <p className="mt-5 body-lg max-w-md">
            Dijital Roket'te hız, plansızlık anlamına gelmez. Her projede kapsam, kullanıcı rolleri, veri akışı, mobil
            uyumluluk, güvenlik, test ve teslim süreci dikkate alınır.
          </p>
        </div>

        <div className="lg:col-span-7">
          <ul className="grid gap-3 sm:grid-cols-2" data-testid="trust-list">
            {ITEMS.map((t, i) => (
              <motion.li
                key={t}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#10B981]/10 text-[#10B981]">
                  <Check className="h-4 w-4" strokeWidth={3} />
                </span>
                <span className="text-sm sm:text-base font-medium text-[#0A1F1A] leading-snug">{t}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
