
import React from 'react';

// Helper function to safely define a property if it doesn't exist
const safelyDefineProperty = (obj, prop, value) => {
  if (!obj[prop]) {
    try {
      Object.defineProperty(obj, prop, { 
        value, 
        configurable: true,
        writable: true
      });
    } catch (e) {
      console.warn(`Could not define ${prop} on object: ${e.message}`);
    }
  }
};

// Export the function for applying React compatibility
export function ensureReactCompatibility(): void {
  if (typeof window !== 'undefined') {
    try {
      // Create a full copy of React in the window if it doesn't exist
      if (!window.React) {
        window.React = Object.create(React);
        console.log('Created window.React from React module');
      }
      
      // Use JSX functions from React
      const jsxFunctions = {
        jsx: React.createElement, 
        jsxs: React.createElement,
        jsxDEV: React.createElement
      };
      
      Object.entries(jsxFunctions).forEach(([key, value]) => {
        safelyDefineProperty(window.React, key, value);
      });
      
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
      
      // Apply essential functions safely
      Object.entries(essentialReactFunctions).forEach(([key, value]) => {
        if (value) { // Only apply if the function actually exists
          safelyDefineProperty(window.React, key, value);
        }
      });
      
      // Log success
      console.log('React patches applied successfully with React 18.3.1 compatibility');
    } catch (error) {
      console.error('Error applying React patches:', error);
    }
  }
}

// Apply the patch immediately when imported
ensureReactCompatibility();

// Export for backwards compatibility
export default ensureReactCompatibility;
