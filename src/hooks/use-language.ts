import { useLanguage as useLanguageContext } from "@/providers/LanguageProvider";

// Re-export with proper interface that matches how it's being used
export const useLanguage = () => {
  const { t: originalT, ...rest } = useLanguageContext();
  
  // Wrap the original t function to accept an optional fallback string
  const t = (key: string, fallback?: string) => {
    // If the translation exists for the key, return it
    // Otherwise return the fallback or the key itself
    return originalT(key) || fallback || key;
  };
  
  return { t, ...rest };
};
