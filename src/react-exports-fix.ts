
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

// Explicitly re-export the hooks that react-router-dom is looking for
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
  forwardRef,
  Children,
  cloneElement,
  isValidElement,
  createElement,
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

// Log successful load of React exports fix
console.log('React exports fix loaded. Hooks available:', {
  useState: !!React.useState,
  useEffect: !!React.useEffect,
  useContext: !!React.useContext,
  useRef: !!React.useRef,
  createContext: !!React.createContext
});
