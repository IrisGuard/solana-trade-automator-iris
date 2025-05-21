
/**
 * This file provides explicit exports of React JSX runtime functions
 * to fix build issues with JSX transformations in React 18.3.1
 */
import * as React from 'react';

// Access React exports properly - React 18.3.1 requires using the namespace
export const jsx = React.jsx || React.createElement;
export const jsxs = React.jsxs || React.createElement;
export const Fragment = React.Fragment;

// Also export these functions that might be used by the JSX transformer
export const jsxDEV = React.jsxDEV || React.createElement;
export const jsxsDEV = React.jsxsDEV || React.createElement;

// Export createElement directly
export const createElement = React.createElement;

// Export all React hooks explicitly using the namespace approach
export const {
  useState = React.useState,
  useEffect = React.useEffect,
  useContext = React.useContext,
  useReducer = React.useReducer,
  useRef = React.useRef,
  useMemo = React.useMemo,
  useCallback = React.useCallback,
  useLayoutEffect = React.useLayoutEffect,
  useDebugValue = React.useDebugValue,
  useImperativeHandle = React.useImperativeHandle,
  useId = React.useId,
  useDeferredValue = React.useDeferredValue,
  useInsertionEffect = React.useInsertionEffect,
  useSyncExternalStore = React.useSyncExternalStore,
  useTransition = React.useTransition
} = React;

// Apply to global React for compatibility
if (typeof window !== 'undefined') {
  window.React = window.React || {} as any;
  
  // Add JSX runtime functions to global React
  Object.assign(window.React, {
    jsx: jsx,
    jsxs: jsxs,
    jsxDEV: jsxDEV,
    jsxsDEV: jsxsDEV,
    Fragment: Fragment,
    createElement: createElement,
    // Also add hooks
    useState: useState,
    useEffect: useEffect,
    useContext: useContext,
    useRef: useRef,
    useReducer: useReducer,
    useCallback: useCallback,
    useMemo: useMemo,
    useLayoutEffect: useLayoutEffect,
    useImperativeHandle: useImperativeHandle,
    useDebugValue: useDebugValue,
    useId: useId,
    useDeferredValue: useDeferredValue,
    useInsertionEffect: useInsertionEffect,
    useSyncExternalStore: useSyncExternalStore,
    useTransition: useTransition
  });
}

// Export default React for compatibility
export default React;
