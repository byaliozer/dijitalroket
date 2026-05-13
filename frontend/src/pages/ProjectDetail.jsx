import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { api } from "../lib/api";
import SEO from "../components/SEO";
import FinalCta from "../sections/FinalCta";

export default function ProjectDetail() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    api.get(`/projects/${slug}`).then((r) => setItem(r.data)).catch(() => setErr("Proje bulunamadı"));
  }, [slug]);

  if (err) {
    return (
      <div className="container-x py-32 text-center">
        <h1 className="h2-section">Proje bulunamadı</h1>
        <Link to="/projeler" className="mt-6 inline-flex btn-secondary">Projelere dön</Link>
      </div>
    );
  }
  if (!item) return <div className="container-x py-32 text-center text-[#334155]">Yükleniyor...</div>;

  return (
    <>
      <SEO title={`${item.title} | Dijital Roket`} description={item.need} />
      <section className="relative overflow-hidden bg-[#07111F] text-white">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute -top-20 left-1/4 h-[420px] w-[420px] rounded-full bg-[#2563EB]/25 blur-[120px]" />
        <div className="container-x relative pt-24 pb-16">
          <Link to="/projeler" className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Tüm Projeler
          </Link>
          <span className="mt-6 eyebrow-light">{item.sector}</span>
          <h1 className="mt-3 h1-display text-white max-w-3xl">{item.title}</h1>
          <div className="mt-4 flex flex-wrap gap-2">
            {(item.tags || []).map((t) => (
              <span key={t} className="rounded-md border border-white/15 bg-white/5 px-2.5 py-1 text-xs uppercase tracking-wide text-white/70">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {item.cover_image && (
        <div className="container-x -mt-10">
          <img src={item.cover_image} alt={item.title} className="rounded-2xl border border-slate-200 shadow-xl w-full h-[280px] sm:h-[420px] object-cover" />
        </div>
      )}

      <section className="section bg-white">
        <div className="container-x grid gap-10 lg:grid-cols-3">
          {[
            { label: "İhtiyaç", body: item.need },
            { label: "Çözüm", body: item.solution },
            { label: "Sonuç", body: item.result },
          ].map((b) => (
            <div key={b.label} className="card-elevate p-7">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#2563EB]">{b.label}</div>
              <p className="mt-3 body-lg">{b.body}</p>
            </div>
          ))}
        </div>

        <div className="container-x mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-3xl border border-slate-200 bg-[#F8FAFC] p-8">
          <div>
            <h3 className="h3-card">Benzer bir proje sizin için de mümkün.</h3>
            <p className="mt-2 text-sm text-[#334155]">Bu vakaya benzer bir ihtiyaç için kapsam sohbeti planlayalım.</p>
          </div>
          <Link to="/proje-talep" className="btn-primary">Projemi Analiz Edin <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
      <FinalCta />
    </>
  );
}
