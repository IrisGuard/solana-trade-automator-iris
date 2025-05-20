
import * as React from 'react';

// Export the function for applying React compatibility
export function ensureReactCompatibility(): void {
  if (typeof window !== 'undefined') {
    try {
      // Create a full copy of React in the window
      window.React = window.React || Object.assign({}, React);
      
      // Explicitly patch jsx and jsxs functions if they don't exist
      if (!window.React.jsx) {
        Object.defineProperty(window.React, 'jsx', {
          value: React.createElement,
          writable: false,
          configurable: true
        });
      }
      
      if (!window.React.jsxs) {
        Object.defineProperty(window.React, 'jsxs', {
          value: React.createElement,
          writable: false,
          configurable: true
        });
      }
      
      // Explicitly add other important React exports
      const reactExports = {
        createElement: React.createElement,
        createContext: React.createContext,
        Fragment: React.Fragment,
        useState: React.useState,
        useEffect: React.useEffect,
        useContext: React.useContext,
        useRef: React.useRef
      };
      
      Object.entries(reactExports).forEach(([key, value]) => {
        if (!window.React[key]) {
          window.React[key] = value;
        }
      });
      
      // Log success
      console.log('React patches applied successfully');
    } catch (error) {
      console.error('Error applying React patches:', error);
    }
  }
}

// Ensure the patch is applied automatically when the module is imported
ensureReactCompatibility();

// For backwards compatibility with older code
export default ensureReactCompatibility;
