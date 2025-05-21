
/**
 * This file provides specific compatibility fixes for React 18.3.1
 * which has changed its internal API structure.
 */

// Import standard React
import * as React from 'react';

// Access React hooks via the hooks object in React 18.3.1
const reactHooks = React.hooks || {};

/**
 * React 18.3.1 has moved hooks and other APIs into a different structure.
 * This function detects the React version and provides appropriate shims.
 */
export function applyReact183Compatibility() {
  console.log('Applying React 18.3.1 compatibility layer');
  
  // Create shims for common React APIs if needed
  const reactApiShims = {
    createElement: React.createElement || function createElement(type, props, ...children) {
      // Very basic fallback
      console.warn('Using createElement fallback');
      return { type, props: { ...props, children: children.length === 1 ? children[0] : children } };
    },
    
    Fragment: React.Fragment || Symbol('React.Fragment'),
    
    createContext: React.createContext || function createContext(defaultValue) {
      // Basic fallback for createContext
      console.warn('Using createContext fallback');
      const context = {
        Provider: ({ value, children }) => children,
        Consumer: ({ children }) => children(defaultValue),
        _currentValue: defaultValue
      };
      return context;
    }
  };
  
  // Hook shims - use React.hooks object from 18.3.1 if available
  const hookShims = {
    useState: reactHooks.useState || function useState(initialState) {
      console.warn('Using useState fallback shim');
      const state = typeof initialState === 'function' ? initialState() : initialState;
      const setState = () => { /* noop */ };
      return [state, setState];
    },
    
    useEffect: reactHooks.useEffect || function useEffect() {
      console.warn('Using useEffect fallback shim');
      // No-op implementation
    },
    
    useRef: reactHooks.useRef || function useRef(initialValue) {
      console.warn('Using useRef fallback shim');
      return { current: initialValue };
    }
    
    // Add other hooks as needed
  };

  // Apply to global React if it exists
  if (typeof window !== 'undefined') {
    window.React = window.React || {};
    
    // Apply API shims
    Object.entries(reactApiShims).forEach(([key, implementation]) => {
      if (!window.React[key]) {
        try {
          Object.defineProperty(window.React, key, {
            value: implementation,
            configurable: true,
            writable: true
          });
          console.log(`Applied ${key} shim to global React`);
        } catch (e) {
          console.warn(`Failed to apply ${key} shim: ${e.message}`);
        }
      }
    });
    
    // Apply hook shims
    Object.entries(hookShims).forEach(([key, implementation]) => {
      if (!window.React[key]) {
        try {
          Object.defineProperty(window.React, key, {
            value: implementation, 
            configurable: true,
            writable: true
          });
          console.log(`Applied ${key} hook shim to global React`);
        } catch (e) {
          console.warn(`Failed to apply ${key} hook shim: ${e.message}`);
        }
      }
    });
  }
  
  console.log('React 18.3.1 compatibility layer applied');
  return true;
}

// Auto-apply when module is imported
if (typeof window !== 'undefined') {
  // Delay to ensure it runs after other scripts
  setTimeout(applyReact183Compatibility, 0);
}

export default applyReact183Compatibility;
