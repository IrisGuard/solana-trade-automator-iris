
/**
 * This file provides a bridge for JSX runtime functions to ensure compatibility
 * with various React versions including React 18.3.1
 */
import * as React from 'react';
import { createElement, Fragment, jsx, jsxs, jsxDEV } from './react-compatibility';

// Export all the functions
export {
  jsx,
  jsxs,
  jsxDEV,
  Fragment
};

// Log initialization
console.log('JSX Runtime bridge initialized using React compatibility layer');

// Export default for compatibility
export default {
  jsx,
  jsxs,
  jsxDEV,
  Fragment
};
