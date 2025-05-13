
import { useLanguage as useLanguageContext } from "@/providers/LanguageProvider";

export function useLanguage() {
  const context = useLanguageContext();
  return context;
}
