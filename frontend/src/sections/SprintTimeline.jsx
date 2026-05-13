import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const STEPS = [
  { title: "Keşif Toplantısı", desc: "İhtiyaç, hedef ve kapsamı netleştirdiğimiz açılış görüşmesi." },
  { title: "Proje Haritası", desc: "Sayfa, modül, kullanıcı rolü ve veri akışı planı." },
  { title: "Ekran ve Akış Tasarımı", desc: "Kurumsal kimliğe uygun arayüz ve UX akışları." },
  { title: "Çalışan İlk Versiyon", desc: "DR AI destekli sprintle hızlıca canlı prototip." },
  { title: "Test ve Revizyon", desc: "Kullanıcı testi, mobil uyumluluk ve revizyonlar." },
  { title: "Yayına Alma", desc: "Domain, hosting, SSL ve canlı yayın süreci." },
  { title: "Sürekli Gelişim", desc: "Yeni ihtiyaçlara göre büyütme ve optimizasyon." },
];

export default function SprintTimeline() {
  return (
    <section className="section bg-[#F8FAFC] relative" data-testid="sprint-section">
      <div className="container-x">
        <div className="max-w-3xl">
          <span className="eyebrow">Dijital Dönüşüm Sprintleri</span>
          <h2 className="mt-3 h2-section">
            Aylar Süren Süreçleri<br />
            <span className="text-[#2563EB]">Sprint Modeliyle Hızlandırıyoruz</span>
          </h2>
          <p className="mt-5 body-lg max-w-2xl">
            Klasik yazılım süreçlerinde analiz, tasarım, revizyon ve yayın aşamaları uzun sürebilir. Dijital Roket'te
            önce ihtiyacı netleştirir, ardından DR AI destekli sprint modeliyle çalışan ilk versiyonu kısa sürede ortaya çıkarırız.
          </p>
        </div>

        <div className="mt-16 relative">
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#2563EB]/40 via-[#22D3EE]/40 to-transparent sm:-translate-x-1/2" />

          <div className="space-y-10">
            {STEPS.map((s, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: 0.05 * i }}
                  className={`relative sm:grid sm:grid-cols-2 sm:gap-12 ${isLeft ? "" : ""}`}
                  data-testid={`sprint-step-${i}`}
                >
                  <div className={`pl-12 sm:pl-0 ${isLeft ? "sm:pr-12 sm:text-right" : "sm:col-start-2 sm:pl-12"}`}>
                    <div className="card-elevate p-6">
                      <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#2563EB]">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Adım {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="mt-2 h3-card">{s.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#334155]">{s.desc}</p>
                    </div>
                  </div>
                  <span className="absolute left-4 sm:left-1/2 top-6 flex h-3 w-3 -translate-x-1/2 items-center justify-center">
                    <span className="absolute inset-0 rounded-full bg-[#22D3EE]/30 animate-ping" />
                    <span className="relative h-3 w-3 rounded-full bg-gradient-to-br from-[#2563EB] to-[#22D3EE]" />
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
