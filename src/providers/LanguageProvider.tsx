import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import en from "../locales/en";
import el from "../locales/el";

// Define a type for translations using the en object as reference
type Translations = typeof en;

// Types for the language context
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
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<"en" | "el">("el"); // Default to Greek
  const [translations, setTranslations] = useState<Translations>(language === "en" ? en : el as unknown as Translations);

  // Update translations when language changes
  useEffect(() => {
    setTranslations(language === "en" ? en : el as unknown as Translations);
    document.documentElement.setAttribute("lang", language);
  }, [language]);

  // Keep the selected language in localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem("app-language");
    if (savedLanguage === "en" || savedLanguage === "el") {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save the selected language when it changes
  useEffect(() => {
    localStorage.setItem("app-language", language);
  }, [language]);

  // Helper function to get translations with dot notation (e.g., "general.save")
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
      console.error("Translation error:", error, key);
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
