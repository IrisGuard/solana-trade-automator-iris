
// Import the core polyfills
import 'buffer/';
import 'process/browser';
import 'stream-browserify';
import 'util/';

// Import JSX runtime fix BEFORE importing React components
import './utils/jsx-runtime-fix';

// Import React compatibility patches
import { ensureReactCompatibility } from './utils/reactPatches';

// Basic buffer polyfill for early access
if (typeof window !== 'undefined' && !window.Buffer) {
  // Use type assertion to work around TypeScript errors with Buffer types
  window.Buffer = {
    from: function(data: any, encoding?: BufferEncoding) {
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
  if (!('kB' in window)) {
    (window as any).kB = {
      from: function(data: any, encoding?: BufferEncoding) {
        return (window.Buffer as any).from(data, encoding);
      },
      alloc: function(size: number, fill?: any) {
        return (window.Buffer as any).alloc(size, fill);
      }
    };
  }
}

// Call React compatibility function if it exists
ensureReactCompatibility();

console.log('Polyfills loaded successfully');
