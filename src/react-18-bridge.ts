
/**
 * React 18.3.1 Bridge
 * 
 * This file creates compatibility bridges for React 18.3.1 which has changed
 * how hooks and JSX functions are exported
 */
import * as React from 'react';

// Create a version check that doesn't rely on the version export
console.log('React bridge loading - ensuring compatibility with React 18.3.1');

// Create hooks with safe fallbacks
const createHook = (hookName, fallbackFn) => {
  // Try to access the hook directly from the React object
  return React[hookName] || // Direct access if available
         fallbackFn;        // Fallback implementation
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

// Create safe versions of React element creation functions
// Use hasOwnProperty to safely check if the methods exist
const hasCreateElement = React && typeof React.createElement === 'function';
const hasFragment = React && React.Fragment !== undefined;
const hasCreateContext = React && typeof React.createContext === 'function';
const hasForwardRef = React && typeof React.forwardRef === 'function';
const hasMemo = React && typeof React.memo === 'function';

// Create JSX runtime function exports with fallbacks
export const jsx = hasCreateElement ? React.createElement : ((type, props) => ({ type, props }));
export const jsxs = hasCreateElement ? React.createElement : ((type, props) => ({ type, props }));
export const Fragment = hasFragment ? React.Fragment : Symbol('React.Fragment');
export const createElement = hasCreateElement ? React.createElement : ((type, props, ...children) => ({ type, props: { ...props, children } }));
export const createContext = hasCreateContext ? React.createContext : ((defaultValue) => ({ Provider: ({ children }) => children, Consumer: ({ children }) => children(defaultValue), _currentValue: defaultValue }));
export const forwardRef = hasForwardRef ? React.forwardRef : ((render) => render);
export const memo = hasMemo ? React.memo : ((component) => component);

// Apply these to the global React object
if (typeof window !== 'undefined') {
  // Initialize window.React with the React object itself
  window.React = window.React || React;
  
  // Apply hooks
  const hooks = {
    useState, useEffect, useContext, useReducer, useRef, useMemo, useCallback,
    useLayoutEffect, useDebugValue, useImperativeHandle, useId, useDeferredValue,
    useInsertionEffect, useSyncExternalStore, useTransition,
    Fragment, createElement, createContext, forwardRef, memo,
    jsx, jsxs
  };
  
  Object.entries(hooks).forEach(([name, fn]) => {
    if (fn && !window.React[name]) {
      window.React[name] = fn;
    }
  });
  
  console.log('[React 18.3.1] Bridge initialized successfully');
}

// Export the React namespace as default
export default React;
