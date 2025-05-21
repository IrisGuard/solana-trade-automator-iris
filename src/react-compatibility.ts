
// Export React hooks for compatibility
import { 
  useState, 
  useEffect, 
  useCallback, 
  useMemo, 
  useRef, 
  useContext, 
  useReducer,
  useLayoutEffect,
  useId
} from 'react';

// Re-export core React hooks
export {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useContext,
  useReducer,
  useLayoutEffect,
  useId
};

// Create custom hook shims if needed here in the future
