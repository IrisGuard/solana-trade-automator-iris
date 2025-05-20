
// Simple translation hook to handle internationalization
export function useTranslation() {
  // In a real app, this would fetch translations based on the current locale
  const t = (key: string, fallback?: string) => {
    // Sample translations for Greek language
    const translations: Record<string, string> = {
      'general.restore': 'Επαναφορά',
      'general.confirmRestore': 'Είστε σίγουροι ότι θέλετε να γίνει επαναφορά της εφαρμογής;',
      'general.restoreSuccess': 'Επιτυχής επαναφορά της εφαρμογής',
      'general.restoreError': 'Σφάλμα κατά την επαναφορά',
      'errors.refreshed': 'Ανανέωση λίστας σφαλμάτων',
      'errors.errorsCleared': 'Τα σφάλματα διαγράφηκαν',
      'errors.errorResolved': 'Το σφάλμα επιλύθηκε',
      'errors.errorResolvingError': 'Σφάλμα κατά την επίλυση του σφάλματος',
      'general.all': 'Όλα',
      'general.visit': 'Επίσκεψη',
      'general.learnMore': 'Μάθετε περισσότερα',
      'help.documentation': 'Τεκμηρίωση',
      'help.exploreResources': 'Εξερευνήστε πόρους για να μάθετε περισσότερα για το blockchain και το οικοσύστημα του Solana',
      'help.searchResources': 'Αναζήτηση πόρων',
      'help.noResourcesFound': 'Δεν βρέθηκαν πόροι που να ταιριάζουν με τα κριτήριά σας'
    };

    // Use the provided fallback or the key itself as fallback
    return translations[key] || fallback || key;
  };

  return { t };
}
