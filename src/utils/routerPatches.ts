
/**
 * This file patches React Router DOM to ensure compatibility with our React setup
 */

import * as React from 'react';  // Add proper React import to fix TS2686 errors

// Ensure proper React exports are available for React Router DOM
if (typeof window !== 'undefined') {
  // Make core React hooks and methods available globally to fix issues with React Router DOM
  try {
    // Create patched React module with required exports
    const patchedReact = {
      createElement: React.createElement,
      useContext: React.useContext,
      useState: React.useState,
      useEffect: React.useEffect,
      useRef: React.useRef,
      createContext: React.createContext
    };
    
    // Make available to modules that expect React from window
    window.React = window.React || patchedReact;
    
    // Store the patched React module for direct reference
    (window as any).patchedReactRouter = patchedReact;
    
    console.log('React Router patches applied successfully');
  } catch (error) {
    console.error('Failed to apply React Router patches:', error);
  }
}

export default {};
