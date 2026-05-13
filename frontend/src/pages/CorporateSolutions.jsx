import PageHero from "../components/PageHero";
import SEO from "../components/SEO";
import SolutionsGrid from "../sections/SolutionsGrid";
import FinalCta from "../sections/FinalCta";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const DETAILS = [
  {
    title: "Kurumsal Web Siteleri",
    forWho: "Kendi markasını dijitalde güçlü göstermek isteyen orta ve büyük ölçekli firmalar.",
    benefit: "Modern tasarım, mobil uyumluluk, hızlı yayın ve SEO uyumlu altyapı.",
    example: "Kurumsal hizmet firmaları, üretici firmalar, eğitim ve sağlık merkezleri.",
  },
  {
    title: "B2B ve Bayi Sistemleri",
    forWho: "Bayi ağı olan üretici, toptancı ve distribütör firmalar.",
    benefit: "Bayiler ürünleri görüntüler, sipariş verir, fiyat ve stok bilgilerini takip eder. Yönetim ekibi tüm siparişleri panelden yönetir.",
    example: "Halı, mobilya, otomotiv yedek parça, gıda, tekstil ve inşaat malzemeleri sektörleri.",
  },
  {
    title: "CRM Benzeri Takip Sistemleri",
    forWho: "Satış ekibi olan, müşteri görüşmesi ve teklif yönetimi yapan firmalar.",
    benefit: "Müşteri kartları, görüşme notları, teklif aşamaları ve takip akışı tek panelde.",
    example: "Hizmet firmaları, danışmanlık şirketleri, gayrimenkul, B2B satış ekipleri.",
  },
  {
    title: "Satış ve Teklif Yönetimi",
    forWho: "Düzenli teklif üreten ve teklifleri takip etmesi gereken firmalar.",
    benefit: "Teklif şablonları, dijital onay akışları ve teklif geçmişi.",
    example: "İnşaat, mühendislik, danışmanlık, kurumsal hizmet sektörleri.",
  },
  {
    title: "Yönetici Dashboard",
    forWho: "Birden fazla departmanı veya bayisi olan, veriyle yönetilmek isteyen firmalar.",
    benefit: "Satış, talep, müşteri ve operasyon verilerinin anlaşılır görselleştirmesi.",
    example: "Üretici firmalar, perakende zincirleri, hizmet sağlayıcılar.",
  },
  {
    title: "Sosyal Medya ve Kampanya Üretimi",
    forWho: "Pazarlama hızını artırmak isteyen, düzenli içerik üreten markalar.",
    benefit: "DR AI destekli şablon, görsel ve plan üretimi; insan editörlüğüyle teslim.",
    example: "Perakende, turizm, spor kulüpleri, eğitim, gıda markaları.",
  },
  {
    title: "Özel Panel ve Otomasyonlar",
    forWho: "İş akışına özel sistemi olmayan, manuel süreçlerle çalışan firmalar.",
    benefit: "İhtiyacınıza özel modül, otomatik bildirim ve raporlama akışları.",
    example: "Üretim, lojistik, dernek, organizasyon ve operasyon yoğun yapılar.",
  },
];

export default function CorporateSolutions() {
  return (
    <>
      <SEO
        title="Kurumsal Çözümler | Web, B2B, CRM ve Panel Sistemleri"
        description="Dijital Roket kurumsal çözümleri: kurumsal web, B2B paneller, CRM benzeri sistemler, satış ve teklif yönetimi, yönetici dashboard ve özel otomasyonlar."
      />
      <PageHero
        eyebrow="Kurumsal Çözümler"
        title="Şirketinizin İhtiyacına Özel Dijital Sistemler"
        subtitle="Hazır kalıplara sıkışmadan iş akışlarınıza özel paneller, sistemler ve otomasyonlar geliştiriyoruz."
      >
        <Link to="/proje-talep" className="btn-primary">Çözüm Talep Edin <ArrowRight className="h-4 w-4" /></Link>
      </PageHero>

      <SolutionsGrid compact />

      <section className="section bg-[#F8FAFC]">
        <div className="container-x">
          <span className="eyebrow">Detaylı Çözümler</span>
          <h2 className="mt-3 h2-section max-w-3xl">Her Çözüm İçin: Kim İçin, Ne Sağlar, Nerede Kullanılır</h2>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {DETAILS.map((d, i) => (
              <motion.div
                key={d.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="card-elevate p-7"
              >
                <h3 className="h3-card">{d.title}</h3>
                <div className="mt-5 space-y-3">
                  <Row label="Kimler için?" value={d.forWho} />
                  <Row label="Ne sağlar?" value={d.benefit} />
                  <Row label="Örnek kullanım" value={d.example} />
                </div>
                <Link to="/proje-talep" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] hover:gap-2.5 transition-all">
                  Bu çözüm için görüşme planlayın <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex gap-3">
      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-[#10B981]" />
      <div>
        <div className="text-xs font-bold uppercase tracking-[0.15em] text-[#2563EB]">{label}</div>
        <div className="mt-0.5 text-sm text-[#334155] leading-relaxed">{value}</div>
      </div>
    </div>
  );
}
