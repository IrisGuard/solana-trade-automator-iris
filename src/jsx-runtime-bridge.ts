
/**
 * This file provides explicit exports of React JSX runtime functions
 * to fix build issues with JSX transformations.
 */
import * as React from 'react';

// Explicitly re-export JSX functions from React
export const jsx = React.createElement;
export const jsxs = React.createElement;
export const Fragment = React.Fragment;

// Also export these functions that might be used by the JSX transformer
export const jsxDEV = React.createElement;
export const jsxsDEV = React.createElement;

// Make sure createElement is also exported
export const createElement = React.createElement;

// Export default React for compatibility
export default React;
