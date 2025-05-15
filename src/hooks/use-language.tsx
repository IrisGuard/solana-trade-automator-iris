
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
    'general.dashboard': 'Πίνακας Ελέγχου',
    'general.navigation': 'Πλοήγηση',
    'general.support': 'Υποστήριξη',
    'general.allRightsReserved': 'Όλα τα δικαιώματα διατηρούνται.',
    'general.terms': 'Όροι Χρήσης',
    'general.privacy': 'Πολιτική Απορρήτου',
    'general.learnMore': 'Μάθετε περισσότερα',
    'general.home': 'Αρχική',
    'general.settings': 'Ρυθμίσεις',
    'general.help': 'Βοήθεια',
    
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
    'wallet.connectionInstructions': 'Συνδέστε το Phantom πορτοφόλι σας πατώντας το κουμπί \"Connect\" στην επάνω δεξιά γωνία. Αυτό θα σας επιτρέψει να δείτε το υπόλοιπό σας, τα tokens και να πραγματοποιήσετε συναλλαγές.',
    'wallet.connectWallet': 'Σύνδεση πορτοφολιού',
    'wallet.disconnectWallet': 'Αποσύνδεση πορτοφολιού',
    'wallet.walletBalance': 'Υπόλοιπο πορτοφολιού',
    'wallet.tokensBalance': 'Λίστα tokens',
    'wallet.walletStatus': 'Πορτοφόλι',
    
    // Platform
    'platform.step1Title': 'Σύνδεση Πορτοφολιού',
    'platform.step1Desc': 'Συνδέστε το πορτοφόλι Solana σας για να ξεκινήσετε τις συναλλαγές',
    'platform.step2Title': 'Επιλογή Bot',
    'platform.step2Desc': 'Επιλέξτε ανάμεσα σε Trading Bot και Market Maker Bot',
    'platform.step3Title': 'Ρύθμιση Παραμέτρων',
    'platform.step3Desc': 'Προσαρμόστε τις παραμέτρους για τις ανάγκες σας',
    'platform.step4Title': 'Παρακολούθηση & Βελτιστοποίηση',
    'platform.step4Desc': 'Παρακολουθήστε την απόδοση των bots σας και βελτιώστε τις στρατηγικές σας',
    'platform.howItWorksTitle': 'Πώς Λειτουργεί',
    'platform.featuresTitle': 'Χαρακτηριστικά Πλατφόρμας',
    'platform.tradingModes': 'Αυτόματες Συναλλαγές',
    'platform.avgReturns': 'Μέση Απόδοση',
    'platform.lowFees': 'Χαμηλές Χρεώσεις',
    'platform.controlFunds': 'Έλεγχος Κεφαλαίων',
    'platform.description': 'Η πλατφόρμα μας παρέχει προηγμένα εργαλεία για τη διαχείριση των συναλλαγών σας στο Solana blockchain.',
    
    // Market Bot
    'makerBot.startBot': 'Εκκίνηση market maker bot',
    'makerBot.stopBot': 'Τερματισμός market maker bot',
    'makerBot.botSettings': 'Ρυθμίσεις Bot',
    'makerBot.title': 'Ρυθμίσεις Bot',
    'makerBot.configureDesc': 'Προσαρμόστε τις ρυθμίσεις των bots σας για βέλτιστα αποτελέσματα',
    'botStats': 'Στατιστικά λειτουργίας bot',
    
    // API Vault
    'apiVault.manageApiKeys': 'Διαχείριση API keys',
    
    // Hero
    'hero.getStartedButton': 'Ξεκινήστε Τώρα',
    'hero.tagline': "Διαχειριστείτε τα κρυπτονομίσματά σας, αυτοματοποιήστε τις συναλλαγές σας και παρακολουθήστε τα κεφάλαιά σας - όλα σε ένα μέρος",
    'hero.dashboardToast': "Μετάβαση στον Πίνακα Ελέγχου",
    'hero.botControlToast': "Μετάβαση στις Ρυθμίσεις Bot",
    'hero.walletToast': "Παρακαλώ συνδέστε το πορτοφόλι σας",
    'hero.tradeAutomationTitle': "Αυτοματισμός Συναλλαγών",
    'hero.tradeAutomationDesc': "Αφήστε τα bots να εκτελούν συναλλαγές βάσει της στρατηγικής σας 24/7",
    'hero.marketMonitoringTitle': "Παρακολούθηση Αγοράς",
    'hero.marketMonitoringDesc': "Ανάλυση δεδομένων και εντοπισμός ευκαιριών σε πραγματικό χρόνο",
    'hero.securityFeaturesTitle': "Προηγμένη Ασφάλεια",
    'hero.securityFeaturesDesc': "Τα κεφάλαιά σας παραμένουν πάντα υπό τον έλεγχό σας",
    'hero.analyticsTitle': "Προηγμένη Ανάλυση",
    'hero.analyticsDesc': "Αναλυτικά στατιστικά και αναφορές για βελτιστοποίηση της στρατηγικής σας",
    'hero.multiStrategyTitle': "Πολλαπλές Στρατηγικές",
    'hero.multiStrategyDesc': "Επιλέξτε μεταξύ διαφορετικών στρατηγικών trading για βέλτιστα αποτελέσματα",
    'hero.welcomeDescription': "Η κορυφαία πλατφόρμα αυτοματοποιημένων συναλλαγών για το Solana blockchain.",
    
    // Security
    'security.title': 'Ασφάλεια',
    
    // FAQ
    'faq.title': 'Συχνές Ερωτήσεις',
    'faq.subtitle': 'Απαντήσεις στις πιο συχνές ερωτήσεις για το Solana Trade Automator',
    'faq.questions.q1': 'Τι είναι το Solana Trade Automator;',
    'faq.questions.a1': 'Το Solana Trade Automator είναι μια πλατφόρμα αυτοματοποιημένων συναλλαγών για το blockchain του Solana που επιτρέπει στους χρήστες να δημιουργούν και να διαχειρίζονται bots συναλλαγών, τα οποία ακολουθούν συγκεκριμένες στρατηγικές για την αγορά και την πώληση tokens.',
    'faq.questions.q2': 'Πώς λειτουργούν τα trading bots;',
    'faq.questions.a2': 'Τα trading bots παρακολουθούν συνεχώς την αγορά και εκτελούν αυτόματα συναλλαγές βάσει προκαθορισμένων παραμέτρων και στρατηγικών. Μπορείτε να ρυθμίσετε τα bots για να ακολουθήσουν συγκεκριμένες στρατηγικές όπως DCA, grid trading, ή arbitrage.',
    'faq.questions.q3': 'Είναι ασφαλή τα κεφάλαιά μου;',
    'faq.questions.a3': 'Ναι, η πλατφόρμα μας είναι σχεδιασμένη έτσι ώστε να έχετε πάντα τον πλήρη έλεγχο των κεφαλαίων σας. Τα κλειδιά του πορτοφολιού σας δεν αποθηκεύονται ποτέ στους διακομιστές μας και όλες οι συναλλαγές απαιτούν την έγκρισή σας μέσω του wallet σας.',
    'faq.questions.q4': 'Ποιες είναι οι χρεώσεις της πλατφόρμας;',
    'faq.questions.a4': 'Η πλατφόρμα μας χρεώνει μόνο ένα μικρό ποσοστό (0.1%) για κάθε επιτυχημένη συναλλαγή που πραγματοποιείται από τα bots. Δεν υπάρχουν κρυφές χρεώσεις ή μηνιαίες συνδρομές.',
    'faq.questions.q5': 'Πώς μπορώ να ξεκινήσω;',
    'faq.questions.a5': 'Για να ξεκινήσετε, συνδέστε απλώς το Phantom wallet σας, επιλέξτε τα tokens που θέλετε να χρησιμοποιήσετε, ρυθμίστε τις παραμέτρους του bot και ενεργοποιήστε το. Η πλατφόρμα μας έχει σχεδιαστεί για να είναι εύκολη στη χρήση, ακόμη και για αρχάριους στο χώρο του crypto.'
  },
  en: {
    // We can add English translations here if needed
    // General
    'general.all': 'All',
    'general.visit': 'Visit',
    'general.command': 'Command',
    'general.dashboard': 'Dashboard',
    'general.navigation': 'Navigation',
    'general.support': 'Support',
    'general.allRightsReserved': 'All rights reserved.',
    'general.terms': 'Terms of Use',
    'general.privacy': 'Privacy Policy',
    'general.learnMore': 'Learn More',
    'general.home': 'Home',
    'general.settings': 'Settings',
    'general.help': 'Help',
    
    // Hero
    'hero.getStartedButton': 'Get Started Now',
    'hero.tagline': "Manage your crypto, automate your transactions, and monitor your funds - all in one place",
    'hero.dashboardToast': "Navigate to Dashboard",
    'hero.botControlToast': "Navigate to Bot Settings",
    'hero.walletToast': "Please connect your wallet",
    'hero.tradeAutomationTitle': "Trade Automation",
    'hero.tradeAutomationDesc': "Let bots execute trades based on your strategy 24/7",
    'hero.marketMonitoringTitle': "Market Monitoring",
    'hero.marketMonitoringDesc': "Analyzing data and identifying opportunities in real-time",
    'hero.securityFeaturesTitle': "Advanced Security",
    'hero.securityFeaturesDesc': "Your funds always remain under your control",
    'hero.analyticsTitle': "Advanced Analytics",
    'hero.analyticsDesc': "Detailed statistics and reports to optimize your strategy",
    'hero.multiStrategyTitle': "Multiple Strategies",
    'hero.multiStrategyDesc': "Choose between different trading strategies for optimal results",
    'hero.welcomeDescription': "The leading automated trading platform for the Solana blockchain.",
    
    // Wallet
    'wallet.connectWallet': 'Connect Wallet',
    'wallet.walletStatus': 'Wallet',
    
    // Platform
    'platform.step1Title': 'Connect Wallet',
    'platform.step1Desc': 'Connect your Solana wallet to start trading',
    'platform.step2Title': 'Select Bot',
    'platform.step2Desc': 'Choose between Trading Bot and Market Maker Bot',
    'platform.step3Title': 'Configure Parameters',
    'platform.step3Desc': 'Customize parameters to suit your needs',
    'platform.step4Title': 'Monitor & Optimize',
    'platform.step4Desc': 'Track your bots performance and improve your strategies',
    'platform.howItWorksTitle': 'How It Works',
    'platform.featuresTitle': 'Platform Features',
    'platform.tradingModes': 'Automated Trading',
    'platform.avgReturns': 'Average Returns',
    'platform.lowFees': 'Low Fees',
    'platform.controlFunds': 'Fund Control',
    'platform.description': 'Our platform provides advanced tools for managing your transactions on the Solana blockchain.',
    
    // Market Bot
    'makerBot.botSettings': 'Bot Settings',
    'makerBot.title': 'Bot Settings',
    'makerBot.configureDesc': 'Customize your bot settings for optimal results',
    
    // Security
    'security.title': 'Security',
    
    // FAQ
    'faq.title': 'Frequently Asked Questions',
    'faq.subtitle': 'Answers to the most common questions about Solana Trade Automator'
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
