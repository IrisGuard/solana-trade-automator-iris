
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import el from "../locales/el";

type Translations = typeof el;

interface LanguageContextType {
  t: (key: string, section?: string) => string;
  translations: Translations;
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
  const [translations] = useState<Translations>(el);

  // Εφαρμογή των ρυθμίσεων στο HTML
  useEffect(() => {
    document.documentElement.setAttribute("lang", "el");
  }, []);

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
      
      return result || key;
    } catch (error) {
      console.error("Σφάλμα μετάφρασης:", error, key);
      return key;
    }
  };

  const value = {
    t,
    translations
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
