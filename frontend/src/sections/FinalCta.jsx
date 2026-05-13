import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";

const CTA_BG = "https://static.prod-images.emergentagent.com/jobs/4563ce39-d136-4158-943b-98a85fea66a9/images/bf36a3370e6682320e9e8ad812ca5a29125baf68971acdf711b896f9ffc22e4a.png";

export default function FinalCta() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32" data-testid="final-cta">
      <div className="absolute inset-0">
        <img src={CTA_BG} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#051512]/85 via-[#0A1F1A]/85 to-[#051512]/95" />
        <div className="absolute inset-0 bg-grid opacity-20" />
      </div>

      <div className="container-x relative text-center max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-heading font-extrabold tracking-tight text-3xl sm:text-5xl text-white leading-tight"
        >
          Şirketinizde Dijitalleşmeyi<br />
          <span className="text-gradient">Bekleyen Süreçler Var mı?</span>
        </motion.h2>
        <p className="mt-6 text-base sm:text-lg text-white/70 max-w-2xl mx-auto">
          Web sitenizden müşteri takip panelinize, bayi sisteminizden sosyal medya üretiminize kadar tüm dijital
          ihtiyaçlarınızı birlikte analiz edelim.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-3">
          <Link to="/proje-talep" data-testid="final-cta-primary" className="btn-primary animate-glow-pulse">
            Projemi Analiz Edin <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/iletisim" data-testid="final-cta-secondary" className="btn-ghost-dark">
            <Phone className="h-4 w-4" /> İletişime Geçin
          </Link>
        </div>
      </div>
    </section>
  );
}
