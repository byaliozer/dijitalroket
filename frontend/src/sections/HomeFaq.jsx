import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteSettings } from "../context/SiteSettingsContext";
import JsonLd from "../components/JsonLd";
import { SITE_URL } from "../components/OrganizationSchema";

export default function HomeFaq() {
  const { settings } = useSiteSettings();
  const [open, setOpen] = useState(0);
  const faq = (settings?.home_faq || []).filter((x) => x?.q && x?.a);
  if (!faq.length) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: faq.map((x) => ({
      "@type": "Question",
      name: x.q,
      acceptedAnswer: { "@type": "Answer", text: x.a },
    })),
  };

  return (
    <section className="section bg-white" data-testid="home-faq">
      <JsonLd id="home-faq" data={jsonLd} />
      <div className="container-x max-w-3xl">
        <div className="text-center">
          <span className="eyebrow justify-center">Sık Sorulan Sorular</span>
          <h2 className="mt-3 font-heading text-3xl sm:text-4xl font-bold text-[#07111F]">
            Dijital Roket hakkında merak edilenler
          </h2>
          <p className="mt-4 text-[15px] text-[#334155]">
            Yapay zekâ asistanlarına en çok sorulan soruların yanıtları.
          </p>
        </div>
        <div className="mt-10 space-y-3">
          {faq.map((x, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-[#F8FAFC] overflow-hidden"
                data-testid={`home-faq-item-${i}`}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  data-testid={`home-faq-toggle-${i}`}
                >
                  <span className="font-heading text-base font-bold text-[#07111F]">{x.q}</span>
                  <ChevronDown className={`h-5 w-5 shrink-0 text-[#2563EB] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="px-6 pb-6 text-[15px] leading-relaxed text-[#334155]">{x.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
