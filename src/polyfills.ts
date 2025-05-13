
/**
 * Polyfills for browser compatibility
 * This file should be imported before any other code
 */

// Include React patches
import './utils/reactPatches';

// Buffer polyfill
if (typeof window !== 'undefined' && !window.Buffer) {
  console.log('Setting up Buffer polyfill');
  try {
    import('buffer').then(({ Buffer }) => {
      window.Buffer = Buffer;
    });
  } catch (e) {
    console.error('Failed to load Buffer polyfill', e);
  }
}

// Process polyfill
if (typeof window !== 'undefined' && !window.process) {
  console.log('Setting up process polyfill');
  window.process = {
    env: {},
    version: '',
    versions: {},
    browser: true,
  } as any;
}
