
import * as React from 'react';

// Export the function for applying React compatibility
export function ensureReactCompatibility(): void {
  if (typeof window !== 'undefined') {
    try {
      // Create a full copy of React in the window
      window.React = window.React || React;
      
      // Explicitly patch JSX runtime functions using Object.defineProperty
      if (!window.React.jsx) {
        try {
          Object.defineProperty(window.React, 'jsx', {
            value: React.createElement,
            configurable: true
          });
        } catch (e) {
          console.warn('Could not define jsx on window.React', e);
        }
      }
      
      if (!window.React.jsxs) {
        try {
          Object.defineProperty(window.React, 'jsxs', {
            value: React.createElement,
            configurable: true
          });
        } catch (e) {
          console.warn('Could not define jsxs on window.React', e);
        }
      }
      
      if (!window.React.jsxDEV) {
        try {
          Object.defineProperty(window.React, 'jsxDEV', {
            value: React.createElement,
            configurable: true
          });
        } catch (e) {
          console.warn('Could not define jsxDEV on window.React', e);
        }
      }
      
      // Make sure all essential React functions are available
      const essentialReactFunctions = {
        createElement: React.createElement,
        createContext: React.createContext,
        Fragment: React.Fragment,
        useState: React.useState,
        useEffect: React.useEffect,
        useContext: React.useContext,
        useRef: React.useRef,
        useReducer: React.useReducer,
        useCallback: React.useCallback,
        useMemo: React.useMemo,
        useLayoutEffect: React.useLayoutEffect,
        useImperativeHandle: React.useImperativeHandle,
        useDebugValue: React.useDebugValue,
        useId: React.useId,
        Children: React.Children
      };
      
      // Apply essential functions
      Object.entries(essentialReactFunctions).forEach(([key, value]) => {
        if (!window.React[key]) {
          try {
            Object.defineProperty(window.React, key, {
              value,
              configurable: true
            });
          } catch (e) {
            console.warn(`Could not define ${key} on window.React`, e);
          }
        }
      });
      
      // Log success
      console.log('React patches applied successfully');
    } catch (error) {
      console.error('Error applying React patches:', error);
    }
  }
}

// Apply the patch immediately when imported
ensureReactCompatibility();

// Export for backwards compatibility
export default ensureReactCompatibility;
