
/**
 * This file provides bridge functions for React Router hooks
 * to ensure they can access React hooks properly
 */
import * as React from 'react';
import * as ReactRouter from 'react-router-dom';

// Ensure essential React exports are available
const { useState, useEffect, useRef, useContext } = React;

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
    }
  });
}
