import PageHero from "../components/PageHero";
import SEO from "../components/SEO";
import FinalCta from "../sections/FinalCta";
import { motion } from "framer-motion";
import { Zap, Shield, Brain, Cpu, RefreshCcw, Target } from "lucide-react";

const VALUES = [
  { icon: Zap, name: "Hız" },
  { icon: Shield, name: "Güven" },
  { icon: Target, name: "Strateji" },
  { icon: Cpu, name: "Teknoloji" },
  { icon: RefreshCcw, name: "Sürekli Gelişim" },
  { icon: Brain, name: "Sonuç Odaklılık" },
];

export default function About() {
  return (
    <>
      <SEO
        title="Hakkımızda | Dijital Roket"
        description="Dijital Roket; 2015'ten bu yana Bursa merkezli AI destekli dijital dönüşüm şirketidir."
      />
      <PageHero eyebrow="Hakkımızda" title="Dijital Dönüşümü Hızlandıran Teknoloji Ekibi" />

      <section className="section bg-white">
        <div className="container-x grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="eyebrow">Hikâyemiz</span>
            <h2 className="mt-3 h2-section">2015'ten Bu Yana Markaların Dijital Çözüm Ortağı</h2>
            <p className="mt-5 body-lg">
              Dijital Roket, 2015'ten bu yana markaların dijital dünyada daha güçlü görünmesi ve daha verimli çalışması
              için çözümler üreten Bursa merkezli bir teknoloji ve dijital dönüşüm şirketidir.
            </p>
            <p className="mt-3 body-lg">
              Bugün Dijital Roket; web tasarımı, özel yazılım, sosyal medya, içerik üretimi, AI destekli görsel üretimi,
              B2B sistemler, CRM benzeri paneller ve kurumsal dijital dönüşüm projelerini tek çatı altında sunar.
            </p>
            <p className="mt-3 body-lg">
              Amacımız sadece güzel görünen işler yapmak değil; şirketlerin satış, operasyon, pazarlama ve müşteri
              yönetimi süreçlerini daha hızlı, ölçülebilir ve profesyonel hale getirmektir.
            </p>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[#2563EB]/10 to-[#22D3EE]/10 blur-2xl" />
            <img
              src="https://images.unsplash.com/photo-1758518729685-f88df7890776?w=1200&q=80"
              alt="Dijital Roket ekibi"
              className="relative rounded-2xl border border-slate-200 shadow-xl w-full h-[420px] object-cover"
            />
          </div>
        </div>
      </section>

      <section className="section bg-[#F8FAFC]">
        <div className="container-x">
          <span className="eyebrow">Değerlerimiz</span>
          <h2 className="mt-3 h2-section">İşimizi Yönlendiren İlkeler</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.name}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="card-elevate p-7"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563EB]/10 to-[#22D3EE]/10 border border-[#2563EB]/15">
                  <v.icon className="h-5 w-5 text-[#2563EB]" />
                </span>
                <h3 className="mt-5 h3-card">{v.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <FinalCta />
    </>
  );
}
