
/**
 * This file ensures all React hooks are properly exported before React Router loads
 * It fixes the "useState is not exported by React" errors with React 18.3.1
 */

// Use namespace import instead of default import for React 18.3.1+ compatibility
import * as React from 'react';
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
  useState: bridgeUseState,
  useEffect: bridgeUseEffect,
  useContext: bridgeUseContext,
  useRef: bridgeUseRef,
  useReducer: bridgeUseReducer,
  useCallback: bridgeUseCallback,
  useMemo: bridgeUseMemo,
  useLayoutEffect: bridgeUseLayoutEffect,
  useImperativeHandle: bridgeUseImperativeHandle,
  useDebugValue: bridgeUseDebugValue,
  useId: bridgeUseId,
  useDeferredValue: bridgeUseDeferredValue,
  useInsertionEffect: bridgeUseInsertionEffect,
  useSyncExternalStore: bridgeUseSyncExternalStore,
  useTransition: bridgeUseTransition
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
  
  // Export JSX runtime functions from bridge to global React
  const jsxFunctions = {
    jsx: bridgeUseState,
    jsxs: bridgeUseEffect,
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
