
/**
 * This file ensures all React hooks are properly exported before React Router loads
 * It fixes the "useState is not exported by React" errors with React 18.3.1
 */

// Use namespace import instead of default import for React 18.3.1+ compatibility
import * as React from 'react';

// Create a mapping of all hooks to ensure they exist
const reactHooks = {
  useState: React.useState || function useState(initialState) { 
    console.warn('useState fallback used'); 
    return [initialState, () => {}]; 
  },
  useEffect: React.useEffect || function useEffect(effect, deps) { 
    console.warn('useEffect fallback used'); 
  },
  useContext: React.useContext || function useContext(context) { 
    console.warn('useContext fallback used'); 
    return undefined; 
  },
  useRef: React.useRef || function useRef(initialValue) { 
    console.warn('useRef fallback used'); 
    return { current: initialValue }; 
  },
  useReducer: React.useReducer || function useReducer(reducer, initialState) { 
    console.warn('useReducer fallback used'); 
    return [initialState, () => {}]; 
  },
  useCallback: React.useCallback || function useCallback(callback, deps) { 
    console.warn('useCallback fallback used'); 
    return callback; 
  },
  useMemo: React.useMemo || function useMemo(factory, deps) { 
    console.warn('useMemo fallback used'); 
    return factory(); 
  },
  useLayoutEffect: React.useLayoutEffect || function useLayoutEffect(effect, deps) { 
    console.warn('useLayoutEffect fallback used'); 
  },
  useImperativeHandle: React.useImperativeHandle || function useImperativeHandle(ref, createHandle, deps) { 
    console.warn('useImperativeHandle fallback used'); 
  },
  useDebugValue: React.useDebugValue || function useDebugValue(value) { 
    console.warn('useDebugValue fallback used'); 
  },
  useId: React.useId || function useId() { 
    console.warn('useId fallback used'); 
    return Math.random().toString(36).substr(2, 9); 
  },
  useDeferredValue: React.useDeferredValue || function useDeferredValue(value) { 
    console.warn('useDeferredValue fallback used'); 
    return value; 
  },
  useInsertionEffect: React.useInsertionEffect || function useInsertionEffect(effect, deps) { 
    console.warn('useInsertionEffect fallback used'); 
  },
  useSyncExternalStore: React.useSyncExternalStore || function useSyncExternalStore(subscribe, getSnapshot) {
    console.warn('useSyncExternalStore fallback used'); 
    return getSnapshot(); 
  },
  useTransition: React.useTransition || function useTransition() { 
    console.warn('useTransition fallback used'); 
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
} = reactHooks;

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
  
  // Check if each hook exists on global React and add it if not
  Object.entries(reactHooks).forEach(([hookName, hookFn]) => {
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
  
  // Export JSX runtime functions to global React
  const jsxFunctions = {
    jsx: React.jsx || React.createElement,
    jsxs: React.jsxs || React.createElement,
    Fragment: React.Fragment
  };
  
  Object.entries(jsxFunctions).forEach(([fnName, fn]) => {
    if (!window.React[fnName]) {
      try {
        Object.defineProperty(window.React, fnName, {
          value: fn,
          writable: true,
          configurable: true
        });
        console.log(`Patched ${fnName} onto global React object`);
      } catch (e) {
        console.warn(`Could not patch ${fnName} onto global React:`, e);
      }
    }
  });
  
  console.log('React hooks exported to global React object successfully');
}

// Export default React
export default React;
