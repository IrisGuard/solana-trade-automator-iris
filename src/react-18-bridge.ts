
/**
 * React 18.3.1 Bridge
 * 
 * This file creates compatibility bridges for React 18.3.1 which has changed
 * how hooks and JSX functions are exported
 */
import * as React from 'react';

// Ensure we're using the correct version of React
if (React.version !== '18.3.1') {
  console.warn(`React bridge loaded but version is ${React.version} instead of 18.3.1`);
}

// Create named exports for all React hooks
export const {
  useState = React.useState,
  useEffect = React.useEffect,
  useContext = React.useContext,
  useReducer = React.useReducer, 
  useRef = React.useRef,
  useMemo = React.useMemo,
  useCallback = React.useCallback,
  useLayoutEffect = React.useLayoutEffect,
  useDebugValue = React.useDebugValue,
  useImperativeHandle = React.useImperativeHandle,
  useId = React.useId,
  useDeferredValue = React.useDeferredValue,
  useInsertionEffect = React.useInsertionEffect,
  useSyncExternalStore = React.useSyncExternalStore,
  useTransition = React.useTransition
} = React;

// Create JSX runtime function exports
export const jsx = React.jsx || React.createElement;
export const jsxs = React.jsxs || React.createElement;
export const Fragment = React.Fragment;
export const createElement = React.createElement;
export const createContext = React.createContext;
export const forwardRef = React.forwardRef;
export const memo = React.memo;

// Apply these to the global React object
if (typeof window !== 'undefined') {
  // Initialize window.React with the React object itself, not an empty object
  // This fixes the type error by ensuring it has all required properties
  window.React = window.React || React;
  
  // Apply JSX functions
  Object.assign(window.React, {
    jsx, jsxs, Fragment, createElement, createContext, forwardRef, memo
  });
  
  // Apply hooks
  const hooks = {
    useState, useEffect, useContext, useReducer, useRef, useMemo, useCallback,
    useLayoutEffect, useDebugValue, useImperativeHandle, useId, useDeferredValue,
    useInsertionEffect, useSyncExternalStore, useTransition
  };
  
  Object.entries(hooks).forEach(([name, fn]) => {
    if (fn && !window.React[name]) {
      window.React[name] = fn;
    }
  });
  
  console.log('[React 18.3.1] Bridge initialized successfully');
}

// Export the entire React object
export default React;
