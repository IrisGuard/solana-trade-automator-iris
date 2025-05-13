
// Type definitions needed for our polyfills
declare global {
  interface Window {
    process: any;
    Buffer: any;
    kB: any;
  }
}

// Comprehensive polyfills for Solana web3.js and other Node.js dependencies
console.log("Polyfills loaded");

// Process polyfill for browser environment
if (typeof window !== 'undefined') {
  // Using 'as any' to bypass TypeScript's type checking for these polyfills
  // since we're intentionally providing simplified versions
  if (!window.process) {
    window.process = { 
      env: {}, 
      browser: true,
      // Add minimal required properties
      argv: [],
      argv0: '',
      execArgv: [],
      execPath: '',
      version: '',
      versions: {},
      exit: () => {},
      kill: () => {},
      cwd: () => '/',
    } as any;
  } else if (!window.process.env) {
    window.process.env = {} as any;
  }
  
  // Ensure browser property exists
  window.process.browser = true;
}

// Global Buffer polyfill
if (typeof window !== 'undefined' && typeof window.Buffer === 'undefined') {
  // Use 'as any' to bypass TypeScript's strict type checking
  window.Buffer = {
    from: function(data: any, encoding?: any) {
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
    },
    allocUnsafe: function(size: number) {
      return new Uint8Array(size);
    },
    // Add minimal Buffer-like interface expected by some libraries
    isBuffer: (obj: any) => obj instanceof Uint8Array,
    concat: (list: Uint8Array[], length?: number) => {
      if (length === undefined) {
        length = list.reduce((acc, val) => acc + val.length, 0);
      }
      const result = new Uint8Array(length);
      let offset = 0;
      for (const arr of list) {
        result.set(arr, offset);
        offset += arr.length;
      }
      return result;
    }
  } as any;
}

// Use actual Buffer implementation from the buffer package when available
import('buffer')
  .then(bufferModule => {
    if (typeof window !== 'undefined' && bufferModule.Buffer) {
      // Replace our simplified Buffer implementation with the real one
      window.Buffer = bufferModule.Buffer;
    }
  })
  .catch(err => console.warn('Buffer import failed:', err));

// Explicitly export empty object to make this a module
export {};
