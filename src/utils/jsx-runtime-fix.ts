
/**
 * JSX Runtime Fix
 * 
 * A simplified implementation that fixes compatibility issues between 
 * React components and JSX runtime.
 */
import * as React from 'react';

// Define these as function declarations for better hoisting
export function jsx(type: any, props: any, key?: any) {
  return React.createElement(type, props, key);
}

export function jsxs(type: any, props: any, key?: any) {
  return React.createElement(type, props, key);
}

export function jsxDEV(type: any, props: any, key?: any) {
  return React.createElement(type, props, key);
}

export const Fragment = React.Fragment;

// Create a compatibility object for direct imports
const jsxRuntime = {
  jsx,
  jsxs,
  Fragment,
  jsxDEV
};

export default jsxRuntime;

// Apply global patches if in browser environment
if (typeof window !== 'undefined') {
  // Make sure React global object exists
  if (!window.React) {
    window.React = { ...React };
  }
  
  // Add JSX functions to global React
  if (window.React) {
    if (!window.React.jsx) {
      window.React.jsx = jsx;
    }
    
    if (!window.React.jsxs) {
      window.React.jsxs = jsxs;
    }
    
    if (!window.React.jsxDEV) {
      window.React.jsxDEV = jsxDEV;
    }
  }
}
