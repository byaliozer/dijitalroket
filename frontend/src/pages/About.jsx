import PageHero from "../components/PageHero";
import SEO from "../components/SEO";
import FinalCta from "../sections/FinalCta";
import Markdown from "../components/Markdown";
import { useSiteSettings } from "../context/SiteSettingsContext";

export default function About() {
  const { settings } = useSiteSettings();
  if (!settings) return <div className="container-x py-32 text-center text-[#334155]">Yükleniyor...</div>;

  return (
    <>
      <SEO page="about" />
      <PageHero
        eyebrow={settings.about_eyebrow || "Hakkımızda"}
        title={settings.about_title || "Dijital Dönüşümü Hızlandıran Teknoloji Ekibi"}
      />

      <section className="section bg-white">
        <div className="container-x grid lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-3">
            <Markdown source={settings.about_content || ""} />
          </div>
          {settings.about_hero_image && (
            <div className="lg:col-span-2 relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[#2563EB]/10 to-[#22D3EE]/10 blur-2xl" />
              <img
                src={settings.about_hero_image}
                alt="Dijital Roket"
                className="relative rounded-2xl border border-slate-200 shadow-xl w-full h-[420px] object-cover"
              />
            </div>
          )}
        </div>
      </section>
      <FinalCta />
    </>
  );
}
