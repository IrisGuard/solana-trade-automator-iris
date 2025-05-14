
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import en from '@/locales/en';
import el from '@/locales/el';
import { TranslationKeys } from '@/types/language';

// Supported languages
type Language = 'en' | 'el';

// Context type definition
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultValue?: string) => string;
  translations: TranslationKeys;
}

// Create the context with a default value
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('el');
  
  // Load saved language from localStorage on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage === 'en' || savedLanguage === 'el') {
      setLanguage(savedLanguage as Language);
    }
  }, []);
  
  // Get translations based on the selected language
  const translations = language === 'en' 
    ? en as unknown as TranslationKeys
    : el as unknown as TranslationKeys;
  
  // Function to get a translated string by key
  const t = (key: string, defaultValue?: string): string => {
    try {
      // Split the key by dots to access nested properties
      const keys = key.split('.');
      let result: any = translations;
      
      // Traverse the translations object
      for (const k of keys) {
        if (result && result[k]) {
          result = result[k];
        } else {
          // If key not found, return default value or key
          return defaultValue || key;
        }
      }
      
      return result || defaultValue || key;
    } catch (error) {
      console.error(`Translation error for key: ${key}`, error);
      return defaultValue || key;
    }
  };
  
  // Update localStorage when language changes
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };
  
  const value: LanguageContextType = {
    language,
    setLanguage: handleSetLanguage,
    t,
    translations
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to use the language context
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
