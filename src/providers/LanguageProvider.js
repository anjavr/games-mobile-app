import { createContext, useState } from "react";
import i18n from "../../i18n";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(i18n.language || "en");

  const switchLanguage = (language) => {
    setLang(language);
    i18n.changeLanguage(language);
  };

  return (
    <LanguageContext.Provider value={{ lang, switchLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

