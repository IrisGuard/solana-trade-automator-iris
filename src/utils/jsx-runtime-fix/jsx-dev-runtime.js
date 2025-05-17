
// Re-export JSX dev runtime from React
import React from 'react';
import jsxRuntime from 'react/jsx-runtime';

// Use actual React JSX runtime functions directly
const jsx = jsxRuntime.jsx;
const jsxs = jsxRuntime.jsxs;
const Fragment = React.Fragment;

// Define jsxDEV for compatibility (in dev mode, jsxDEV is used as jsx)
const jsxDEV = function(type, props, key) {
  return jsx(type, props, key);
};

// Export with jsxDEV as jsx for dev mode
export { jsxDEV as jsx, jsxs, Fragment };

// Default export
export default { jsx: jsxDEV, jsxs, Fragment };
