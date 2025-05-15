
import * as React from 'react';

// Βεβαιώνουμε ότι το React είναι διαθέσιμο στο window για προβλήματα συμβατότητας

// Προσθήκη τύπων για το window object
declare global {
  interface Window {
    React: typeof React;
  }
}

// Εξαγωγή της συνάρτησης για εφαρμογή συμβατότητας με το React
export function ensureReactCompatibility(): void {
  if (typeof window !== 'undefined') {
    try {
      // Δημιουργία πλήρους αντιγράφου του React στο window
      window.React = { ...React };
      
      // Καταγραφή επιτυχίας
      console.log('React patches applied successfully');
    } catch (error) {
      console.error('Error applying React patches:', error);
    }
  }
}

// Βεβαιώνουμε ότι το patch εφαρμόζεται αυτόματα κατά την εισαγωγή του module
ensureReactCompatibility();

// Για συμβατότητα με παλαιότερες εκδόσεις κώδικα
export default ensureReactCompatibility;
