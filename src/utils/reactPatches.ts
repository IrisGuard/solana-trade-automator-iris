
import * as React from 'react';

// Helper function to safely define a property if it doesn't exist
const safelyDefineProperty = (obj: any, prop: string, value: any) => {
  if (!obj[prop]) {
    try {
      Object.defineProperty(obj, prop, { 
        value, 
        configurable: true,
        writable: true
      });
    } catch (e) {
      console.warn(`Could not define ${prop} on object: ${(e as Error).message}`);
    }
  }
};

// Export the function for applying React compatibility
export function ensureReactCompatibility(): void {
  if (typeof window !== 'undefined') {
    try {
      // Create a full copy of React in the window if it doesn't exist
      if (!window.React) {
        // Use React as the base to ensure proper typing
        window.React = Object.create(React);
        console.log('Created window.React from React module');
      }
      
      // Create JSX functions aliases
      const jsxFunctions = {
        jsx: React?.createElement, 
        jsxs: React?.createElement,
        jsxDEV: React?.createElement
      };
      
      Object.entries(jsxFunctions).forEach(([key, value]) => {
        safelyDefineProperty(window.React, key, value);
      });
      
      // Make sure all essential React functions are available
      const essentialReactFunctions = {
        createElement: React?.createElement,
        createContext: React?.createContext,
        Fragment: React?.Fragment || Symbol('Fragment'),
        useState: React?.useState || function(initial: any) { return [initial, () => {}]; },
        useEffect: React?.useEffect || function() {},
        useContext: React?.useContext || function() { return undefined; },
        useRef: React?.useRef || function(val: any) { return {current: val}; },
        useReducer: React?.useReducer || function(r: any, s: any) { return [s, () => {}]; },
        useCallback: React?.useCallback || function(fn: any) { return fn; },
        useMemo: React?.useMemo || function(fn: any) { return fn(); },
        useLayoutEffect: React?.useLayoutEffect || function() {},
        useImperativeHandle: React?.useImperativeHandle || function() {},
        useDebugValue: React?.useDebugValue || function() {},
        useId: React?.useId || function() { return Math.random().toString(36).slice(2); },
        Children: React?.Children || {
          map: (children: any, fn: any) => Array.isArray(children) ? children.map(fn) : children ? [fn(children)] : []
        }
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
      const err = error instanceof Error ? error : new Error(String(error));
      console.error('Error applying React patches:', err);
    }
  }
}

// Apply the patch immediately when imported
ensureReactCompatibility();

// Export for backwards compatibility
export default ensureReactCompatibility;
