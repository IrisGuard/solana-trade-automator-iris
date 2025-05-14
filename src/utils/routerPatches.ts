
/**
 * This file patches React Router DOM to ensure compatibility with our React setup
 */

import * as React from 'react';  // Add proper React import to fix TS2686 errors

// Ensure proper React exports are available for React Router DOM
if (typeof window !== 'undefined') {
  // Make core React hooks and methods available globally to fix issues with React Router DOM
  try {
    // Instead of creating a new object, store reference to needed methods
    if (!window.React) {
      // If React isn't defined on window, create it as an empty object first
      window.React = {} as typeof React;
    }
    
    // Add essential React methods that react-router-dom needs
    // TypeScript will allow property assignments to window.React
    window.React.createElement = window.React.createElement || React.createElement;
    window.React.useContext = window.React.useContext || React.useContext;
    window.React.useState = window.React.useState || React.useState;
    window.React.useEffect = window.React.useEffect || React.useEffect;
    window.React.useRef = window.React.useRef || React.useRef;
    window.React.createContext = window.React.createContext || React.createContext;
    
    // Store the key methods separately for direct reference if needed
    (window as any).patchedReactRouter = {
      createElement: React.createElement,
      useContext: React.useContext,
      useState: React.useState,
      useEffect: React.useEffect,
      useRef: React.useRef,
      createContext: React.createContext
    };
    
    console.log('React Router patches applied successfully');
  } catch (error) {
    console.error('Failed to apply React Router patches:', error);
  }
}

export default {};
