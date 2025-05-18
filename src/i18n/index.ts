
// Simple translation function
const translations = {
  'sidebar.dashboard': 'Dashboard',
  'sidebar.wallet': 'Wallet',
  'sidebar.transactions': 'Transactions',
  'sidebar.bots': 'Bots',
  'sidebar.api_vault': 'API Vault',
};

export const t = (key: string): string => {
  return translations[key as keyof typeof translations] || key;
};
