
// Re-export React hooks and functions properly
import * as React from 'react';

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
if (typeof window !== 'undefined' && window.React) {
  // Add hooks if they don't exist
  Object.entries({
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
    jsx,
    jsxs,
    jsxDEV,
    Fragment,
    createElement
  }).forEach(([key, value]) => {
    if (!window.React[key]) {
      window.React[key] = value;
    }
  });
}

// Export React itself for compatibility
export default React;
