
/**
 * This file provides bridge functions for React Router hooks
 * to ensure they can access React hooks properly with React 18.3.1
 */
import * as React from 'react';
import * as ReactRouter from 'react-router-dom';

// First ensure React hooks are available through the namespace
const hooks = {
  useState: React.useState,
  useEffect: React.useEffect,
  useRef: React.useRef, 
  useContext: React.useContext,
  useCallback: React.useCallback,
  useMemo: React.useMemo,
  useReducer: React.useReducer,
  useLayoutEffect: React.useLayoutEffect,
  useImperativeHandle: React.useImperativeHandle,
  useDebugValue: React.useDebugValue,
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

// Re-export React Router hooks with ensured React hooks access
export const useNavigate = ReactRouter.useNavigate;
export const useLocation = ReactRouter.useLocation;
export const useParams = ReactRouter.useParams;
export const useSearchParams = ReactRouter.useSearchParams;
export const useRouteMatch = ReactRouter.useMatch;

// Export other core router components
export const {
  BrowserRouter,
  Routes,
  Route,
  Link,
  NavLink,
  Navigate,
  Outlet
} = ReactRouter;

// Create debug function
export function checkRouterHooksAvailable() {
  console.log({
    hooksExported: {
      useNavigate: typeof useNavigate === 'function',
      useLocation: typeof useLocation === 'function',
      useParams: typeof useParams === 'function',
      useSearchParams: typeof useSearchParams === 'function'
    },
    reactHooksExported: {
      useState: typeof React.useState === 'function',
      useEffect: typeof React.useEffect === 'function',
      useRef: typeof React.useRef === 'function'
    },
    originalReactExports: {
      useState: typeof useState === 'function',
      useEffect: typeof useEffect === 'function', 
      useRef: typeof useRef === 'function'
    }
  });
}

// Patch window.React if available to ensure React Router can find hooks
if (typeof window !== 'undefined' && window.React) {
  // Add hooks to the global React object
  Object.entries(hooks).forEach(([hookName, hookFn]) => {
    if (!window.React[hookName]) {
      window.React[hookName] = hookFn;
      console.log(`[RouterBridge] Added ${hookName} to global React`);
    }
  });
}
