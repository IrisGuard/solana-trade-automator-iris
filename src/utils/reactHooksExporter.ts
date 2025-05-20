
/**
 * This file ensures all React hooks are properly exported before React Router loads
 * It fixes the "useState is not exported by React" errors
 */

import React from 'react';

// Explicitly export all hooks from React
export const {
  useState,
  useEffect,
  useContext,
  useRef,
  useReducer,
  useCallback,
  useMemo,
  useLayoutEffect,
  useImperativeHandle,
  useDebugValue,
  useId,
  useDeferredValue,
  useInsertionEffect,
  useSyncExternalStore,
  useTransition
} = React;

// Ensure the hooks are also available on the global React object
if (typeof window !== 'undefined' && window.React) {
  Object.assign(window.React, {
    useState,
    useEffect,
    useContext,
    useRef,
    useReducer,
    useCallback,
    useMemo,
    useLayoutEffect,
    useImperativeHandle,
    useDebugValue,
    useId,
    useDeferredValue,
    useInsertionEffect,
    useSyncExternalStore,
    useTransition
  });
  
  console.log('React hooks exported to global React object');
}
