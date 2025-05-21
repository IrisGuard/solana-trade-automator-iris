
/**
 * This file creates a set of safe imports from React that work with React 18.3.1
 * It provides a centralized place to import React features from
 */

// Import React directly to get accurate types and implementations
import * as React from 'react';

// Create hooks with fallbacks
const hooksWithFallbacks = {
  useState: React.useState || function useState(initialState) { 
    return [typeof initialState === 'function' ? initialState() : initialState, () => {}]; 
  },
  useEffect: React.useEffect || function useEffect() {},
  useContext: React.useContext || function useContext() { return undefined; },
  useReducer: React.useReducer || function useReducer(reducer, state) { return [state, () => {}]; },
  useRef: React.useRef || function useRef(value) { return {current: value}; },
  useCallback: React.useCallback || function useCallback(fn) { return fn; },
  useMemo: React.useMemo || function useMemo(fn) { return fn(); },
  useLayoutEffect: React.useLayoutEffect || function useLayoutEffect() {},
  useImperativeHandle: React.useImperativeHandle || function useImperativeHandle() {},
  useDebugValue: React.useDebugValue || function useDebugValue() {},
  useId: React.useId || function useId() { return Math.random().toString(36).slice(2); }
};

// Core React APIs with fallbacks
const coreApis = {
  Fragment: React.Fragment || Symbol('React.Fragment'),
  createElement: React.createElement,
  createContext: React.createContext,
  forwardRef: React.forwardRef,
  memo: React.memo
};

// JSX runtime functions
const jsxRuntime = {
  jsx: React.createElement,
  jsxs: React.createElement,
  jsxDEV: React.createElement
};

// Export hooks
export const {
  useState,
  useEffect,
  useRef,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useLayoutEffect,
  useImperativeHandle,
  useDebugValue,
  useId
} = hooksWithFallbacks;

// Export core React functions
export const {
  Fragment,
  createElement,
  createContext,
  forwardRef,
  memo
} = coreApis;

// Export JSX runtime
export const {
  jsx,
  jsxs,
  jsxDEV
} = jsxRuntime;

/**
 * Ensures React exports are patched in the global scope
 * This helps React Router and other libraries find the hooks they need
 */
export function patchGlobalReact() {
  if (typeof window !== 'undefined') {
    // Create a starter React object with required props if needed
    if (!window.React) {
      window.React = Object.create(React);
    }
    
    // Combine all exports
    const allExports = {
      ...hooksWithFallbacks,
      ...coreApis,
      ...jsxRuntime
    };
    
    // Apply all exports to window.React
    Object.entries(allExports).forEach(([name, fn]) => {
      if (!window.React[name]) {
        try {
          Object.defineProperty(window.React, name, {
            value: fn,
            configurable: true,
            writable: true
          });
        } catch (e) {
          console.warn(`Failed to patch ${name} on global React: ${e.message}`);
        }
      }
    });
    
    console.log('React exports patched globally');
    return true;
  }
  
  return false;
}

// Auto-patch when module is loaded
patchGlobalReact();
