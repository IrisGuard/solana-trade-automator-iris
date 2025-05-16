
import * as React from 'react';

// Εξαγωγή της συνάρτησης για εφαρμογή συμβατότητας με το React Router
export function ensureRouterCompatibility(): void {
  if (typeof window !== 'undefined') {
    try {
      // Βεβαιώνουμε ότι έχουμε πλήρες React object
      // Use type assertion to match the expected extended React type
      window.React = window.React || React as typeof window.React;
      
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
