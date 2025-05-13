
import { useLanguage as useLanguageContext } from "@/providers/LanguageProvider";

export function useLanguage() {
  return useLanguageContext();
}
