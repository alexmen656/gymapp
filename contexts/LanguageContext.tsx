import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

type Language = "de" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  de: {
    settings: "Einstellungen",
    language: "Sprache",
    theme: "Design",
    lightMode: "Hell",
    darkMode: "Dunkel",
    systemMode: "System",
    privacyPolicy: "Datenschutz",
    termsOfUse: "Nutzungsbedingungen",
    openSource: "Diese App ist Open Source",
    viewOnGithub: "Auf GitHub anschauen",
    aboutTitle: "Über diese App",
  },
  en: {
    settings: "Settings",
    language: "Language",
    theme: "Theme",
    lightMode: "Light",
    darkMode: "Dark",
    systemMode: "System",
    privacyPolicy: "Privacy Policy",
    termsOfUse: "Terms of Use",
    openSource: "This app is open source",
    viewOnGithub: "View on GitHub",
    aboutTitle: "About this app",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: "de",
  setLanguage: () => {},
  t: (key: string) => key,
});

const STORAGE_KEY = "@language";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("de");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === "de" || stored === "en") {
        setLanguageState(stored);
      }
      setLoaded(true);
    });
  }, []);

  function setLanguage(lang: Language) {
    setLanguageState(lang);
    AsyncStorage.setItem(STORAGE_KEY, lang);
  }

  function t(key: string): string {
    return translations[language][key] || key;
  }

  if (!loaded) return null;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
