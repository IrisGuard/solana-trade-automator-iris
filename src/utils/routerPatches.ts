
import * as React from 'react';

// Προσθήκη τύπων για το window object
declare global {
  interface Window {
    React: typeof React;
    patchedReactRouter: boolean;
  }
}

// Εξαγωγή της συνάρτησης για εφαρμογή συμβατότητας με το React Router
export function ensureRouterCompatibility(): void {
  if (typeof window !== 'undefined') {
    try {
      // Βεβαιώνουμε ότι έχουμε πλήρες React object
      window.React = window.React || { ...React };
      
      // Σημειώνουμε ότι έχουμε εφαρμόσει το router patch
      window.patchedReactRouter = true;
      
      console.log('React Router patches applied successfully');
    } catch (error) {
      console.error('Error applying router patches:', error);
    }
  }
}

// Για συμβατότητα με παλαιότερες εκδόσεις κώδικα
export default ensureRouterCompatibility;
