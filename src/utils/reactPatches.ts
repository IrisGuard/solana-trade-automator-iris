
import * as React from 'react';

// Export the function for applying React compatibility
export function ensureReactCompatibility(): void {
  if (typeof window !== 'undefined') {
    try {
      // Create a full copy of React on window
      if (!window.React) {
        window.React = { ...React } as typeof window.React;
      }
      
      // Ensure JSX functions are available
      if (window.React) {
        // Define JSX functions directly without relying on problematic imports
        if (!window.React.jsx) {
          window.React.jsx = function(type, props, key) {
            return React.createElement(type, props, key);
          };
        }
        
        if (!window.React.jsxs) {
          window.React.jsxs = function(type, props, key) {
            return React.createElement(type, props, key);
          };
        }
        
        if (!window.React.jsxDEV) {
          window.React.jsxDEV = function(type, props, key) {
            return React.createElement(type, props, key);
          };
        }
        
        // Patch the Fragment property if needed
        if (!window.React.Fragment) {
          Object.defineProperty(window.React, 'Fragment', {
            value: React.Fragment,
            writable: false,
            configurable: true
          });
        }
      }
      
      // Log success
      console.log('React patches applied successfully');
    } catch (error) {
      console.error('Error applying React patches:', error);
    }
  }
}

// Ensure the patch is automatically applied when the module is imported
ensureReactCompatibility();

// For backwards compatibility with older code
export default ensureReactCompatibility;
