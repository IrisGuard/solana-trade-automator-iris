
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import en from "../locales/en";
import el from "../locales/el";

type TranslationValue = string | Record<string, any>;
type Translations = typeof en;

// Τύποι για το language context
interface LanguageContextType {
  t: (key: string, section?: string) => string;
  translations: Translations;
  language: "en" | "el";
  setLanguage: (lang: "en" | "el") => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage πρέπει να χρησιμοποιείται μέσα σε LanguageProvider");
  }
  return context;
}

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<"en" | "el">("el"); // Default σε Ελληνικά
  const [translations, setTranslations] = useState<Translations>(el);

  // Ενημέρωση των μεταφράσεων όταν αλλάζει η γλώσσα
  useEffect(() => {
    setTranslations(language === "en" ? en : el);
    document.documentElement.setAttribute("lang", language);
  }, [language]);

  // Διατήρηση της επιλεγμένης γλώσσας στο localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem("app-language");
    if (savedLanguage === "en" || savedLanguage === "el") {
      setLanguage(savedLanguage);
    }
  }, []);

  // Αποθήκευση της επιλεγμένης γλώσσας όταν αλλάζει
  useEffect(() => {
    localStorage.setItem("app-language", language);
  }, [language]);

  // Βοηθητική συνάρτηση για να παίρνουμε μεταφράσεις με dot notation (π.χ., "general.save")
  const t = (key: string, section?: string): string => {
    try {
      if (!key) return "";
      
      const keys = key.split(".");
      let result: any = translations;
      
      if (section) {
        result = result[section];
        if (!result) return key;
        return result[keys[0]] || key;
      }
      
      for (const k of keys) {
        if (!result) return key;
        result = result[k];
        if (result === undefined) return key;
      }
      
      return typeof result === 'string' ? result : key;
    } catch (error) {
      console.error("Σφάλμα μετάφρασης:", error, key);
      return key;
    }
  };

  const value = {
    t,
    translations,
    language,
    setLanguage
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
