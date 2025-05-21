
/**
 * This file provides a bridge for JSX runtime functions to ensure compatibility
 * with various React versions including React 18.3.1
 */
import * as React from 'react';

// Access createElement
const createElement = React.createElement;

// JSX runtime functions that use createElement
export const jsx = createElement;
export const jsxs = createElement;
export const jsxDEV = createElement;

// Export Fragment for JSX usage
export const Fragment = React.Fragment;

// Log initialization
console.log('JSX Runtime bridge initialized');

// Apply to global React if available
if (typeof window !== 'undefined' && window.React) {
  // Use Object.defineProperty for safer assignment to potentially read-only properties
  try {
    // Helper function to safely define a property if it doesn't exist
    const safelyDefineProperty = (obj, prop, value) => {
      if (!obj[prop]) {
        try {
          Object.defineProperty(obj, prop, { 
            value, 
            configurable: true,
            writable: true
          });
        } catch (e) {
          console.warn(`Could not define ${prop} on React: ${e.message}`);
        }
      }
    };
    
    // Apply JSX runtime functions
    safelyDefineProperty(window.React, 'jsx', jsx);
    safelyDefineProperty(window.React, 'jsxs', jsxs);
    safelyDefineProperty(window.React, 'jsxDEV', jsxDEV);
    safelyDefineProperty(window.React, 'Fragment', Fragment);
    
  } catch (e) {
    console.warn('Could not apply JSX runtime functions to window.React', e);
  }
}

// Export default for compatibility
export default {
  jsx,
  jsxs,
  jsxDEV,
  Fragment
};
