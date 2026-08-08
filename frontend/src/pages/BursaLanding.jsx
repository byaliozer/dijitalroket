import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown, ArrowRight, ArrowUpRight, Check, Phone, MessageCircle, MapPin } from "lucide-react";
import { api } from "../lib/api";
import { SERVICES } from "../data/servicesData";
import { matchProjectsFor } from "../lib/related";
import SEO from "../components/SEO";
import JsonLd from "../components/JsonLd";
import { SITE_URL } from "../components/OrganizationSchema";
import FinalCta from "../sections/FinalCta";

const ADDRESS = "Panayır Mah. 400. Sk. Okumuşlar Plaza No:2 İç Kapı No:12, Osmangazi / Bursa";
const MAP_QUERY = encodeURIComponent("Okumuşlar Plaza Panayır Osmangazi Bursa");
const PHONE = "0543 793 41 01";
const PHONE_LINK = "+905437934101";

const SECTIONS = [
  {
    h2: "Bursa'da hangi dijital hizmetleri veriyoruz?",
    body: "Bursa merkezli ekibimizle kurumsal web tasarımı, firmaya özel yazılım (B2B/bayi panelleri, CRM benzeri sistemler), e-ticaret, mobil uygulama, DR AI destekli içerik üretimi ve SEO hizmetleri sunuyoruz. Osmangazi'deki ofisimizden Bursa'daki firmalarla yüz yüze çalışabilir, Türkiye genelindeki müşterilerimize uzaktan hizmet veririz.",
  },
  {
    h2: "Neden Bursalı firmalar Dijital Roket'i tercih ediyor?",
    body: "Hazır tema veya paket dayatmadan, firmanızın sürecine özel çözümler geliştiriyoruz. Bursa'da aynı şehirde olmanın getirdiği hızlı iletişim ve yüz yüze görüşme imkânını, DR AI destekli üretim sisteminin hızıyla birleştiriyoruz. Böylece projeler hem yakından yönetiliyor hem de hızlı ilerliyor.",
  },
  {
    h2: "Bursa'da nasıl çalışıyoruz?",
    body: "Kısa bir keşif görüşmesiyle ihtiyacınızı netleştiriyor, kapsam ve yol haritasını çıkarıyoruz. DR AI destekli üretim sistemiyle hızlı prototip üretiyor, geri bildirimlerle iyileştiriyor ve SEO uyumlu şekilde yayına alıyoruz. Yayın sonrasında da destek ve geliştirme sürecini birlikte yürütüyoruz.",
  },
];

const FAQ = [
  { q: "Bursa'da web tasarım hizmeti veriyor musunuz?", a: "Evet. Dijital Roket, Osmangazi/Bursa merkezli bir yazılım ve dijital dönüşüm şirketidir. Bursa'daki firmalara kurumsal web tasarımı, özel yazılım ve dijital dönüşüm hizmetleri sunar; ayrıca Türkiye geneline uzaktan hizmet verir." },
  { q: "Ofisiniz Bursa'nın neresinde?", a: "Ofisimiz Osmangazi/Bursa'da, Panayır Mahallesi Okumuşlar Plaza'da bulunmaktadır. Randevu alarak yüz yüze görüşebilirsiniz." },
  { q: "Sadece web tasarım mı yapıyorsunuz?", a: "Hayır. Kurumsal web tasarımının yanında B2B/bayi sistemleri, özel CRM ve yazılım geliştirme, yapay zekâ agent, AI içerik üretimi ve iş süreci otomasyonu gibi geniş bir yelpazede hizmet veriyoruz." },
  { q: "Bursa dışındaki firmalarla çalışıyor musunuz?", a: "Evet. Bursa merkezli olsak da uzaktan çalışma modeliyle Türkiye genelindeki tüm firmalara hizmet veriyoruz." },
  { q: "Proje süreci ne kadar sürüyor?", a: "Süre projenin kapsamına göre değişir. DR AI destekli üretim sistemiyle çoğu kurumsal web projesi birkaç hafta içinde yayına alınır; özel yazılım projelerinde süre kapsama göre netleştirilir." },
];

