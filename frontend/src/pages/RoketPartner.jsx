import PageHero from "../components/PageHero";
import SEO from "../components/SEO";
import RoketPartnerSection from "../sections/RoketPartnerSection";
import FinalCta from "../sections/FinalCta";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const REQUESTS = [
  "Web sitesi güncellemeleri", "Yeni landing page tasarımları", "Kampanya görselleri",
  "Sosyal medya içerikleri", "Blog içerikleri", "Panel geliştirmeleri",
  "Dashboard ekranları", "Form ve başvuru sistemleri", "AI destekli görsel üretimleri",
  "Dijital fikir prototipleri",
];

export default function RoketPartner() {
  return (
    <>
      <SEO
        title="Roket Partner Programı | Kurumsal Dijital Çözüm Ortaklığı"
        description="Roket Partner Programı; şirketinizin yıl boyunca dijital ihtiyaçlarını planlı sprintlerle yöneten sürekli çözüm ortaklığıdır."
      />
      <PageHero
        eyebrow="Roket Partner Programı"
        title="Dijital İhtiyaçlarınız İçin Sürekli Çözüm Ortağı"
        subtitle="Roket Partner Programı; şirketinizin yıl boyunca ihtiyaç duyduğu web, yazılım, içerik, görsel ve dijital geliştirme taleplerini planlı sprint modeliyle yönetir."
      >
        <Link to="/iletisim" className="btn-primary">Roket Partner Görüşmesi <ArrowRight className="h-4 w-4" /></Link>
      </PageHero>

      <section className="section bg-white">
        <div className="container-x grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <span className="eyebrow">Program Nedir?</span>
            <h2 className="mt-3 h2-section">Tek Ekip, Yıl Boyunca Süren Üretim</h2>
            <p className="mt-5 body-lg">
              Roket Partner; tasarım, yazılım, içerik, görsel ve AI üretimi kabiliyetlerini tek bir ekipte toplar. Aylık
              veya kuartal bazlı çalışma modellerinde, talepleriniz öncelik sırasına alınır ve sprint planına göre
              hayata geçirilir.
            </p>
            <p className="mt-3 text-sm text-[#334155]">
              Sınırsız talep modeli, aynı anda sınırsız teslimat anlamına gelmez. Talepler önceliklendirilir ve sprint
              planına göre sırayla tamamlanır.
            </p>
          </div>
          <div className="card-elevate p-8">
            <span className="eyebrow">Hangi Talepler Dahil Olabilir?</span>
            <ul className="mt-5 grid sm:grid-cols-2 gap-2">
              {REQUESTS.map((r, i) => (
                <motion.li
                  key={r}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-start gap-2 text-sm text-[#07111F]"
                >
                  <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-[#10B981]" />
                  <span>{r}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <RoketPartnerSection />

      <section className="section bg-[#F8FAFC]">
        <div className="container-x grid gap-8 md:grid-cols-3">
          {[
            { title: "Kimler İçin Uygun?", body: "Bayisi olan üretici firmalar, çok şubeli yapılar, dijital departmanı olmayan kurumsal firmalar ve sürekli üretim hattına ihtiyaç duyan markalar." },
            { title: "Nasıl Çalışır?", body: "Aylık planlama, haftalık sprint, görünür çıktı. Her sprint sonunda teslimat ve demo. Talepler öncelik sırasına alınır." },
            { title: "Avantajlar", body: "Tek noktadan iletişim, bütünleşik kalite, hızlı yayın, sürekli gelişim ve uzun vadeli süreklilik." },
          ].map((b) => (
            <div key={b.title} className="card-elevate p-7">
              <h3 className="h3-card">{b.title}</h3>
              <p className="mt-3 body-lg text-base">{b.body}</p>
            </div>
          ))}
        </div>
      </section>
      <FinalCta />
    </>
  );
}
