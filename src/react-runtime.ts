
// This file creates a compatibility layer for React
import * as React from 'react';

// Store React in a variable for compatibility with code expecting default import
const _React = React;

// Extract components and hooks we need directly
const useState = React.useState || function() { return [undefined, () => {}]; };
const useEffect = React.useEffect || function() {};
const useCallback = React.useCallback || function(fn) { return fn; };
const useMemo = React.useMemo || function(fn) { return fn(); };
const useRef = React.useRef || function(val) { return {current: val}; };
const useContext = React.useContext || function() { return undefined; };
const createContext = React.createContext || function() {};
const useReducer = React.useReducer || function(r, i) { return [i, () => {}]; };
const useLayoutEffect = React.useLayoutEffect || React.useEffect || function() {};
const useId = React.useId || function() { return Math.random().toString(36).substring(7); };
const Fragment = React.Fragment || Symbol('Fragment');
const Children = React.Children;

// JSX Runtime functions
const jsx = React.createElement || function() {};
const jsxs = React.createElement || function() {};
const jsxDEV = React.createElement || function() {};
const jsxsDEV = React.createElement || function() {};

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
  Children,
  jsx,
  jsxs,
  jsxDEV,
  jsxsDEV
};

// Additional hooks that might be needed
export const useImperativeHandle = React.useImperativeHandle || function() {};
export const useDebugValue = React.useDebugValue || function() {};
export const Profiler = React.Profiler || 'Profiler'; // Use string fallback if not available

export default _React;
