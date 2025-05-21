
import * as React from 'react';

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
      
      // Access React methods with safe property access
      const jsxFunctions = {
        jsx: React['jsx'] || React['createElement'] || function(){},
        jsxs: React['jsxs'] || React['createElement'] || function(){},
        jsxDEV: React['jsxDEV'] || React['createElement'] || function(){}
      };
      
      Object.entries(jsxFunctions).forEach(([key, value]) => {
        safelyDefineProperty(window.React, key, value);
      });
      
      // Make sure all essential React functions are available using safe property access
      const essentialReactFunctions = {
        createElement: React['createElement'] || function(){},
        createContext: React['createContext'] || function(){},
        Fragment: React['Fragment'] || Symbol('Fragment'),
        useState: React['useState'] || function(){ return [undefined, () => {}]; },
        useEffect: React['useEffect'] || function(){},
        useContext: React['useContext'] || function(){},
        useRef: React['useRef'] || function(){ return { current: null }; },
        useReducer: React['useReducer'] || function(){ return [undefined, () => {}]; },
        useCallback: React['useCallback'] || function(cb){ return cb; },
        useMemo: React['useMemo'] || function(fn){ return fn(); },
        useLayoutEffect: React['useLayoutEffect'] || function(){},
        useImperativeHandle: React['useImperativeHandle'] || function(){},
        useDebugValue: React['useDebugValue'] || function(){},
        useId: React['useId'] || function(){ return Math.random().toString(36).slice(2); },
        Children: React['Children'] || {}
      };
      
      // Apply essential functions safely
      Object.entries(essentialReactFunctions).forEach(([key, value]) => {
        safelyDefineProperty(window.React, key, value);
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
