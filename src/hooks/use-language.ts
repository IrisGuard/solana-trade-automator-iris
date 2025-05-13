
import { useLanguage as useLanguageContext } from "@/providers/LanguageProvider";

export function useLanguage() {
  const context = useLanguageContext();
  if (!context) {
    throw new Error("useLanguage πρέπει να χρησιμοποιείται μέσα σε LanguageProvider");
  }
  return context;
}
