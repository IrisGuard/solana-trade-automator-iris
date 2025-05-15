
import { useContext, createContext, useState, ReactNode } from 'react';

// Define the context type
interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, fallback?: string) => string;
}

// Create the context with a default value
export const LanguageContext = createContext<LanguageContextType>({
  language: 'el', // Default to Greek
  setLanguage: () => {},
  t: (key: string, fallback?: string) => fallback || key,
});

// Simple translations object
const translations: Record<string, Record<string, string>> = {
  el: {
    // General
    'general.all': 'Όλα',
    'general.visit': 'Επίσκεψη',
    'general.command': 'Εντολή',
    
    // Help
    'help.availableCommands': 'Διαθέσιμες Εντολές',
    'help.useCommands': 'Χρησιμοποιήστε αυτές τις εντολές για να αλληλεπιδράσετε με την πλατφόρμα',
    'help.platformGuide': 'Οδηγός Πλατφόρμας',
    'help.shortGuide': 'Σύντομος οδηγός για τη χρήση της πλατφόρμας',
    'help.walletConnection': 'Σύνδεση Πορτοφολιού',
    'help.tradingBots': 'Trading Bots',
    'help.botsDescription': 'Η πλατφόρμα μας παρέχει δύο τύπους bots:',
    'help.tradingBotDescription': 'Αυτόματες αγορές και πωλήσεις με ρυθμιζόμενα stop-loss και take-profit',
    'help.makerBotDescription': 'Δημιουργία ρευστότητας στην αγορά με αυτόματες εντολές αγοράς και πώλησης',
    'help.apiVaultHelp': 'Διαχείριση API Keys',
    'help.apiVaultDescription': 'Στην ενότητα API Vault μπορείτε να αποθηκεύσετε και να διαχειριστείτε με ασφάλεια τα API κλειδιά σας για διάφορες υπηρεσίες όπως Helius, Coingecko, και άλλες πλατφόρμες.',
    'help.usefulLinks': 'Χρήσιμοι Σύνδεσμοι',
    'help.documentation': 'Τεκμηρίωση',
    'help.exploreResources': 'Εξερευνήστε πόρους για να μάθετε περισσότερα για το blockchain και το οικοσύστημα του Solana',
    'help.searchResources': 'Αναζήτηση πόρων',
    'help.noResourcesFound': 'Δεν βρέθηκαν πόροι που να ταιριάζουν με τα κριτήριά σας',
    'help.commandExplorer': 'Εντολές & Πόροι Πλατφόρμας',
    'help.exploreAllCommands': 'Εξερευνήστε όλες τις διαθέσιμες εντολές και πόρους της πλατφόρμας',
    
    // Wallet
    'wallet.connectionInstructions': 'Συνδέστε το Phantom πορτοφόλι σας πατώντας το κουμπί "Connect" στην επάνω δεξιά γωνία. Αυτό θα σας επιτρέψει να δείτε το υπόλοιπό σας, τα tokens και να πραγματοποιήσετε συναλλαγές.',
    'wallet.connectWallet': 'Σύνδεση πορτοφολιού',
    'wallet.disconnectWallet': 'Αποσύνδεση πορτοφολιού',
    'wallet.walletBalance': 'Υπόλοιπο πορτοφολιού',
    'wallet.tokensBalance': 'Λίστα tokens',
    
    // Platform
    'platform.step1Title': 'Σύνδεση Πορτοφολιού',
    'platform.step1Desc': 'Συνδέστε το πορτοφόλι Solana σας για να ξεκινήσετε τις συναλλαγές',
    'platform.step2Title': 'Επιλογή Bot',
    'platform.step2Desc': 'Επιλέξτε ανάμεσα σε Trading Bot και Market Maker Bot',
    'platform.step3Title': 'Ρύθμιση Παραμέτρων',
    'platform.step3Desc': 'Προσαρμόστε τις παραμέτρους για τις ανάγκες σας',
    'platform.step4Title': 'Παρακολούθηση & Βελτιστοποίηση',
    'platform.step4Desc': 'Παρακολουθήστε την απόδοση των bots σας και βελτιώστε τις στρατηγικές σας με βάση τα αποτελέσματα',
    'platform.howItWorksTitle': 'Πώς Λειτουργεί',
    
    // Market Bot
    'makerBot.startBot': 'Εκκίνηση market maker bot',
    'makerBot.stopBot': 'Τερματισμός market maker bot',
    'botStats': 'Στατιστικά λειτουργίας bot',
    
    // API Vault
    'apiVault.manageApiKeys': 'Διαχείριση API keys'
  },
  en: {
    // We can add English translations here if needed
  }
};

// Provider component
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<string>('el');

  // Translation function
  const t = (key: string, fallback?: string): string => {
    if (!translations[language]) {
      return fallback || key;
    }
    
    return translations[language][key] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook for using the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
