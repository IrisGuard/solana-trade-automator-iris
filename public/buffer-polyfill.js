
// Comprehensive Buffer polyfill for web browsers
(function() {
  if (typeof window !== 'undefined') {
    console.log('Complete Buffer polyfill initializing');
    
    // Create a full Buffer implementation
    function BufferPolyfill(arg, encodingOrOffset, length) {
      // Handle different constructor arguments
      if (typeof arg === 'number') {
        const buf = new Uint8Array(arg);
        buf.alloc = BufferPolyfill.alloc;
        buf.from = BufferPolyfill.from;
        return buf;
      } else if (typeof arg === 'string') {
        const buf = new TextEncoder().encode(arg);
        buf.alloc = BufferPolyfill.alloc;
        buf.from = BufferPolyfill.from;
        return buf;
      } else if (Array.isArray(arg) || arg instanceof Uint8Array) {
        const buf = new Uint8Array(arg);
        buf.alloc = BufferPolyfill.alloc;
        buf.from = BufferPolyfill.from;
        return buf;
      }
      return new Uint8Array();
    }
    
    // Add static methods to Buffer
    BufferPolyfill.alloc = function(size, fill) {
      console.log('BufferPolyfill.alloc called with size:', size);
      const buf = new Uint8Array(size);
      if (fill !== undefined) {
        buf.fill(fill);
      }
      buf.alloc = BufferPolyfill.alloc;
      buf.from = BufferPolyfill.from;
      return buf;
    };
    
    BufferPolyfill.from = function(data, encoding) {
      console.log('BufferPolyfill.from called with type:', typeof data);
      if (typeof data === 'string') {
        const buf = new TextEncoder().encode(data);
        buf.alloc = BufferPolyfill.alloc;
        buf.from = BufferPolyfill.from;
        return buf;
      }
      const buf = new Uint8Array(data);
      buf.alloc = BufferPolyfill.alloc;
      buf.from = BufferPolyfill.from;
      return buf;
    };
    
    // Create a global kB object specifically since this is what's causing errors
    window.kB = {
      alloc: BufferPolyfill.alloc,
      from: BufferPolyfill.from
    };
    
    // Also provide the normal Buffer global
    window.Buffer = BufferPolyfill;
    Buffer.alloc = BufferPolyfill.alloc;
    Buffer.from = BufferPolyfill.from;
    
    console.log('Buffer polyfill fully initialized', {
      hasBuffer: typeof window.Buffer !== 'undefined',
      hasAlloc: typeof window.Buffer.alloc === 'function',
      hasFrom: typeof window.Buffer.from === 'function',
      haskB: typeof window.kB !== 'undefined',
      haskBAlloc: typeof window.kB.alloc === 'function'
    });
  }
})();
