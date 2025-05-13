
// Comprehensive polyfills for Solana web3.js and other Node.js dependencies
console.log("Polyfills loaded");

// Process polyfill for browser environment
if (typeof window !== 'undefined') {
  // Ensure process exists
  if (!window.process) {
    window.process = { env: {}, browser: true };
  } else if (!window.process.env) {
    window.process.env = {};
  }
  
  // Ensure browser property exists
  window.process.browser = true;
}

// Global Buffer polyfill
if (typeof window !== 'undefined' && typeof window.Buffer === 'undefined') {
  window.Buffer = {
    from: function(data, encoding) {
      if (typeof data === 'string') {
        return new Uint8Array([...data].map(c => c.charCodeAt(0)));
      }
      return new Uint8Array(data);
    },
    alloc: function(size, fill) {
      const buffer = new Uint8Array(size);
      if (fill !== undefined) {
        buffer.fill(fill);
      }
      return buffer;
    },
    allocUnsafe: function(size) {
      return new Uint8Array(size);
    }
  };
}

// Import actual buffer polyfill library for enhanced functionality
import('buffer').catch(err => console.warn('Buffer import failed:', err));
