import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "../lib/api";

const SiteSettingsContext = createContext({ settings: null, loading: true, refresh: () => {} });

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get("/settings");
      setSettings(data);
    } catch {
      // keep null; pages have hardcoded fallbacks
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Apply favicon dynamically
  useEffect(() => {
    if (!settings?.favicon_url) return;
    let link = document.querySelector("link[rel='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = settings.favicon_url;
  }, [settings?.favicon_url]);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, refresh: load }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export const useSiteSettings = () => useContext(SiteSettingsContext);
