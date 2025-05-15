
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Available languages
type LanguageType = 'en' | 'el';

interface LanguageContextType {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Simple translations
const translations: Record<LanguageType, Record<string, string>> = {
  en: {
    welcome: 'Welcome to our platform',
    connect_wallet: 'Connect Wallet',
    disconnect_wallet: 'Disconnect',
    trade: 'Trade',
    settings: 'Settings'
  },
  el: {
    welcome: 'Καλώς ήλθατε στην πλατφόρμα μας',
    connect_wallet: 'Σύνδεση Wallet',
    disconnect_wallet: 'Αποσύνδεση',
    trade: 'Συναλλαγή',
    settings: 'Ρυθμίσεις'
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageType>('en');
  
  const t = (key: string, params?: Record<string, string>): string => {
    let text = translations[language][key] || key;
    
    // Replace parameters if provided
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        text = text.replace(`{{${paramKey}}}`, paramValue);
      });
    }
    
    return text;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
