
import * as React from 'react';
import * as jsxRuntime from 'react/jsx-runtime';
import { jsx, jsxs, Fragment, jsxDEV } from './jsx-runtime-fix';

// In the window.d.ts file we've added the type definition for React

// Εξαγωγή της συνάρτησης για εφαρμογή συμβατότητας με το React
export function ensureReactCompatibility(): void {
  if (typeof window !== 'undefined') {
    try {
      // Δημιουργία πλήρους αντιγράφου του React στο window
      window.React = { ...React } as typeof window.React;
      
      // Ensure JSX functions are available
      if (window.React) {
        window.React.jsx = jsx;
        window.React.jsxs = jsxs;
        window.React.jsxDEV = jsxDEV;
        
        // Patch the Fragment property if needed
        if (!window.React.Fragment) {
          Object.defineProperty(window.React, 'Fragment', {
            value: Fragment,
            writable: false,
            configurable: true
          });
        }
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
