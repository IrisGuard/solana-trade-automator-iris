
import * as React from 'react';

// Define types for the window object
declare global {
  interface Window {
    React: typeof React;
    // Using consistent declaration - checking other files, it seems this should be optional
    patchedReactRouter?: boolean;
  }
}

// Export the function for applying React Router compatibility
export function ensureRouterCompatibility(): void {
  if (typeof window !== 'undefined') {
    try {
      // Ensure we have a complete React object
      window.React = window.React || React;
      
      // Ensure all essential React functions are available
      Object.entries({
        createElement: React.createElement,
        createContext: React.createContext,
        Fragment: React.Fragment,
        useState: React.useState,
        useEffect: React.useEffect,
        useContext: React.useContext,
        useRef: React.useRef
      }).forEach(([key, value]) => {
        if (!window.React[key]) {
          window.React[key] = value;
        }
      });
      
      // Mark that we've applied the router patch
      window.patchedReactRouter = true;
      
      console.log('React Router patches applied successfully');
    } catch (error) {
      console.error('Error applying router patches:', error);
    }
  }
}

// For backwards compatibility with older code
export default ensureRouterCompatibility;
