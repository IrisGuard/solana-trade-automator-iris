
/**
 * React Runtime Initializer - Enhanced
 * 
 * This file initializes the React JSX runtime functions early to prevent
 * circular dependencies and ensure they're available when needed.
 */

import * as React from 'react';

/**
 * Initialize the React runtime functions on the global React object
 * to ensure JSX functions are available early in the application lifecycle.
 */
export function initializeReactRuntime(): void {
  if (typeof window === 'undefined') return;
  
  try {
    // Create React on window if it doesn't exist
    if (!window.React) {
      window.React = { ...React };
      console.log('React global object created');
    }
    
    // Ensure core JSX functions are defined early
    const reactObj = window.React;
    
    // Use Object.defineProperty for more reliable property definition
    if (!reactObj.jsx) {
      Object.defineProperty(reactObj, 'jsx', {
        value: function jsx(type: any, props: any, key?: any) {
          return React.createElement(type, props, key);
        },
        configurable: true,
        writable: true
      });
      console.log('JSX function initialized');
    }
    
    if (!reactObj.jsxs) {
      Object.defineProperty(reactObj, 'jsxs', {
        value: function jsxs(type: any, props: any, key?: any) {
          return React.createElement(type, props, key);
        },
        configurable: true,
        writable: true
      });
      console.log('JSXS function initialized');
    }
    
    if (!reactObj.jsxDEV) {
      Object.defineProperty(reactObj, 'jsxDEV', {
        value: function jsxDEV(type: any, props: any, key?: any) {
          return React.createElement(type, props, key);
        },
        configurable: true,
        writable: true
      });
      console.log('JSXDEV function initialized');
    }
    
    if (!reactObj.Fragment) {
      Object.defineProperty(reactObj, 'Fragment', {
        value: React.Fragment,
        configurable: true,
        writable: true
      });
      console.log('Fragment initialized');
    }
    
    // Verify initialization
    console.log('React runtime initialized:', {
      jsx: !!reactObj.jsx,
      jsxs: !!reactObj.jsxs,
      jsxDEV: !!reactObj.jsxDEV,
      Fragment: !!reactObj.Fragment
    });
  } catch (error) {
    console.error('React runtime initialization error:', error);
  }
}

// Export the core JSX functions directly
export const jsx = (type: any, props: any, key?: any) => React.createElement(type, props, key);
export const jsxs = (type: any, props: any, key?: any) => React.createElement(type, props, key);
export const jsxDEV = (type: any, props: any, key?: any) => React.createElement(type, props, key);
export const Fragment = React.Fragment;

export default { jsx, jsxs, jsxDEV, Fragment };
