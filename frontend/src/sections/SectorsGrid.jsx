import { motion } from "framer-motion";
import { Plane, Sofa, Layers3, Car, GraduationCap, Trophy, Heart, Building2 } from "lucide-react";

const SECTORS = [
  { icon: Plane, name: "Turizm ve Seyahat", desc: "Rezervasyon akışları, müşteri panelleri ve teklif yönetimi." },
  { icon: Sofa, name: "Mobilya ve Perakende", desc: "Ürün katalogları, bayi panelleri ve sipariş yönetimi." },
  { icon: Layers3, name: "Halı ve Üretim", desc: "Koleksiyon yönetimi ve bayi sipariş sistemleri." },
  { icon: Car, name: "Otomotiv ve Servis", desc: "Servis takip, randevu ve yedek parça sistemleri." },
  { icon: GraduationCap, name: "Eğitim", desc: "Başvuru, kayıt ve eğitmen paneli sistemleri." },
  { icon: Heart, name: "Sağlık", desc: "Randevu, hasta takip ve içerik yönetimi." },
  { icon: Trophy, name: "Spor Kulüpleri", desc: "Kurumsal web, üye yönetimi ve içerik üretimi." },
  { icon: Building2, name: "Dernek ve Organizasyonlar", desc: "Üye paneli, bağış ve etkinlik yönetimi." },
];

export default function SectorsGrid() {
  return (
    <section className="section bg-white" data-testid="sectors-section">
      <div className="container-x">
        <div className="max-w-3xl">
          <span className="eyebrow">Sektörler</span>
          <h2 className="mt-3 h2-section">Hangi Sektörler İçin Çalışıyoruz?</h2>
          <p className="mt-5 body-lg max-w-2xl">
            Operasyonu olan, bayi ağı bulunan ya da müşteri trafiği yoğun olan firmalara özel dijital çözümler üretiyoruz.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SECTORS.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
              className="card-elevate p-6"
              data-testid={`sector-${i}`}
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563EB]/10 to-[#22D3EE]/10 border border-[#22D3EE]/20">
                <s.icon className="h-5 w-5 text-[#2563EB]" strokeWidth={1.8} />
              </span>
              <h3 className="mt-4 font-heading text-base font-semibold text-[#07111F]">{s.name}</h3>
              <p className="mt-1.5 text-sm text-[#334155] leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
