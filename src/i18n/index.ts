
// This file exists only for compatibility with older code
// Please use the useLanguage() hook instead of this function
export const t = (key: string): string => {
  console.warn('Deprecated: The direct t() function is deprecated. Please use useLanguage() hook instead');
  
  try {
    const translations = {
      'sidebar.dashboard': 'Dashboard',
      'sidebar.wallet': 'Wallet',
      'sidebar.transactions': 'Transactions',
      'sidebar.bots': 'Bots',
      'sidebar.api_vault': 'API Vault',
    };
    
    return translations[key as keyof typeof translations] || key;
  } catch (e) {
    return key;
  }
};
