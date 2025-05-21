
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
  Children: React['Children']
};

// JSX runtime functions
const jsx = {
  jsx: React['jsx'] || React['createElement'],
  jsxs: React['jsxs'] || React['createElement'],
  jsxDEV: React['jsxDEV'] || React['createElement']
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
  Children
} = core;

export const {
  jsx,
  jsxs,
  jsxDEV
} = jsx;

// Patch global React object if in browser
if (typeof window !== 'undefined') {
  window.React = window.React || {};
  
  // Apply all hooks
  Object.entries({...hooks, ...core, ...jsx}).forEach(([key, value]) => {
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
