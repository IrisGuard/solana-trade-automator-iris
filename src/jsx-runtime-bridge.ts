
/**
 * This file provides a bridge for JSX runtime functions to ensure compatibility
 * with various React versions including React 18.3.1
 */
import * as React from 'react';

// Get a reference to createElement for JSX transformation
const createElement = React.createElement;

// JSX runtime functions that use createElement
export const jsx = createElement;
export const jsxs = createElement;
export const jsxDEV = createElement;

// Export Fragment for JSX usage
export const Fragment = React.Fragment;

// Log initialization
console.log('JSX Runtime bridge initialized');

// Apply to global React if available
if (typeof window !== 'undefined' && window.React) {
  // Use safe property assignment
  try {
    if (!window.React.jsx) window.React.jsx = jsx;
    if (!window.React.jsxs) window.React.jsxs = jsxs;
    if (!window.React.jsxDEV) window.React.jsxDEV = jsxDEV;
    if (!window.React.Fragment) window.React.Fragment = Fragment;
  } catch (e) {
    console.warn('Could not apply JSX runtime functions to window.React', e);
  }
}

// Export default for compatibility
export default {
  jsx,
  jsxs,
  jsxDEV,
  Fragment
};
