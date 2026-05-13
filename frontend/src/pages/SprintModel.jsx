import PageHero from "../components/PageHero";
import SEO from "../components/SEO";
import SprintTimeline from "../sections/SprintTimeline";
import TrustSection from "../sections/TrustSection";
import FinalCta from "../sections/FinalCta";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function SprintModel() {
  return (
    <>
      <SEO
        title="Dijital Dönüşüm Sprintleri | Hızlı Proje Geliştirme"
        description="Aylar süren proje süreçlerini Dijital Roket Sprint Modeli ile hızlandırın. Keşiften yayına çalışan ilk versiyona kadar tüm aşamalar."
      />
      <PageHero
        eyebrow="Sprint Modeli"
        title="Fikirden Çalışan Sisteme: Dijital Dönüşüm Sprintleri"
        subtitle="Keşif, analiz, tasarım, geliştirme, test ve yayın adımlarını paralel yürüten DR AI destekli sprint modelimiz."
      >
        <Link to="/proje-talep" className="btn-primary">Sprint Başlatın <ArrowRight className="h-4 w-4" /></Link>
      </PageHero>
      <SprintTimeline />
      <TrustSection />
      <FinalCta />
    </>
  );
}
