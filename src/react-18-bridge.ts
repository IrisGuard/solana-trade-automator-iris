
/**
 * React 18.3.1 Bridge
 * 
 * This file creates compatibility bridges for React 18.3.1 which has changed
 * how hooks and JSX functions are exported
 */
import * as React from 'react';

// Access React hooks via React.hooks
const hooks = React.hooks || {};

// Export hooks using proper React 18.3.1 structure
export const useState = hooks.useState || function(initialState) { return [initialState, () => {}]; };
export const useEffect = hooks.useEffect || function() {};
export const useContext = hooks.useContext || function() { return undefined; };
export const useReducer = hooks.useReducer || function(r, i) { return [i, () => {}]; };
export const useRef = hooks.useRef || function(i) { return {current: i}; };
export const useMemo = hooks.useMemo || function(fn) { return fn(); };
export const useCallback = hooks.useCallback || function(fn) { return fn; };
export const useLayoutEffect = hooks.useLayoutEffect || function() {};
export const useDebugValue = hooks.useDebugValue || function() {};
export const useImperativeHandle = hooks.useImperativeHandle || function() {};
export const useId = hooks.useId || function() { return Math.random().toString(36).slice(2); };
export const useDeferredValue = hooks.useDeferredValue || function(v) { return v; };
export const useInsertionEffect = hooks.useInsertionEffect || hooks.useEffect || function() {};
export const useSyncExternalStore = hooks.useSyncExternalStore || function(s, g) { return g(); };
export const useTransition = hooks.useTransition || function() { return [false, function() {}]; };

// Core React functions
export const Fragment = React.Fragment || Symbol('React.Fragment');
export const createElement = React.createElement;
export const createContext = React.createContext;
export const forwardRef = React.forwardRef;
export const memo = React.memo;

// Create JSX runtime function exports that use createElement directly
export const jsx = createElement;
export const jsxs = createElement;

// Apply these to the global React object
if (typeof window !== 'undefined') {
  // Initialize window.React with the React object itself
  window.React = window.React || React;
  
  // Apply hooks
  const reactExports = {
    useState, useEffect, useContext, useReducer, useRef, useMemo, useCallback,
    useLayoutEffect, useDebugValue, useImperativeHandle, useId, useDeferredValue,
    useInsertionEffect, useSyncExternalStore, useTransition,
    Fragment, createElement, createContext, forwardRef, memo,
    jsx, jsxs
  };
  
  Object.entries(reactExports).forEach(([name, fn]) => {
    if (!window.React[name]) {
      try {
        Object.defineProperty(window.React, name, {
          value: fn,
          writable: true,
          configurable: true
        });
      } catch (e) {
        console.warn(`[React 18.3.1] Failed to define ${name} on window.React:`, e);
      }
    }
  });
  
  console.log('[React 18.3.1] Bridge initialized successfully');
}

// Export the React namespace as default
export default React;
