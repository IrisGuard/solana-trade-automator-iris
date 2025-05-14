
import React, { createContext, useContext, useState } from 'react';

// Βασικές μεταφράσεις
const translations = {
  // Γενικά
  general: {
    home: "Αρχική",
    dashboard: "Dashboard",
    wallet: "Πορτοφόλι",
    portfolio: "Χαρτοφυλάκιο",
    transactions: "Συναλλαγές",
    tokens: "Tokens",
    bots: "Bots",
    settings: "Ρυθμίσεις",
    help: "Βοήθεια",
    main: "Βασικά",
    extra: "Επιπλέον",
    refresh: "Ανανέωση",
    loading: "Φόρτωση...",
    error: "Σφάλμα",
    success: "Επιτυχία",
    save: "Αποθήκευση",
    cancel: "Ακύρωση"
  },
  // Wallet
  wallet: {
    connectWallet: "Σύνδεση με Wallet",
    disconnectWallet: "Αποσύνδεση Wallet",
    walletAddress: "Διεύθυνση Wallet",
    solBalance: "Υπόλοιπο SOL",
    tokens: "Tokens"
  },
  // Bots
  makerBot: {
    botSettings: "Ρυθμίσεις Bot",
    tradingSettings: "Ρυθμίσεις Trading",
    startBot: "Εκκίνηση Bot",
    stopBot: "Διακοπή Bot"
  },
  // Notifications
  notifications: {
    title: "Ειδοποιήσεις",
    noNotifications: "Δεν υπάρχουν ειδοποιήσεις"
  },
  // API
  api: {
    title: "API Keys"
  },
  // Hero
  hero: {
    tagline: "Αυτοματοποιήστε τις συναλλαγές σας στο Solana blockchain με ευφυείς στρατηγικές και παρακολούθηση σε πραγματικό χρόνο",
    dashboard: "Πίνακας Ελέγχου",
    botControlToast: "Καλώς ήρθατε στις ρυθμίσεις του Bot",
    dashboardToast: "Καλώς ήρθατε στο Dashboard"
  }
};

// Δημιουργία context
type LanguageContextType = {
  t: (key: string) => string;
  language: string;
  setLanguage: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextType>({
  t: () => '',
  language: 'el',
  setLanguage: () => {}
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState('el'); // Προεπιλογή στα Ελληνικά

  // Η συνάρτηση μετάφρασης t
  const t = (key: string): string => {
    const parts = key.split('.');
    if (parts.length === 2) {
      const category = parts[0];
      const label = parts[1];
      
      // @ts-ignore - Δυναμική αναζήτηση στις μεταφράσεις
      if (translations[category] && translations[category][label]) {
        // @ts-ignore
        return translations[category][label];
      }
    }
    
    // Επιστρέφουμε το κλειδί αν δεν υπάρχει μετάφραση
    return key;
  };

  return (
    <LanguageContext.Provider value={{ t, language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
