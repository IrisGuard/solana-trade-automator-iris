
/**
 * Enhanced React exports fix to ensure proper hook availability for react-router-dom
 */
import * as ReactModule from 'react';

// Set up React on window to ensure global availability
if (typeof window !== 'undefined') {
  window.React = ReactModule;
}

// Re-export the React object with all its properties
export default ReactModule;

// Get all the functions we need from ReactModule
const {
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
} = ReactModule;

// Explicitly re-export these functions
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
  useTransition,
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
};

// Ensure these hooks are definitely exported
export const useStateExport = ReactModule.useState;
export const useEffectExport = ReactModule.useEffect;
export const useContextExport = ReactModule.useContext;
export const useRefExport = ReactModule.useRef;
export const createContextExport = ReactModule.createContext;
export const forwardRefExport = ReactModule.forwardRef;
export const createElementExport = ReactModule.createElement;

// Fix for React Router DOM - ensure it can access our React exports
if (typeof window !== 'undefined') {
  // Make all React hooks available globally for React Router DOM
  Object.assign(window.React, {
    useState: ReactModule.useState,
    useEffect: ReactModule.useEffect,
    useContext: ReactModule.useContext,
    useRef: ReactModule.useRef,
    createContext: ReactModule.createContext,
    createElement: ReactModule.createElement
  });
  
  // Create a reference to our patched React for module resolution
  try {
    (window as any).patchedReact = ReactModule;
    console.log('Patched React object created for React Router DOM');
  } catch (e) {
    console.error('Failed to create patched React reference:', e);
  }
}

// Log successful load of React exports fix
console.log('React exports fix loaded. Hooks available:', {
  useState: !!ReactModule.useState,
  useEffect: !!ReactModule.useEffect,
  useContext: !!ReactModule.useContext,
  useRef: !!ReactModule.useRef,
  createContext: !!ReactModule.createContext,
  createElement: !!ReactModule.createElement
});
