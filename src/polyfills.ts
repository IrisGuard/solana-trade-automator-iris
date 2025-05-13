
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
    } as typeof window.process;
  } else if (!window.process.env) {
    window.process.env = {} as Record<string, string | undefined>;
  }
  
  // Ensure browser property exists
  window.process.browser = true;
}

// Global Buffer polyfill
if (typeof window !== 'undefined' && typeof window.Buffer === 'undefined') {
  // Create a simple Buffer-like implementation
  const BufferPolyfill = {
    from: function(data: any, encodingOrOffset?: string | number, length?: number) {
      if (typeof data === 'string') {
        return new Uint8Array([...data].map(c => c.charCodeAt(0)));
      }
      return new Uint8Array(data);
    },
    alloc: function(size: number, fill?: any, encoding?: string) {
      const buffer = new Uint8Array(size);
      if (fill !== undefined) {
        buffer.fill(fill);
      }
      return buffer;
    },
    allocUnsafe: function(size: number) {
      return new Uint8Array(size);
    },
    isBuffer: (obj: any) => obj instanceof Uint8Array,
    byteLength: (string: string, encoding?: string) => string.length,
    concat: function(list: Uint8Array[], totalLength?: number) {
      if (totalLength === undefined) {
        totalLength = list.reduce((acc, val) => acc + val.length, 0);
      }
      const result = new Uint8Array(totalLength);
      let offset = 0;
      for (const arr of list) {
        result.set(arr, offset);
        offset += arr.length;
      }
      return result;
    }
  };
  
  // Assign the polyfill to window.Buffer
  window.Buffer = BufferPolyfill as unknown as typeof window.Buffer;
  
  // Also create kB alias if it doesn't exist
  if (!window.kB) {
    window.kB = {
      from: (data: any, encoding?: string) => BufferPolyfill.from(data, encoding),
      alloc: (size: number, fill?: any) => BufferPolyfill.alloc(size, fill)
    } as typeof window.kB;
  }
}

// Use actual Buffer implementation from the buffer package when available
import('buffer')
  .then(bufferModule => {
    if (typeof window !== 'undefined' && bufferModule.Buffer) {
      // Replace our simplified Buffer implementation with the real one
      window.Buffer = bufferModule.Buffer as unknown as typeof window.Buffer;
      
      // Update kB as well
      if (window.kB) {
        window.kB = {
          from: bufferModule.Buffer.from.bind(bufferModule.Buffer) as typeof window.kB.from,
          alloc: bufferModule.Buffer.alloc.bind(bufferModule.Buffer) as typeof window.kB.alloc
        } as typeof window.kB;
      }
    }
  })
  .catch(err => console.warn('Buffer import failed:', err));

// Explicitly export empty object to make this a module
export {};
