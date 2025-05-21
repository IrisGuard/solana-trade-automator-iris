/**
 * React 18.3.1 Compatibility Layer
 * 
 * This file provides a unified compatibility layer for React 18.3.1
 * which changes how hooks and other APIs are exported.
 */

// Import React with namespace import instead of default import
import * as React from 'react';

// Access to React internals
const internalReact = React;

// Define types for basic hooks for better TypeScript support
type SetStateAction<S> = S | ((prevState: S) => S);
type Dispatch<A> = (action: A) => void;

// Create safe hook references using internal React object
export const useState = <S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>] => {
  if (internalReact.useState) {
    return internalReact.useState(initialState);
  }
  console.warn('Using useState fallback');
  const state = typeof initialState === 'function' 
    ? (initialState as () => S)() 
    : initialState;
  return [state, () => {}];
};

export const useEffect = (effect: React.EffectCallback, deps?: React.DependencyList): void => {
  if (internalReact.useEffect) {
    return internalReact.useEffect(effect, deps);
  }
  console.warn('Using useEffect fallback');
};

export const useContext = <T>(context: React.Context<T>): T => {
  if (internalReact.useContext) {
    return internalReact.useContext(context);
  }
  console.warn('Using useContext fallback');
  return (context as any)._currentValue;
};

export const useReducer = <R extends React.Reducer<any, any>>(
  reducer: R,
  initialState: React.ReducerState<R>,
  initializer?: (arg: React.ReducerState<R>) => React.ReducerState<R>
): [React.ReducerState<R>, React.Dispatch<React.ReducerAction<R>>] => {
  if (internalReact.useReducer) {
    return internalReact.useReducer(reducer, initialState, initializer);
  }
  console.warn('Using useReducer fallback');
  return [initialState, () => {}];
};

export const useRef = <T>(initialValue: T): React.RefObject<T> => {
  if (internalReact.useRef) {
    return internalReact.useRef(initialValue);
  }
  console.warn('Using useRef fallback');
  return { current: initialValue };
};

export const useMemo = <T>(factory: () => T, deps?: React.DependencyList): T => {
  if (internalReact.useMemo) {
    return internalReact.useMemo(factory, deps);
  }
  console.warn('Using useMemo fallback');
  return factory();
};

export const useCallback = <T extends Function>(callback: T, deps?: React.DependencyList): T => {
  if (internalReact.useCallback) {
    return internalReact.useCallback(callback, deps);
  }
  console.warn('Using useCallback fallback');
  return callback;
};

export const useLayoutEffect = (effect: React.EffectCallback, deps?: React.DependencyList): void => {
  if (internalReact.useLayoutEffect) {
    return internalReact.useLayoutEffect(effect, deps);
  }
  console.warn('Using useLayoutEffect fallback');
  // Fall back to useEffect if available, otherwise no-op
  if (internalReact.useEffect) {
    return internalReact.useEffect(effect, deps);
  }
};

export const useDebugValue = <T>(value: T, format?: (value: T) => any): void => {
  if (internalReact.useDebugValue) {
    return internalReact.useDebugValue(value, format);
  }
};

export const useImperativeHandle = <T, R extends T>(
  ref: React.Ref<T> | undefined,
  init: () => R,
  deps?: React.DependencyList
): void => {
  if (internalReact.useImperativeHandle) {
    return internalReact.useImperativeHandle(ref, init, deps);
  }
  console.warn('Using useImperativeHandle fallback');
};

export const useId = (): string => {
  if (internalReact.useId) {
    return internalReact.useId();
  }
  console.warn('Using useId fallback');
  return Math.random().toString(36).substr(2, 9);
};

export const useDeferredValue = <T>(value: T): T => {
  if (internalReact.useDeferredValue) {
    return internalReact.useDeferredValue(value);
  }
  console.warn('Using useDeferredValue fallback');
  return value;
};

export const useInsertionEffect = (effect: React.EffectCallback, deps?: React.DependencyList): void => {
  if (internalReact.useInsertionEffect) {
    return internalReact.useInsertionEffect(effect, deps);
  }
  console.warn('Using useInsertionEffect fallback');
  // Fall back to useLayoutEffect if available
  if (internalReact.useLayoutEffect) {
    return internalReact.useLayoutEffect(effect, deps);
  }
  // Fall back to useEffect if available
  if (internalReact.useEffect) {
    return internalReact.useEffect(effect, deps);
  }
};

export const useSyncExternalStore = <Snapshot>(
  subscribe: (onStoreChange: () => void) => () => void,
  getSnapshot: () => Snapshot,
  getServerSnapshot?: () => Snapshot
): Snapshot => {
  if (internalReact.useSyncExternalStore) {
    return internalReact.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  }
  console.warn('Using useSyncExternalStore fallback');
  return getSnapshot();
};

export const useTransition = (): [boolean, (callback: () => void) => void] => {
  if (internalReact.useTransition) {
    return internalReact.useTransition();
  }
  console.warn('Using useTransition fallback');
  return [false, (callback: () => void) => { callback(); }];
};

// Core React APIs
export const Fragment = internalReact.Fragment || Symbol('React.Fragment');
export const createElement = internalReact.createElement;
export const createContext = internalReact.createContext;
export const forwardRef = internalReact.forwardRef;
export const memo = internalReact.memo;

// JSX Runtime
export const jsx = internalReact.createElement;
export const jsxs = internalReact.createElement;
export const jsxDEV = internalReact.createElement;

// Patch global React object when in browser
export function patchReact(): void {
  console.log('Applying React 18.3.1 compatibility patches');
  
  if (typeof window !== 'undefined') {
    // Ensure React global object exists
    window.React = window.React || internalReact;
    
    // Apply all our exported functions to the global React
    const exports = {
      useState, useEffect, useContext, useReducer, useRef,
      useMemo, useCallback, useLayoutEffect, useDebugValue,
      useImperativeHandle, useId, useDeferredValue, useInsertionEffect,
      useSyncExternalStore, useTransition,
      Fragment, createElement, createContext, forwardRef, memo,
      jsx, jsxs, jsxDEV
    };
    
    // Apply all exports to window.React
    Object.entries(exports).forEach(([name, implementation]) => {
      if (!window.React[name]) {
        try {
          window.React[name] = implementation;
          console.log(`Patched ${name} onto global React`);
        } catch (e) {
          console.warn(`Failed to patch ${name}: ${e.message}`);
        }
      }
    });
    
    console.log('React 18.3.1 compatibility layer applied successfully');
  }
}

// Auto-patch when this file is imported
patchReact();

// Export the React namespace for backward compatibility
export default React;
