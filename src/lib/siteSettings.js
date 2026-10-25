import { createContext, useContext } from "react";
import { defaultSettings } from "../constants";

export const SiteSettingsContext = createContext(defaultSettings);

export const useSiteSettings = () => useContext(SiteSettingsContext);
