
/**
 * Enhanced React exports fix to ensure proper hook availability for react-router-dom
 */
import * as React from 'react';

// Re-export the React object with all its properties
export default React;

// Explicitly re-export the hooks that react-router-dom is looking for
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
  // Add any other hooks that might be needed
  useDeferredValue,
  useInsertionEffect,
  useSyncExternalStore,
  useTransition
  // React 18 specific hooks that aren't available in this version have been removed
} = React;

// Ensure these hooks are definitely exported (redundant but ensuring exports work)
export const useStateExport = React.useState;
export const useEffectExport = React.useEffect;
export const useContextExport = React.useContext;
export const useRefExport = React.useRef;
