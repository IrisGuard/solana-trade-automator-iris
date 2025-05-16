
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { en } from "@/locales/en";
import { el } from "@/locales/el";

// Available languages
export type LanguageType = 'en' | 'el';

type TranslationParams = Record<string, string> | string;

interface LanguageContextType {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  t: (key: string, paramsOrDefault?: TranslationParams) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: LanguageType;
}

// Combined translations
const translations = {
  en: en,
  el: el
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children, defaultLanguage = 'en' }) => {
  const [language, setLanguage] = useState<LanguageType>(defaultLanguage);
  
  const t = (key: string, paramsOrDefault?: TranslationParams): string => {
    // Split the key by dots to navigate nested objects
    const keys = key.split('.');
    let defaultValue: string | undefined;
    
    // Check if paramsOrDefault is a string (defaultValue) or an object (params)
    if (typeof paramsOrDefault === 'string') {
      defaultValue = paramsOrDefault;
    }
    
    try {
      // Search for translation in selected language
      let text = keys.reduce((obj: any, key) => {
        return obj?.[key];
      }, translations[language]);
      
      // If not found, try in English as fallback
      if (text === undefined && language !== 'en') {
        text = keys.reduce((obj: any, key) => {
          return obj?.[key];
        }, translations['en']);
      }
      
      // If still not found, return defaultValue if exists, otherwise the key
      if (text === undefined) {
        console.warn(`Translation not found for key: ${key}`);
        return defaultValue || key;
      }
      
      // If paramsOrDefault is an object, replace parameters in the text
      if (paramsOrDefault && typeof paramsOrDefault === 'object') {
        Object.entries(paramsOrDefault).forEach(([paramKey, paramValue]) => {
          text = text.replace(`{{${paramKey}}}`, paramValue);
        });
      }
      
      return text;
    } catch (e) {
      console.warn(`Error looking for translation for key: ${key}`, e);
      return defaultValue || key;
    }
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
