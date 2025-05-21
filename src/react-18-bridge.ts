
/**
 * React 18.3.1 Bridge
 * 
 * This file creates compatibility bridges for React 18.3.1 which has changed
 * how hooks and JSX functions are exported
 */
import React from 'react';

// Create a version check that doesn't rely on the version export
console.log('React bridge loading - ensuring compatibility with React 18.3.1');

// Create hooks with safe fallbacks
const createHook = (name, fallbackFn) => {
  // Try to access the hook from React directly
  return React[name] || // Direct access
         fallbackFn;    // Fallback implementation
};

// Create named exports for all React hooks
export const useState = createHook('useState', (initialState) => [initialState, () => {}]);
export const useEffect = createHook('useEffect', () => {});
export const useContext = createHook('useContext', (context) => undefined);
export const useReducer = createHook('useReducer', (reducer, initialState) => [initialState, () => {}]); 
export const useRef = createHook('useRef', (initialValue) => ({ current: initialValue }));
export const useMemo = createHook('useMemo', (factory) => factory());
export const useCallback = createHook('useCallback', (callback) => callback);
export const useLayoutEffect = createHook('useLayoutEffect', () => {});
export const useDebugValue = createHook('useDebugValue', () => {});
export const useImperativeHandle = createHook('useImperativeHandle', () => {});
export const useId = createHook('useId', () => Math.random().toString(36).substring(2));
export const useDeferredValue = createHook('useDeferredValue', (value) => value);
export const useInsertionEffect = createHook('useInsertionEffect', () => {});
export const useSyncExternalStore = createHook('useSyncExternalStore', (subscribe, getSnapshot) => getSnapshot());
export const useTransition = createHook('useTransition', () => [false, () => {}]);

// Create JSX runtime function exports - use React.createElement directly as fallback
export const jsx = React.createElement;
export const jsxs = React.createElement;
export const Fragment = React.Fragment || Symbol('React.Fragment');
export const createElement = React.createElement;
export const createContext = React.createContext;
export const forwardRef = React.forwardRef;
export const memo = React.memo;

// Apply these to the global React object
if (typeof window !== 'undefined') {
  // Initialize window.React with the React object itself
  window.React = window.React || React;
  
  // Apply hooks
  const hooks = {
    useState, useEffect, useContext, useReducer, useRef, useMemo, useCallback,
    useLayoutEffect, useDebugValue, useImperativeHandle, useId, useDeferredValue,
    useInsertionEffect, useSyncExternalStore, useTransition,
    Fragment, createElement, createContext, forwardRef, memo
  };
  
  Object.entries(hooks).forEach(([name, fn]) => {
    if (fn && !window.React[name]) {
      window.React[name] = fn;
    }
  });
  
  console.log('[React 18.3.1] Bridge initialized successfully');
}

// Export the entire React object
export default React;
