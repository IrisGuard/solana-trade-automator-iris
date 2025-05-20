
/**
 * This file ensures React hooks are properly bridged between ESM and CommonJS modules
 * to fix compatibility issues with React Router DOM and React 18.3.1
 */
import * as React from 'react';

// Store all hooks in an object for programmatic access
const hooks = {
  useState: React.useState,
  useEffect: React.useEffect,
  useContext: React.useContext,
  useReducer: React.useReducer,
  useRef: React.useRef,
  useMemo: React.useMemo,
  useCallback: React.useCallback,
  useLayoutEffect: React.useLayoutEffect,
  useDebugValue: React.useDebugValue,
  useImperativeHandle: React.useImperativeHandle,
  useId: React.useId,
  useDeferredValue: React.useDeferredValue,
  useInsertionEffect: React.useInsertionEffect,
  useSyncExternalStore: React.useSyncExternalStore,
  useTransition: React.useTransition
};

// Re-export all hooks for direct usage
export const {
  useState,
  useEffect,
  useContext,
  useReducer,
  useRef,
  useMemo,
  useCallback,
  useLayoutEffect,
  useDebugValue,
  useImperativeHandle,
  useId,
  useDeferredValue,
  useInsertionEffect,
  useSyncExternalStore,
  useTransition
} = hooks;

// For browser environment, ensure global React object has hooks
if (typeof window !== 'undefined') {
  // Create React on window if it doesn't exist
  if (!window.React) {
    Object.defineProperty(window, 'React', { 
      value: {}, 
      writable: true, 
      configurable: true 
    });
  }
  
  // Apply hooks to global React and log diagnostic info
  Object.entries(hooks).forEach(([hookName, hookFn]) => {
    if (!window.React[hookName]) {
      try {
        Object.defineProperty(window.React, hookName, {
          value: hookFn,
          writable: true,
          configurable: true
        });
        console.log(`[ReactBridge] Bridged ${hookName} to global React`);
      } catch (e) {
        console.warn(`[ReactBridge] Failed to bridge ${hookName}:`, e);
      }
    }
  });
  
  // JSX runtime functions
  const jsxFunctions = {
    createElement: React.createElement,
    Fragment: React.Fragment,
    jsx: React.createElement,
    jsxs: React.createElement
  };
  
  // Add createElement and other JSX functions if not present
  Object.entries(jsxFunctions).forEach(([fnName, fn]) => {
    if (!window.React[fnName]) {
      try {
        Object.defineProperty(window.React, fnName, {
          value: fn,
          writable: true,
          configurable: true
        });
        console.log(`[ReactBridge] Added ${fnName} to global React`);
      } catch (e) {
        console.warn(`[ReactBridge] Failed to add ${fnName}:`, e);
      }
    }
  });
  
  console.log('[ReactBridge] React hooks bridge initialization completed');
}

// Export React itself with all hooks attached
const ReactWithHooks = {...React, ...hooks};
export default ReactWithHooks;
