
import { useContext } from "react";
import { LanguageContext, LanguageType } from "@/providers/LanguageProvider";
import enTranslations from "@/locales/en";
import elTranslations from "@/locales/el";

const translations = {
  en: enTranslations,
  el: elTranslations
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  
  const { language, setLanguage } = context;
  
  // Enhanced translation function
  const t = (key: string, fallback?: string): string => {
    // Split the key by dots to navigate nested objects
    const keys = key.split('.');
    
    try {
      // Reduce through the object tree to get the translation
      let result = keys.reduce((obj: any, key) => {
        return obj?.[key];
      }, translations[language]);
      
      // If the translation is not found, try in English as fallback
      if (result === undefined && language !== 'en') {
        result = keys.reduce((obj: any, key) => {
          return obj?.[key];
        }, translations['en']);
      }
      
      // If still not found, return the fallback or the key
      return result || fallback || key;
    } catch (e) {
      console.warn(`Translation key not found: ${key}`);
      return fallback || key;
    }
  };
  
  return { language, setLanguage, t };
}
