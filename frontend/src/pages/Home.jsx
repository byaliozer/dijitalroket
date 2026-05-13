import Hero from "../sections/Hero";
import VurucuFark from "../sections/VurucuFark";
import Positioning from "../sections/Positioning";
import DrAiSection from "../sections/DrAiSection";
import SolutionsGrid from "../sections/SolutionsGrid";
import SprintTimeline from "../sections/SprintTimeline";
import CaseStudiesSection from "../sections/CaseStudiesSection";
import RoketPartnerSection from "../sections/RoketPartnerSection";
import TrustSection from "../sections/TrustSection";
import BlogTeasers from "../sections/BlogTeasers";
import FinalCta from "../sections/FinalCta";
import SEO from "../components/SEO";

export default function Home() {
  return (
    <>
      <SEO page="home" />
      <Hero />
      <VurucuFark />
      <Positioning />
      <DrAiSection />
      <SolutionsGrid />
      <SprintTimeline />
      <CaseStudiesSection />
      <RoketPartnerSection />
      <TrustSection />
      <BlogTeasers />
      <FinalCta />
    </>
  );
}
