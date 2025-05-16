
import { useContext } from 'react';
import { LanguageContext, LanguageType } from '@/providers/LanguageProvider';

export function useLanguage() {
  const context = useContext(LanguageContext);
  
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  return context;
}

// Export types for use in other files
export type { LanguageType };
