
// This file creates a compatibility layer for React
import React, { 
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useContext,
  createContext,
  useReducer
} from 'react';

let _React: any = React;

export const useStateShim = (initialState: unknown) => useState(initialState);
export const useEffectShim = (effect: () => void | (() => void), deps?: readonly unknown[]) => useEffect(effect, deps);
export const useCallbackShim = (callback: (...args: unknown[]) => unknown, deps?: readonly unknown[]) => useCallback(callback, deps);
export const useMemoShim = (factory: () => unknown, deps?: readonly unknown[]) => useMemo(factory, deps);
export const useRefShim = (initialValue: unknown) => useRef(initialValue);
export const useContextShim = (context: React.Context<unknown>) => useContext(context);
export const useReducerShim = (reducer: (state: unknown, action: unknown) => unknown, initialState: unknown) => useReducer(reducer, initialState);
export const createContextShim = (defaultValue: unknown) => createContext(defaultValue);

// For compatibility with older code
export {
  useState as useState,
  useEffect as useEffect,
  useCallback as useCallback,
  useMemo as useMemo,
  useRef as useRef,
  useContext as useContext,
  useReducer as useReducer,
  createContext as createContext
};

export default _React;
