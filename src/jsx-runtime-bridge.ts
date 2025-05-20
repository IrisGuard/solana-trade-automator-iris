
/**
 * This file provides explicit exports of React JSX runtime functions
 * to fix build issues with JSX transformations in React 18.3.1
 */
import * as React from 'react';

// Explicitly re-export JSX functions from React
export const jsx = React.createElement;
export const jsxs = React.createElement;
export const Fragment = React.Fragment;

// Also export these functions that might be used by the JSX transformer
export const jsxDEV = React.createElement;
export const jsxsDEV = React.createElement;

// Make sure createElement is also exported
export const createElement = React.createElement;

// Export all React hooks explicitly to ensure they're available
export const {
  useState,
  useEffect,
  useContext,
  useReducer,
  useRef,
  useMemo,
  useCallback,
  useLayoutEffect,
  useDebugValue,
  useImperativeHandle,
  useId,
  useDeferredValue,
  useInsertionEffect,
  useSyncExternalStore,
  useTransition
} = React;

// Apply to global React for compatibility
if (typeof window !== 'undefined') {
  window.React = window.React || {} as any;
  
  // Add JSX runtime functions to global React
  Object.assign(window.React, {
    jsx,
    jsxs,
    jsxDEV,
    jsxsDEV,
    Fragment,
    createElement,
    // Also add hooks
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
  });
}

// Export default React for compatibility
export default React;
