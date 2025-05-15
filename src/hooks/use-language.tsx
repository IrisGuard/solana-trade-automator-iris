
import { useContext } from "react";
import { LanguageContext, LanguageType } from "@/providers/LanguageProvider";

export function useLanguage() {
  const context = useContext(LanguageContext);
  
  if (context === undefined) {
    throw new Error("useLanguage πρέπει να χρησιμοποιείται εντός του LanguageProvider");
  }
  
  const { language, setLanguage, t } = context;
  
  return { language, setLanguage, t };
}
