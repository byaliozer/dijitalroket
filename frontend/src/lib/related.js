// Internal Link Engine — blog / hizmet / proje içerikleri arasında ilgili
// bağlantıları doğal biçimde eşleştiren yardımcılar.
import { SERVICES } from "../data/servicesData";

const norm = (s) => (s || "").toString().toLowerCase();

// Metin + etiketlere göre ilgili hizmetleri skorlayarak döndürür.
export function matchServicesFor(text, tags = [], limit = 3) {
  const hay = norm(`${text} ${(tags || []).join(" ")}`);
  const scored = SERVICES.map((s) => {
    const kws = [...(s.keywords || []), s.navLabel];
    const score = kws.reduce((acc, k) => (hay.includes(norm(k)) ? acc + 1 : acc), 0);
    return { s, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  const base = scored.length ? scored.map((x) => x.s) : SERVICES;
  return base.slice(0, limit);
}

// Metin + etiketlere göre ilgili projeleri skorlayarak döndürür.
export function matchProjectsFor(all, text, tags = [], limit = 3, excludeSlug) {
  const list = (all || []).filter((p) => p.slug !== excludeSlug);
  const tokens = norm(`${text} ${(tags || []).join(" ")}`)
    .split(/[\s,./]+/)
    .filter((t) => t.length > 3);
  const scored = list
    .map((p) => {
      const phay = norm(`${p.sector || ""} ${(p.tags || []).join(" ")} ${p.title || ""}`);
      const score = tokens.reduce((acc, t) => (phay.includes(t) ? acc + 1 : acc), 0);
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  const base = scored.length ? scored.map((x) => x.p) : list.filter((p) => p.featured);
  return (base.length ? base : list).slice(0, limit);
}

// Anahtar kelimelere göre ilgili blog yazılarını döndürür (hizmet sayfaları için).
export function matchPostsForKeywords(posts, keywords = [], limit = 3) {
  const kw = keywords.map(norm);
  const scored = (posts || [])
    .map((p) => {
      const hay = norm(`${p.category || ""} ${(p.tags || []).join(" ")} ${p.title || ""} ${p.excerpt || ""}`);
      const score = kw.reduce((acc, k) => (hay.includes(k) ? acc + 1 : acc), 0);
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  const base = scored.length ? scored.map((x) => x.p) : posts || [];
  return base.slice(0, limit);
}

// Aynı kategori önceliğiyle ilgili blog yazılarını döndürür (blog detay için).
export function matchPostsFor(all, currentSlug, category, limit = 3) {
  const list = (all || []).filter((p) => p.slug !== currentSlug);
  const sameCat = list.filter((p) => p.category === category);
  const rest = list.filter((p) => p.category !== category);
  return [...sameCat, ...rest].slice(0, limit);
}

export function formatTrDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return "";
  }
}
