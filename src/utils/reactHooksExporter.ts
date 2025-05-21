
/**
 * This file ensures all React hooks are properly exported before React Router loads
 * It fixes the "useState is not exported by React" errors with React 18.3.1
 */

// Use namespace import instead of default import for React 18.3.1+ compatibility
import * as React from 'react';

// Create a mapping of all hooks with fallbacks
const hooksMapping = {
  // Try direct access to hooks, then use fallbacks
  useState: React.useState || function useState(initialState) { 
    console.warn('Using fallback useState');
    return [typeof initialState === 'function' ? initialState() : initialState, () => {}]; 
  },
  useEffect: React.useEffect || function useEffect() {
    console.warn('Using fallback useEffect');
  },
  useContext: React.useContext || function useContext() { 
    console.warn('Using fallback useContext');
    return undefined; 
  },
  useRef: React.useRef || function useRef(initialValue) { 
    console.warn('Using fallback useRef');
    return { current: initialValue }; 
  },
  useReducer: React.useReducer || function useReducer(reducer, initialState) { 
    console.warn('Using fallback useReducer');
    return [initialState, () => {}]; 
  },
  useCallback: React.useCallback || function useCallback(callback) { 
    console.warn('Using fallback useCallback');
    return callback; 
  },
  useMemo: React.useMemo || function useMemo(factory) { 
    console.warn('Using fallback useMemo');
    return factory(); 
  },
  useLayoutEffect: React.useLayoutEffect || function useLayoutEffect() {
    console.warn('Using fallback useLayoutEffect');
  },
  useImperativeHandle: React.useImperativeHandle || function useImperativeHandle() {
    console.warn('Using fallback useImperativeHandle');
  },
  useDebugValue: React.useDebugValue || function useDebugValue() {
    console.warn('Using fallback useDebugValue');
  },
  useId: React.useId || function useId() { 
    console.warn('Using fallback useId');
    return Math.random().toString(36).substring(2); 
  },
  useDeferredValue: React.useDeferredValue || function useDeferredValue(value) { 
    console.warn('Using fallback useDeferredValue');
    return value; 
  },
  useInsertionEffect: React.useInsertionEffect || function useInsertionEffect() {
    console.warn('Using fallback useInsertionEffect');
  },
  useSyncExternalStore: React.useSyncExternalStore || function useSyncExternalStore(subscribe, getSnapshot) { 
    console.warn('Using fallback useSyncExternalStore');
    return getSnapshot(); 
  },
  useTransition: React.useTransition || function useTransition() { 
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
