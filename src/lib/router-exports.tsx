
/**
 * This file provides a consistent interface for React Router DOM exports
 * to ensure compatibility across the application with React 18.3.1
 */
import * as React from 'react';

// Import all React hooks first to ensure they're available
// Use our hook exporter to ensure they're properly exported
import {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
  useMemo,
  useReducer,
  useLayoutEffect
} from '../utils/reactHooksExporter';

// Patch React global object if needed
if (typeof window !== 'undefined') {
  window.React = window.React || {} as any;
  
  // Make sure React.createElement exists
  if (!window.React.createElement) {
    window.React.createElement = React.createElement;
  }
  
  // Add essential hooks to global React
  const hooks = {
    useState,
    useEffect,
    useContext,
    useRef,
    useCallback,
    useMemo,
    useReducer,
    useLayoutEffect
  };
  
  Object.entries(hooks).forEach(([name, fn]) => {
    if (!window.React[name]) {
      window.React[name] = fn;
    }
  });
  
  console.log('[RouterExports] React hooks patched for router compatibility');
}

// Import all react-router-dom exports that we need
import * as ReactRouterDOM from 'react-router-dom';

// Check if the imports are working
if (!ReactRouterDOM.BrowserRouter) {
  console.error('React Router DOM is not loading properly. This could cause navigation issues.');
}

// Re-export everything from react-router-dom
export const {
  // Core components
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  
  // Navigation components
  Link,
  NavLink,
  Navigate,
  
  // Hooks
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
  useMatch
} = ReactRouterDOM;

// Fallbacks in case the exports aren't working
export const FallbackLink: typeof ReactRouterDOM.Link = ({ to, children, ...props }) => (
  // @ts-ignore - Fallback to regular anchor if Link isn't available
  React.createElement('a', { href: to, ...props }, children)
);

export const FallbackNavLink: typeof ReactRouterDOM.NavLink = ({ to, children, ...props }) => (
  // @ts-ignore - Fallback to regular anchor if NavLink isn't available
  React.createElement('a', { href: to, ...props }, children)
);

// Debug function to help troubleshoot
export function debugRouterExports() {
  console.log('Router exports available:', {
    BrowserRouter: !!ReactRouterDOM.BrowserRouter,
    Routes: !!ReactRouterDOM.Routes,
    Route: !!ReactRouterDOM.Route,
    Link: !!ReactRouterDOM.Link,
    useNavigate: !!ReactRouterDOM.useNavigate,
    useLocation: !!ReactRouterDOM.useLocation,
    useState: typeof useState === 'function',
    useEffect: typeof useEffect === 'function',
    createElement: !!React.createElement
  });
}

// Export patched React
export { React };
