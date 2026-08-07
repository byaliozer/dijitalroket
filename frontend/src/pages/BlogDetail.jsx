import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import { api } from "../lib/api";
import SEO from "../components/SEO";
import JsonLd from "../components/JsonLd";
import { SITE_URL } from "../components/OrganizationSchema";
import Markdown from "../components/Markdown";
import FinalCta from "../sections/FinalCta";

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    api.get(`/blog/${slug}`).then((r) => setPost(r.data)).catch(() => setErr("Yazı bulunamadı"));
  }, [slug]);

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
  const graph = [
      {
        "@type": "Article",
        "@id": `${postUrl}#article`,
        headline: post.title,
        description: post.seo_description || post.excerpt || "",
        ...(post.cover_image ? { image: [post.cover_image] } : {}),
        ...(post.category ? { articleSection: post.category } : {}),
        ...(post.tags?.length ? { keywords: post.tags.join(", ") } : {}),
        datePublished: post.created_at,
        dateModified: post.updated_at || post.created_at,
        author: { "@id": `${SITE_URL}/#organization` },
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
      <SEO title={`${post.title} | Dijital Roket Blog`} description={post.seo_description || post.excerpt} />
      <JsonLd id="blog-post" data={articleJsonLd} />
      <section className="relative overflow-hidden bg-[#07111F] text-white">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute -top-20 left-1/3 h-[420px] w-[420px] rounded-full bg-[#2563EB]/25 blur-[120px]" />
        <div className="container-x relative pt-24 pb-16 max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Tüm Yazılar
          </Link>
          <div className="mt-6 block"><span className="eyebrow-light">{post.category}</span></div>
          <h1 className="mt-3 h1-display text-white">{post.title}</h1>
          <div className="mt-4 inline-flex items-center gap-1.5 text-sm text-white/60">
            <Clock className="h-3.5 w-3.5" /> {post.read_time} dakikalık okuma
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

      <FinalCta />
    </>
  );
}
