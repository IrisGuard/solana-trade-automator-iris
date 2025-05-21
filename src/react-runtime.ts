
// This file creates a compatibility layer for React
import React, { 
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
} from 'react';

let _React: any = React;

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
