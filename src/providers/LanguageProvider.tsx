
import React, { createContext, useContext, useState, useEffect } from 'react';
import enTranslations from '@/locales/en';
import elTranslations from '@/locales/el';

type Translations = {
  [key: string]: any;
};

export type LanguageContextType = {
  t: (key: string) => string;
  language: string;
  setLanguage: (lang: string) => void;
};

const translations: Record<string, Translations> = {
  el: elTranslations,
  en: enTranslations,
};

const LanguageContext = createContext<LanguageContextType>({
  t: () => '',
  language: 'el',
  setLanguage: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState('el'); // Default to Greek

  // Function to translate keys
  const t = (key: string): string => {
    const parts = key.split('.');
    if (parts.length === 2) {
      const category = parts[0];
      const label = parts[1];
      
      try {
        // First check in the current language
        if (translations[language] && 
            translations[language][category] && 
            translations[language][category][label]) {
          return translations[language][category][label];
        }
        
        // Fallback to English if the key doesn't exist in the current language
        if (language !== 'en' && 
            translations['en'] && 
            translations['en'][category] && 
            translations['en'][category][label]) {
          console.log(`Using fallback for ${key}`);
          return translations['en'][category][label];
        }
      } catch (error) {
        console.error(`Translation error for key ${key}:`, error);
      }
    } else if (parts.length === 3) {
      // Handle nested translations like "botExplanation.overview.title"
      const category = parts[0];
      const subcategory = parts[1];
      const label = parts[2];
      
      try {
        if (translations[language] && 
            translations[language][category] && 
            translations[language][category][subcategory] && 
            translations[language][category][subcategory][label]) {
          return translations[language][category][subcategory][label];
        }
        
        // Fallback to English
        if (language !== 'en' && 
            translations['en'] && 
            translations['en'][category] && 
            translations['en'][category][subcategory] && 
            translations['en'][category][subcategory][label]) {
          return translations['en'][category][subcategory][label];
        }
      } catch (error) {
        console.error(`Translation error for nested key ${key}:`, error);
      }
    }
    
    // Return the key itself as fallback if no translation is found
    return key;
  };

  // Effect to load any saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && (savedLanguage === 'el' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Effect to save language preference when it changes
  useEffect(() => {
    localStorage.setItem('preferredLanguage', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ t, language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
