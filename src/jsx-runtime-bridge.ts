
/**
 * This file provides a bridge for JSX runtime functions to ensure compatibility
 * with various React versions including React 18.3.1
 */
import React from 'react';
import { createElement, Fragment } from 'react';

// Define JSX runtime functions - using our safe exports from react-runtime
const jsx = createElement;
const jsxs = createElement;
const jsxDEV = createElement;

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
