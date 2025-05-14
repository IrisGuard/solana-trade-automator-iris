
import { useLanguage as useLanguageContext } from "@/providers/LanguageProvider";

/**
 * Hook για την πρόσβαση στο τρέχον context γλώσσας της εφαρμογής.
 * Επιτρέπει την αλλαγή γλώσσας και την πρόσβαση στις μεταφράσεις.
 */
export function useLanguage() {
  const context = useLanguageContext();
  if (!context) {
    throw new Error("useLanguage πρέπει να χρησιμοποιείται μέσα σε LanguageProvider");
  }
  return context;
}
