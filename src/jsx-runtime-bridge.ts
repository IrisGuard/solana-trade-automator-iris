
/**
 * This file provides explicit exports of React JSX runtime functions
 * to fix build issues with JSX transformations.
 */
import React from 'react';

// Re-export JSX functions from React
export const jsx = React.createElement;
export const jsxs = React.createElement;
export const Fragment = React.Fragment;

// Export default React for compatibility
export default React;
