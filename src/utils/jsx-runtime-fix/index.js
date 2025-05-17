
// Main export file for JSX runtime fixes - simplified
import React from 'react';

// Explicitly define JSX functions
export function jsx(type, props, key) {
  return React.createElement(type, props, key);
}

export function jsxs(type, props, key) {
  return React.createElement(type, props, key);
}

export const Fragment = React.Fragment;

export function jsxDEV(type, props, key) {
  return React.createElement(type, props, key);
}

// Export individually and as default
export { jsx, jsxs, Fragment, jsxDEV };
export default { jsx, jsxs, Fragment, jsxDEV };
