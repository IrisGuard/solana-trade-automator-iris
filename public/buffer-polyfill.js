
// Enhanced Buffer polyfill for browsers - fixes kB.alloc is not a function
(function() {
  if (typeof window !== 'undefined') {
    console.log('Buffer polyfill script running');
    
    // Check for existing Buffer implementation
    const hasBuffer = typeof window.Buffer !== 'undefined';
    const hasAlloc = hasBuffer && typeof window.Buffer.alloc === 'function';
    const hasFrom = hasBuffer && typeof window.Buffer.from === 'function';
    
    console.log('Initial Buffer check:', {
      hasBuffer,
      hasAlloc,
      hasFrom
    });
    
    // Create minimal Buffer implementation if none exists
    if (!window.Buffer) {
      console.log('Creating minimal Buffer implementation');
      
      function BufferConstructor(arg, encodingOrOffset, length) {
        if (typeof arg === 'string') {
          return new Uint8Array([...arg].map(c => c.charCodeAt(0)));
        }
        if (Array.isArray(arg) || arg instanceof Uint8Array) {
          return new Uint8Array(arg);
        }
        if (typeof arg === 'number') {
          return new Uint8Array(arg);
        }
        return new Uint8Array();
      }
      
      // Add static methods
      BufferConstructor.from = function(data, encoding) {
        console.log('Buffer.from called with:', typeof data);
        if (typeof data === 'string') {
          return new Uint8Array([...data].map(c => c.charCodeAt(0)));
        }
        return new Uint8Array(data);
      };
      
      BufferConstructor.alloc = function(size, fill) {
        console.log('Buffer.alloc called with size:', size);
        const buffer = new Uint8Array(size);
        if (fill !== undefined) {
          buffer.fill(fill);
        }
        return buffer;
      };
      
      BufferConstructor.allocUnsafe = function(size) {
        return new Uint8Array(size);
      };
      
      BufferConstructor.isBuffer = function(obj) {
        return obj instanceof Uint8Array;
      };
      
      BufferConstructor.byteLength = function(string, encoding) {
        return string.length;
      };
      
      BufferConstructor.concat = function(list, length) {
        if (length === undefined) {
          length = list.reduce((acc, val) => acc + val.length, 0);
        }
        
        const result = new Uint8Array(length);
        let offset = 0;
        
        for (let i = 0; i < list.length; i++) {
          const buf = list[i];
          result.set(buf, offset);
          offset += buf.length;
        }
        
        return result;
      };
      
      window.Buffer = BufferConstructor;
    }
    
    // Create kB alias for Buffer (used by some libraries)
    if (!window.kB) {
      console.log('Creating kB alias for Buffer');
      window.kB = {
        alloc: function(size, fill) {
          console.log('kB.alloc called with size:', size);
          if (typeof window.Buffer.alloc === 'function') {
            return window.Buffer.alloc(size, fill);
          }
          const buffer = new Uint8Array(size);
          if (fill !== undefined) {
            buffer.fill(fill);
          }
          return buffer;
        },
        from: function(data, encoding) {
          console.log('kB.from called');
          if (typeof window.Buffer.from === 'function') {
            return window.Buffer.from(data, encoding);
          }
          if (typeof data === 'string') {
            return new Uint8Array([...data].map(c => c.charCodeAt(0)));
          }
          return new Uint8Array(data);
        }
      };
    }
    
    // Test Buffer functionality
    try {
      const testBuf = window.Buffer.alloc(10);
      console.log('Buffer.alloc test successful:', testBuf.length === 10);
    } catch (e) {
      console.error('Buffer.alloc test failed:', e);
    }
  }
})();
