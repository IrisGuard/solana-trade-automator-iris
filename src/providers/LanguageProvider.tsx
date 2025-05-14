
import React, { createContext, useState, useContext, ReactNode } from 'react';
import en from '@/locales/en';
import el from '@/locales/el';
import { TranslationKeys } from '@/types/language';

type Language = 'en' | 'el';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultValue?: string) => string;
  translations: TranslationKeys;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('el');
  
  // Get translations based on the selected language
  const translations = language === 'en' 
    ? en as unknown as TranslationKeys
    : el as unknown as TranslationKeys;

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  // Helper function to get a nested value from an object with string path
  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((prev, curr) => {
      return prev && prev[curr] !== undefined ? prev[curr] : undefined;
    }, obj);
  };

  // Translate function
  const t = (key: string, defaultValue: string = key) => {
    const value = getNestedValue(translations, key);
    return value !== undefined ? value : defaultValue;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, translations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
