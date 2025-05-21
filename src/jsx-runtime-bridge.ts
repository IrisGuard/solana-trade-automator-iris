
/**
 * This file provides bridge functions for React JSX runtime with React 18.3.1
 */
import * as React from 'react';

// Use direct imports from React
const reactCreateElement = React.createElement;
const reactFragment = React.Fragment;

// Create jsx/jsxs functions that always use React.createElement
export const jsx = function jsx(type, props, ...children) {
  return reactCreateElement(type, props, ...children);
};

export const jsxs = function jsxs(type, props, ...children) {
  return reactCreateElement(type, props, ...children);
};

export { reactFragment as Fragment };

// Also export these functions that might be used by the JSX transformer
export const jsxDEV = jsx;
export const jsxsDEV = jsxs;

// Export createElement directly 
export { reactCreateElement as createElement };

// Re-export all React hooks
export const useState = React.useState || ((initialState) => [initialState, () => {}]);
export const useEffect = React.useEffect || (() => {});
export const useContext = React.useContext || (() => undefined);
export const useReducer = React.useReducer || ((reducer, initialState) => [initialState, () => {}]);
export const useRef = React.useRef || ((initialValue) => ({ current: initialValue }));
export const useMemo = React.useMemo || ((factory) => factory());
export const useCallback = React.useCallback || ((callback) => callback);
export const useLayoutEffect = React.useLayoutEffect || (() => {});
export const useImperativeHandle = React.useImperativeHandle || (() => {});
export const useDebugValue = React.useDebugValue || (() => {});
export const useId = React.useId || (() => Math.random().toString(36).substring(2));

// Apply to global React for compatibility
if (typeof window !== 'undefined') {
  // Create window.React if it doesn't exist
  window.React = window.React || React;
  
  // Add JSX runtime functions to global React
  const runtimeFunctions = {
    jsx,
    jsxs,
    jsxDEV,
    jsxsDEV,
    Fragment: reactFragment,
    createElement: reactCreateElement,
    // Also add hooks
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
  };
  
  // Safely add properties to window.React
  Object.entries(runtimeFunctions).forEach(([key, value]) => {
    if (!window.React[key]) {
      try {
        Object.defineProperty(window.React, key, {
          value,
          writable: false,
          configurable: true
        });
      } catch (e) {
        console.warn(`Could not define ${key} on window.React`, e);
      }
    }
  });

  // Mark that we've patched the JSX runtime
  window.__JSX_RUNTIME_PATCHED__ = true;
  console.log('JSX Runtime bridge initialized');
}

// Export default React for compatibility
export default React;
