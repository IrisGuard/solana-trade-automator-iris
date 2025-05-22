
// This file creates a compatibility layer for React
import * as React from 'react';

// Store React in a variable for compatibility with code expecting default import
const _React = React;

// Create fallback implementations for all hooks
const fallbacks = {
  useState: function(initialValue) { return [initialValue, () => {}]; },
  useEffect: function() {},
  useCallback: function(fn) { return fn; },
  useMemo: function(fn) { return fn(); },
  useRef: function(val) { return {current: val}; },
  useContext: function() { return undefined; },
  useReducer: function(r, i) { return [i, () => {}]; },
  useLayoutEffect: function() {},
  useId: function() { return Math.random().toString(36).substring(7); },
  Children: {
    map: function(children, fn) { return Array.isArray(children) ? children.map(fn) : children ? [fn(children)] : []; },
    forEach: function(children, fn) { Array.isArray(children) ? children.forEach(fn) : children && fn(children); },
    count: function(children) { return Array.isArray(children) ? children.length : children ? 1 : 0; },
    only: function(children) { return Array.isArray(children) ? (children.length !== 1 ? new Error('Expected only one child') : children[0]) : children; },
    toArray: function(children) { return Array.isArray(children) ? children : children ? [children] : []; }
  }
};

// Extract React hooks using property access instead of destructuring
const useState = React.useState || fallbacks.useState;
const useEffect = React.useEffect || fallbacks.useEffect;
const useCallback = React.useCallback || fallbacks.useCallback;
const useMemo = React.useMemo || fallbacks.useMemo;
const useRef = React.useRef || fallbacks.useRef;
const useContext = React.useContext || fallbacks.useContext;
const createContext = React.createContext;
const useReducer = React.useReducer || fallbacks.useReducer;
const useLayoutEffect = React.useLayoutEffect || React.useEffect || fallbacks.useLayoutEffect;
const useId = React.useId || fallbacks.useId;
const Fragment = React.Fragment;
const Children = React.Children || fallbacks.Children;

// JSX Runtime functions
const jsx = React.createElement;
const jsxs = React.createElement;
const jsxDEV = React.createElement;
const jsxsDEV = React.createElement;

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
