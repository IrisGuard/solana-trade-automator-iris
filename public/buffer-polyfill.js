
// Comprehensive Buffer polyfill for web browsers
(function() {
  if (typeof window !== 'undefined') {
    console.log('Buffer polyfill initializing');
    
    // Create a proper Buffer implementation
    const BufferPolyfill = function(arg, encodingOrOffset, length) {
      // Handle different constructor arguments
      if (typeof arg === 'number') {
        return new Uint8Array(arg);
      } else if (typeof arg === 'string') {
        return new TextEncoder().encode(arg);
      } else if (Array.isArray(arg) || arg instanceof Uint8Array) {
        return new Uint8Array(arg);
      }
      return new Uint8Array();
    };
    
    // Add static methods to BufferPolyfill
    BufferPolyfill.alloc = function(size, fill) {
      console.log('BufferPolyfill.alloc called with size:', size);
      const buf = new Uint8Array(size);
      if (fill !== undefined && fill !== 0) {
        buf.fill(fill);
      }
      return buf;
    };
    
    BufferPolyfill.from = function(data, encoding) {
      console.log('BufferPolyfill.from called with type:', typeof data);
      if (typeof data === 'string') {
        return new TextEncoder().encode(data);
      }
      return new Uint8Array(data);
    };
    
    // Assign to window.Buffer
    window.Buffer = BufferPolyfill;
    
    // Create the kB object explicitly (this is what's missing)
    window.kB = {
      alloc: function(size, fill) {
        console.log('kB.alloc called with size:', size);
        return BufferPolyfill.alloc(size, fill);
      },
      from: function(data, encoding) {
        console.log('kB.from called with type:', typeof data);
        return BufferPolyfill.from(data, encoding);
      }
    };
    
    console.log('Buffer polyfill initialization complete', {
      hasBuffer: typeof window.Buffer !== 'undefined', 
      haskB: typeof window.kB !== 'undefined',
      haskBAlloc: typeof window.kB.alloc === 'function'
    });
  }
})();
