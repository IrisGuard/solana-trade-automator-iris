
// This file creates a compatibility layer for React
import React from 'react';

// Extract components and hooks we need directly
const {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useContext,
  createContext,
  useReducer,
  useLayoutEffect,
  useId,
  Fragment,
  Children
} = React;

// Store React in a variable for compatibility with code expecting default import
let _React = React;

// JSX Runtime functions
export const jsx = React.createElement || function() {};
export const jsxs = React.createElement || function() {};
export const jsxDEV = React.createElement || function() {};
export const jsxsDEV = React.createElement || function() {};

// For compatibility with older code
export {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useContext,
  useReducer,
  useLayoutEffect,
  useId,
  createContext,
  Fragment,
  Children
};

// Additional hooks that might be needed
export const useImperativeHandle = React.useImperativeHandle || function() {};
export const useDebugValue = React.useDebugValue || function() {};
export const Profiler = React.Profiler || 'Profiler'; // Use string fallback if not available

export default _React;
