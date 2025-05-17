
// Simple and direct JSX runtime implementation from React
import React from 'react';

// Explicitly define JSX functions with function declarations for better hoisting
export function jsx(type, props, key) {
  return React.createElement(type, props, key);
}

export function jsxs(type, props, key) {
  return React.createElement(type, props, key);
}

export const Fragment = React.Fragment;

// Define jsxDEV for compatibility
export function jsxDEV(type, props, key) {
  return React.createElement(type, props, key);
}

// Default export as single object
const runtime = { jsx, jsxs, Fragment, jsxDEV };
export default runtime;
