import { useEffect, useState } from "react";
import { defaultSettings } from "../constants";
import { fetchSiteSettings } from "../lib/content";
import { SiteSettingsContext } from "../lib/siteSettings";

// Renders immediately with fallback settings, then swaps in the CMS values.
// On fetch failure the fallbacks simply stay — every field has one.
const SiteSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    fetchSiteSettings()
      .then(setSettings)
      .catch((err) => console.error("Failed to fetch site settings:", err));
  }, []);

  return <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>;
};

export default SiteSettingsProvider;
