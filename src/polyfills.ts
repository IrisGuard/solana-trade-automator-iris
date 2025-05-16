
/**
 * Polyfills for browser compatibility
 * 
 * This file imports and initializes all necessary polyfills for proper application functionality,
 * especially for Solana web3.js which requires Node.js built-ins.
 */

// Import Buffer polyfill for browser environment
import { Buffer } from 'buffer';

// Make Buffer available globally
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

// Add process shim if needed
if (typeof window !== 'undefined' && !window.process) {
  window.process = {
    env: {},
    browser: true,
    version: '',
    nextTick: (fn: Function) => setTimeout(fn, 0)
  } as any;
}

// Console message to confirm polyfills loaded
console.log('Polyfills initialized for browser environment');

// Export for type checking
export default {};
