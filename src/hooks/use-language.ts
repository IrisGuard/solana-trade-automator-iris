
import { useState, useEffect } from 'react';

// A basic dictionary for demonstration purposes
const translations: Record<string, Record<string, string>> = {
  en: {
    'hero.connectWallet': 'Connect Wallet',
    'platform.welcomeMessage': 'Welcome to the Platform',
    'platform.welcomeDescription': 'Connect your wallet to get started with the platform.',
    'platform.howItWorks': 'How it works',
    'platform.feature1': 'Connect your Solana wallet',
    'platform.feature2': 'View and manage your tokens',
    'platform.feature3': 'Use trading bots to automate trading',
    'platform.feature4': 'Monitor your portfolio performance',
    'platform.feature5': 'Secure your assets with best practices',
    'platform.gettingStarted': 'Getting Started',
    'platform.step1Title': 'Connect Your Wallet',
    'platform.step1Desc': 'Connect your Phantom wallet to get started.',
    'platform.step2Title': 'Explore Your Assets',
    'platform.step2Desc': 'View your balances and token holdings.',
    'platform.step3Title': 'Start Trading',
    'platform.step3Desc': 'Set up trading bots or make manual trades.',
  },
  el: {
    'hero.connectWallet': 'Σύνδεση Πορτοφολιού',
    'platform.welcomeMessage': 'Καλωσήρθατε στην Πλατφόρμα',
    'platform.welcomeDescription': 'Συνδέστε το πορτοφόλι σας για να ξεκινήσετε με την πλατφόρμα.',
    'platform.howItWorks': 'Πώς λειτουργεί',
    'platform.feature1': 'Συνδέστε το πορτοφόλι Solana σας',
    'platform.feature2': 'Δείτε και διαχειριστείτε τα tokens σας',
    'platform.feature3': 'Χρησιμοποιήστε trading bots για αυτοματοποίηση συναλλαγών',
    'platform.feature4': 'Παρακολουθήστε την απόδοση του χαρτοφυλακίου σας',
    'platform.feature5': 'Ασφαλίστε τα περιουσιακά σας στοιχεία με βέλτιστες πρακτικές',
    'platform.gettingStarted': 'Ξεκινώντας',
    'platform.step1Title': 'Συνδέστε το Πορτοφόλι Σας',
    'platform.step1Desc': 'Συνδέστε το Phantom wallet για να ξεκινήσετε.',
    'platform.step2Title': 'Εξερευνήστε τα Στοιχεία Σας',
    'platform.step2Desc': 'Δείτε τα υπόλοιπά σας και τα tokens που κατέχετε.',
    'platform.step3Title': 'Ξεκινήστε τις Συναλλαγές',
    'platform.step3Desc': 'Ρυθμίστε trading bots ή κάντε χειροκίνητες συναλλαγές.',
  }
};

export function useLanguage() {
  const [language, setLanguage] = useState('el');
  
  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };
  
  const changeLanguage = (lang: string) => {
    if (translations[lang]) {
      setLanguage(lang);
      localStorage.setItem('preferred_language', lang);
    }
  };
  
  useEffect(() => {
    const savedLang = localStorage.getItem('preferred_language');
    if (savedLang && translations[savedLang]) {
      setLanguage(savedLang);
    }
  }, []);
  
  return { language, t, changeLanguage };
}
