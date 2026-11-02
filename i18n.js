import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslations from "./localization/en.json";
import srTranslations from "./localization/sr.json";
import { getSettings } from "./src/database/repository/settings";

export const initI18n = async (db = null, userId = null) => {
  let selectedLang = "en";

  try {
    let settings = null;

    if (db && userId) {
      settings = await getSettings(db, userId);
    } else if (db) {
      settings = await getSettings(db);
    }

    if (settings?.language) {
      selectedLang = settings.language;
    } else {
      const deviceLang = Localization.locale?.split("-")[0];
      if (["en", "sr"].includes(deviceLang)) selectedLang = deviceLang;
    }

    if (!i18n.isInitialized) {
      await i18n.use(initReactI18next).init({
        resources: {
          en: { translation: enTranslations },
          sr: { translation: srTranslations },
        },
        lng: selectedLang,
        fallbackLng: "en",
        interpolation: { escapeValue: false },
      });
    } else {
      i18n.changeLanguage(selectedLang);
    }
  } catch (error) {
    console.error("Error initializing i18n:", error);
  }

  return selectedLang;
};



export default i18n;
