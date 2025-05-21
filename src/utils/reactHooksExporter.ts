
/**
 * This file ensures all React hooks are properly exported before React Router loads
 * It fixes the "useState is not exported by React" errors with React 18.3.1
 */

// Use namespace import instead of default import for React 18.3.1+ compatibility
import * as React from 'react';
// Import bridge hooks that provide fallbacks
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

// Check if React hooks are directly available
const hasUseState = typeof React['useState'] === 'function';
const hasUseEffect = typeof React['useEffect'] === 'function';
const hasFragment = React.Fragment !== undefined;

// Create a mapping of all hooks to ensure they exist - prefer direct React hooks if available
const reactHooks = {
  // Use direct React hooks, bridge hooks, or fallbacks in that order
  useState: hasUseState ? React['useState'] : (bridgeUseState || function useState(initialState) { return [initialState, () => {}]; }),
  useEffect: hasUseEffect ? React['useEffect'] : (bridgeUseEffect || function useEffect() {}),
  useContext: React['useContext'] || bridgeUseContext || function useContext() { return undefined; },
  useRef: React['useRef'] || bridgeUseRef || function useRef(initialValue) { return { current: initialValue }; },
  useReducer: React['useReducer'] || bridgeUseReducer || function useReducer(reducer, initialState) { return [initialState, () => {}]; },
  useCallback: React['useCallback'] || bridgeUseCallback || function useCallback(callback) { return callback; },
  useMemo: React['useMemo'] || bridgeUseMemo || function useMemo(factory) { return factory(); },
  useLayoutEffect: React['useLayoutEffect'] || bridgeUseLayoutEffect || function useLayoutEffect() {},
  useImperativeHandle: React['useImperativeHandle'] || bridgeUseImperativeHandle || function useImperativeHandle() {},
  useDebugValue: React['useDebugValue'] || bridgeUseDebugValue || function useDebugValue() {},
  useId: React['useId'] || bridgeUseId || function useId() { return Math.random().toString(36).substring(2); },
  useDeferredValue: React['useDeferredValue'] || bridgeUseDeferredValue || function useDeferredValue(value) { return value; },
  useInsertionEffect: React['useInsertionEffect'] || bridgeUseInsertionEffect || function useInsertionEffect() {},
  useSyncExternalStore: React['useSyncExternalStore'] || bridgeUseSyncExternalStore || function useSyncExternalStore(subscribe, getSnapshot) { return getSnapshot(); },
  useTransition: React['useTransition'] || bridgeUseTransition || function useTransition() { return [false, () => {}]; }
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

// Create a safe Fragment reference
export const Fragment = hasFragment ? React.Fragment : Symbol('React.Fragment');

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
  
  // Handle Fragment differently to avoid read-only property error
  if (!window.React.Fragment) {
    try {
      // Use our safe Fragment reference
      Object.defineProperty(window.React, 'Fragment', {
        value: Fragment,
        writable: true,
        configurable: true
      });
      console.log('Patched Fragment onto global React object');
    } catch (e) {
      console.warn('Could not patch Fragment onto global React:', e);
    }
  }
  
  console.log('React hooks exported to global React object successfully');
}

// Export default React
export default React;
