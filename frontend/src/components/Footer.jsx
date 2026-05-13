import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Linkedin, Instagram, Twitter, Rocket } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-[#020617] text-white" data-testid="site-footer">
      <div className="container-x py-20 grid gap-12 lg:grid-cols-4">
        <div>
          <Logo variant="light" />
          <p className="mt-5 text-sm leading-relaxed text-white/60 max-w-xs">
            DR AI destekli kurumsal web, yazılım, içerik ve dijital dönüşüm çözümleri. Şirketinizi dijitalde roketliyoruz.
          </p>
          <div className="mt-6 flex gap-3">
            {[Linkedin, Instagram, Twitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                data-testid={`footer-social-${i}`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white/70 transition hover:bg-white/5 hover:text-white"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-[#22D3EE]">Çözümler</h4>
          <ul className="mt-5 space-y-3 text-sm text-white/70">
            <li><Link to="/kurumsal-cozumler" className="hover:text-white">Kurumsal Web</Link></li>
            <li><Link to="/kurumsal-cozumler" className="hover:text-white">B2B Sistemler</Link></li>
            <li><Link to="/kurumsal-cozumler" className="hover:text-white">CRM Benzeri Paneller</Link></li>
            <li><Link to="/kurumsal-cozumler" className="hover:text-white">Sosyal Medya Üretimi</Link></li>
            <li><Link to="/roket-partner" className="hover:text-white">Roket Partner</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-[#22D3EE]">Şirket</h4>
          <ul className="mt-5 space-y-3 text-sm text-white/70">
            <li><Link to="/hakkimizda" className="hover:text-white">Hakkımızda</Link></li>
            <li><Link to="/projeler" className="hover:text-white">Projeler</Link></li>
            <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
            <li><Link to="/iletisim" className="hover:text-white">İletişim</Link></li>
            <li><Link to="/dr-ai-sistemi" className="hover:text-white">DR AI Sistemi</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-[#22D3EE]">İletişim</h4>
          <ul className="mt-5 space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 text-[#22D3EE]" /> 0543 793 41 01</li>
            <li className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5 text-[#22D3EE]" /> info@dijitalroket.com</li>
            <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-[#22D3EE]" /> Bursa, Türkiye</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="container-x py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <span>© 2026 Dijital Roket. Tüm hakları saklıdır.</span>
          <span className="inline-flex items-center gap-2">
            <Rocket className="h-3 w-3 text-[#22D3EE]" /> DR AI Üretim Sistemi ile yayında.
          </span>
        </div>
      </div>
    </footer>
  );
}
