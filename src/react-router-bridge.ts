
/**
 * React Router Compatibility Bridge for React 18.3.1
 * 
 * This file ensures React Router can access the React hooks it needs
 */

// Import our React runtime first
import * as RuntimeBridge from './react-runtime';

// Import React Router
import * as ReactRouter from 'react-router-dom';

// Re-export React hooks needed by React Router from our runtime bridge
export const {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
  useMemo,
  useReducer,
  useLayoutEffect,
  useId
} = RuntimeBridge;

// Re-export React Router hooks
export const {
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
  useMatch,
  // Components
  BrowserRouter,
  Routes,
  Route,
  Link,
  NavLink,
  Navigate,
  Outlet
} = ReactRouter;

// Patch the window.React object specifically for router compatibility
if (typeof window !== 'undefined') {
  // Make sure all the hooks React Router needs are available
  const requiredHooks = {
    useContext: RuntimeBridge.useContext,
    useState: RuntimeBridge.useState, 
    useEffect: RuntimeBridge.useEffect,
    useRef: RuntimeBridge.useRef,
    useCallback: RuntimeBridge.useCallback,
    useMemo: RuntimeBridge.useMemo,
    useReducer: RuntimeBridge.useReducer,
    useLayoutEffect: RuntimeBridge.useLayoutEffect,
    useId: RuntimeBridge.useId,
    createElement: RuntimeBridge.createElement,
    createContext: RuntimeBridge.createContext,
    Fragment: RuntimeBridge.Fragment,
    // Add missing properties that were causing TypeScript errors
    Profiler: RuntimeBridge.Profiler,
    jsxsDEV: RuntimeBridge.jsxsDEV
  };
  
  // Create window.React if it doesn't exist
  if (!window.React) {
    window.React = Object.create(RuntimeBridge);
  }
  
  // Add all required hooks to window.React
  Object.entries(requiredHooks).forEach(([hookName, hook]) => {
    if (!window.React[hookName] && hook) {
      try {
        window.React[hookName] = hook;
        console.log(`[RouterBridge] Added ${hookName} to global React`);
      } catch (e) {
        console.warn(`[RouterBridge] Failed to add ${hookName}: ${e.message}`);
      }
    }
  });
  
  console.log('[RouterBridge] React Router compatibility bridge initialized for React 18.3.1');
}

// Debug function to verify hooks are available
export function debugRouterHooks() {
  return {
    reactHooks: {
      useState: typeof RuntimeBridge.useState === 'function',
      useEffect: typeof RuntimeBridge.useEffect === 'function',
      useContext: typeof RuntimeBridge.useContext === 'function'
    },
    routerHooks: {
      useNavigate: typeof ReactRouter.useNavigate === 'function',
      useLocation: typeof ReactRouter.useLocation === 'function',
      useParams: typeof ReactRouter.useParams === 'function'
    },
    windowReact: typeof window !== 'undefined' ? {
      useState: typeof window.React?.useState === 'function',
      useEffect: typeof window.React?.useEffect === 'function',
      useContext: typeof window.React?.useContext === 'function'
    } : 'Not in browser'
  };
}

// Export React for compatibility
export { RuntimeBridge as React };

// Export the router
export { ReactRouter };
