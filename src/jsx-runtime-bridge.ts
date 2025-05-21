
/**
 * This file provides bridge functions for React JSX runtime with React 18.3.1
 */
import * as React from 'react';

// In React 18.3.1, JSX runtime functions are no longer exported from 'react'
// They are available from specific modules
const hasCreateElement = React && typeof React.createElement === 'function';
const hasFragment = React && React.Fragment !== undefined;

const jsxRuntime = hasCreateElement ? 
  { 
    jsx: React.createElement,
    jsxs: React.createElement,
    Fragment: React.Fragment
  } : 
  // Use bracket notation to avoid TypeScript errors about missing exports
  {
    jsx: function jsx(type, props) {
      return hasCreateElement ? React.createElement(type, props) : { type, props };
    },
    jsxs: function jsxs(type, props) { 
      return hasCreateElement ? React.createElement(type, props) : { type, props };
    },
    Fragment: hasFragment ? React.Fragment : Symbol('Fragment')
  };

export const jsx = jsxRuntime.jsx;
export const jsxs = jsxRuntime.jsxs;
export const Fragment = hasFragment ? React.Fragment : jsxRuntime.Fragment;

// Also export these functions that might be used by the JSX transformer
export const jsxDEV = jsx;
export const jsxsDEV = jsxs;

// Export createElement directly with safe fallback
export const createElement = hasCreateElement ? React.createElement : function createElement(type, props, ...children) {
  // Basic fallback implementation
  console.warn('Using createElement fallback implementation');
  return { type, props: { ...props, children } };
};

// Re-export all React hooks with safe fallbacks
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
  Object.assign(window.React, {
    jsx,
    jsxs,
    jsxDEV,
    jsxsDEV,
    Fragment,
    createElement,
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
  });

  // Mark that we've patched the JSX runtime
  window.__JSX_RUNTIME_PATCHED__ = true;
  console.log('JSX Runtime bridge initialized');
}

// Export default React for compatibility
export default React;
