
/**
 * Central React Runtime Bridge for React 18.3.1 compatibility
 * This file should be imported before any other React imports
 */

// Import full React module
import React from 'react';

// Create fallbacks for React hooks since they're not exported directly in React 18.3.1
const fallbackHooks = {
  // State management hooks
  useState: function useState(initialState) {
    console.warn('Using useState fallback');
    return [typeof initialState === 'function' ? initialState() : initialState, () => {}]; 
  },
  useEffect: function useEffect() {
    console.warn('Using useEffect fallback');
  },
  useRef: function useRef(initialValue) { 
    console.warn('Using useRef fallback');
    return { current: initialValue }; 
  },
  useContext: function useContext() {
    console.warn('Using useContext fallback');
    return undefined;
  },
  useReducer: function useReducer(reducer, initialState) {
    console.warn('Using useReducer fallback');
    return [initialState, () => {}];
  },
  useCallback: function useCallback(callback) {
    console.warn('Using useCallback fallback');
    return callback;
  },
  useMemo: function useMemo(factory) {
    console.warn('Using useMemo fallback');
    return factory();
  },
  useLayoutEffect: function useLayoutEffect() {
    console.warn('Using useLayoutEffect fallback');
  },
  useImperativeHandle: function useImperativeHandle() {
    console.warn('Using useImperativeHandle fallback');
  },
  useDebugValue: function useDebugValue() {
    console.warn('Using useDebugValue fallback');
  },
  useId: function useId() {
    console.warn('Using useId fallback');
    return Math.random().toString(36).slice(2);
  },
  useDeferredValue: function useDeferredValue(value) {
    console.warn('Using useDeferredValue fallback');
    return value;
  },
  useInsertionEffect: function useInsertionEffect() {
    console.warn('Using useInsertionEffect fallback');
  },
  useSyncExternalStore: function useSyncExternalStore(subscribe, getSnapshot) {
    console.warn('Using useSyncExternalStore fallback');
    return getSnapshot();
  },
  useTransition: function useTransition() {
    console.warn('Using useTransition fallback');
    return [false, () => {}];
  }
};

// Create fallbacks for core React APIs
const fallbackCore = {
  createElement: React.createElement || function createElement(type, props, ...children) {
    console.warn('Using createElement fallback');
    return { type, props: { ...props, children: children.length === 1 ? children[0] : children } };
  },
  createContext: React.createContext || function createContext(defaultValue) {
    console.warn('Using createContext fallback');
    return {
      Provider: ({ value, children }) => children,
      Consumer: ({ children }) => children(defaultValue),
      _currentValue: defaultValue,
      _currentChangedBits: 0
    };
  },
  Fragment: React.Fragment || Symbol('React.Fragment'),
  forwardRef: React.forwardRef || function forwardRef(render) {
    console.warn('Using forwardRef fallback');
    return render;
  },
  memo: React.memo || function memo(component) {
    console.warn('Using memo fallback');
    return component;
  },
  Children: React.Children || {
    map: (children, fn) => Array.isArray(children) ? children.map(fn) : children ? [fn(children)] : [],
    forEach: (children, fn) => Array.isArray(children) ? children.forEach(fn) : children && fn(children),
    count: (children) => Array.isArray(children) ? children.length : children ? 1 : 0,
    only: (children) => {
      if (!children) throw new Error('React.Children.only expected to receive a single React element child.');
      return children;
    },
    toArray: (children) => Array.isArray(children) ? children : children ? [children] : []
  },
  createRef: React.createRef || function createRef() {
    console.warn('Using createRef fallback');
    return { current: null };
  },
  cloneElement: React.cloneElement || function cloneElement(element) {
    console.warn('Using cloneElement fallback');
    return element;
  },
  isValidElement: React.isValidElement || function isValidElement() {
    console.warn('Using isValidElement fallback');
    return false;
  },
  createFactory: React.createFactory || function createFactory(type) {
    console.warn('Using createFactory fallback');
    return React.createElement.bind(null, type);
  },
  lazy: React.lazy || function lazy(loader) {
    console.warn('Using lazy fallback');
    return { 
      $$typeof: Symbol.for('react.lazy'),
      _payload: { _status: -1, _result: loader },
      _init: function (payload) {
        if (payload._status === -1) {
          try {
            const result = loader();
            payload._status = 1;
            payload._result = result;
          } catch (error) {
            payload._status = 2;
            payload._result = error;
          }
        }
        return payload._result;
      }
    };
  },
  startTransition: React.startTransition || function startTransition(callback) {
    console.warn('Using startTransition fallback');
    callback();
  },
  act: React.act || function act(callback) {
    console.warn('Using act fallback');
    callback();
    return { then: (resolve) => { resolve(); return { catch: () => {} }; } };
  },
  StrictMode: React.StrictMode || React.Fragment || 'div',
  Suspense: React.Suspense || function Suspense({ children }) {
    console.warn('Using Suspense fallback');
    return children;
  },
  Component: React.Component || class Component {},
  PureComponent: React.PureComponent || class PureComponent {},
  version: React.version || '18.3.1',
  Profiler: React.Profiler || function Profiler({ children }) {
    console.warn('Using Profiler fallback');
    return children;
  }
};

