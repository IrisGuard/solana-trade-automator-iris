
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
      // Start with a minimal set of React functions that must exist
      window.React = {
        createElement,
        Fragment,
        useState,
        useEffect,
        useContext,
        useRef,
        useReducer,
        useCallback,
        useMemo,
        useLayoutEffect,
        createContext,
        forwardRef,
        memo,
        // Provide other essential properties
        version: '18.3.1',
        Children: {
          map: (children, fn) => Array.isArray(children) ? children.map(fn) : (children ? [fn(children)] : []),
          forEach: (children, fn) => Array.isArray(children) ? children.forEach(fn) : (children ? fn(children) : null),
          count: (children) => children ? (Array.isArray(children) ? children.length : 1) : 0,
          only: (children) => Array.isArray(children) ? (children.length === 1 ? children[0] : new Error('Children.only expected to receive a single React element child.')) : children,
          toArray: (children) => Array.isArray(children) ? children : (children ? [children] : [])
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
