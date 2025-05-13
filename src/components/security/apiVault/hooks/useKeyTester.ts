
import { useCallback } from 'react';
import { ApiKey } from '../types';

export function useKeyTester() {
  // Προσθήκη νέας μεθόδου για δοκιμή λειτουργικότητας κλειδιών
  const testKeyFunctionality = useCallback(async (key: ApiKey): Promise<boolean> => {
    try {
      // Απλή προσομοίωση ελέγχου - στην πραγματικότητα θα έπρεπε να γίνει κλήση στο API
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true); // Όλα τα κλειδιά θεωρούνται λειτουργικά
        }, 300);
      });
    } catch (testError) {
      console.error('Σφάλμα δοκιμής κλειδιού:', testError);
      return false;
    }
  }, []);

  return {
    testKeyFunctionality
  };
}
