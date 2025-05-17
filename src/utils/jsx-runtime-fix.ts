
/**
 * JSX Runtime Proxy
 * 
 * This file fixes compatibility issues between Radix UI components and React's JSX runtime.
 * It creates proxy exports that match what Radix UI expects for both production and development environments.
 */
import * as React from 'react';

// Define these as function declarations for better hoisting
export function jsx(type: any, props: any, key?: any) {
  return React.createElement(type, props, key);
}

export function jsxs(type: any, props: any, key?: any) {
  return React.createElement(type, props, key);
}

export function jsxDEV(type: any, props: any, key?: any, isStaticChildren?: boolean, source?: any, self?: any) {
  return React.createElement(type, props, key);
}

// First define our basic functions that don't depend on anything else
export const Fragment = React.Fragment;

// Create a compatibility layer for older code that might import directly
const jsxRuntime = {
  jsx,
  jsxs,
  Fragment,
  jsxDEV
};

export default jsxRuntime;

// Apply patches to global React if in browser environment
if (typeof window !== 'undefined' && window.React) {
  // Make sure React.jsx and React.jsxs are defined
  if (!window.React.jsx) {
    window.React.jsx = jsx;
  }
  
  if (!window.React.jsxs) {
    window.React.jsxs = jsxs;
  }
  
  // Add jsxDEV for development mode
  if (!window.React.jsxDEV) {
    window.React.jsxDEV = jsxDEV;
  }
}
