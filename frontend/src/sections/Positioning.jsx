import { motion } from "framer-motion";
import { Globe2, Database, Wand2 } from "lucide-react";

const CARDS = [
  {
    icon: Globe2,
    title: "Kurumsal Web",
    desc: "Markanızı güçlü gösteren, hızlı, modern ve mobil uyumlu web siteleri.",
  },
  {
    icon: Database,
    title: "Özel Dijital Sistemler",
    desc: "CRM benzeri müşteri takip sistemleri, B2B paneller, satış ve teklif yönetimi.",
  },
  {
    icon: Wand2,
    title: "DR AI İçerik Üretimi",
    desc: "Sosyal medya, kampanya, görsel ve metin üretimini hızlandıran akıllı üretim modeli.",
  },
];

export default function Positioning() {
  return (
    <section className="section bg-[#F4FAF7] relative" data-testid="positioning-section">
      <div className="container-x">
        <div className="max-w-3xl">
          <span className="eyebrow">Konumlandırma</span>
          <h2 className="mt-3 h2-section">
            Klasik Ajans Değil,<br />
            <span className="text-[#059669]">DR AI Destekli Dijital Dönüşüm Hizmeti</span>
          </h2>
          <p className="mt-5 body-lg max-w-2xl">
            Dijital Roket; tasarım, yazılım, içerik, yapay zeka, otomasyon ve pazarlama kabiliyetlerini tek çatı altında
            birleştirir. Böylece şirketinizin sadece dış dünyaya görünen yüzünü değil, içeride çalışan operasyon
            sistemlerini de geliştirir.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {CARDS.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card-elevate p-7"
              data-testid={`positioning-card-${i}`}
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#059669]/10 to-[#34D399]/10 border border-[#059669]/15">
                <c.icon className="h-5 w-5 text-[#059669]" />
              </span>
              <h3 className="mt-5 h3-card">{c.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[#334155]">{c.desc}</p>
              <div className="mt-6 h-px bg-gradient-to-r from-transparent via-[#34D399]/20 to-transparent" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
