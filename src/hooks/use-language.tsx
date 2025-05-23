
import { useContext } from "react";
import { LanguageContext, LanguageType } from "@/providers/LanguageProvider";

export function useLanguage() {
  const context = useContext(LanguageContext);
  
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  
  const { language, setLanguage, t } = context;
  
  return { language, setLanguage, t };
}
