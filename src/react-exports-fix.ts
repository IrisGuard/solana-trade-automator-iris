
/**
 * Enhanced React exports fix to ensure proper hook availability for react-router-dom
 */
import * as React from 'react';

// Set up React on window to ensure global availability
if (typeof window !== 'undefined') {
  window.React = React;
}

// Re-export the React object with all its properties
export default React;

// Explicitly re-export the hooks and functions that react-router-dom is looking for
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
  useTransition,
  // Add other React exports
  createContext,
  createElement,
  forwardRef,
  Children,
  cloneElement,
  isValidElement,
  Fragment,
  Component,
  PureComponent,
  memo,
  createRef,
  Suspense,
  lazy,
  startTransition
} = React;

// Ensure these hooks are definitely exported
export const useStateExport = React.useState;
export const useEffectExport = React.useEffect;
export const useContextExport = React.useContext;
export const useRefExport = React.useRef;
export const createContextExport = React.createContext;
export const forwardRefExport = React.forwardRef;
export const createElementExport = React.createElement;

// Fix for React Router DOM - ensure it can access our React exports
if (typeof window !== 'undefined') {
  // Make all React hooks available globally for React Router DOM
  Object.assign(window.React, {
    useState: React.useState,
    useEffect: React.useEffect,
    useContext: React.useContext,
    useRef: React.useRef,
    createContext: React.createContext,
    createElement: React.createElement
  });
  
  // Create a reference to our patched React for module resolution
  try {
    (window as any).patchedReact = React;
    console.log('Patched React object created for React Router DOM');
  } catch (e) {
    console.error('Failed to create patched React reference:', e);
  }
}

// Log successful load of React exports fix
console.log('React exports fix loaded. Hooks available:', {
  useState: !!React.useState,
  useEffect: !!React.useEffect,
  useContext: !!React.useContext,
  useRef: !!React.useRef,
  createContext: !!React.createContext,
  createElement: !!React.createElement
});
