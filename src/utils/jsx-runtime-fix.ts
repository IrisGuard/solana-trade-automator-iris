
/**
 * JSX Runtime Proxy
 * 
 * This file fixes compatibility issues between Radix UI components and React's JSX runtime.
 * It creates proxy exports that match what Radix UI expects for both production and development environments.
 */
import * as React from 'react';

// First define our basic functions that don't depend on anything else
export const Fragment = React.Fragment;

// Define JSX functions directly without relying on imports that might not be initialized
export const jsx = function(type, props, key) {
  return React.createElement(type, props, key);
};

export const jsxs = function(type, props, key) {
  // jsxs is for handling multiple children
  return React.createElement(type, props, key);
};

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
