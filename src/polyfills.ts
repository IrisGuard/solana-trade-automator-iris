
import { Buffer as BufferPolyfill } from 'buffer';

// Make Buffer available globally with all required methods
if (typeof window !== 'undefined') {
  window.Buffer = BufferPolyfill;
}

// Log Buffer availability for debugging
console.log('Buffer polyfill loaded:', typeof window.Buffer);
console.log('Buffer.from available:', typeof window.Buffer.from);
console.log('Buffer.alloc available:', typeof window.Buffer.alloc);
