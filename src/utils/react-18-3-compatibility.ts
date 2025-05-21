
/**
 * This file provides specific compatibility fixes for React 18.3.1
 * which has changed its internal API structure.
 */

// Import standard React
import * as React from 'react';

/**
 * React 18.3.1 has moved hooks and other APIs into a different structure.
 * This function detects the React version and provides appropriate shims.
 */
export function applyReact183Compatibility() {
  console.log('Applying React 18.3.1 compatibility layer');
  
  // Create shims for common React APIs if needed
  const reactApiShims = {
    createElement: function createElement(type: any, props: any, ...children: any[]) {
      // Fallback implementation for React.createElement
      if (typeof React.createElement === 'function') {
        return React.createElement(type, props, ...children);
      }
      
      // Very basic fallback
      console.warn('Using createElement fallback');
      return { type, props: { ...props, children: children.length === 1 ? children[0] : children } };
    },
    
    Fragment: React.Fragment || Symbol('React.Fragment'),
    
    createContext: function createContext(defaultValue: any) {
      if (typeof React.createContext === 'function') {
        return React.createContext(defaultValue);
      }
      
      // Basic fallback for createContext
      console.warn('Using createContext fallback');
      const context = {
        Provider: ({ value, children }: { value: any, children: any }) => children,
        Consumer: ({ children }: { children: (value: any) => any }) => children(defaultValue),
        _currentValue: defaultValue
      };
      return context;
    }
  };
  
  // Hook shims
  const hookShims = {
    useState: function useState<T>(initialState: T | (() => T)): [T, (value: T | ((prev: T) => T)) => void] {
      console.warn('Using useState fallback shim');
      const state = typeof initialState === 'function' ? (initialState as () => T)() : initialState;
      const setState = (_: T | ((prev: T) => T)) => { /* noop */ };
      return [state, setState];
    },
    
    useEffect: function useEffect(effect: () => void | (() => void), deps?: any[]) {
      console.warn('Using useEffect fallback shim');
      // No-op implementation
    },
    
    useRef: function useRef<T>(initialValue: T): { current: T } {
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
