import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Linkedin, Instagram, Twitter, Rocket } from "lucide-react";
import Logo from "./Logo";
import { useSiteSettings } from "../context/SiteSettingsContext";

export default function Footer() {
  const { settings } = useSiteSettings();
  const phone = settings?.contact_phone || "0543 793 41 01";
  const phoneLink = settings?.contact_phone_link || "+905437934101";
  const email = settings?.contact_email || "byaliozer@gmail.com";
  const address = settings?.contact_address || "Bursa, Türkiye";

  const socials = [
    settings?.social_linkedin && { icon: Linkedin, href: settings.social_linkedin },
    settings?.social_instagram && { icon: Instagram, href: settings.social_instagram },
    settings?.social_twitter && { icon: Twitter, href: settings.social_twitter },
  ].filter(Boolean);

  const googlePlayUrl = settings?.app_google_play || "";
  const appStoreUrl = settings?.app_app_store || "";

  return (
    <footer className="bg-[#020617] text-white" data-testid="site-footer">
      <div className="container-x py-20 grid gap-12 lg:grid-cols-4">
        <div>
          <Logo variant="light" />
          <p className="mt-5 text-sm leading-relaxed text-white/60 max-w-xs">
            DR AI destekli kurumsal web, yazılım, içerik ve dijital dönüşüm çözümleri. Şirketinizi dijitalde roketliyoruz.
          </p>
          {socials.length > 0 && (
            <div className="mt-6 flex gap-3">
              {socials.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  data-testid={`footer-social-${i}`}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white/70 transition hover:bg-white/5 hover:text-white"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-[#22D3EE]">Çözümler</h4>
          <ul className="mt-5 space-y-3 text-sm text-white/70">
            <li><Link to="/kurumsal-cozumler" className="hover:text-white">Kurumsal Web</Link></li>
            <li><Link to="/kurumsal-cozumler" className="hover:text-white">B2B Sistemler</Link></li>
            <li><Link to="/kurumsal-cozumler" className="hover:text-white">CRM Benzeri Paneller</Link></li>
            <li><Link to="/kurumsal-cozumler" className="hover:text-white">Sosyal Medya Üretimi</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-[#22D3EE]">Şirket</h4>
          <ul className="mt-5 space-y-3 text-sm text-white/70">
            <li><Link to="/hakkimizda" className="hover:text-white">Hakkımızda</Link></li>
            <li><Link to="/projeler" className="hover:text-white">Projeler</Link></li>
            <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
            <li><Link to="/iletisim" className="hover:text-white">İletişim</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-[#22D3EE]">İletişim</h4>
          <ul className="mt-5 space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <Phone className="h-4 w-4 mt-0.5 text-[#22D3EE]" />
              <a href={`tel:${phoneLink}`} className="hover:text-white">{phone}</a>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="h-4 w-4 mt-0.5 text-[#22D3EE]" />
              <a href={`mailto:${email}`} className="hover:text-white break-all">{email}</a>
            </li>
            <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-[#22D3EE]" /> {address}</li>
          </ul>
        </div>
      </div>

      {/* DR AI App promo strip */}
      {(googlePlayUrl || appStoreUrl || settings?.social_instagram) && (
        <div className="border-t border-white/5">
          <div className="container-x py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-md">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#22D3EE]">DR AI · Sosyal Medya Stüdyosu</div>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">
                Yapay zekâ destekli sosyal medya üretim uygulamamızı şimdi indirin veya bizi Instagram'da takip edin.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3" data-testid="app-buttons">
              {settings?.social_instagram && (
                <a
                  href={settings.social_instagram}
                  target="_blank"
                  rel="noreferrer"
                  data-testid="footer-instagram-cta"
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] shadow-lg shadow-[#DD2A7B]/30 hover:-translate-y-0.5 transition"
                >
                  <Instagram className="h-4 w-4" /> Instagram'da Takip Et
                </a>
              )}
              {googlePlayUrl && <GooglePlayButton href={googlePlayUrl} />}
              {appStoreUrl && <AppStoreButton href={appStoreUrl} />}
            </div>
          </div>
        </div>
      )}

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

function GooglePlayButton({ href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      data-testid="footer-google-play"
      className="inline-flex items-center gap-3 rounded-xl border border-white/15 bg-black px-4 py-2.5 text-white hover:border-white/30 transition"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <path fill="#34A853" d="M3.6 2.6c-.4.4-.6 1-.6 1.7v15.4c0 .7.2 1.3.6 1.7l8.8-9.4-8.8-9.4z" />
        <path fill="#FBBC04" d="M16.2 8.4 12.4 12l3.8 3.6 4.4-2.5c1.3-.7 1.3-2.5 0-3.2l-4.4-2.5z" />
        <path fill="#EA4335" d="M12.4 12 3.6 21.4c.5.5 1.3.6 2 .1l10-5.7L12.4 12z" />
        <path fill="#4285F4" d="M12.4 12 15.6 8.4 5.6 2.7c-.7-.4-1.5-.4-2 .1l8.8 9.2z" />
      </svg>
      <span className="leading-tight">
        <span className="block text-[9px] uppercase tracking-[0.15em] text-white/60">İndirin</span>
        <span className="block text-sm font-semibold">Google Play</span>
      </span>
    </a>
  );
}

function AppStoreButton({ href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      data-testid="footer-app-store"
      className="inline-flex items-center gap-3 rounded-xl border border-white/15 bg-black px-4 py-2.5 text-white hover:border-white/30 transition"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white" aria-hidden="true">
        <path d="M17.05 12.04c-.03-2.84 2.32-4.2 2.42-4.27-1.32-1.93-3.38-2.2-4.11-2.22-1.75-.18-3.41 1.03-4.3 1.03-.89 0-2.26-1.01-3.71-.98-1.91.03-3.67 1.11-4.65 2.82-1.98 3.44-.5 8.53 1.43 11.32.94 1.36 2.06 2.89 3.52 2.83 1.41-.06 1.95-.91 3.66-.91s2.2.91 3.7.88c1.53-.03 2.5-1.38 3.43-2.75 1.08-1.58 1.53-3.11 1.55-3.19-.03-.02-2.96-1.13-2.94-4.56zM14.13 4.36c.78-.94 1.3-2.25 1.16-3.54-1.12.05-2.47.75-3.27 1.68-.72.83-1.35 2.16-1.18 3.43 1.25.1 2.52-.63 3.29-1.57z"/>
      </svg>
      <span className="leading-tight">
        <span className="block text-[9px] uppercase tracking-[0.15em] text-white/60">İndirin</span>
        <span className="block text-sm font-semibold">App Store</span>
      </span>
    </a>
  );
}
