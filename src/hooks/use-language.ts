
import { useContext } from 'react';

// Simple language context
interface LanguageContext {
  t: (key: string, defaultValue?: string) => string;
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
}

// Simplified mock language hook
export function useLanguage(): LanguageContext {
  // Simple translation function that returns the key or default value
  const t = (key: string, defaultValue?: string): string => {
    // In a real app, this would look up translations
    return defaultValue || key;
  };
  
  return {
    t,
    currentLanguage: 'en', // Changed to English by default
    changeLanguage: (lang: string) => {}, // No-op
    language: 'en', // Changed to English by default
    setLanguage: (lang: string) => {} // No-op but matches the required interface
  };
}
