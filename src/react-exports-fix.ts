
/**
 * React Exports Fix
 * 
 * This file helps fix React exports compatibility issues with different frameworks
 * by ensuring proper exports are available under expected names.
 */

// Import needed React modules
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as JSXRuntime from 'react/jsx-runtime';

// Make React available globally if it's not already
if (typeof window !== 'undefined') {
  // Ensure React is available on window
  if (!window.React) {
    window.React = React;
  }
  
  // Ensure ReactDOM is available on window
  if (!window.ReactDOM) {
    window.ReactDOM = ReactDOM;
  }
  
  // Add React.Fragment if missing
  if (window.React && !window.React.Fragment) {
    window.React.Fragment = React.Fragment;
  }
}

// Export all React features for local imports
export * from 'react';
export default React;
