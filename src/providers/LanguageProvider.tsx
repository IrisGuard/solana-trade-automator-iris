
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Available languages - English only
export type LanguageType = 'en';

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

// Simple English translations
const translations = {
  en: {
    general: {
      welcome: "Welcome",
      home: "Home",
      dashboard: "Dashboard",
      wallet: "Wallet",
      transactions: "Transactions",
      security: "Security",
      settings: "Settings",
      help: "Help",
      loading: "Loading",
      connect: "Connect",
      disconnect: "Disconnect",
      bots: "Bots",
      apiVault: "API Vault"
    },
    wallet: {
      connectWallet: "Connect Wallet",
      walletConnected: "Wallet Connected",
      walletDisconnected: "Wallet Disconnected",
      walletAddress: "Wallet Address",
      walletBalance: "Wallet Balance",
      tokensBalance: "Token Balance"
    },
    platform: {
      title: "Platform Features",
      subtitle: "Advanced trading automation",
      description: "Our platform provides professional trading tools",
      createBot: "Create Trading Bot"
    },
    bots: {
      title: "Bot Management",
      description: "Create and manage your trading bots",
      automatedTrading: "Automated Trading",
      differentStrategies: "Different Strategies",
      investmentProtection: "Investment Protection"
    }
  }
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
      // Search for translation in English
      let text = keys.reduce((obj: any, key) => {
        return obj?.[key];
      }, translations[language]);
      
      // If not found, return defaultValue if exists, otherwise the key
      if (text === undefined) {
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
      return defaultValue || key;
    }
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
