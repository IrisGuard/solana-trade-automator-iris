
/**
 * Core React functionality bridge for React 18.3.1
 * Provides simplified, reliable access to essential React features
 */
import * as React from 'react';

// Core React functionality with fallbacks
const createElement = React.createElement || function(type, props) { return null; };
const Fragment = React.Fragment || Symbol('React.Fragment');
const createContext = React.createContext || function(defaultValue) { return { Provider: () => null, Consumer: () => null }; };

// Essential React hooks with fallbacks
const useState = React.useState || function(initialValue) { return [initialValue, () => {}]; };
const useEffect = React.useEffect || function() {};
const useContext = React.useContext || function() { return undefined; };
const useRef = React.useRef || function(value) { return {current: value}; };
const useReducer = React.useReducer || function(r, i) { return [i, () => {}]; };
const useCallback = React.useCallback || function(fn) { return fn; };
const useMemo = React.useMemo || function(fn) { return fn(); };
const useLayoutEffect = React.useLayoutEffect || function() {};

// JSX runtime aliases
const jsx = React.createElement || function(type, props) { return null; };
const jsxs = React.createElement || function(type, props) { return null; };
const jsxDEV = React.createElement || function(type, props) { return null; };

// Export all functions
export {
  createElement,
  Fragment,
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
  useReducer,
  useCallback,
  useMemo,
  useLayoutEffect,
  jsx,
  jsxs,
  jsxDEV
};

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
