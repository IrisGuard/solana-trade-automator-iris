
// Re-export React hooks and functions properly
import * as React from 'react';

// Create an object to hold all hook exports
const reactHooks = {
  useState: React.useState,
  useEffect: React.useEffect,
  useContext: React.useContext,
  useRef: React.useRef,
  useReducer: React.useReducer,
  useCallback: React.useCallback,
  useMemo: React.useMemo,
  useLayoutEffect: React.useLayoutEffect,
  useImperativeHandle: React.useImperativeHandle,
  useDebugValue: React.useDebugValue,
  useId: React.useId, 
  useDeferredValue: React.useDeferredValue,
  useInsertionEffect: React.useInsertionEffect,
  useSyncExternalStore: React.useSyncExternalStore,
  useTransition: React.useTransition
};

// Ensure all React hooks are exported
export const {
  useState,
  useEffect,
  useContext,
  useRef,
  createContext,
  forwardRef,
  memo,
  useCallback,
  useMemo,
  useReducer,
  useLayoutEffect,
  useImperativeHandle,
  useDebugValue,
  useId,
  useDeferredValue,
  useInsertionEffect,
  useSyncExternalStore,
  useTransition,
  Fragment,
  createElement
} = React;

// Provide JSX runtime functions
export const jsx = React.createElement;
export const jsxs = React.createElement;
export const jsxDEV = React.createElement;

// Apply hooks to global React for compatibility
if (typeof window !== 'undefined') {
  // Create window.React if it doesn't exist
  window.React = window.React || {} as any;
  
  // Add hooks if they don't exist
  const exportedItems = {
    ...reactHooks,
    createContext: React.createContext,
    forwardRef: React.forwardRef,
    memo: React.memo,
    Fragment: React.Fragment,
    createElement: React.createElement,
    jsx: React.createElement,
    jsxs: React.createElement,
    jsxDEV: React.createElement
  };
  
  Object.entries(exportedItems).forEach(([key, value]) => {
    if (!window.React[key]) {
      window.React[key] = value;
      console.log(`[ReactFix] Added ${key} to global React`);
    }
  });
  
  console.log('[ReactFix] React exports patched successfully');
}

// Export a complete React object with all hooks
const FixedReact = {...React, ...reactHooks, jsx, jsxs, jsxDEV};

// Export React itself for compatibility
export default FixedReact;
