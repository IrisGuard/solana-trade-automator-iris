
// Early Buffer polyfill for browsers - fixes kB.alloc is not a function
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
    
    // Always try to use the buffer module
    try {
      // Create a minimal Buffer implementation if none exists
      if (!window.Buffer) {
        console.log('Creating minimal Buffer implementation');
        
        // Minimal Buffer constructor implementation
        function BufferConstructor(arg, encodingOrOffset, length) {
          // Basic implementation to handle string conversion
          if (typeof arg === 'string') {
            return new Uint8Array([...arg].map(c => c.charCodeAt(0)));
          }
          
          // Handle array-like inputs
          if (Array.isArray(arg) || arg instanceof Uint8Array) {
            return new Uint8Array(arg);
          }
          
          // Number (size)
          if (typeof arg === 'number') {
            return new Uint8Array(arg);
          }
          
          // Default fallback
          return new Uint8Array();
        }
        
        // Add critical Buffer static methods
        BufferConstructor.from = function(data, encoding) {
          if (typeof data === 'string') {
            return new Uint8Array([...data].map(c => c.charCodeAt(0)));
          }
          return new Uint8Array(data);
        };
        
        BufferConstructor.alloc = function(size, fill) {
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
        
        // Set the minimal implementation
        window.Buffer = BufferConstructor;
      }
      
      // Dynamic import of buffer module for enhanced functionality
      import('buffer').then(bufferModule => {
        const BufferImpl = bufferModule.Buffer;
        
        // Enhance the existing Buffer implementation with proper methods
        if (!window.Buffer.alloc || typeof window.Buffer.alloc !== 'function') {
          console.log('Enhancing Buffer.alloc');
          window.Buffer.alloc = BufferImpl.alloc.bind(BufferImpl);
        }
        
        if (!window.Buffer.from || typeof window.Buffer.from !== 'function') {
          console.log('Enhancing Buffer.from');
          window.Buffer.from = BufferImpl.from.bind(BufferImpl);
        }
        
        if (!window.Buffer.allocUnsafe || typeof window.Buffer.allocUnsafe !== 'function') {
          window.Buffer.allocUnsafe = BufferImpl.allocUnsafe.bind(BufferImpl);
        }
        
        if (!window.Buffer.isBuffer || typeof window.Buffer.isBuffer !== 'function') {
          window.Buffer.isBuffer = BufferImpl.isBuffer.bind(BufferImpl);
        }
        
        if (!window.Buffer.byteLength || typeof window.Buffer.byteLength !== 'function') {
          window.Buffer.byteLength = BufferImpl.byteLength.bind(BufferImpl);
        }
        
        if (!window.Buffer.concat || typeof window.Buffer.concat !== 'function') {
          window.Buffer.concat = BufferImpl.concat.bind(BufferImpl);
        }
        
        console.log('Enhanced Buffer with proper implementation');
        console.log('Buffer.alloc available:', typeof window.Buffer.alloc === 'function');
        console.log('Buffer.from available:', typeof window.Buffer.from === 'function');
        
        // Check if methods are really functions
        try {
          const testBuf = window.Buffer.alloc(10);
          console.log('Buffer.alloc test successful:', testBuf.length === 10);
        } catch (e) {
          console.error('Buffer.alloc test failed:', e);
        }
      }).catch(err => {
        console.warn('ESM Buffer import failed:', err);
      });
    } catch (e) {
      console.warn('Error setting up Buffer polyfill:', e);
    }
  }
})();
