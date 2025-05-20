
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useTranslation } from './useTranslation';

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ 
  children, 
  defaultLanguage = 'el' 
}: { 
  children: ReactNode; 
  defaultLanguage?: string;
}) {
  const [language, setLanguage] = useState<string>(defaultLanguage);
  const { t } = useTranslation();

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        setLanguage,
        t 
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  
  if (context === undefined) {
    // Fallback if used outside of LanguageProvider
    const { t } = useTranslation();
    return {
      language: 'el',
      setLanguage: () => console.warn('setLanguage was called outside of LanguageProvider'),
      t
    };
  }
  
  return context;
}
