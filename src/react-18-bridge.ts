
/**
 * React 18.3.1 Bridge
 * 
 * This file creates compatibility bridges for React 18.3.1 which has changed
 * how hooks and JSX functions are exported
 */
import * as React from 'react';

// Access React hooks directly or create fallbacks
// React 18.3.1 doesn't use the hooks property in TypeScript definitions
const useState = React.useState || function(initialState) { return [initialState, () => {}]; };
const useEffect = React.useEffect || function() {};
const useContext = React.useContext || function() { return undefined; };
const useReducer = React.useReducer || function(r, i) { return [i, () => {}]; };
const useRef = React.useRef || function(i) { return {current: i}; };
const useMemo = React.useMemo || function(fn) { return fn(); };
const useCallback = React.useCallback || function(fn) { return fn; };
const useLayoutEffect = React.useLayoutEffect || function() {};
const useDebugValue = React.useDebugValue || function() {};
const useImperativeHandle = React.useImperativeHandle || function() {};
const useId = React.useId || function() { return Math.random().toString(36).slice(2); };
const useDeferredValue = React.useDeferredValue || function(v) { return v; };
const useInsertionEffect = React.useInsertionEffect || React.useEffect || function() {};
const useSyncExternalStore = React.useSyncExternalStore || function(s, g) { return g(); };
const useTransition = React.useTransition || function() { return [false, function() {}]; };

// Core React functions
const Fragment = React.Fragment || Symbol('React.Fragment');
const createElement = React.createElement || function() {};
const createContext = React.createContext || function() {};
const forwardRef = React.forwardRef || function(r) { return r; };
const memo = React.memo || function(c) { return c; };

// Create JSX runtime function exports that use createElement directly
const jsx = createElement;
const jsxs = createElement;

// Export all hooks and functions
export {
  useState, useEffect, useContext, useReducer, useRef, useMemo, useCallback,
  useLayoutEffect, useDebugValue, useImperativeHandle, useId, useDeferredValue,
  useInsertionEffect, useSyncExternalStore, useTransition,
  Fragment, createElement, createContext, forwardRef, memo,
  jsx, jsxs
};

// Apply these to the global React object
if (typeof window !== 'undefined') {
  // Initialize window.React with the React object itself
  if (!window.React) {
    // Create a proper typed React object instead of an empty object
    window.React = {...React} as typeof React;
  }
  
  // Copy all properties from React to window.React
  for (const key in React) {
    if (Object.prototype.hasOwnProperty.call(React, key)) {
      (window.React as any)[key] = React[key];
    }
  }
  
  // Apply hooks
  const reactExports = {
    useState, useEffect, useContext, useReducer, useRef, useMemo, useCallback,
    useLayoutEffect, useDebugValue, useImperativeHandle, useId, useDeferredValue,
    useInsertionEffect, useSyncExternalStore, useTransition,
    Fragment, createElement, createContext, forwardRef, memo,
    jsx, jsxs
  };
  
  Object.entries(reactExports).forEach(([name, fn]) => {
    if (!(window.React as any)[name]) {
      try {
        Object.defineProperty(window.React, name, {
          value: fn,
          writable: true,
          configurable: true
        });
      } catch (e) {
        console.warn(`[React 18.3.1] Failed to define ${name} on window.React:`, e);
      }
    }
  });
  
  console.log('[React 18.3.1] Bridge initialized successfully');
}

// Export the React namespace as default
export default React;
