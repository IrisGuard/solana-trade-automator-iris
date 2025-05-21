
/**
 * This file provides bridge functions for React JSX runtime with React 18.3.1
 */
import * as React from 'react';

// In React 18.3.1, JSX runtime functions are no longer exported from 'react'
// They are available from specific modules
const jsxRuntime = React.createElement ? 
  { 
    jsx: React.createElement,
    jsxs: React.createElement,
    Fragment: React.Fragment
  } : 
  // Use bracket notation to avoid TypeScript errors about missing exports
  {
    jsx: function jsx(type, props) {
      return React.createElement ? React.createElement(type, props) : { type, props };
    },
    jsxs: function jsxs(type, props) { 
      return React.createElement ? React.createElement(type, props) : { type, props };
    },
    Fragment: React.Fragment || Symbol('Fragment')
  };

export const jsx = jsxRuntime.jsx;
export const jsxs = jsxRuntime.jsxs;
export const Fragment = React.Fragment || jsxRuntime.Fragment;

// Also export these functions that might be used by the JSX transformer
export const jsxDEV = jsx;
export const jsxsDEV = jsxs;

// Export createElement directly
export const createElement = React.createElement || function createElement(type, props, ...children) {
  // Basic fallback implementation
  console.warn('Using createElement fallback implementation');
  return { type, props: { ...props, children } };
};

// Re-export all React hooks
export const {
  useState,
  useEffect, 
  useContext,
  useReducer,
  useRef,
  useMemo,
  useCallback,
  useLayoutEffect,
  useImperativeHandle,
  useDebugValue,
  useId
} = React;

// Apply to global React for compatibility
if (typeof window !== 'undefined') {
  // Create window.React if it doesn't exist
  window.React = window.React || React;
  
  // Add JSX runtime functions to global React
  Object.assign(window.React, {
    jsx,
    jsxs,
    jsxDEV,
    jsxsDEV,
    Fragment,
    createElement,
    // Also add hooks
    ...React  // Spread all React properties and methods
  });

  // Mark that we've patched the JSX runtime
  window.__JSX_RUNTIME_PATCHED__ = true;
  console.log('JSX Runtime bridge initialized');
}

// Export default React for compatibility
export default React;
