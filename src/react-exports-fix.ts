
/**
 * React Exports Fix - Simplified
 * 
 * This file helps fix React exports compatibility issues with different frameworks
 * by ensuring proper exports are available under expected names.
 */

// Import needed React modules
import * as React from 'react';
import * as ReactDOM from 'react-dom';

// Make React available globally if it's not already
if (typeof window !== 'undefined') {
  // Set React on window only if not already defined
  if (!window.React) {
    window.React = React;
    console.log('React successfully attached to window');
  }
  
  // Set ReactDOM on window only if not already defined
  if (!window.ReactDOM) {
    window.ReactDOM = ReactDOM;
    console.log('ReactDOM successfully attached to window');
  }
  
  // Make sure JSX runtime functions are available
  if (window.React) {
    // Add React.Fragment if missing
    if (!window.React.Fragment) {
      window.React.Fragment = React.Fragment;
    }
    
    // Add JSX functions if missing
    if (!window.React.jsx) {
      window.React.jsx = (type, props, key) => React.createElement(type, props, key);
    }
    
    if (!window.React.jsxs) {
      window.React.jsxs = (type, props, key) => React.createElement(type, props, key);
    }
    
    if (!window.React.jsxDEV) {
      window.React.jsxDEV = (type, props, key) => React.createElement(type, props, key);
    }
    
    console.log('JSX runtime functions setup complete');
  }
}

// Export React hooks and components for direct import
export const {
  useState, useEffect, useContext, useReducer, useCallback,
  useMemo, useRef, useImperativeHandle, useLayoutEffect, useDebugValue,
  Fragment, createElement, createContext, forwardRef, memo,
  Children, Component, PureComponent, cloneElement, isValidElement
} = React;

// Add JSX runtime functions
export const jsx = (type, props, key) => React.createElement(type, props, key);
export const jsxs = (type, props, key) => React.createElement(type, props, key);
export const jsxDEV = (type, props, key) => React.createElement(type, props, key);

// Export the default React object
export default React;
