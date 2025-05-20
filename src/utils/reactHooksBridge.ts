
/**
 * This file ensures React hooks are properly bridged between ESM and CommonJS modules
 */
import * as React from 'react';

// Get React hooks via destructuring
const { 
  useState, 
  useEffect, 
  useContext, 
  useReducer, 
  useRef, 
  useMemo, 
  useCallback, 
  useLayoutEffect, 
  useDebugValue,
  useImperativeHandle,
  useId,
  useDeferredValue,
  useInsertionEffect,
  useSyncExternalStore,
  useTransition
} = React;

// Re-export all hooks for direct usage
export {
  useState,
  useEffect,
  useContext,
  useReducer,
  useRef,
  useMemo,
  useCallback,
  useLayoutEffect,
  useDebugValue,
  useImperativeHandle,
  useId,
  useDeferredValue,
  useInsertionEffect,
  useSyncExternalStore,
  useTransition
};

// For browser environment, ensure global React object has hooks
if (typeof window !== 'undefined' && window.React) {
  const hooks = {
    useState,
    useEffect,
    useContext,
    useReducer,
    useRef,
    useMemo,
    useCallback,
    useLayoutEffect,
    useDebugValue,
    useImperativeHandle,
    useId,
    useDeferredValue,
    useInsertionEffect,
    useSyncExternalStore,
    useTransition
  };

  // Apply hooks to global React
  Object.assign(window.React, hooks);
}
