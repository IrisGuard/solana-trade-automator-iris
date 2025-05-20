
/**
 * This file ensures all React hooks are properly exported before React Router loads
 * It fixes the "useState is not exported by React" errors with React 18.3.1
 */

// Use namespace import instead of default import for React 18.3.1+ compatibility
import * as React from 'react';

// Create a mapping of all hooks to ensure they exist
const reactHooks = {
  useState: React.useState,
  useEffect: React.useEffect,
  useContext: React.useContext,
  useRef: React.useRef,
  useReducer: React.useReducer,
  useCallback: React.useCallback,
  useMemo: React.useMemo,
  useLayoutEffect: React.useLayoutEffect,
  useImperativeHandle: React.useImperativeHandle,
  useDebugValue: React.useDebugValue,
  useId: React.useId,
  useDeferredValue: React.useDeferredValue,
  useInsertionEffect: React.useInsertionEffect,
  useSyncExternalStore: React.useSyncExternalStore,
  useTransition: React.useTransition
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
  window.React = window.React || {} as any;
  
  // Check if each hook exists on global React and add it if not
  Object.entries(reactHooks).forEach(([hookName, hookFn]) => {
    if (!window.React[hookName]) {
      console.log(`Patching ${hookName} onto global React object`);
      window.React[hookName] = hookFn;
    }
  });
  
  // Export JSX runtime functions to global React
  if (!window.React.jsx) {
    window.React.jsx = React.createElement;
  }
  if (!window.React.jsxs) {
    window.React.jsxs = React.createElement;
  }
  if (!window.React.Fragment) {
    window.React.Fragment = React.Fragment;
  }
  
  console.log('React hooks exported to global React object successfully');
}

// Export default React
export default React;
