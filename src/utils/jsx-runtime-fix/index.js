
// Main export file for JSX runtime fixes
import React from 'react';

// Explicitly define JSX functions with function declarations
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

// Export individually to avoid initialization issues
export { jsx, jsxs, Fragment, jsxDEV };

// Default export
const runtime = { jsx, jsxs, Fragment, jsxDEV };
export default runtime;
