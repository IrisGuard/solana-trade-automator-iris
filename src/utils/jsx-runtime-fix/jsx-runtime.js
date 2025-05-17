
// Re-export JSX runtime from React
import React from 'react';
import jsxRuntime from 'react/jsx-runtime';

// Use actual React JSX runtime functions directly
const jsx = jsxRuntime.jsx;
const jsxs = jsxRuntime.jsxs;
const Fragment = React.Fragment;

// Define jsxDEV for compatibility
const jsxDEV = function(type, props, key) {
  return jsx(type, props, key);
};

// Export individually to avoid initialization issues
export { jsx, jsxs, Fragment, jsxDEV };

// Default export
export default { jsx, jsxs, Fragment, jsxDEV };
