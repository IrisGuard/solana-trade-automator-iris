
/**
 * JSX Runtime Proxy
 * 
 * This file fixes compatibility issues between Radix UI components and React's JSX runtime.
 * It creates proxy exports that match what Radix UI expects for both production and development environments.
 */
import * as React from 'react';
import * as jsxRuntime from 'react/jsx-runtime';

// Explicitly re-export the jsx and jsxs functions from React's JSX runtime
export const jsx = jsxRuntime.jsx;
export const jsxs = jsxRuntime.jsxs;
export const Fragment = React.Fragment;

// For development runtime compatibility
export const jsxDEV = function(type, props, key, isStaticChildren, source, self) {
  // Development version uses the same function as production but with more parameters
  return jsx(type, props, key);
};

// Create a compatibility layer for older code that might import directly
export default {
  jsx,
  jsxs,
  Fragment,
  jsxDEV
};

// Apply patches to global React if in browser environment
if (typeof window !== 'undefined' && window.React) {
  // Make sure React.jsx and React.jsxs are defined
  if (!window.React.jsx) {
    Object.defineProperty(window.React, 'jsx', {
      value: jsx,
      configurable: true,
      writable: false
    });
  }
  
  if (!window.React.jsxs) {
    Object.defineProperty(window.React, 'jsxs', {
      value: jsxs,
      configurable: true,
      writable: false
    });
  }
  
  // Add jsxDEV for development mode
  if (!window.React.jsxDEV) {
    Object.defineProperty(window.React, 'jsxDEV', {
      value: jsxDEV,
      configurable: true,
      writable: false
    });
  }
}
