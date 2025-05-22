
/**
 * React Router Compatibility Bridge for React 18.3.1
 * 
 * This file ensures React Router can access the React hooks it needs
 */

// Import our React hooks directly from React
import * as React from 'react';

// Extract all needed functions from React
const { 
  useState, 
  useEffect, 
  useRef, 
  useContext, 
  useCallback, 
  useMemo, 
  useReducer,
  useLayoutEffect,
  useId,
  createElement,
  Fragment
} = React;

// Import React Router
import * as ReactRouter from 'react-router-dom';

// Re-export React hooks needed by React Router
export {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
  useMemo,
  useReducer,
  useLayoutEffect,
  useId
};

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
    useContext,
    useState, 
    useEffect,
    useRef,
    useCallback,
    useMemo,
    useReducer,
    useLayoutEffect,
    useId,
    createElement,
    createContext: React.createContext,
    Fragment,
    // For completeness
    jsx: createElement,
    jsxs: createElement,
    jsxDEV: createElement
  };
  
  // Create window.React if it doesn't exist
  if (!window.React) {
    window.React = Object.create({});
    
    // Copy all properties from React to window.React
    for (const key in React) {
      if (Object.prototype.hasOwnProperty.call(React, key)) {
        window.React[key] = React[key];
      }
    }
  }
  
  // Add all required hooks to window.React
  Object.entries(requiredHooks).forEach(([hookName, hook]) => {
    if (!window.React[hookName] && hook) {
      try {
        window.React[hookName] = hook;
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
      useState: typeof React.useState === 'function',
      useEffect: typeof React.useEffect === 'function',
      useContext: typeof React.useContext === 'function'
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
export { React };

// Export the router
export { ReactRouter };
