
import * as React from 'react';
import * as jsxRuntime from 'react/jsx-runtime';
import { jsx, jsxs, Fragment } from './jsx-runtime-fix';

// Βεβαιώνουμε ότι το React είναι διαθέσιμο στο window για προβλήματα συμβατότητας

// Προσθήκη τύπων για το window object
declare global {
  interface Window {
    React: typeof React & {
      jsx?: typeof jsxRuntime.jsx;
      jsxs?: typeof jsxRuntime.jsxs;
    };
  }
}

// Εξαγωγή της συνάρτησης για εφαρμογή συμβατότητας με το React
export function ensureReactCompatibility(): void {
  if (typeof window !== 'undefined') {
    try {
      // Δημιουργία πλήρους αντιγράφου του React στο window
      window.React = { ...React };
      
      // Ensure JSX functions are available
      window.React.jsx = jsx;
      window.React.jsxs = jsxs;
      
      // Patch the Fragment property if needed
      if (!window.React.Fragment) {
        Object.defineProperty(window.React, 'Fragment', {
          value: Fragment,
          writable: false,
          configurable: true
        });
      }
      
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
