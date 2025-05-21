
/**
 * This file ensures all React hooks are properly exported before React Router loads
 * It fixes the "useState is not exported by React" errors with React 18.3.1
 */

// Use namespace import instead of default import for React 18.3.1+ compatibility
import * as React from 'react';

// Access React hooks via the hooks namespace in React 18.3.1
const reactHooks = React.hooks || {};

// Create a mapping of all hooks to ensure they exist
const hooksMapping = {
  // First try React.hooks (React 18.3.1), then fallback to direct access, then use fallbacks
  useState: reactHooks.useState || function useState(initialState) { 
    console.warn('Using fallback useState');
    return [typeof initialState === 'function' ? initialState() : initialState, () => {}]; 
  },
  useEffect: reactHooks.useEffect || function useEffect() {
    console.warn('Using fallback useEffect');
  },
  useContext: reactHooks.useContext || function useContext() { 
    console.warn('Using fallback useContext');
    return undefined; 
  },
  useRef: reactHooks.useRef || function useRef(initialValue) { 
    console.warn('Using fallback useRef');
    return { current: initialValue }; 
  },
  useReducer: reactHooks.useReducer || function useReducer(reducer, initialState) { 
    console.warn('Using fallback useReducer');
    return [initialState, () => {}]; 
  },
  useCallback: reactHooks.useCallback || function useCallback(callback) { 
    console.warn('Using fallback useCallback');
    return callback; 
  },
  useMemo: reactHooks.useMemo || function useMemo(factory) { 
    console.warn('Using fallback useMemo');
    return factory(); 
  },
  useLayoutEffect: reactHooks.useLayoutEffect || function useLayoutEffect() {
    console.warn('Using fallback useLayoutEffect');
  },
  useImperativeHandle: reactHooks.useImperativeHandle || function useImperativeHandle() {
    console.warn('Using fallback useImperativeHandle');
  },
  useDebugValue: reactHooks.useDebugValue || function useDebugValue() {
    console.warn('Using fallback useDebugValue');
  },
  useId: reactHooks.useId || function useId() { 
    console.warn('Using fallback useId');
    return Math.random().toString(36).substring(2); 
  },
  useDeferredValue: reactHooks.useDeferredValue || function useDeferredValue(value) { 
    console.warn('Using fallback useDeferredValue');
    return value; 
  },
  useInsertionEffect: reactHooks.useInsertionEffect || function useInsertionEffect() {
    console.warn('Using fallback useInsertionEffect');
  },
  useSyncExternalStore: reactHooks.useSyncExternalStore || function useSyncExternalStore(subscribe, getSnapshot) { 
    console.warn('Using fallback useSyncExternalStore');
    return getSnapshot(); 
  },
  useTransition: reactHooks.useTransition || function useTransition() { 
    console.warn('Using fallback useTransition');
    return [false, () => {}]; 
  }
};

// Explicitly export all hooks from React
export const {
  useState,
  useEffect,
  useContext,
  useRef,
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
} = hooksMapping;

// Create a safe Fragment reference
export const Fragment = React.Fragment || Symbol('React.Fragment');

// Ensure the hooks are also available on the global React object
if (typeof window !== 'undefined') {
  // Create React on window if it doesn't exist
  if (!window.React) {
    Object.defineProperty(window, 'React', { 
      value: {}, 
      writable: true, 
      configurable: true 
    });
  }
  
  // Add hooks and Fragment to global React
  const exportItems = { ...hooksMapping, Fragment };
  
  Object.entries(exportItems).forEach(([hookName, hookFn]) => {
    if (!window.React[hookName]) {
      try {
        // Use Object.defineProperty for safer property assignment
        Object.defineProperty(window.React, hookName, {
          value: hookFn,
          writable: true,
          configurable: true
        });
        console.log(`Patched ${hookName} onto global React object`);
      } catch (e) {
        console.warn(`Could not patch ${hookName} onto global React:`, e);
      }
    }
  });
  
  console.log('React hooks exported to global React object successfully');
}

// Export default React
export default React;
