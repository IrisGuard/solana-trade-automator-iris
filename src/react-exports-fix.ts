
// Re-export React hooks and functions properly
import * as React from 'react';

// Use named imports instead of namespace access
import {
  useState,
  useEffect,
  useContext,
  useRef,
  createContext,
  forwardRef,
  memo,
  useCallback,
  useMemo,
  useReducer,
  useLayoutEffect,
  Fragment
} from 'react';

// Export with named exports
export {
  useState,
  useEffect,
  useContext,
  useRef,
  createContext,
  forwardRef,
  Fragment,
  memo,
  useCallback,
  useMemo,
  useReducer,
  useLayoutEffect,
};

// Export React itself for compatibility
export default React;
