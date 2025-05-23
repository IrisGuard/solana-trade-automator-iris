
import { useState } from 'react';

export function useLanguage() {
  const [language, setLanguage] = useState('el');
  
  const t = (key: string, fallback?: string) => fallback || key;

  return {
    language,
    setLanguage,
    t
  };
}
