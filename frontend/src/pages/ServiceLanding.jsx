import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown, ArrowRight, ArrowUpRight, Check, Phone, MessageCircle } from "lucide-react";
import { api } from "../lib/api";
import { getService, SERVICES } from "../data/servicesData";
import { matchPostsForKeywords } from "../lib/related";
import SEO from "../components/SEO";
import JsonLd from "../components/JsonLd";
import { SITE_URL } from "../components/OrganizationSchema";
import FinalCta from "../sections/FinalCta";

function matchProjects(all, keywords) {
  const kw = keywords.map((k) => k.toLowerCase());
  const hit = all.filter((p) => {
    const hay = `${p.sector || ""} ${(p.tags || []).join(" ")} ${p.title || ""}`.toLowerCase();
    return kw.some((k) => hay.includes(k));
  });
  const base = hit.length ? hit : all.filter((p) => p.featured);
  return (base.length ? base : all).slice(0, 3);
}

export default function ServiceLanding() {
  const { slug } = useParams();
  const service = getService(slug);
  const [projects, setProjects] = useState([]);
  const [posts, setPosts] = useState([]);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    api.get("/projects").then((r) => setProjects(r.data || [])).catch(() => {});
    api.get("/blog").then((r) => setPosts(r.data || [])).catch(() => {});
  }, []);

  if (!service) return <Navigate to="/hizmetler" replace />;

  const url = `${SITE_URL}/hizmetler/${service.slug}`;
  const related = matchProjects(projects, service.keywords);
  const relatedPosts = matchPostsForKeywords(posts, [...service.keywords, service.navLabel], 3);
  const otherServices = SERVICES.filter((s) => s.slug !== service.slug).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: service.h1,
        serviceType: service.navLabel,
        description: service.metaDescription,
        provider: { "@id": `${SITE_URL}/#organization` },
        areaServed: { "@type": "Country", name: "Türkiye" },
        url,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Hizmetler", item: `${SITE_URL}/hizmetler` },
          { "@type": "ListItem", position: 3, name: service.navLabel, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: service.faq.map((x) => ({
          "@type": "Question",
          name: x.q,
          acceptedAnswer: { "@type": "Answer", text: x.a },
        })),
      },
    ],
  };

  return (
    <>
      <SEO title={service.metaTitle} description={service.metaDescription} />
      <JsonLd id="service" data={jsonLd} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#07111F] text-white">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute -top-20 left-1/4 h-[420px] w-[420px] rounded-full bg-[#2563EB]/25 blur-[120px]" />
        <div className="container-x relative pt-24 pb-16 max-w-4xl">
          <nav aria-label="breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-white/50" data-testid="service-breadcrumb">
              <li><Link to="/" className="hover:text-white">Ana Sayfa</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link to="/hizmetler" className="hover:text-white">Hizmetler</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-white/80" aria-current="page">{service.navLabel}</li>
            </ol>
          </nav>
          <h1 className="mt-5 h1-display text-white">{service.h1}</h1>
          <p className="mt-5 text-base sm:text-lg text-white/70 leading-relaxed">{service.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/proje-talep" className="btn-primary" data-testid="service-cta-top">
              Firmanıza Uygun Sistemi Planlayalım <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="tel:+905437934101" className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition">
              <Phone className="h-4 w-4" /> 0543 793 41 01
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section bg-white">
        <div className="container-x">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {service.features.map((f, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-[#F8FAFC] p-4" data-testid={`service-feature-${i}`}>
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2563EB]/10 text-[#2563EB]"><Check className="h-3.5 w-3.5" /></span>
                <span className="text-sm font-medium text-[#07111F]">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content sections */}
      <section className="pb-4 bg-white">
        <div className="container-x max-w-3xl space-y-10">
          {service.sections.map((sec, i) => (
            <div key={i}>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#07111F]">{sec.h2}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-[#334155]">{sec.body}</p>
              {sec.bullets && (
                <ul className="mt-4 grid sm:grid-cols-2 gap-2">
                  {sec.bullets.map((b, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-[#334155]">
                      <Check className="h-4 w-4 text-[#2563EB]" /> {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Related projects */}
      {related.length > 0 && (
        <section className="section bg-[#F8FAFC]">
          <div className="container-x">
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className="eyebrow">İlgili Projeler</span>
                <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-bold text-[#07111F]">Bu alanda geliştirdiğimiz işler</h2>
              </div>
              <Link to="/projeler" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-[#2563EB] hover:gap-2 transition-all">Tümü <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <Link key={p.slug} to={`/projeler/${p.slug}`} className="group rounded-2xl overflow-hidden border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl" data-testid={`service-related-${p.slug}`}>
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
      <section className="section bg-white">
        <div className="container-x max-w-3xl">
          <span className="eyebrow">Sık Sorulan Sorular</span>
          <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-bold text-[#07111F]">{service.navLabel} hakkında merak edilenler</h2>
          <div className="mt-8 space-y-3">
            {service.faq.map((x, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className="rounded-2xl border border-slate-200 bg-[#F8FAFC] overflow-hidden" data-testid={`service-faq-${i}`}>
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

      {/* Related blog posts (internal links) */}
      {relatedPosts.length > 0 && (
        <section className="pb-4 bg-white" data-testid="service-related-posts">
          <div className="container-x">
            <h2 className="font-heading text-xl font-bold text-[#07111F]">İlgili blog yazıları</h2>
            <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((p) => (
                <Link key={p.slug} to={`/blog/${p.slug}`} className="group card-elevate p-5" data-testid={`service-rel-post-${p.slug}`}>
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#2563EB]">{p.category}</span>
                  <h3 className="mt-1.5 font-heading text-base font-semibold text-[#07111F] leading-snug line-clamp-2">{p.title}</h3>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#2563EB] group-hover:gap-1.5 transition-all">Oku <ArrowRight className="h-3.5 w-3.5" /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Internal links to other services */}
      <section className="pb-16 bg-white">
        <div className="container-x">
          <h2 className="font-heading text-xl font-bold text-[#07111F]">Diğer hizmetlerimiz</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {otherServices.map((s) => (
              <Link key={s.slug} to={`/hizmetler/${s.slug}`} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-[#F8FAFC] px-4 py-2 text-sm font-medium text-[#334155] hover:border-[#2563EB]/40 hover:text-[#07111F] transition">
                {s.navLabel} <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
