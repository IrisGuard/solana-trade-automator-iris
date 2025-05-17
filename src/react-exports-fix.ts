
/**
 * React Exports Fix
 * 
 * This file helps fix React exports compatibility issues with different frameworks
 * by ensuring proper exports are available under expected names.
 */

// Import needed React modules
import * as React from 'react';
import * as ReactDOM from 'react-dom';

// Make React available globally if it's not already
if (typeof window !== 'undefined') {
  // Ensure React is available on window
  if (!window.React) {
    window.React = React;
  }
  
  // Ensure ReactDOM is available on window
  if (!window.ReactDOM) {
    window.ReactDOM = ReactDOM;
  }
  
  // Add React.Fragment if missing
  if (window.React && !window.React.Fragment) {
    window.React.Fragment = React.Fragment;
  }
  
  // Add JSX functions if missing
  if (window.React && !window.React.jsx) {
    window.React.jsx = function(type, props, key) {
      return React.createElement(type, props, key);
    };
  }
  
  if (window.React && !window.React.jsxs) {
    window.React.jsxs = function(type, props, key) {
      return React.createElement(type, props, key);
    };
  }
  
  if (window.React && !window.React.jsxDEV) {
    window.React.jsxDEV = function(type, props, key) {
      return React.createElement(type, props, key);
    };
  }
}

// Instead of using "export *", we explicitly re-export the React elements we need
export const useState = React.useState;
export const useEffect = React.useEffect;
export const useContext = React.useContext;
export const useReducer = React.useReducer;
export const useCallback = React.useCallback;
export const useMemo = React.useMemo;
export const useRef = React.useRef;
export const useImperativeHandle = React.useImperativeHandle;
export const useLayoutEffect = React.useLayoutEffect;
export const useDebugValue = React.useDebugValue;
export const Fragment = React.Fragment;
export const createElement = React.createElement;
export const createContext = React.createContext;
export const forwardRef = React.forwardRef;
export const memo = React.memo;
export const Children = React.Children;
export const Component = React.Component;
export const PureComponent = React.PureComponent;
export const cloneElement = React.cloneElement;
export const isValidElement = React.isValidElement;

// Add JSX runtime functions
export const jsx = function(type, props, key) {
  return React.createElement(type, props, key);
};

export const jsxs = function(type, props, key) {
  return React.createElement(type, props, key);
};

export const jsxDEV = function(type, props, key) {
  return React.createElement(type, props, key);
};

// Export the default React object
export default React;
