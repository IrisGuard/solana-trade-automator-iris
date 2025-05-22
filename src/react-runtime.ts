
// This file creates a compatibility layer for React
import * as React from 'react';

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
  createElement,
  Fragment,
  Children
} = React;

// Store React in a variable for compatibility with code expecting default import
let _React = React;

// JSX Runtime functions
export const jsx = React.createElement || createElement;
export const jsxs = React.createElement || createElement;
export const jsxDEV = React.createElement || createElement;
export const jsxsDEV = React.createElement || createElement;

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
  createElement,
  Fragment,
  Children
};

// Additional hooks that might be needed
export const useImperativeHandle = React.useImperativeHandle;
export const useDebugValue = React.useDebugValue;
export const Profiler = React.Profiler || (() => null);

export default _React;