// Create fallbacks for JSX runtime functions
const fallbackJsxRuntime = {
  jsx: React.jsx || fallbackCore.createElement,
  jsxs: React.jsxs || fallbackCore.createElement,
  jsxDEV: React.jsxDEV || fallbackCore.createElement,
  jsxsDEV: React.jsxsDEV || React.jsxDEV || fallbackCore.createElement
};

// Determine which hooks to use - try to get from React or use fallbacks
const hooks = {
  useState: React.useState || fallbackHooks.useState,
  useEffect: React.useEffect || fallbackHooks.useEffect,
  useRef: React.useRef || fallbackHooks.useRef,
  useContext: React.useContext || fallbackHooks.useContext,
  useReducer: React.useReducer || fallbackHooks.useReducer,
  useCallback: React.useCallback || fallbackHooks.useCallback,
  useMemo: React.useMemo || fallbackHooks.useMemo,
  useLayoutEffect: React.useLayoutEffect || fallbackHooks.useLayoutEffect,
  useImperativeHandle: React.useImperativeHandle || fallbackHooks.useImperativeHandle,
  useDebugValue: React.useDebugValue || fallbackHooks.useDebugValue,
  useId: React.useId || fallbackHooks.useId,
  useDeferredValue: React.useDeferredValue || fallbackHooks.useDeferredValue,
  useInsertionEffect: React.useInsertionEffect || fallbackHooks.useInsertionEffect,
  useSyncExternalStore: React.useSyncExternalStore || fallbackHooks.useSyncExternalStore,
  useTransition: React.useTransition || fallbackHooks.useTransition
};

// Determine which core APIs to use - try to get from React or use fallbacks
const core = {
  createElement: React.createElement || fallbackCore.createElement,
  createContext: React.createContext || fallbackCore.createContext,
  Fragment: React.Fragment || fallbackCore.Fragment,
  forwardRef: React.forwardRef || fallbackCore.forwardRef,
  memo: React.memo || fallbackCore.memo,
  Children: React.Children || fallbackCore.Children,
  createRef: React.createRef || fallbackCore.createRef,
  cloneElement: React.cloneElement || fallbackCore.cloneElement,
  isValidElement: React.isValidElement || fallbackCore.isValidElement,
  createFactory: React.createFactory || fallbackCore.createFactory,
  lazy: React.lazy || fallbackCore.lazy,
  startTransition: React.startTransition || fallbackCore.startTransition,
  act: React.act || fallbackCore.act,
  StrictMode: React.StrictMode || fallbackCore.StrictMode,
  Suspense: React.Suspense || fallbackCore.Suspense,
  Component: React.Component || fallbackCore.Component,
  PureComponent: React.PureComponent || fallbackCore.PureComponent,
  version: React.version || fallbackCore.version,
  Profiler: React.Profiler || fallbackCore.Profiler
};

// Determine which JSX runtime functions to use
const jsxRuntime = {
  jsx: React.jsx || fallbackJsxRuntime.jsx,
  jsxs: React.jsxs || fallbackJsxRuntime.jsxs,
  jsxDEV: React.jsxDEV || fallbackJsxRuntime.jsxDEV,
  jsxsDEV: React.jsxsDEV || fallbackJsxRuntime.jsxsDEV
};

// Export all hooks
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
  useId,
  useDeferredValue,
  useInsertionEffect,
  useSyncExternalStore,
  useTransition
} = hooks;

// Export all core APIs
export const {
  createElement,
  createContext,
  Fragment,
  forwardRef,
  memo,
  Children,
  createRef,
  cloneElement,
  isValidElement,
  createFactory,
  lazy,
  startTransition,
  act,
  StrictMode,
  Suspense,
  Component,
  PureComponent,
  version,
  Profiler
} = core;

// Export JSX runtime functions
export const {
  jsx,
  jsxs,
  jsxDEV,
  jsxsDEV
} = jsxRuntime;

// Patch global React object if in browser
if (typeof window !== 'undefined') {
  // Make sure window.React exists
  if (!window.React) {
    window.React = React || {};
  }
  
  // Apply all hooks and core methods
  const reactExports = {...hooks, ...core, ...jsxRuntime};
  
  // Add each export to window.React
  Object.entries(reactExports).forEach(([key, value]) => {
    if (value && !window.React[key]) {
      try {
        window.React[key] = value;
      } catch (e) {
        console.warn(`Failed to patch ${key} onto global React: ${e}`);
      }
    }
  });
  
  console.log('React runtime bridge initialized successfully with fallbacks for 18.3.1');
}

// Export default React for compatibility
export default React;
