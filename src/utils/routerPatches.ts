
import React from 'react';
import { createElement, createContext, Fragment, useState, useEffect, useContext, useRef } from '../react-compatibility';

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
      window.React = window.React || React;
      
      // Ensure all essential React functions are available
      const essentialFunctions = {
        createElement,
        createContext,
        Fragment,
        useState,
        useEffect,
        useContext,
        useRef
      };
      
      // Apply them to window.React
      Object.entries(essentialFunctions).forEach(([key, value]) => {
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

// Apply patch immediately when imported
ensureRouterCompatibility();

// For backwards compatibility with older code
export default ensureRouterCompatibility;
