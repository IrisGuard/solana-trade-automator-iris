
import React from 'react';
import * as RuntimeBridge from '../react-runtime';

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
      
      // Use our runtime bridge exports for JSX functions
      const jsxFunctions = {
        jsx: RuntimeBridge.jsx,
        jsxs: RuntimeBridge.jsxs,
        jsxDEV: RuntimeBridge.jsxDEV
      };
      
      Object.entries(jsxFunctions).forEach(([key, value]) => {
        safelyDefineProperty(window.React, key, value);
      });
      
      // Make sure all essential React functions are available from our bridge
      const essentialReactFunctions = {
        createElement: RuntimeBridge.createElement,
        createContext: RuntimeBridge.createContext,
        Fragment: RuntimeBridge.Fragment,
        useState: RuntimeBridge.useState,
        useEffect: RuntimeBridge.useEffect,
        useContext: RuntimeBridge.useContext,
        useRef: RuntimeBridge.useRef,
        useReducer: RuntimeBridge.useReducer,
        useCallback: RuntimeBridge.useCallback,
        useMemo: RuntimeBridge.useMemo,
        useLayoutEffect: RuntimeBridge.useLayoutEffect,
        useImperativeHandle: RuntimeBridge.useImperativeHandle,
        useDebugValue: RuntimeBridge.useDebugValue,
        useId: RuntimeBridge.useId,
        Children: RuntimeBridge.Children
      };
      
      // Apply essential functions safely
      Object.entries(essentialReactFunctions).forEach(([key, value]) => {
        safelyDefineProperty(window.React, key, value);
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
