
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import el from "../locales/el";
import en from "../locales/en";

type LanguageKey = "el" | "en";
type Translations = typeof el;

interface LanguageContextType {
  language: LanguageKey;
  setLanguage: (lang: LanguageKey) => void;
  t: (key: string, section?: string) => string;
  translations: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  // Ανάκτηση προτιμώμενης γλώσσας από localStorage ή χρήση default (el)
  const [language, setLanguageState] = useState<LanguageKey>(() => {
    const savedLanguage = localStorage.getItem("language") as LanguageKey;
    return savedLanguage || "el";
  });

  const [translations, setTranslations] = useState<Translations>(language === "el" ? el : en);

  const setLanguage = (lang: LanguageKey) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    setTranslations(lang === "el" ? el : en);
  };

  // Βοηθητική συνάρτηση για να παίρνουμε μεταφράσεις με dot notation (π.χ., "general.save")
  const t = (key: string, section?: string): string => {
    try {
      const keys = key.split(".");
      let result: any = translations;
      
      if (section) {
        result = result[section];
        if (!result) return key;
        return result[keys[0]] || key;
      }
      
      for (const k of keys) {
        result = result[k];
        if (result === undefined) return key;
      }
      
      return result;
    } catch (error) {
      console.error("Translation error:", error);
      return key;
    }
  };

  const value = {
    language,
    setLanguage,
    t,
    translations
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
