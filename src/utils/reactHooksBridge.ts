
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
  window.React = window.React || {} as any;
  
  // Apply hooks to global React and log diagnostic info
  Object.entries(hooks).forEach(([hookName, hookFn]) => {
    if (!window.React[hookName]) {
      window.React[hookName] = hookFn;
      console.log(`[ReactBridge] Bridged ${hookName} to global React`);
    }
  });
  
  // Add createElement and Fragment if not present
  if (!window.React.createElement) {
    window.React.createElement = React.createElement;
    console.log('[ReactBridge] Added createElement to global React');
  }
  
  if (!window.React.Fragment) {
    window.React.Fragment = React.Fragment;
    console.log('[ReactBridge] Added Fragment to global React');
  }
  
  // Add JSX runtime functions
  if (!window.React.jsx) {
    window.React.jsx = React.createElement;
    console.log('[ReactBridge] Added jsx to global React');
  }
  
  if (!window.React.jsxs) {
    window.React.jsxs = React.createElement;
    console.log('[ReactBridge] Added jsxs to global React');
  }
  
  console.log('[ReactBridge] React hooks bridge initialization completed');
}

// Export React itself with all hooks attached
const ReactWithHooks = {...React, ...hooks};
export default ReactWithHooks;
