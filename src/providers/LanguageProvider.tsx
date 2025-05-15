
import React, { createContext, useState, useContext, ReactNode } from 'react';
import enTranslations from "@/locales/en";
import elTranslations from "@/locales/el";

// Available languages
export type LanguageType = 'en' | 'el';

interface LanguageContextType {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: LanguageType;
}

// Συνδυασμένες μεταφράσεις
const translations = {
  en: enTranslations,
  el: elTranslations
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children, defaultLanguage = 'en' }) => {
  const [language, setLanguage] = useState<LanguageType>(defaultLanguage);
  
  const t = (key: string, params?: Record<string, string>): string => {
    // Διαχωρισμός του κλειδιού με τελείες για πλοήγηση σε nested objects
    const keys = key.split('.');
    
    try {
      // Αναζήτηση της μετάφρασης στο επιλεγμένο language
      let text = keys.reduce((obj: any, key) => {
        return obj?.[key];
      }, translations[language]);
      
      // Αν δεν βρεθεί, δοκιμάζουμε στα αγγλικά ως fallback
      if (text === undefined && language !== 'en') {
        text = keys.reduce((obj: any, key) => {
          return obj?.[key];
        }, translations['en']);
      }
      
      // Αν ακόμα δεν βρεθεί, επιστρέφουμε το κλειδί
      if (text === undefined) {
        console.warn(`Δεν βρέθηκε μετάφραση για το κλειδί: ${key}`);
        return key;
      }
      
      // Αντικατάσταση παραμέτρων αν παρέχονται
      if (params && text) {
        Object.entries(params).forEach(([paramKey, paramValue]) => {
          text = text.replace(`{{${paramKey}}}`, paramValue);
        });
      }
      
      return text;
    } catch (e) {
      console.warn(`Σφάλμα κατά την αναζήτηση μετάφρασης για το κλειδί: ${key}`, e);
      return key;
    }
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
