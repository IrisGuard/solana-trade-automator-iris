
// Main export file for JSX runtime fixes
import React from 'react';

// Define JSX functions directly without relying on imports that might not be initialized
export function jsx(type, props, key) {
  return React.createElement(type, props, key);
}

export function jsxs(type, props, key) {
  // jsxs is for handling multiple children
  return React.createElement(type, props, key);
}

export const Fragment = React.Fragment;

// Define jsxDEV for compatibility
export function jsxDEV(type, props, key) {
  return jsx(type, props, key);
}

// Export individually to avoid initialization issues
export { jsx, jsxs, Fragment, jsxDEV };

// Default export
const runtime = { jsx, jsxs, Fragment, jsxDEV };
export default runtime;
