
// Manually polyfill globalThis for older browsers
if (typeof globalThis === 'undefined') {
  (window as any).globalThis = window;
}

// Ensure process object exists for browser
if (typeof window !== 'undefined' && !window.process) {
  (window as any).process = {
    env: {},
    browser: true,
  };
}

// Buffer polyfill
import { Buffer } from 'buffer';
if (typeof window !== 'undefined' && !window.Buffer) {
  window.Buffer = Buffer;
}

// These polyfills help Solana web3.js work in browsers
