
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
    // Create window.React if needed
    window.React = window.React || {};
    
    // Patch all exports
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
