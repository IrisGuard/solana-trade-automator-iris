
import * as React from 'react';

// Define types for the window object without conflict
declare global {
  interface Window {
    // Using proper typing for React to avoid conflicts
    React: typeof React;
    patchedReactRouter?: boolean;
  }
}

// Export the function for applying React Router compatibility
export function ensureRouterCompatibility(): void {
  if (typeof window !== 'undefined') {
    try {
      // Ensure we have a complete React object
      window.React = window.React || Object.create(React);
      
      // Ensure all essential React functions are available
      const essentialFunctions = {
        createElement: React.createElement || function() {},
        createContext: React.createContext || function() {},
        Fragment: React.Fragment || Symbol('Fragment'),
        useState: React.useState || function() { return [undefined, () => {}]; },
        useEffect: React.useEffect || function() {},
        useContext: React.useContext || function() {},
        useRef: React.useRef || function() { return { current: null }; }
      };
      
      // Apply them to window.React
      Object.entries(essentialFunctions).forEach(([key, value]) => {
        if (!window.React[key]) {
          try {
            window.React[key] = value;
          } catch (e) {
            console.warn(`Could not assign ${key} to window.React: ${e.message}`);
          }
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

// Apply patch immediately when imported
ensureRouterCompatibility();

// For backwards compatibility with older code
export default ensureRouterCompatibility;
