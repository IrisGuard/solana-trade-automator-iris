
/**
 * React 18.3.1 Bridge
 * 
 * This file creates compatibility bridges for React 18.3.1 which has changed
 * how hooks and JSX functions are exported
 */
import * as React from 'react';

// Use direct access to React functions
export const useState = React.useState;
export const useEffect = React.useEffect;
export const useContext = React.useContext;
export const useReducer = React.useReducer;
export const useRef = React.useRef;
export const useMemo = React.useMemo;
export const useCallback = React.useCallback;
export const useLayoutEffect = React.useLayoutEffect;
export const useDebugValue = React.useDebugValue;
export const useImperativeHandle = React.useImperativeHandle;
export const useId = React.useId;
export const useDeferredValue = React.useDeferredValue;
export const useInsertionEffect = React.useInsertionEffect;
export const useSyncExternalStore = React.useSyncExternalStore;
export const useTransition = React.useTransition;

// Core React functions
export const Fragment = React.Fragment;
export const createElement = React.createElement;
export const createContext = React.createContext;
export const forwardRef = React.forwardRef;
export const memo = React.memo;

// Create JSX runtime function exports that use createElement directly
export const jsx = React.createElement;
export const jsxs = React.createElement;

// Apply these to the global React object
if (typeof window !== 'undefined') {
  // Initialize window.React with the React object itself
  window.React = window.React || React;
  
  // Apply hooks
  const hooks = {
    useState, useEffect, useContext, useReducer, useRef, useMemo, useCallback,
    useLayoutEffect, useDebugValue, useImperativeHandle, useId, useDeferredValue,
    useInsertionEffect, useSyncExternalStore, useTransition,
    Fragment, createElement, createContext, forwardRef, memo,
    jsx, jsxs
  };
  
  Object.entries(hooks).forEach(([name, fn]) => {
    if (fn && !window.React[name]) {
      window.React[name] = fn;
    }
  });
  
  console.log('[React 18.3.1] Bridge initialized successfully');
}

// Export the React namespace as default
export default React;
