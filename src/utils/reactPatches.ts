
/**
 * This file contains patches needed for React to work properly with the rest of the application
 * Especially for fixing common ESM/CJS compatibility issues
 */

// Patch global React for CommonJS modules that might require it
if (typeof window !== 'undefined') {
  // Make sure React is available globally
  if (!window.React) {
    import('react').then(React => {
      window.React = React;
      console.log('React patched globally for CommonJS compatibility');
      
      // Ensure react-router-dom can find hooks
      import('../react-exports-fix').then(reactExports => {
        // Expose React hooks to react-router-dom
        window.React = {
          ...window.React,
          ...reactExports
        };
        console.log('Enhanced React patched globally with hooks for react-router-dom');
      }).catch(err => {
        console.error('Failed to enhance React with hooks:', err);
      });
    }).catch(err => {
      console.error('Failed to patch React globally:', err);
    });
  }
  
  // Ensure react hooks are available on global React
  if (window.React && !window.React.useState) {
    import('./reactHooksBridge').then(hooks => {
      console.log('React hooks patched globally');
    }).catch(err => {
      console.error('Failed to patch React hooks globally:', err);
    });
  }
  
  // Special handling for React Router
  try {
    // Try to make React Router use our fixed React exports
    const originalRequire = window.require;
    if (typeof originalRequire === 'function') {
      window.require = function(id: string) {
        if (id === 'react') {
          console.log('Intercepted require("react") for React Router compatibility');
          return window.React;
        }
        return originalRequire(id);
      };
    }
  } catch (e) {
    console.warn('Could not patch require for React Router', e);
  }
}

export default function ensureReactCompatibility() {
  console.log('React compatibility layer activated');
  
  if (typeof window !== 'undefined' && window.React) {
    // Log available React hooks for debugging
    console.log('React hooks available in compatibility layer:', {
      useState: !!window.React.useState,
      useEffect: !!window.React.useEffect,
      useContext: !!window.React.useContext,
      useRef: !!window.React.useRef,
      createContext: !!window.React.createContext
    });
  }
  
  return true;
}
