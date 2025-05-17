
// Simple JSX dev runtime implementation
import React from 'react';

// Explicitly define JSX functions with function declarations
export function jsx(type, props, key) {
  return React.createElement(type, props, key);
}

export function jsxs(type, props, key) {
  return React.createElement(type, props, key);
}

export const Fragment = React.Fragment;

// Define jsxDEV for development mode
export function jsxDEV(type, props, key) {
  return React.createElement(type, props, key);
}

// In dev mode, jsxDEV is used as jsx
export { jsxDEV as jsx, jsxs, Fragment };

// Default export for compatibility
const runtime = { jsx: jsxDEV, jsxs, Fragment };
export default runtime;
