
/**
 * This file provides a consistent interface for React Router DOM exports
 * to ensure compatibility across the application
 */
import React from '../react-exports-fix'; // Import from our fixed exports

// Import all React hooks first to ensure they're available
import {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
  useMemo
} from '../utils/reactHooksExporter';

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
    createElement: !!React.createElement
  });
}
