
/**
 * This file provides bridge functions for React Router hooks
 * to ensure they can access React hooks properly with React 18.3.1
 */
import * as React from 'react';
import * as ReactRouter from 'react-router-dom';
import { 
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
} from '../react-18-bridge';

// Re-export all hooks for direct usage
export {
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
};

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
  const hooksToAdd = {
    useState, 
    useEffect, 
    useRef, 
    useContext,
    useCallback,
    useMemo,
    useReducer,
    useLayoutEffect,
    useImperativeHandle,
    useDebugValue,
    useId,
    useDeferredValue,
    useInsertionEffect,
    useSyncExternalStore,
    useTransition
  };
  
  Object.entries(hooksToAdd).forEach(([hookName, hookFn]) => {
    if (!window.React[hookName]) {
      window.React[hookName] = hookFn;
      console.log(`[RouterBridge] Added ${hookName} to global React`);
    }
  });
}
