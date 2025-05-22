
/**
 * Core React functionality bridge for React 18.3.1
 * Provides simplified, reliable access to essential React features
 */
import * as React from 'react';

// Core React functionality
export const createElement = React.createElement;
export const Fragment = React.Fragment;
export const createContext = React.createContext; 

// Essential React hooks
export const useState = React.useState;
export const useEffect = React.useEffect;
export const useContext = React.useContext;
export const useRef = React.useRef;
export const useReducer = React.useReducer;
export const useCallback = React.useCallback;
export const useMemo = React.useMemo;
export const useLayoutEffect = React.useLayoutEffect;

// JSX runtime aliases
export const jsx = React.createElement;
export const jsxs = React.createElement;
export const jsxDEV = React.createElement;

// Log initialization
console.log('React Core Bridge initialized');

// Apply to window.React if needed
if (typeof window !== 'undefined' && window.React) {
  // Add essential React features to window.React
  const features = {
    createElement, Fragment, createContext,
    useState, useEffect, useContext, useRef,
    useReducer, useCallback, useMemo, useLayoutEffect,
    jsx, jsxs, jsxDEV
  };
  
  Object.entries(features).forEach(([key, value]) => {
    if (!window.React[key]) {
      try {
        window.React[key] = value;
      } catch (e) {
        console.warn(`Failed to add ${key} to window.React:`, e);
      }
    }
  });
}

export default React;
