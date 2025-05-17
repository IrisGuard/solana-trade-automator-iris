
// Main export file for JSX runtime fixes
import React from 'react';

// Define JSX functions directly without relying on imports that might not be initialized
const jsx = function(type, props, key) {
  return React.createElement(type, props, key);
};

const jsxs = function(type, props, key) {
  // jsxs is for handling multiple children
  return React.createElement(type, props, key);
};

const Fragment = React.Fragment;

// Define jsxDEV for compatibility
const jsxDEV = function(type, props, key) {
  return jsx(type, props, key);
};

// Export individually to avoid initialization issues
export { jsx, jsxs, Fragment, jsxDEV };

// Default export
export default { jsx, jsxs, Fragment, jsxDEV };
