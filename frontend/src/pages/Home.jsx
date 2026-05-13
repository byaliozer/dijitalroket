import Hero from "../sections/Hero";
import VurucuFark from "../sections/VurucuFark";
import Positioning from "../sections/Positioning";
import DrAiSection from "../sections/DrAiSection";
import SolutionsGrid from "../sections/SolutionsGrid";
import SprintTimeline from "../sections/SprintTimeline";
import CaseStudiesSection from "../sections/CaseStudiesSection";
import RoketPartnerSection from "../sections/RoketPartnerSection";
import TrustSection from "../sections/TrustSection";
import SectorsGrid from "../sections/SectorsGrid";
import BlogTeasers from "../sections/BlogTeasers";
import FinalCta from "../sections/FinalCta";
import SEO from "../components/SEO";

export default function Home() {
  return (
    <>
      <SEO
        title="Dijital Roket | DR AI Destekli Kurumsal Web, Yazılım ve Dijital Dönüşüm"
        description="Dijital Roket; DR AI destekli üretim sistemiyle kurumsal web siteleri, B2B paneller, CRM benzeri sistemler, sosyal medya içerikleri ve özel dijital projeler geliştirir."
      />
      <Hero />
      <VurucuFark />
      <Positioning />
      <DrAiSection />
      <SolutionsGrid />
      <SprintTimeline />
      <CaseStudiesSection />
      <RoketPartnerSection />
      <TrustSection />
      <SectorsGrid />
      <BlogTeasers />
      <FinalCta />
    </>
  );
}
