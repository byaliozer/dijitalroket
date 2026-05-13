import { motion } from "framer-motion";
import {
  Globe, Network, Users2, FileText, BarChart3, Package,
  CalendarClock, UserCog, Headphones, Image, Sparkles, Smartphone,
} from "lucide-react";

const SOLUTIONS = [
  { icon: Globe, title: "Kurumsal Web Siteleri", desc: "Markanızı güçlü yansıtan, hızlı ve mobil uyumlu kurumsal siteler." },
  { icon: Network, title: "B2B Bayi ve Sipariş Sistemleri", desc: "Bayilerin ürünleri görüntüleyip sipariş verebileceği özel B2B altyapı." },
  { icon: Users2, title: "CRM Benzeri Müşteri Takip", desc: "Müşteri, teklif ve takip süreçlerini tek panelden yönetin." },
  { icon: FileText, title: "Satış ve Teklif Yönetimi", desc: "Teklif oluşturma, onay ve takibi sistemleştiren paneller." },
  { icon: BarChart3, title: "Yönetici Dashboard ve Raporlama", desc: "Satış, talep ve operasyon verilerini anlaşılır ekranlarda izleyin." },
  { icon: Package, title: "Stok, Ürün ve Koleksiyon Yönetimi", desc: "Ürün, varyant ve koleksiyonları merkezi sistemde yönetin." },
  { icon: CalendarClock, title: "Randevu ve Rezervasyon", desc: "Müşteri randevularını ve rezervasyonları otomatik yönetin." },
  { icon: UserCog, title: "Personel / İK Yönetim Panelleri", desc: "Ekip, izin, görev ve performans takibi için özel paneller." },
  { icon: Headphones, title: "Destek Talep / Ticket Sistemleri", desc: "Müşteri destek taleplerini önceliklendiren akış sistemleri." },
  { icon: Sparkles, title: "Sosyal Medya İçerik Üretimi", desc: "DR AI destekli sosyal medya plan ve görsel üretim hattı." },
  { icon: Image, title: "AI Destekli Kampanya Görselleri", desc: "Kampanya görsellerini kurumsal şablonla hızlıca üretin." },
  { icon: Smartphone, title: "Mobil Uyumlu Web Uygulamaları", desc: "PWA mantığında çalışan, mobile öncelikli web uygulamaları." },
];

export default function SolutionsGrid({ compact = false }) {
  return (
    <section className={`${compact ? "py-16" : "section"} bg-white`} data-testid="solutions-section">
      <div className="container-x">
        {!compact && (
          <div className="max-w-3xl">
            <span className="eyebrow">Kurumsal Çözümler</span>
            <h2 className="mt-3 h2-section">
              Şirketinizin İhtiyacına<br />
              <span className="text-[#2563EB]">Özel Dijital Sistemler</span>
            </h2>
            <p className="mt-5 body-lg max-w-2xl">
              Hazır kalıplara sıkışmadan; satış, operasyon, insan kaynakları, müşteri yönetimi, bayi ağı, teklif süreçleri
              ve raporlama gibi iş akışlarınıza özel dijital çözümler geliştiriyoruz.
            </p>
          </div>
        )}

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {SOLUTIONS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
              className="card-elevate p-6"
              data-testid={`solution-card-${i}`}
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#2563EB]/8 text-[#2563EB] border border-[#2563EB]/15">
                <s.icon className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <h3 className="mt-5 font-heading text-base font-semibold text-[#07111F]">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#334155]">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
