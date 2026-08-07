import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import { SiteSettingsProvider } from "./context/SiteSettingsContext";
import SiteLayout from "./components/SiteLayout";
import Home from "./pages/Home";
import CorporateSolutions from "./pages/CorporateSolutions";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import ProjectRequest from "./pages/ProjectRequest";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { BrandAuthProvider } from "./context/BrandAuthContext";
import BrandLogin from "./pages/brand/BrandLogin";
import BrandPortal from "./pages/brand/BrandPortal";
import SEO from "./components/SEO";
import "./App.css";

export default function App() {
  return (
    <SiteSettingsProvider>
      <AuthProvider>
        <BrandAuthProvider>
          <BrowserRouter>
            <Toaster position="top-right" richColors closeButton />
            <Routes>
              <Route element={<SiteLayout />}>
                <Route index element={<Home />} />
                <Route path="/kurumsal-cozumler" element={<CorporateSolutions />} />
                <Route path="/projeler" element={<Projects />} />
                <Route path="/projeler/:slug" element={<ProjectDetail />} />
                <Route path="/hakkimizda" element={<About />} />
                <Route path="/iletisim" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/proje-talep" element={<ProjectRequest />} />
              </Route>
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/firma/giris" element={<BrandLogin />} />
              <Route path="/firma/panel" element={<BrandPortal />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </BrandAuthProvider>
      </AuthProvider>
    </SiteSettingsProvider>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#07111F] text-white px-6 text-center">
      <SEO title="Sayfa Bulunamadı (404) | Dijital Roket" description="Aradığınız sayfa bulunamadı. Dijital Roket ana sayfasına dönerek devam edebilirsiniz." noindex />
      <div className="font-heading text-7xl font-extrabold text-gradient">404</div>
      <p className="mt-4 text-white/70">Aradığınız sayfa bulunamadı.</p>
      <a href="/" className="mt-8 btn-primary">Ana Sayfaya Dön</a>
    </div>
  );
}
