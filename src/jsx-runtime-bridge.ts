
/**
 * This file provides explicit exports of React JSX runtime functions
 * to fix build issues with JSX transformations in React 18.3.1
 */
import * as React from 'react';

// Access React exports from React.jsx namespace for React 18.3.1
const reactJsx = React.jsx || {};

// Export JSX runtime functions with fallbacks
export const jsx = reactJsx.jsx || React['jsx'] || function jsx(type, props) {
  return React.createElement(type, props);
};

export const jsxs = reactJsx.jsxs || React['jsxs'] || function jsxs(type, props) {
  return React.createElement(type, props);
};

export const Fragment = React.Fragment;

// Also export these functions that might be used by the JSX transformer
export const jsxDEV = reactJsx.jsxDEV || React['jsxDEV'] || function jsxDEV(type, props) {
  return React.createElement(type, props);
};

export const jsxsDEV = reactJsx.jsxsDEV || React['jsxsDEV'] || function jsxsDEV(type, props) {
  return React.createElement(type, props);
};

// Export createElement directly with fallback
export const createElement = React['createElement'] || function createElement(type, props, ...children) {
  // Basic fallback implementation
  console.warn('Using createElement fallback implementation');
  return { type, props: { ...props, children } };
};

// Export all React hooks explicitly with fallbacks
const reactHooks = React;

// Create a hooks object with fallbacks
export const useState = reactHooks.useState || function useState(initialState) {
  console.warn('Using useState fallback');
  return [initialState, () => {}];
};

export const useEffect = reactHooks.useEffect || function useEffect() {
  console.warn('Using useEffect fallback');
};

export const useContext = reactHooks.useContext || function useContext() {
  console.warn('Using useContext fallback');
  return undefined;
};

export const useReducer = reactHooks.useReducer || function useReducer(reducer, initialState) {
  console.warn('Using useReducer fallback');
  return [initialState, () => {}];
};

export const useRef = reactHooks.useRef || function useRef(initialValue) {
  console.warn('Using useRef fallback');
  return { current: initialValue };
};

export const useMemo = reactHooks.useMemo || function useMemo(factory) {
  console.warn('Using useMemo fallback');
  return factory();
};

export const useCallback = reactHooks.useCallback || function useCallback(callback) {
  console.warn('Using useCallback fallback');
  return callback;
};

export const useLayoutEffect = reactHooks.useLayoutEffect || reactHooks.useEffect || function useLayoutEffect() {
  console.warn('Using useLayoutEffect fallback');
};

export const useDebugValue = reactHooks.useDebugValue || function useDebugValue() {
  console.warn('Using useDebugValue fallback');
};

export const useImperativeHandle = reactHooks.useImperativeHandle || function useImperativeHandle() {
  console.warn('Using useImperativeHandle fallback');
};

export const useId = reactHooks.useId || function useId() {
  console.warn('Using useId fallback');
  return Math.random().toString(36).substring(2);
};

export const useDeferredValue = reactHooks.useDeferredValue || function useDeferredValue(value) {
  console.warn('Using useDeferredValue fallback');
  return value;
};

export const useInsertionEffect = reactHooks.useInsertionEffect || reactHooks.useEffect || function useInsertionEffect() {
  console.warn('Using useInsertionEffect fallback');
};

export const useSyncExternalStore = reactHooks.useSyncExternalStore || function useSyncExternalStore(subscribe, getSnapshot) {
  console.warn('Using useSyncExternalStore fallback');
  return getSnapshot();
};

export const useTransition = reactHooks.useTransition || function useTransition() {
  console.warn('Using useTransition fallback');
  return [false, () => {}];
};

// Apply to global React for compatibility
if (typeof window !== 'undefined') {
  window.React = window.React || {} as any;
  
  // Add JSX runtime functions to global React
  Object.assign(window.React, {
    jsx,
    jsxs,
    jsxDEV,
    jsxsDEV,
    Fragment,
    createElement,
    // Also add hooks
    useState,
    useEffect,
    useContext,
    useRef,
    useReducer,
    useCallback,
    useMemo,
    useLayoutEffect,
    useImperativeHandle,
    useDebugValue,
    useId,
    useDeferredValue,
    useInsertionEffect,
    useSyncExternalStore,
    useTransition
  });

  // Mark that we've patched the JSX runtime
  window.__JSX_RUNTIME_PATCHED__ = true;
  console.log('JSX Runtime bridge initialized');
}

// Export default React for compatibility
export default React;
