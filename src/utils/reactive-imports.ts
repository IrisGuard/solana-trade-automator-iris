
/**
 * This file creates a set of safe imports from React that work with React 18.3.1
 * It provides a centralized place to import React features from
 */

// Import from our bridge
import {
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
  Fragment,
  createElement,
  createContext,
  forwardRef,
  memo
} from '../react-18-bridge';

// JSX runtime functions
import { jsx, jsxs, jsxDEV } from '../jsx-runtime-bridge';

// Export everything
export {
  // Hooks
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
  
  // Core React functions
  Fragment,
  createElement,
  createContext,
  forwardRef,
  memo,
  
  // JSX runtime
  jsx,
  jsxs,
  jsxDEV
};

/**
 * Ensures React exports are patched in the global scope
 * This helps React Router and other libraries find the hooks they need
 */
export function patchGlobalReact() {
  if (typeof window !== 'undefined') {
    // Create a starter React object with required props if needed
    if (!window.React) {
      // Import React directly to ensure we have the correct types
      const React = require('react');
      
      // Initialize with React itself or create a minimal compatible object
      window.React = React || {
        // These must be correctly typed functions, not just any functions
        version: '18.3.1',
        // Use the actual imported functions when available
        createElement: createElement || React.createElement,
        Fragment: Fragment || React.Fragment,
        useState: useState || React.useState,
        useEffect: useEffect || React.useEffect,
        useContext: useContext || React.useContext,
        useRef: useRef || React.useRef,
        useReducer: useReducer || React.useReducer,
        useCallback: useCallback || React.useCallback,
        useMemo: useMemo || React.useMemo,
        useLayoutEffect: useLayoutEffect || React.useLayoutEffect,
        createContext: createContext || React.createContext,
        forwardRef: forwardRef || React.forwardRef,
        memo: memo || React.memo,
        Children: {
          map: function mapChildren(children, fn, context) {
            if (!children) return null;
            return Array.isArray(children) 
              ? children.map(child => fn.call(context || null, child)) 
              : [fn.call(context || null, children)];
          },
          forEach: function forEachChildren(children, fn, context) {
            if (!children) return null;
            if (Array.isArray(children)) {
              children.forEach(child => fn.call(context || null, child));
            } else {
              fn.call(context || null, children);
            }
            return undefined;
          },
          count: function countChildren(children) {
            if (!children) return 0;
            return Array.isArray(children) ? children.length : 1;
          },
          only: function onlyChild(children) {
            if (Array.isArray(children)) {
              if (children.length !== 1) {
                throw new Error('Children.only expected to receive a single React element child.');
              }
              return children[0];
            }
            return children;
          },
          toArray: function toArrayChildren(children) {
            if (!children) return [];
            return Array.isArray(children) ? children : [children];
          }
        }
      };
    }
    
    // Apply all exports
    const exports = {
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
      Fragment,
      createElement,
      createContext,
      forwardRef,
      memo,
      jsx,
      jsxs,
      jsxDEV
    };
    
    // Apply to global React
    Object.entries(exports).forEach(([name, fn]) => {
      if (fn && !window.React[name]) {
        window.React[name] = fn;
      }
    });
    
    console.log('React exports patched globally');
    return true;
  }
  
  return false;
}

// Auto-patch when module is loaded
patchGlobalReact();
