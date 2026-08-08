import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock, Calendar, RefreshCw, User, ExternalLink, ArrowUpRight, ArrowRight } from "lucide-react";
import { api } from "../lib/api";
import SEO from "../components/SEO";
import JsonLd from "../components/JsonLd";
import { SITE_URL } from "../components/OrganizationSchema";
import Markdown from "../components/Markdown";
import FinalCta from "../sections/FinalCta";
import { AUTHOR } from "../data/authorData";
import { matchServicesFor, matchProjectsFor, matchPostsFor, formatTrDate } from "../lib/related";

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [err, setErr] = useState("");
  const [projects, setProjects] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setPost(null);
    api.get(`/blog/${slug}`).then((r) => setPost(r.data)).catch(() => setErr("Yazı bulunamadı"));
  }, [slug]);

  useEffect(() => {
    api.get("/projects").then((r) => setProjects(r.data || [])).catch(() => {});
    api.get("/blog").then((r) => setPosts(r.data || [])).catch(() => {});
  }, []);

  if (err) {
    return (
      <div className="container-x py-32 text-center">
        <h1 className="h2-section">Yazı bulunamadı</h1>
        <Link to="/blog" className="mt-6 inline-flex btn-secondary">Bloga dön</Link>
      </div>
    );
  }
  if (!post) return <div className="container-x py-32 text-center text-[#334155]">Yükleniyor...</div>;

  const postUrl = `${SITE_URL}/blog/${post.slug}`;
  const faq = (post.faq || []).filter((x) => x?.q && x?.a);
  const matchText = `${post.title} ${post.category || ""} ${post.excerpt || ""}`;
  const relatedServices = matchServicesFor(matchText, post.tags, 3);
  const relatedProjects = matchProjectsFor(projects, matchText, post.tags, 3);
  const relatedPosts = matchPostsFor(posts, post.slug, post.category, 3);
  const published = formatTrDate(post.created_at);
  const updated = formatTrDate(post.updated_at);
  const showUpdated = updated && updated !== published;

  const graph = [
    {
      "@type": "BlogPosting",
      "@id": `${postUrl}#article`,
      headline: post.title,
      description: post.seo_description || post.excerpt || "",
      ...(post.cover_image ? { image: [post.cover_image] } : {}),
      ...(post.category ? { articleSection: post.category } : {}),
      ...(post.tags?.length ? { keywords: post.tags.join(", ") } : {}),
      datePublished: post.created_at,
      dateModified: post.updated_at || post.created_at,
      author: {
        "@type": "Person",
        name: AUTHOR.name,
        jobTitle: AUTHOR.jobTitle,
        url: AUTHOR.url,
        worksFor: { "@id": `${SITE_URL}/#organization` },
      },
      publisher: { "@id": `${SITE_URL}/#organization` },
      mainEntityOfPage: postUrl,
      inLanguage: "tr-TR",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: postUrl },
      ],
    },
  ];
  if (faq.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${postUrl}#faq`,
      mainEntity: faq.map((x) => ({
        "@type": "Question",
        name: x.q,
        acceptedAnswer: { "@type": "Answer", text: x.a },
      })),
    });
  }
  const articleJsonLd = { "@context": "https://schema.org", "@graph": graph };

  return (
    <>
      <SEO title={`${post.title} | Dijital Roket Blog`} description={post.seo_description || post.excerpt} image={post.cover_image} />
      <JsonLd id="blog-post" data={articleJsonLd} />
      <section className="relative overflow-hidden bg-[#07111F] text-white">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute -top-20 left-1/3 h-[420px] w-[420px] rounded-full bg-[#2563EB]/25 blur-[120px]" />
        <div className="container-x relative pt-24 pb-16 max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Tüm Yazılar
          </Link>
          <nav aria-label="breadcrumb" className="mt-4">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-white/50" data-testid="blog-breadcrumb">
              <li><Link to="/" className="hover:text-white">Ana Sayfa</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-white/80" aria-current="page">{post.title}</li>
            </ol>
          </nav>
          <div className="mt-6 block"><span className="eyebrow-light">{post.category}</span></div>
          <h1 className="mt-3 h1-display text-white">{post.title}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/60" data-testid="blog-meta">
            <span className="inline-flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-[#22D3EE]" /> {AUTHOR.name}</span>
            {published && <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-[#22D3EE]" /> {published}</span>}
            {showUpdated && <span className="inline-flex items-center gap-1.5"><RefreshCw className="h-3.5 w-3.5 text-[#22D3EE]" /> Güncelleme: {updated}</span>}
            <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-[#22D3EE]" /> {post.read_time} dk okuma</span>
          </div>
        </div>
      </section>

      {post.cover_image && (
        <div className="container-x -mt-10 max-w-3xl">
          <img src={post.cover_image} alt={post.title} className="rounded-2xl border border-slate-200 shadow-xl w-full h-[280px] sm:h-[380px] object-cover" />
        </div>
      )}

      <article className="section bg-white">
        <div className="container-x max-w-3xl">
          <Markdown source={post.content} />
        </div>
      </article>

      {faq.length > 0 && (
        <section className="pb-16 bg-white" data-testid="blog-faq">
          <div className="container-x max-w-3xl">
            <span className="eyebrow">Sık Sorulan Sorular</span>
            <h2 className="mt-3 font-heading text-2xl sm:text-3xl font-bold text-[#07111F]">
              Bu konuda merak edilenler
            </h2>
            <dl className="mt-8 space-y-4">
              {faq.map((x, i) => (
                <div key={i} className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6" data-testid={`blog-faq-item-${i}`}>
                  <dt className="font-heading text-base font-bold text-[#07111F]">{x.q}</dt>
                  <dd className="mt-2 text-[15px] leading-relaxed text-[#334155]">{x.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {/* Author E-E-A-T */}
      <section className="pb-12 bg-white" data-testid="blog-author">
        <div className="container-x max-w-3xl">
          <div className="flex flex-col sm:flex-row gap-5 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#22D3EE] text-white font-heading text-xl font-bold" aria-hidden="true">
              {AUTHOR.initials}
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-[#2563EB]">Yazar</div>
              <h3 className="mt-1 font-heading text-lg font-bold text-[#07111F]">{AUTHOR.name}</h3>
              <div className="text-sm font-medium text-[#334155]">{AUTHOR.title}</div>
              <p className="mt-3 text-sm leading-relaxed text-[#334155]">{AUTHOR.bio}</p>
              <a href={AUTHOR.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] hover:gap-2 transition-all" data-testid="blog-author-link">
                {AUTHOR.url.replace(/^https?:\/\//, "").replace(/\/$/, "")} <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Internal links: related services */}
      {relatedServices.length > 0 && (
        <section className="pb-4 bg-white">
          <div className="container-x max-w-3xl">
            <h2 className="font-heading text-xl font-bold text-[#07111F]">İlgili hizmetlerimiz</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {relatedServices.map((s) => (
                <Link key={s.slug} to={`/hizmetler/${s.slug}`} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-[#F8FAFC] px-4 py-2 text-sm font-medium text-[#334155] hover:border-[#2563EB]/40 hover:text-[#07111F] transition" data-testid={`blog-rel-service-${s.slug}`}>
                  {s.navLabel} çözümlerimizi inceleyin <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Internal links: related projects */}
      {relatedProjects.length > 0 && (
        <section className="section bg-white">
          <div className="container-x">
            <span className="eyebrow">İlgili Projeler</span>
            <h2 className="mt-2 font-heading text-2xl font-bold text-[#07111F]">Bu konuyla ilgili işlerimiz</h2>
            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProjects.map((p) => (
                <Link key={p.slug} to={`/projeler/${p.slug}`} className="group rounded-2xl overflow-hidden border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl" data-testid={`blog-rel-project-${p.slug}`}>
                  <div className="h-36 overflow-hidden bg-[#0B1728]">
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

      {/* Internal links: related posts */}
      {relatedPosts.length > 0 && (
        <section className="pb-16 bg-white">
          <div className="container-x">
            <h2 className="font-heading text-xl font-bold text-[#07111F]">İlgili yazılar</h2>
            <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((p) => (
                <Link key={p.slug} to={`/blog/${p.slug}`} className="group card-elevate p-5" data-testid={`blog-rel-post-${p.slug}`}>
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#2563EB]">{p.category}</span>
                  <h3 className="mt-1.5 font-heading text-base font-semibold text-[#07111F] leading-snug line-clamp-2">{p.title}</h3>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#2563EB] group-hover:gap-1.5 transition-all">Oku <ArrowRight className="h-3.5 w-3.5" /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <FinalCta />
    </>
  );
}
