
import * as React from 'react';

// Export the function for applying React compatibility
export function ensureReactCompatibility(): void {
  if (typeof window === 'undefined') return;

  try {
    // Create a React on window if it doesn't exist
    if (!window.React) {
      window.React = Object.create(React);
      console.log('React object created on window');
    }
    
    // Ensure JSX functions are available
    if (window.React) {
      // Define JSX functions properly using Object.defineProperty
      if (!window.React.jsx) {
        Object.defineProperty(window.React, 'jsx', {
          value: function(type, props, key) {
            return React.createElement(type, props, key);
          },
          writable: true,
          configurable: true
        });
        console.log('jsx function patched');
      }
      
      if (!window.React.jsxs) {
        Object.defineProperty(window.React, 'jsxs', {
          value: function(type, props, key) {
            return React.createElement(type, props, key);
          }, 
          writable: true,
          configurable: true
        });
        console.log('jsxs function patched');
      }
      
      if (!window.React.jsxDEV) {
        Object.defineProperty(window.React, 'jsxDEV', {
          value: function(type, props, key) {
            return React.createElement(type, props, key);
          },
          writable: true,
          configurable: true
        });
        console.log('jsxDEV function patched');
      }
      
      // Patch Fragment if needed
      if (!window.React.Fragment) {
        Object.defineProperty(window.React, 'Fragment', {
          value: React.Fragment,
          writable: false,
          configurable: true
        });
        console.log('Fragment patched');
      }
      
      // Log success
      console.log('All React patches applied successfully');
    }
  } catch (error) {
    console.error('Error applying React patches:', error);
  }
}

// Ensure the patch is automatically applied when the module is imported
ensureReactCompatibility();

// For backwards compatibility with older code
export default ensureReactCompatibility;
