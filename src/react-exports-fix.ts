
/**
 * React Exports Fix
 * 
 * This file ensures React exports are consistent across the application
 * and fixes issues with JSX runtime in both development and production.
 */
import * as React from 'react';
import { jsx, jsxs, Fragment, jsxDEV } from './utils/jsx-runtime-fix';

// Re-export everything from React
const ReactExports = {
  ...React,
  jsx,
  jsxs,
  jsxDEV,
  Fragment
};

// Apply to window.React if in browser
if (typeof window !== 'undefined') {
  window.React = window.React || {} as any;
  Object.assign(window.React, ReactExports);
}

export default ReactExports;
