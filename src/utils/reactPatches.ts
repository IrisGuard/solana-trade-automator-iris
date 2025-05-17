
import * as React from 'react';

// In the window.d.ts file we've added the type definition for React

// Εξαγωγή της συνάρτησης για εφαρμογή συμβατότητας με το React
export function ensureReactCompatibility(): void {
  if (typeof window !== 'undefined') {
    try {
      // Δημιουργία πλήρους αντιγράφου του React στο window
      window.React = { ...React } as typeof window.React;
      
      // Ensure JSX functions are available
      if (window.React) {
        // Define JSX functions directly without relying on problematic imports
        window.React.jsx = function(type, props, key) {
          return React.createElement(type, props, key);
        };
        
        window.React.jsxs = function(type, props, key) {
          return React.createElement(type, props, key);
        };
        
        window.React.jsxDEV = function(type, props, key) {
          return React.createElement(type, props, key);
        };
        
        // Patch the Fragment property if needed
        if (!window.React.Fragment) {
          Object.defineProperty(window.React, 'Fragment', {
            value: React.Fragment,
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
