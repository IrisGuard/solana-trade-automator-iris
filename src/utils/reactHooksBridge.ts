
/**
 * This file ensures React hooks are properly bridged between ESM and CommonJS modules
 */
import * as React from 'react';

// Attach all hooks to global React - needed for some CommonJS modules
if (typeof window !== 'undefined' && window.React) {
  const hooks = {
    useState: React.useState,
    useEffect: React.useEffect,
    useContext: React.useContext,
    useReducer: React.useReducer,
    useRef: React.useRef,
    useMemo: React.useMemo,
    useCallback: React.useCallback,
    useLayoutEffect: React.useLayoutEffect,
    useDebugValue: React.useDebugValue,
    useImperativeHandle: React.useImperativeHandle,
    useId: React.useId,
    useDeferredValue: React.useDeferredValue,
    useInsertionEffect: React.useInsertionEffect,
    useSyncExternalStore: React.useSyncExternalStore,
    useTransition: React.useTransition
  };

  // Apply hooks to global React
  Object.assign(window.React, hooks);
}

// Re-export all hooks for direct usage
export const {
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
