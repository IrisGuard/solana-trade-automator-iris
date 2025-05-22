
/**
 * React 18.3.1 Compatibility Layer
 * 
 * This file creates unified access to React APIs that works with React 18.3.1's
 * changed export structure. Import this file to get access to React hooks and other APIs.
 */
import * as React from 'react';

// Core React functions with fallbacks
const reactFunctions = {
  // React hooks
  useState: function useState(initialValue) { 
    return (React?.useState || function(initial) { return [initial, () => {}]; })(initialValue); 
  },
  useEffect: function useEffect(effect, deps) { 
    return (React?.useEffect || function() {})(effect, deps); 
  },
  useContext: function useContext(context) { 
    return (React?.useContext || function() { return undefined; })(context); 
  },
  useReducer: function useReducer(reducer, initialState) { 
    return (React?.useReducer || function(r, i) { return [i, () => {}]; })(reducer, initialState); 
  },
  useCallback: function useCallback(callback, deps) { 
    return (React?.useCallback || function(fn) { return fn; })(callback, deps); 
  },
  useMemo: function useMemo(factory, deps) { 
    return (React?.useMemo || function(fn) { return fn(); })(factory, deps); 
  },
  useRef: function useRef(initialValue) { 
    return (React?.useRef || function(val) { return {current: val}; })(initialValue); 
  },
  useLayoutEffect: function useLayoutEffect(effect, deps) { 
    return (React?.useLayoutEffect || React?.useEffect || function() {})(effect, deps); 
  },
  useImperativeHandle: function useImperativeHandle(ref, init, deps) { 
    if (React?.useImperativeHandle) {
      return React.useImperativeHandle(ref, init, deps);
    }
  },
  useDebugValue: function useDebugValue(value, formatFn) { 
    if (React?.useDebugValue) {
      if (formatFn) {
        return React.useDebugValue(value, formatFn);
      } else {
        return React.useDebugValue(value);
      }
    }
  },
  useId: function useId() { 
    return (React?.useId || function() { return Math.random().toString(36).slice(2); })(); 
  },
  
  // Core React APIs
  createElement: React?.createElement || function() { return null; },
  createContext: React?.createContext || function() { return { Provider: () => null, Consumer: () => null }; },
  Fragment: React?.Fragment || Symbol('Fragment'),
  
  // JSX runtime
  jsx: React?.createElement || function() { return null; },
  jsxs: React?.createElement || function() { return null; },
  jsxDEV: React?.createElement || function() { return null; },
  
  // Other React APIs
  Children: React?.Children || {
    map: (children, fn) => Array.isArray(children) ? children.map(fn) : children ? [fn(children)] : [],
    forEach: (children, fn) => Array.isArray(children) ? children.forEach(fn) : children && fn(children),
    count: (children) => Array.isArray(children) ? children.length : children ? 1 : 0,
    only: (children) => Array.isArray(children) ? children[0] : children,
    toArray: (children) => Array.isArray(children) ? children : children ? [children] : []
  },
  memo: React?.memo || function(component) { return component; },
  forwardRef: React?.forwardRef || function(component) { return component; },
  Suspense: React?.Suspense || function({ children }) { return children; },
};

// Export all React functions
export const {
  // React hooks
  useState, useEffect, useContext, useReducer, useCallback, 
  useMemo, useRef, useLayoutEffect, useImperativeHandle,
  useDebugValue, useId,
  
  // Core React APIs
  createElement, createContext, Fragment, 
  
  // JSX runtime
  jsx, jsxs, jsxDEV,
  
  // Other React APIs
  Children, memo, forwardRef, Suspense
} = reactFunctions;

// Apply React functions to window.React for third-party libraries
if (typeof window !== 'undefined') {
  if (!window.React) {
    window.React = {} as typeof React;
  }
  
  Object.entries(reactFunctions).forEach(([key, value]) => {
    if (!window.React[key]) {
      try {
        window.React[key] = value;
      } catch (e) {
        console.warn(`Failed to add ${key} to window.React: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
  });
  
  console.log('React compatibility layer initialized');
}

// Export the React namespace for backward compatibility
export default React;
