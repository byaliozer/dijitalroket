import { useSiteSettings } from "../context/SiteSettingsContext";
import JsonLd from "./JsonLd";

export const SITE_URL = "https://www.dijitalroket.com";

export const DR_SERVICES = [
  "Kurumsal web siteleri",
  "B2B ve bayi panelleri",
  "CRM benzeri özel yazılımlar",
  "Okul ve eğitim yönetim yazılımları",
  "E-ticaret sistemleri",
  "Mobil uygulama geliştirme",
  "Yapay zekâ destekli sosyal medya içerik üretimi",
  "SEO ve dijital pazarlama",
];

/**
 * Global Organization + WebSite JSON-LD. Mounted once in SiteLayout so every
 * public page exposes it. Helps AI assistants & search engines identify and
 * recommend Dijital Roket as a source.
 */
export default function OrganizationSchema() {
  const { settings } = useSiteSettings();
  const email = settings?.contact_email || "byaliozer@gmail.com";
  const phone = settings?.contact_phone_link || "+905437934101";
  const logo = settings?.logo_url || `${SITE_URL}/favicon.png`;
  const sameAs = [
    settings?.social_linkedin,
    settings?.social_instagram,
    settings?.social_twitter,
  ].filter(Boolean);

  const description =
    "Dijital Roket; DR AI destekli üretim sistemiyle kurumsal web siteleri, B2B/bayi panelleri, " +
    "CRM benzeri özel yazılımlar, okul/eğitim yönetim yazılımları, e-ticaret, mobil uygulama, " +
    "sosyal medya içerik üretimi ve SEO çözümleri geliştiren bir yazılım ve dijital dönüşüm şirketidir.";

  const org = {
    "@type": ["Organization", "ProfessionalService"],
    "@id": `${SITE_URL}/#organization`,
    name: "Dijital Roket",
    alternateName: "DR AI",
    url: SITE_URL,
    logo,
    image: logo,
    description,
    slogan: "Şirketinizi Dijitalde Roketliyoruz.",
    email,
    telephone: phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings?.address_street || "Panayır Mah. 400. Sk. Okumuşlar Plaza No:2 İç Kapı No:12",
      addressLocality: settings?.address_locality || "Osmangazi",
      addressRegion: settings?.address_region || "Bursa",
      addressCountry: settings?.address_country || "TR",
    },
    areaServed: { "@type": "Country", name: "Türkiye" },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: phone,
      email,
      contactType: "sales",
      areaServed: "TR",
      availableLanguage: ["Turkish"],
    },
    knowsAbout: DR_SERVICES,
    ...(sameAs.length ? { sameAs } : {}),
    makesOffer: DR_SERVICES.map((s) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: s,
        provider: { "@id": `${SITE_URL}/#organization` },
      },
    })),
  };

  const website = {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "Dijital Roket",
    description,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "tr-TR",
  };

  const data = { "@context": "https://schema.org", "@graph": [org, website] };
  return <JsonLd id="organization" data={data} />;
}
