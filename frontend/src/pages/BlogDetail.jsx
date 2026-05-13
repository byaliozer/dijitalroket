import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import { api } from "../lib/api";
import SEO from "../components/SEO";
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

  return (
    <>
      <SEO title={`${post.title} | Dijital Roket Blog`} description={post.excerpt} />
      <section className="relative overflow-hidden bg-[#0A1F1A] text-white">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute -top-20 left-1/3 h-[420px] w-[420px] rounded-full bg-[#059669]/25 blur-[120px]" />
        <div className="container-x relative pt-24 pb-16 max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Tüm Yazılar
          </Link>
          <span className="mt-6 eyebrow-light">{post.category}</span>
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
        <div className="container-x max-w-3xl prose prose-slate">
          {post.content.split("\n\n").map((para, i) => (
            <p key={i} className="text-[17px] leading-[1.85] text-[#334155] mb-5">{para}</p>
          ))}
        </div>
      </article>
      <FinalCta />
    </>
  );
}
