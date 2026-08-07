import { useEffect } from "react";
import { useSiteSettings } from "../context/SiteSettingsContext";

function setMetaTag(attr, key, value) {
  if (value == null) return;
  let tag = document.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", value);
}

/**
 * SEO component.
 * Props:
 *  - page: "home" | "about" | "contact" | "projects" | "blog" — pulls from settings.pages
 *  - title, description: explicit override (used for detail pages)
 *  - noindex: when true, tells crawlers not to index this page (e.g. 404)
 */
export default function SEO({ page, title, description, noindex = false, image }) {
  const { settings } = useSiteSettings();

  useEffect(() => {
    const pageCfg = page && settings?.pages?.[page];
    const finalTitle =
      title ||
      (pageCfg?.title || (page === "home" && settings?.site_title) || settings?.site_title || "Dijital Roket");
    const finalDesc =
      description ||
      pageCfg?.description ||
      settings?.site_description ||
      "";

    if (finalTitle) document.title = finalTitle;
    if (finalDesc) {
      setMetaTag("name", "description", finalDesc);
      setMetaTag("property", "og:description", finalDesc);
      setMetaTag("name", "twitter:description", finalDesc);
    }
    if (finalTitle) {
      setMetaTag("property", "og:title", finalTitle);
      setMetaTag("name", "twitter:title", finalTitle);
    }

    // og:image / twitter:image — use page image (absolute) or fall back to default
    const defaultImg = "https://dijitalroket.com/og-image.jpg";
    let finalImg = defaultImg;
    if (image) {
      finalImg = image.startsWith("http") ? image : `${window.location.origin}${image}`;
    }
    setMetaTag("property", "og:image", finalImg);
    setMetaTag("name", "twitter:image", finalImg);

    // Robots directive (index/noindex)
    setMetaTag("name", "robots", noindex ? "noindex, nofollow" : "index, follow");

    // Self-referencing canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", window.location.origin + window.location.pathname);
    setMetaTag("property", "og:url", window.location.origin + window.location.pathname);
  }, [page, title, description, noindex, image, settings]);

  return null;
}
