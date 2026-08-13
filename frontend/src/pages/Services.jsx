import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Globe, Network, Users, Code2, Bot, Sparkles, Share2, Workflow } from "lucide-react";
import { SERVICES } from "../data/servicesData";
import SEO from "../components/SEO";
import JsonLd from "../components/JsonLd";
import { SITE_URL } from "../components/OrganizationSchema";
import FinalCta from "../sections/FinalCta";

const ICONS = { Globe, Network, Users, Code2, Bot, Sparkles, Share2, Workflow };

export default function Services() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Hizmetler", item: `${SITE_URL}/hizmetler` },
        ],
      },
      {
        "@type": "ItemList",
        name: "Dijital Roket Hizmetleri",
        itemListElement: SERVICES.map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: s.navLabel,
          url: `${SITE_URL}/hizmetler/${s.slug}`,
        })),
      },
    ],
  };

  return (
    <>
      <SEO
        title="Dijital Roket Hizmetleri | Yazılım, B2B, CRM & AI"
        description="Kurumsal web tasarımından B2B bayi sistemlerine, özel CRM ve yazılımdan AI Agent çözümlerine kadar Dijital Roket'in kurumsal teknoloji hizmetlerini keşfedin."
      />
      <JsonLd id="services-hub" data={jsonLd} />

      <section className="relative overflow-hidden bg-[#07111F] text-white">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute -top-20 left-1/3 h-[420px] w-[420px] rounded-full bg-[#2563EB]/25 blur-[120px]" />
        <div className="container-x relative pt-24 pb-16 max-w-4xl">
          <span className="eyebrow-light">DR AI Destekli Üretim</span>
          <h1 className="mt-4 h1-display text-white">Dijital Roket Hizmetleri</h1>
          <p className="mt-5 text-base sm:text-lg text-white/70 leading-relaxed">
            Kurumsal web sitelerinden firmaya özel B2B panellerine, özel CRM ve yazılım geliştirmeden yapay zekâ agent'larına kadar
            dijital dönüşümünüzün her adımını tek çatı altında planlıyor ve geliştiriyoruz. Aşağıdan ihtiyacınıza uygun hizmeti inceleyin.
          </p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-x">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s, i) => {
              const Icon = ICONS[s.icon] || Globe;
              return (
                <motion.div
                  key={s.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={`/hizmetler/${s.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 transition hover:-translate-y-1 hover:border-[#2563EB]/40 hover:shadow-xl"
                    data-testid={`service-card-${s.slug}`}
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563EB] to-[#22D3EE] text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h2 className="mt-4 font-heading text-lg font-bold text-[#07111F]">{s.navLabel}</h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-[#334155] line-clamp-3">{s.intro}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#2563EB] group-hover:gap-2 transition-all">
                      İncele <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <Link to="/proje-talep" className="btn-primary">Projenizi Konuşalım <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
