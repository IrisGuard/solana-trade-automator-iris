
// Re-export JSX dev runtime from React
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

// Define jsxDEV for compatibility (in dev mode, jsxDEV is used as jsx)
export function jsxDEV(type, props, key) {
  return jsx(type, props, key);
}

// Export with jsxDEV as jsx for dev mode
export { jsxDEV as jsx, jsxs, Fragment };

// Default export for compatibility
const runtime = { jsx: jsxDEV, jsxs, Fragment };
export default runtime;
