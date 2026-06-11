import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";

const NAV_LINKS = [
  { to: "/", label: "Ana Sayfa" },
  { to: "/kurumsal-cozumler", label: "Kurumsal Çözümler" },
  { to: "/projeler", label: "Projeler" },
  { to: "/hakkimizda", label: "Hakkımızda" },
  { to: "/iletisim", label: "İletişim" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        data-testid="site-navbar"
        className="fixed top-0 inset-x-0 z-50 bg-[#07111F]/90 backdrop-blur-xl border-b border-white/10"
      >
      <div className="container-x flex h-16 lg:h-20 items-center justify-between">
        <Logo variant="light" />

        <nav className="hidden xl:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              data-testid={`nav-link-${l.to.replace(/\//g, "") || "home"}`}
              className={({ isActive }) =>
                `relative px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? "text-white" : "text-white/70 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>{l.label}</span>
                  {isActive && (
                    <span className="absolute inset-x-3 -bottom-0.5 h-px bg-gradient-to-r from-[#2563EB] to-[#22D3EE]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden xl:flex items-center gap-2">
          <Link
            to="/firma/giris"
            data-testid="nav-portal-btn"
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2.5 text-sm font-medium text-white/80 hover:text-white hover:border-white/40 transition-colors"
          >
            <LogIn className="h-4 w-4" />
            Portal Girişi
          </Link>
          <Link
            to="/proje-talep"
            data-testid="nav-cta-btn"
            className="btn-primary text-sm py-2.5 px-5"
          >
            Talebim Var
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <button
          data-testid="mobile-menu-toggle"
          onClick={() => setOpen((v) => !v)}
          className="xl:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-white hover:bg-white/10"
          aria-label="Menüyü aç/kapat"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="xl:hidden fixed inset-x-0 top-16 bottom-0 z-[60] bg-[#07111F]"
            data-testid="mobile-menu"
          >
            <div className="container-x py-8 flex flex-col gap-1">
              {NAV_LINKS.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <NavLink
                    to={l.to}
                    end={l.to === "/"}
                    data-testid={`mobile-nav-${l.to.replace(/\//g, "") || "home"}`}
                    className={({ isActive }) =>
                      `block py-4 text-2xl font-heading font-semibold border-b border-white/5 ${
                        isActive ? "text-white" : "text-white/70"
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}
              <Link
                to="/firma/giris"
                data-testid="mobile-portal-btn"
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 py-3 text-base font-medium text-white hover:bg-white/5"
              >
                <LogIn className="h-4 w-4" />
                Portal Girişi
              </Link>
              <Link
                to="/proje-talep"
                data-testid="mobile-cta-btn"
                className="btn-primary mt-3 w-full text-base"
              >
                Talebim Var
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
