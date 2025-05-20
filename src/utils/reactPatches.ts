
import * as React from 'react';

// Ensure React is available in the window object for compatibility issues
declare global {
  interface Window {
    React: typeof React;
  }
}

// Export the function for applying React compatibility
export function ensureReactCompatibility(): void {
  if (typeof window !== 'undefined') {
    try {
      // Create a full copy of React in the window
      window.React = React;
      
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
