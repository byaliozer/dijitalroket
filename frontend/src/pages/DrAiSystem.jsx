import PageHero from "../components/PageHero";
import SEO from "../components/SEO";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Workflow, Sparkles, LayoutPanelTop, FileSearch, Truck } from "lucide-react";
import FinalCta from "../sections/FinalCta";

const SECTIONS = [
  {
    icon: Brain,
    title: "DR AI Nedir?",
    body: "DR AI; Dijital Roket'in dijital projeleri daha hızlı analiz etmek, tasarlamak, üretmek ve yayına hazırlamak için kullandığı yapay zeka destekli üretim modelidir. Bir araç değil; bir üretim metodolojisidir.",
  },
  {
    icon: Workflow,
    title: "Hangi Süreçleri Hızlandırır?",
    body: "Analiz, ekran kurgusu, içerik üretimi, görsel üretimi, kullanıcı akışı, panel yapısı ve test süreçleri DR AI üretim modeliyle paralel ilerletilir. Bu sayede aylar süren işler haftalara, haftalar süren işler günlere iner.",
  },
  {
    icon: LayoutPanelTop,
    title: "Web ve Panel Üretimi",
    body: "Kurumsal web siteleri, yönetim panelleri, dashboard ekranları ve B2B sistemler DR AI yöntemiyle hızla iskeletlenir; tasarım ve geliştirme paralel yürür. İlk versiyon kısa sürede çalışır hale gelir.",
  },
  {
    icon: Sparkles,
    title: "İçerik ve Görsel Üretimi",
    body: "Sosyal medya planları, kampanya görselleri, blog içerikleri ve kurumsal şablonlar markanın diline uygun şekilde üretilir. Üretim kalitesi insan editörlüğüyle her zaman gözden geçirilir.",
  },
  {
    icon: FileSearch,
    title: "Kurumsal Süreç Analizi",
    body: "Hangi iş akışlarının dijitalleştirilebileceğini birlikte haritalandırırız. Satış, operasyon, müşteri yönetimi ve raporlama süreçleri özelinde hızlıca öneriler sunarız.",
  },
  {
    icon: Truck,
    title: "Proje Teslim Modeli",
    body: "Sprint bazlı çalışırız. Her sprint sonunda görünür çıktı, müşteri demosu ve revizyon turu yapılır. Bu sayede süreç şeffaf ilerler ve sürprizler en aza iner.",
  },
];

export default function DrAiSystemPage() {
  return (
    <>
      <SEO
        title="DR AI Sistemi | Dijital Roket"
        description="DR AI Üretim Sistemi; Dijital Roket'in projeleri daha hızlı analiz etme, tasarlama, üretme ve yayına alma metodolojisidir."
      />
      <PageHero
        eyebrow="DR AI Üretim Sistemi"
        title="Dijital Projeleri Roket Hızında Üretmenin Yolu"
        subtitle="DR AI; analiz, tasarım, üretim ve teslim süreçlerini hızlandıran Dijital Roket'in özel üretim modelidir."
      >
        <Link to="/proje-talep" className="btn-primary">Projemi Analiz Edin <ArrowRight className="h-4 w-4" /></Link>
        <Link to="/kurumsal-cozumler" className="btn-ghost-dark">Çözümleri İnceleyin</Link>
      </PageHero>

      <section className="section bg-white">
        <div className="container-x grid gap-8 md:grid-cols-2">
          {SECTIONS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="card-elevate p-8"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563EB]/10 to-[#22D3EE]/10 border border-[#2563EB]/15">
                <s.icon className="h-5 w-5 text-[#2563EB]" />
              </span>
              <h2 className="mt-5 font-heading text-2xl font-bold text-[#07111F]">{s.title}</h2>
              <p className="mt-3 body-lg">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <FinalCta />
    </>
  );
}
