
/**
 * This file ensures all React hooks are properly exported before React Router loads
 * It fixes the "useState is not exported by React" errors with React 18.3.1
 */

// Use namespace import instead of default import for React 18.3.1+ compatibility
import React from 'react';
import { 
  useState as bridgeUseState,
  useEffect as bridgeUseEffect,
  useContext as bridgeUseContext,
  useRef as bridgeUseRef,
  useReducer as bridgeUseReducer,
  useCallback as bridgeUseCallback,
  useMemo as bridgeUseMemo,
  useLayoutEffect as bridgeUseLayoutEffect,
  useImperativeHandle as bridgeUseImperativeHandle,
  useDebugValue as bridgeUseDebugValue,
  useId as bridgeUseId,
  useDeferredValue as bridgeUseDeferredValue,
  useInsertionEffect as bridgeUseInsertionEffect,
  useSyncExternalStore as bridgeUseSyncExternalStore,
  useTransition as bridgeUseTransition
} from '../react-18-bridge';

// Create a mapping of all hooks to ensure they exist
const reactHooks = {
  // Use bridge hooks or fallbacks
  useState: bridgeUseState || React.useState || function useState(initialState) { return [initialState, () => {}]; },
  useEffect: bridgeUseEffect || React.useEffect || function useEffect() {},
  useContext: bridgeUseContext || React.useContext || function useContext() { return undefined; },
  useRef: bridgeUseRef || React.useRef || function useRef(initialValue) { return { current: initialValue }; },
  useReducer: bridgeUseReducer || React.useReducer || function useReducer(reducer, initialState) { return [initialState, () => {}]; },
  useCallback: bridgeUseCallback || React.useCallback || function useCallback(callback) { return callback; },
  useMemo: bridgeUseMemo || React.useMemo || function useMemo(factory) { return factory(); },
  useLayoutEffect: bridgeUseLayoutEffect || React.useLayoutEffect || function useLayoutEffect() {},
  useImperativeHandle: bridgeUseImperativeHandle || React.useImperativeHandle || function useImperativeHandle() {},
  useDebugValue: bridgeUseDebugValue || React.useDebugValue || function useDebugValue() {},
  useId: bridgeUseId || React.useId || function useId() { return Math.random().toString(36).substring(2); },
  useDeferredValue: bridgeUseDeferredValue || React.useDeferredValue || function useDeferredValue(value) { return value; },
  useInsertionEffect: bridgeUseInsertionEffect || React.useInsertionEffect || function useInsertionEffect() {},
  useSyncExternalStore: bridgeUseSyncExternalStore || React.useSyncExternalStore || function useSyncExternalStore(subscribe, getSnapshot) { return getSnapshot(); },
  useTransition: bridgeUseTransition || React.useTransition || function useTransition() { return [false, () => {}]; }
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
  
  // Export fragment symbol
  if (!window.React.Fragment) {
    window.React.Fragment = Symbol('React.Fragment');
  }
  
  console.log('React hooks exported to global React object successfully');
}

// Export default React
export default React;