export default function BursaLanding() {
  const [projects, setProjects] = useState([]);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    api.get("/projects").then((r) => setProjects(r.data || [])).catch(() => {});
  }, []);

  const url = `${SITE_URL}/bursa-web-tasarim`;
  const related = matchProjectsFor(projects, "bursa web tasarım kurumsal yazılım", [], 3);
  const services = SERVICES.slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": `${url}#localbusiness`,
        name: "Dijital Roket — Bursa Web Tasarım & Dijital Dönüşüm",
        url,
        telephone: PHONE_LINK,
        image: `${SITE_URL}/og-image.jpg`,
        priceRange: "₺₺",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Panayır Mah. 400. Sk. Okumuşlar Plaza No:2 İç Kapı No:12",
          addressLocality: "Osmangazi",
          addressRegion: "Bursa",
          addressCountry: "TR",
        },
        areaServed: [
          { "@type": "City", name: "Bursa" },
          { "@type": "Country", name: "Türkiye" },
        ],
        parentOrganization: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Bursa Web Tasarım", item: url },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: FAQ.map((x) => ({
          "@type": "Question",
          name: x.q,
          acceptedAnswer: { "@type": "Answer", text: x.a },
        })),
      },
    ],
  };

  return (
    <>
      <SEO
        title="Bursa Web Tasarım & Dijital Dönüşüm | Dijital Roket"
        description="Osmangazi/Bursa merkezli web tasarım, özel yazılım ve dijital dönüşüm ajansı. Kurumsal web, B2B, CRM ve DR AI destekli çözümler. Bursa + Türkiye geneli hizmet."
      />
      <JsonLd id="bursa" data={jsonLd} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#07111F] text-white">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute -top-20 left-1/4 h-[420px] w-[420px] rounded-full bg-[#2563EB]/25 blur-[120px]" />
        <div className="container-x relative pt-24 pb-16 max-w-4xl">
          <nav aria-label="breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-white/50" data-testid="bursa-breadcrumb">
              <li><Link to="/" className="hover:text-white">Ana Sayfa</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-white/80" aria-current="page">Bursa Web Tasarım</li>
            </ol>
          </nav>
          <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#22D3EE]">
            <MapPin className="h-3.5 w-3.5" /> Osmangazi / Bursa
          </span>
          <h1 className="mt-4 h1-display text-white">Bursa Web Tasarım ve Dijital Dönüşüm</h1>
          <p className="mt-5 text-base sm:text-lg text-white/75 leading-relaxed">
            Dijital Roket, Osmangazi/Bursa merkezli bir web tasarım, özel yazılım ve dijital dönüşüm şirketidir. Bursa'daki
            firmalara kurumsal web siteleri, B2B/bayi panelleri, özel CRM, mobil uygulama ve DR AI destekli içerik çözümleri
            geliştirir; Bursa merkezli olup Türkiye geneline hizmet verir.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/proje-talep" className="btn-primary" data-testid="bursa-cta-top">
              Bursa'da Projemi Konuşalım <ArrowRight className="h-4 w-4" />
            </Link>
            <a href={`tel:${PHONE_LINK}`} className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition">
              <Phone className="h-4 w-4" /> {PHONE}
            </a>
            <a href={`https://wa.me/${PHONE_LINK.replace("+", "")}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-[#22D3EE]/30 bg-[#22D3EE]/10 px-4 py-2.5 text-sm font-semibold text-[#22D3EE] hover:bg-[#22D3EE]/20 transition">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Content sections */}
      <section className="section bg-white">
        <div className="container-x max-w-3xl space-y-10">
          {SECTIONS.map((sec, i) => (
            <div key={i}>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#07111F]">{sec.h2}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-[#334155]">{sec.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services grid (internal links) */}
      <section className="pb-4 bg-white">
        <div className="container-x">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#07111F]">Bursa'da sunduğumuz hizmetler</h2>
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s) => (
              <Link key={s.slug} to={`/hizmetler/${s.slug}`} className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-[#F8FAFC] p-4 transition hover:border-[#2563EB]/40 hover:shadow-md" data-testid={`bursa-service-${s.slug}`}>
                <span className="text-sm font-semibold text-[#07111F]">{s.navLabel}</span>
                <ArrowUpRight className="h-4 w-4 text-[#2563EB] group-hover:translate-x-0.5 transition" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Address + map */}
      <section className="section bg-[#F8FAFC]">
        <div className="container-x grid lg:grid-cols-2 gap-8 items-stretch">
          <div className="rounded-2xl border border-slate-200 bg-white p-8">
            <span className="eyebrow">Bursa Ofisimiz</span>
            <h2 className="mt-3 font-heading text-2xl font-bold text-[#07111F]">Bize Bursa'da ulaşın</h2>
            <ul className="mt-6 space-y-4 text-sm text-[#334155]">
              <li className="flex items-start gap-3"><MapPin className="h-5 w-5 mt-0.5 text-[#2563EB]" /> {ADDRESS}</li>
              <li className="flex items-start gap-3"><Phone className="h-5 w-5 mt-0.5 text-[#2563EB]" /> <a href={`tel:${PHONE_LINK}`} className="hover:text-[#2563EB]">{PHONE}</a></li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/proje-talep" className="btn-primary">Proje Talep Et <ArrowRight className="h-4 w-4" /></Link>
              <a href={`https://wa.me/${PHONE_LINK.replace("+", "")}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[#07111F] hover:bg-slate-50 transition"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 min-h-[320px]">
            <iframe
              title="Dijital Roket Bursa Ofisi Harita"
              src={`https://www.google.com/maps?q=${MAP_QUERY}&output=embed`}
              className="h-full w-full min-h-[320px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* Related projects */}
      {related.length > 0 && (
        <section className="section bg-white">
          <div className="container-x">
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className="eyebrow">Referans Projeler</span>
                <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-bold text-[#07111F]">Geliştirdiğimiz işlerden örnekler</h2>
              </div>
              <Link to="/projeler" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-[#2563EB] hover:gap-2 transition-all">Tümü <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <Link key={p.slug} to={`/projeler/${p.slug}`} className="group rounded-2xl overflow-hidden border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl" data-testid={`bursa-related-${p.slug}`}>
                  <div className="h-40 overflow-hidden bg-[#0B1728]">
                    {p.cover_image && <img src={p.cover_image} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#2563EB]">{p.sector}</span>
                    <h3 className="mt-1.5 font-heading text-base font-semibold text-[#07111F] leading-snug line-clamp-2">{p.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="section bg-[#F8FAFC]">
        <div className="container-x max-w-3xl">
          <span className="eyebrow">Sık Sorulan Sorular</span>
          <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-bold text-[#07111F]">Bursa web tasarım hakkında merak edilenler</h2>
          <div className="mt-8 space-y-3">
            {FAQ.map((x, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className="rounded-2xl border border-slate-200 bg-white overflow-hidden" data-testid={`bursa-faq-${i}`}>
                  <button type="button" onClick={() => setOpenFaq(isOpen ? -1 : i)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left">
                    <span className="font-heading text-base font-bold text-[#07111F]">{x.q}</span>
                    <ChevronDown className={`h-5 w-5 shrink-0 text-[#2563EB] transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && <p className="px-6 pb-6 text-[15px] leading-relaxed text-[#334155]">{x.a}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
