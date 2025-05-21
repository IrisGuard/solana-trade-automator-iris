
/**
 * Central React Runtime Bridge for React 18.3.1 compatibility
 * This file should be imported before any other React imports
 */

import * as React from 'react';

// Extract hooks from React using object property access
const hooks = {
  useState: React['useState'],
  useEffect: React['useEffect'],
  useRef: React['useRef'],
  useContext: React['useContext'],
  useReducer: React['useReducer'],
  useCallback: React['useCallback'],
  useMemo: React['useMemo'],
  useLayoutEffect: React['useLayoutEffect'],
  useImperativeHandle: React['useImperativeHandle'],
  useDebugValue: React['useDebugValue'],
  useId: React['useId'],
  useDeferredValue: React['useDeferredValue'],
  useInsertionEffect: React['useInsertionEffect'],
  useSyncExternalStore: React['useSyncExternalStore'],
  useTransition: React['useTransition']
};

// Core React APIs
const core = {
  createElement: React['createElement'],
  createContext: React['createContext'],
  Fragment: React['Fragment'],
  forwardRef: React['forwardRef'],
  memo: React['memo'],
  Children: React['Children'],
  createRef: React['createRef'],
  cloneElement: React['cloneElement'],
  isValidElement: React['isValidElement'],
  createFactory: React['createFactory'],
  // Add the missing properties causing TypeScript errors
  lazy: React['lazy'],
  startTransition: React['startTransition'],
  act: React['act'],
  StrictMode: React['StrictMode'],
  Suspense: React['Suspense'],
  SuspenseList: React['SuspenseList'],
  Component: React['Component'],
  PureComponent: React['PureComponent'],
  version: React['version'],
  // Add missing Profiler component
  Profiler: React['Profiler']
};

// JSX runtime functions - only define once to avoid redeclaration
const jsxRuntime = {
  jsx: React['jsx'] || React['createElement'],
  jsxs: React['jsxs'] || React['createElement'],
  jsxDEV: React['jsxDEV'] || React['createElement'],
  // Add missing jsxsDEV property (matching the error)
  jsxsDEV: React['jsxsDEV'] || React['jsxDEV'] || React['createElement']
};

// Export all hooks and APIs
export const {
  useState,
  useEffect,
  useRef,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useLayoutEffect,
  useImperativeHandle,
  useDebugValue,
  useId,
  useDeferredValue,
  useInsertionEffect,
  useSyncExternalStore,
  useTransition
} = hooks;

export const {
  createElement,
  createContext,
  Fragment,
  forwardRef,
  memo,
  Children,
  createRef,
  cloneElement,
  isValidElement,
  createFactory,
  lazy,
  startTransition,
  act,
  StrictMode,
  Suspense,
  SuspenseList,
  Component,
  PureComponent,
  version,
  Profiler
} = core;

// Export JSX runtime functions
export const {
  jsx,
  jsxs,
  jsxDEV,
  jsxsDEV
} = jsxRuntime;

// Patch global React object if in browser
if (typeof window !== 'undefined') {
  // Instead of creating an empty object, use the full React object as a base
  window.React = window.React || React;
  
  // Apply all hooks and core methods if they're missing
  Object.entries({...hooks, ...core, ...jsxRuntime}).forEach(([key, value]) => {
    if (value && !window.React[key]) {
      try {
        window.React[key] = value;
      } catch (e) {
        console.warn(`Failed to patch ${key} onto global React: ${e}`);
      }
    }
  });
  
  console.log('React runtime bridge initialized successfully');
}

// Export default React for compatibility
export default React;
