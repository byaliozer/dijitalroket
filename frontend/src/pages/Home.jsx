import Hero from "../sections/Hero";
import ProjectMarquee from "../sections/ProjectMarquee";
import VurucuFark from "../sections/VurucuFark";
import Positioning from "../sections/Positioning";
import DrAiSection from "../sections/DrAiSection";
import SolutionsGrid from "../sections/SolutionsGrid";
import SprintTimeline from "../sections/SprintTimeline";
import CaseStudiesSection from "../sections/CaseStudiesSection";
import RoketPartnerSection from "../sections/RoketPartnerSection";
import TrustSection from "../sections/TrustSection";
import BlogTeasers from "../sections/BlogTeasers";
import HomeFaq from "../sections/HomeFaq";
import FinalCta from "../sections/FinalCta";
import SEO from "../components/SEO";

export default function Home() {
  return (
    <>
      <SEO
        title="Dijital Roket | Özel Yazılım, B2B, CRM & AI Çözümleri"
        description="Dijital Roket; kurumsal web, B2B bayi sistemleri, özel CRM yazılımları, AI Agent çözümleri ve dijital dönüşüm projeleri geliştiren Bursa merkezli teknoloji şirketidir."
      />
      <Hero />
      <ProjectMarquee />
      <SolutionsGrid />
      <CaseStudiesSection />
      <VurucuFark />
      <Positioning />
      <DrAiSection />
      <SprintTimeline />
      <RoketPartnerSection />
      <TrustSection />
      <BlogTeasers />
      <HomeFaq />
      <FinalCta />
    </>
  );
}
