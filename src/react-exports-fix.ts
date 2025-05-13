
// This file ensures React hooks are properly exported and available
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
