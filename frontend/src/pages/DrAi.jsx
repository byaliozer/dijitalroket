import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Check } from "lucide-react";
import SEO from "../components/SEO";
import JsonLd from "../components/JsonLd";
import { SITE_URL } from "../components/OrganizationSchema";
import FinalCta from "../sections/FinalCta";

const CAPABILITIES = [
  { t: "Sosyal medya görsel üretimi", d: "Markaya özel logo, renk ve iletişim bilgileriyle sosyal medya görselleri üretir ve düzenler." },
  { t: "Proje geliştirme desteği", d: "Kurumsal web, panel ve yazılım projelerinde hızlı prototipleme ve üretim sürecini hızlandırır." },
  { t: "İçerik ve kreatif üretimi", d: "Reklam kreatifleri, kurumsal ve ürün görselleri gibi içeriklerin üretiminde kullanılır." },
  { t: "Asenkron üretim mimarisi", d: "Uzun süren üretim işlerini kuyruk ve polling mimarisiyle güvenle tamamlar." },
];

export default function DrAi() {
  const url = `${SITE_URL}/dr-ai`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        name: "DR AI Nedir?",
        url,
        description: "DR AI, Dijital Roket'in proje geliştirme ve içerik üretim süreçlerinde kullandığı yapay zekâ destekli üretim sistemidir.",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "tr-TR",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "DR AI", item: url },
        ],
      },
    ],
  };

  return (
    <>
      <SEO
        title="DR AI Nedir? | Dijital Roket"
        description="DR AI, Dijital Roket'in proje geliştirme ve içerik üretim süreçlerinde kullandığı yapay zekâ destekli üretim sistemidir. DR AI'ın Dijital Roket ile ilişkisini keşfedin."
      />
      <JsonLd id="dr-ai" data={jsonLd} />

      <section className="relative overflow-hidden bg-[#07111F] text-white">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute -top-20 left-1/3 h-[420px] w-[420px] rounded-full bg-[#22D3EE]/20 blur-[120px]" />
        <div className="container-x relative pt-24 pb-16 max-w-4xl">
          <nav aria-label="breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-white/50" data-testid="drai-breadcrumb">
              <li><Link to="/" className="hover:text-white">Ana Sayfa</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-white/80" aria-current="page">DR AI</li>
            </ol>
          </nav>
          <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#22D3EE]">
            <Sparkles className="h-3.5 w-3.5" /> Dijital Roket Teknoloji Katmanı
          </span>
          <h1 className="mt-4 h1-display text-white">DR AI Nedir?</h1>
          <p className="mt-5 text-base sm:text-lg text-white/75 leading-relaxed">
            DR AI, <strong className="text-white">Dijital Roket'in</strong> proje geliştirme ve içerik üretim süreçlerinde kullandığı
            yapay zekâ destekli üretim sistemidir. Ayrı bir şirket değil; Dijital Roket'in işleri daha hızlı, tutarlı ve ölçeklenebilir
            biçimde üretmesini sağlayan teknoloji katmanıdır.
          </p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-x max-w-3xl space-y-10">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#07111F]">DR AI'ın Dijital Roket ile ilişkisi</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[#334155]">
              DR AI bağımsız bir marka veya şirket değildir. Dijital Roket bünyesinde geliştirilen ve yalnızca Dijital Roket'in üretim
              süreçlerinde kullanılan bir yapay zekâ sistemidir. Bir müşteri Dijital Roket ile çalıştığında, projelerin arkasındaki
              üretim gücü DR AI tarafından desteklenir.
            </p>
          </div>
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#07111F]">DR AI ne işe yarar?</h2>
            <div className="mt-5 grid sm:grid-cols-2 gap-4">
              {CAPABILITIES.map((c, i) => (
                <div key={i} className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-5" data-testid={`drai-cap-${i}`}>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#2563EB]" />
                    <span className="font-heading font-bold text-[#07111F]">{c.t}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[#334155]">{c.d}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#07111F]">DR AI'ı deneyimlemek</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[#334155]">
              Markanıza özel sosyal medya görselleri üretmek için Marka Portalı üzerinden DR AI üretim sistemini kullanabilirsiniz.
              Dijital dönüşüm projeleriniz için ise ekibimizle görüşerek DR AI destekli üretim sürecinden faydalanabilirsiniz.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/hizmetler/ai-icerik-uretimi" className="btn-primary">AI İçerik Üretimini İncele <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/proje-talep" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[#07111F] hover:bg-slate-50 transition">Proje Talep Et</Link>
            </div>
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
