
// Re-export JSX dev runtime from React
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

// Define jsxDEV for compatibility (in dev mode, jsxDEV is used as jsx)
const jsxDEV = function(type, props, key) {
  return jsx(type, props, key);
};

// Export with jsxDEV as jsx for dev mode
export { jsxDEV as jsx, jsxs, Fragment };

// Default export
export default { jsx: jsxDEV, jsxs, Fragment };
