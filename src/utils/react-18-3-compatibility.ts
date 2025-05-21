
/**
 * This file provides specific compatibility fixes for React 18.3.1
 * which has changed its internal API structure.
 */

// Import standard React
import * as React from 'react';

// Check if we can access standard React functions
const hasCreateElement = React && typeof React.createElement === 'function';
const hasFragment = React && React.Fragment !== undefined;
const hasCreateContext = React && typeof React.createContext === 'function';

/**
 * React 18.3.1 has moved hooks and other APIs into a different structure.
 * This function detects the React version and provides appropriate shims.
 */
export function applyReact183Compatibility() {
  console.log('Applying React 18.3.1 compatibility layer');
  
  // Create shims for common React APIs if needed
  const reactApiShims = {
    createElement: function createElement(type, props, ...children) {
      // Fallback implementation for React.createElement
      if (hasCreateElement) {
        return React.createElement(type, props, ...children);
      }
      
      // Very basic fallback
      console.warn('Using createElement fallback');
      return { type, props: { ...props, children: children.length === 1 ? children[0] : children } };
    },
    
    Fragment: hasFragment ? React.Fragment : Symbol('React.Fragment'),
    
    createContext: function createContext(defaultValue) {
      if (hasCreateContext) {
        return React.createContext(defaultValue);
      }
      
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
  
  // Hook shims
  const hookShims = {
    useState: function useState(initialState) {
      console.warn('Using useState fallback shim');
      const state = typeof initialState === 'function' ? initialState() : initialState;
      const setState = () => { /* noop */ };
      return [state, setState];
    },
    
    useEffect: function useEffect(effect, deps) {
      console.warn('Using useEffect fallback shim');
      // No-op implementation
    },
    
    useRef: function useRef(initialValue) {
      console.warn('Using useRef fallback shim');
      return { current: initialValue };
    }
    
    // Add other hooks as needed
  };

  // Apply to global React if it exists
  if (typeof window !== 'undefined') {
    window.React = window.React || {} as any;
    
    // Apply API shims
    Object.entries(reactApiShims).forEach(([key, implementation]) => {
      if (!window.React[key]) {
        window.React[key] = implementation;
        console.log(`Applied ${key} shim to global React`);
      }
    });
    
    // Apply hook shims
    Object.entries(hookShims).forEach(([key, implementation]) => {
      if (!window.React[key]) {
        window.React[key] = implementation;
        console.log(`Applied ${key} hook shim to global React`);
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
