
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
      window.React = window.React || React;
      
      // Ensure all essential React functions are available
      Object.entries({
        createElement: React.createElement,
        createContext: React.createContext,
        Fragment: React.Fragment,
        useState: React.useState,
        useEffect: React.useEffect,
        useContext: React.useContext,
        useRef: React.useRef
      }).forEach(([key, value]) => {
        if (!window.React[key]) {
          window.React[key] = value;
        }
      });
      
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
