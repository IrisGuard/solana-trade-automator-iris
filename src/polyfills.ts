
// Import the core polyfills
import 'buffer/';
import 'process/browser';
import 'stream-browserify';
import 'util/';

// Import React compatibility patches - fix import syntax
import ensureReactCompatibility from './utils/reactPatches';

// Basic buffer polyfill for early access
if (typeof window !== 'undefined' && !window.Buffer) {
  // Use type assertion to work around TypeScript errors with Buffer types
  window.Buffer = {
    from: function(data: any, encoding?: string) {
      if (typeof data === 'string') {
        return new Uint8Array([...data].map(c => c.charCodeAt(0)));
      }
      return new Uint8Array(data);
    },
    alloc: function(size: number, fill?: any) {
      const buffer = new Uint8Array(size);
      if (fill !== undefined) {
        buffer.fill(fill);
      }
      return buffer;
    }
  } as unknown as typeof Buffer;

  console.log('Early Buffer polyfill loaded in polyfills.ts');
}

// Set global for potential CommonJS interoperability
if (typeof window !== 'undefined') {
  window.global = window;
  
  // Create kB alias for Buffer (used by some libraries)
  if (!window.kB) {
    window.kB = {
      from: function(data: any, encoding?: string) {
        return window.Buffer.from(data, encoding);
      },
      alloc: function(size: number, fill?: any) {
        return window.Buffer.alloc(size, fill);
      }
    };
  }
}

// Call React compatibility function
ensureReactCompatibility();

console.log('Polyfills loaded successfully');
