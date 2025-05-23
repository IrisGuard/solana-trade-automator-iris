
import { useContext } from 'react';

// Simple language context
interface LanguageContext {
  t: (key: string) => string;
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
}

// Simplified mock language hook
export function useLanguage(): LanguageContext {
  // Simple translation function that returns the key
  const t = (key: string): string => {
    // In a real app, this would look up translations
    return key;
  };
  
  return {
    t,
    currentLanguage: 'el', // Greek by default
    changeLanguage: () => {}, // No-op
  };
}
