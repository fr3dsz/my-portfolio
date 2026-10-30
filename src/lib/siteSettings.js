import { createContext, useContext } from "react";
import { defaultSettings } from "../constants";

export const SiteSettingsContext = createContext(defaultSettings);

export const useSiteSettings = () => useContext(SiteSettingsContext);

// Blank means "nothing to show": callers drop the whole row, not just the text.
export const getAvailabilityLabel = (settings) => settings.availabilityLabel?.trim() || "";
