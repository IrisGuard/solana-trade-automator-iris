
/**
 * React Runtime Initializer
 * 
 * This file initializes the React JSX runtime functions early to prevent
 * circular dependencies and ensure they're available when needed.
 */

import * as React from 'react';

/**
 * Initialize the React runtime functions on the global React object
 * to ensure JSX functions are available early in the application lifecycle.
 */
export function initializeReactRuntime(): void {
  if (typeof window !== 'undefined') {
    // Create React on window if it doesn't exist
    if (!window.React) {
      window.React = React as any;
    }
    
    // Ensure core JSX functions are defined early
    const reactObj = window.React;
    
    if (!reactObj.jsx) {
      reactObj.jsx = function jsx(type: any, props: any, key?: any) {
        return React.createElement(type, props, key);
      };
      console.log('JSX function initialized');
    }
    
    if (!reactObj.jsxs) {
      reactObj.jsxs = function jsxs(type: any, props: any, key?: any) {
        return React.createElement(type, props, key);
      };
      console.log('JSXS function initialized');
    }
    
    if (!reactObj.jsxDEV) {
      reactObj.jsxDEV = function jsxDEV(type: any, props: any, key?: any) {
        return React.createElement(type, props, key);
      };
      console.log('JSXDEV function initialized');
    }
    
    if (!reactObj.Fragment) {
      reactObj.Fragment = React.Fragment;
      console.log('Fragment initialized');
    }
    
    // Verify initialization
    console.log('React runtime initialized:', {
      jsx: !!reactObj.jsx,
      jsxs: !!reactObj.jsxs,
      jsxDEV: !!reactObj.jsxDEV,
      Fragment: !!reactObj.Fragment
    });
  }
}

// Export the core JSX functions directly to make them available for import
export const jsx = function(type: any, props: any, key?: any) {
  return React.createElement(type, props, key);
};

export const jsxs = function(type: any, props: any, key?: any) {
  return React.createElement(type, props, key);
};

export const jsxDEV = function(type: any, props: any, key?: any) {
  return React.createElement(type, props, key);
};

export const Fragment = React.Fragment;

export default { jsx, jsxs, jsxDEV, Fragment };
