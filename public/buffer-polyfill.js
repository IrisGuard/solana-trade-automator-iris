
// Early Buffer polyfill for browsers
(function() {
  if (typeof window !== 'undefined') {
    try {
      // Try to use the buffer module
      const bufferModule = require('buffer/');
      
      if (!window.Buffer) {
        // Create Buffer constructor
        window.Buffer = bufferModule.Buffer;
        
        // Ensure critical Buffer methods are available
        if (window.Buffer) {
          if (!window.Buffer.from) window.Buffer.from = bufferModule.Buffer.from.bind(bufferModule.Buffer);
          if (!window.Buffer.alloc) window.Buffer.alloc = bufferModule.Buffer.alloc.bind(bufferModule.Buffer);
          if (!window.Buffer.allocUnsafe) window.Buffer.allocUnsafe = bufferModule.Buffer.allocUnsafe.bind(bufferModule.Buffer);
          if (!window.Buffer.isBuffer) window.Buffer.isBuffer = bufferModule.Buffer.isBuffer.bind(bufferModule.Buffer);
          
          console.log('Buffer polyfill successfully loaded from script tag');
        }
      }
    } catch (e) {
      console.warn('Failed to load buffer from require, creating minimal polyfill:', e);
      
      // Create a minimal Buffer polyfill
      if (!window.Buffer) {
        const INSPECT_MAX_BYTES = 50;
        
        // Define a minimal Buffer class for early access
        function MinimalBuffer(arg, encodingOrOffset, length) {
          // Implementation
          if (typeof arg === 'number') {
            this.length = arg > 0 ? Math.floor(arg) : 0;
            this.fill(0);
          } else if (typeof arg === 'object') {
            this.length = arg.length;
            for (let i=0; i < this.length; i++) {
              this[i] = arg[i];
            }
          }
        }
        
        // Add common methods
        MinimalBuffer.prototype.fill = function(val) {
          for (let i=0; i < this.length; i++) {
            this[i] = val;
          }
          return this;
        };
        
        MinimalBuffer.prototype.toString = function() {
          return '[object Buffer]';
        };
        
        // Static methods
        MinimalBuffer.alloc = function(size, fill, encoding) {
          const buf = new MinimalBuffer(size);
          if (fill !== undefined) {
            buf.fill(fill);
          }
          return buf;
        };
        
        MinimalBuffer.allocUnsafe = function(size) {
          return new MinimalBuffer(size);
        };
        
        MinimalBuffer.from = function(value, encodingOrOffset, length) {
          if (Array.isArray(value)) {
            return new MinimalBuffer(value);
          }
          
          // Handle string case
          if (typeof value === 'string') {
            const buf = new MinimalBuffer(value.length);
            for (let i=0; i < value.length; i++) {
              buf[i] = value.charCodeAt(i);
            }
            return buf;
          }
          
          return new MinimalBuffer(0);
        };
        
        MinimalBuffer.isBuffer = function(obj) {
          return obj instanceof MinimalBuffer;
        };
        
        MinimalBuffer.concat = function(list, totalLength) {
          if (list.length === 0) return new MinimalBuffer(0);
          
          if (totalLength === undefined) {
            totalLength = 0;
            for (let i=0; i < list.length; i++) {
              totalLength += list[i].length;
            }
          }
          
          const buffer = new MinimalBuffer(totalLength);
          let pos = 0;
          for (let i=0; i < list.length; i++) {
            const buf = list[i];
            for (let j=0; j < buf.length; j++) {
              buffer[pos] = buf[j];
              pos++;
            }
          }
          return buffer;
        };
        
        window.Buffer = MinimalBuffer;
        console.log('Minimal Buffer polyfill created');
      }
    }
  }
})();
