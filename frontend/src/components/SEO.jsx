import { useEffect } from "react";
import { useSiteSettings } from "../context/SiteSettingsContext";

/**
 * SEO component.
 * Props:
 *  - page: "home" | "about" | "contact" | "projects" | "blog" — pulls from settings.pages
 *  - title, description: explicit override (used for detail pages)
 */
export default function SEO({ page, title, description }) {
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
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", "description");
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", finalDesc);
    }
  }, [page, title, description, settings]);

  return null;
}
