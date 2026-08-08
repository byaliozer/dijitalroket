import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "../lib/api";
import SEO from "../components/SEO";
import JsonLd from "../components/JsonLd";
import { SITE_URL } from "../components/OrganizationSchema";
import FinalCta from "../sections/FinalCta";
import Markdown from "../components/Markdown";
import { matchServicesFor, matchPostsForKeywords } from "../lib/related";

// inline helper removed — now using shared Markdown component.

export default function ProjectDetail() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [err, setErr] = useState("");
  const [lightbox, setLightbox] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setItem(null);
    api.get(`/projects/${slug}`).then((r) => setItem(r.data)).catch(() => setErr("Proje bulunamadı"));
  }, [slug]);

  useEffect(() => {
    api.get("/blog").then((r) => setPosts(r.data || [])).catch(() => {});
  }, []);

  if (err) {
    return (
      <div className="container-x py-32 text-center">
        <h1 className="h2-section">Proje bulunamadı</h1>
        <Link to="/projeler" className="mt-6 inline-flex btn-secondary">Projelere dön</Link>
      </div>
    );
  }
  if (!item) return <div className="container-x py-32 text-center text-[#334155]">Yükleniyor...</div>;

  const gallery = item.gallery || [];
  const faq = (item.faq || []).filter((x) => x?.q && x?.a);
  const matchText = `${item.title} ${item.sector || ""} ${item.need || ""} ${item.solution || ""}`;
  const relatedServices = matchServicesFor(matchText, item.tags, 3);
  const relatedPosts = matchPostsForKeywords(posts, [...(item.tags || []), item.sector, item.title].filter(Boolean), 3);
  const projectUrl = `${SITE_URL}/projeler/${item.slug}`;
  const jsonLdGraph = [
    {
      "@type": "Article",
      "@id": `${projectUrl}#article`,
      headline: item.title,
      description: item.seo_description || item.need || "",
      ...(item.cover_image ? { image: [item.cover_image] } : {}),
      ...(item.sector ? { about: item.sector } : {}),
      ...(item.tags?.length ? { keywords: item.tags.join(", ") } : {}),
      author: { "@id": `${SITE_URL}/#organization` },
      publisher: { "@id": `${SITE_URL}/#organization` },
      mainEntityOfPage: projectUrl,
      inLanguage: "tr-TR",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Projeler", item: `${SITE_URL}/projeler` },
        { "@type": "ListItem", position: 3, name: item.title, item: projectUrl },
      ],
    },
  ];
  if (faq.length) {
    jsonLdGraph.push({
      "@type": "FAQPage",
      "@id": `${projectUrl}#faq`,
      mainEntity: faq.map((x) => ({
        "@type": "Question",
        name: x.q,
        acceptedAnswer: { "@type": "Answer", text: x.a },
      })),
    });
  }
  const projectJsonLd = { "@context": "https://schema.org", "@graph": jsonLdGraph };

  return (
    <>
      <SEO title={`${item.title} | Dijital Roket`} description={item.seo_description || item.need} image={item.cover_image} />
      <JsonLd id="project" data={projectJsonLd} />
      <section className="relative overflow-hidden bg-[#07111F] text-white">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute -top-20 left-1/4 h-[420px] w-[420px] rounded-full bg-[#2563EB]/25 blur-[120px]" />
        <div className="container-x relative pt-24 pb-16">
          <Link to="/projeler" className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Tüm Projeler
          </Link>
          <nav aria-label="breadcrumb" className="mt-4">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-white/50" data-testid="project-breadcrumb">
              <li><Link to="/" className="hover:text-white">Ana Sayfa</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link to="/projeler" className="hover:text-white">Projeler</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-white/80" aria-current="page">{item.title}</li>
            </ol>
          </nav>
          <div className="mt-6 block"><span className="eyebrow-light">{item.sector}</span></div>
          <h1 className="mt-3 h1-display text-white max-w-4xl">{item.title}</h1>
          <div className="mt-4 flex flex-wrap gap-2">
            {(item.tags || []).map((t) => (
              <span key={t} className="rounded-md border border-white/15 bg-white/5 px-2.5 py-1 text-xs uppercase tracking-wide text-white/70">{t}</span>
            ))}
          </div>
          {item.external_url && (
            <a
              href={item.external_url}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 backdrop-blur px-4 py-2 text-sm text-white hover:bg-white/10 transition"
            >
              <ExternalLink className="h-3.5 w-3.5" /> {item.external_url.replace(/^https?:\/\//, "")}
            </a>
          )}
        </div>
      </section>

      {item.cover_image && (
        <div className="container-x -mt-10">
          <img
            src={item.cover_image}
            alt={item.title}
            className="rounded-2xl border border-slate-200 shadow-xl w-full h-[280px] sm:h-[460px] object-cover bg-[#07111F]"
          />
        </div>
      )}

      {/* Summary cards */}
      <section className="pt-16 pb-8 bg-white">
        <div className="container-x grid gap-6 lg:grid-cols-3">
          {[
            { label: "İhtiyaç", body: item.need },
            { label: "Çözüm", body: item.solution },
            { label: "Sonuç", body: item.result },
          ].map((b) => (
            <div key={b.label} className="card-elevate p-7">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#2563EB]">{b.label}</div>
              <p className="mt-3 text-[15px] leading-relaxed text-[#334155]">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Full content */}
      {item.content && (
        <article className="pb-12 bg-white">
          <div className="container-x max-w-3xl"><Markdown source={item.content} /></div>
        </article>
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="pb-20 bg-white" data-testid="project-gallery">
          <div className="container-x">
            <div className="max-w-3xl mb-10">
              <span className="eyebrow">Proje Galerisi</span>
              <h2 className="mt-3 font-heading text-2xl sm:text-3xl font-bold text-[#07111F]">
                Çalışmadan Kareler
              </h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((g, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: (i % 3) * 0.06 }}
                  onClick={() => setLightbox(g)}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-[#F8FAFC] aspect-[4/3] text-left"
                  data-testid={`gallery-item-${i}`}
                >
                  <img
                    src={g.url}
                    alt={g.caption || `${item.title} - görsel ${i + 1}`}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {g.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#07111F]/90 via-[#07111F]/50 to-transparent p-4">
                      <p className="text-sm font-medium text-white leading-snug">{g.caption}</p>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      )}

      {faq.length > 0 && (
        <section className="pb-16 bg-white" data-testid="project-faq">
          <div className="container-x max-w-3xl">
            <span className="eyebrow">Sık Sorulan Sorular</span>
            <h2 className="mt-3 font-heading text-2xl sm:text-3xl font-bold text-[#07111F]">
              Bu proje hakkında merak edilenler
            </h2>
            <dl className="mt-8 space-y-4">
              {faq.map((x, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6"
                  data-testid={`faq-item-${i}`}
                >
                  <dt className="font-heading text-base font-bold text-[#07111F]">{x.q}</dt>
                  <dd className="mt-2 text-[15px] leading-relaxed text-[#334155]">{x.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {/* Internal links: related services */}
      {relatedServices.length > 0 && (
        <section className="pb-4 bg-white" data-testid="project-related-services">
          <div className="container-x">
            <h2 className="font-heading text-xl font-bold text-[#07111F]">Bu projeyle ilgili hizmetlerimiz</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {relatedServices.map((s) => (
                <Link key={s.slug} to={`/hizmetler/${s.slug}`} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-[#F8FAFC] px-4 py-2 text-sm font-medium text-[#334155] hover:border-[#2563EB]/40 hover:text-[#07111F] transition" data-testid={`project-rel-service-${s.slug}`}>
                  {s.navLabel} çözümlerimizi inceleyin <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Internal links: related posts */}
      {relatedPosts.length > 0 && (
        <section className="pb-12 bg-white" data-testid="project-related-posts">
          <div className="container-x">
            <h2 className="font-heading text-xl font-bold text-[#07111F]">İlgili yazılar</h2>
            <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((p) => (
                <Link key={p.slug} to={`/blog/${p.slug}`} className="group card-elevate p-5" data-testid={`project-rel-post-${p.slug}`}>
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#2563EB]">{p.category}</span>
                  <h3 className="mt-1.5 font-heading text-base font-semibold text-[#07111F] leading-snug line-clamp-2">{p.title}</h3>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#2563EB] group-hover:gap-1.5 transition-all">Oku <ArrowRight className="h-3.5 w-3.5" /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="container-x mb-16 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-3xl border border-slate-200 bg-[#F8FAFC] p-8">
        <div>
          <h3 className="h3-card">Benzer bir proje sizin için de mümkün.</h3>
          <p className="mt-2 text-sm text-[#334155]">Bu vakaya benzer bir ihtiyaç için kapsam sohbeti planlayalım.</p>
        </div>
        <Link to="/proje-talep" className="btn-primary">Projemi Analiz Edin <ArrowRight className="h-4 w-4" /></Link>
      </div>

      <FinalCta />

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setLightbox(null)}
          data-testid="gallery-lightbox"
        >
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.url} alt={lightbox.caption} className="w-full max-h-[80vh] object-contain rounded-xl" />
            {lightbox.caption && (
              <p className="mt-4 text-center text-sm text-white/80">{lightbox.caption}</p>
            )}
            <button
              onClick={() => setLightbox(null)}
              className="mt-3 mx-auto block text-xs text-white/60 hover:text-white"
            >
              Kapatmak için herhangi bir yere tıklayın
            </button>
          </div>
        </div>
      )}
    </>
  );
}
