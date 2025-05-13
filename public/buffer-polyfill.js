
// Early Buffer polyfill for browsers
(function() {
  if (typeof window !== 'undefined') {
    try {
      // Try to use the buffer module if available (for module environments)
      if (typeof require === 'function') {
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
            if (!window.Buffer.byteLength) window.Buffer.byteLength = bufferModule.Buffer.byteLength.bind(bufferModule.Buffer);
            if (!window.Buffer.concat) window.Buffer.concat = bufferModule.Buffer.concat.bind(bufferModule.Buffer);
            
            console.log('Buffer polyfill successfully loaded from script tag using require');
          }
        }
      }
    } catch (e) {
      console.warn('Failed to load buffer from require, creating minimal polyfill:', e);
      
      // Create a minimal Buffer polyfill if require is not available or failed
      if (!window.Buffer) {
        const INSPECT_MAX_BYTES = 50;
        
        // Define a minimal Buffer class for early access
        function MinimalBuffer(arg, encodingOrOffset, length) {
          // Basic implementation that handles common use cases
          if (typeof arg === 'number') {
            this.length = arg > 0 ? Math.floor(arg) : 0;
            this.fill(0);
          } else if (Array.isArray(arg) || (arg && arg.buffer instanceof ArrayBuffer)) {
            this.length = arg.length;
            for (let i=0; i < this.length; i++) {
              this[i] = arg[i] & 255;
            }
          } else if (typeof arg === 'string') {
            // Simple string handling (just store character codes)
            this.length = arg.length;
            for (let i=0; i < this.length; i++) {
              this[i] = arg.charCodeAt(i) & 255;
            }
          } else if (arg === null || arg === undefined) {
            this.length = 0;
          } else {
            this.length = 0;
            console.warn("Unhandled Buffer constructor argument type:", typeof arg);
          }
        }
        
        // Add common methods
        MinimalBuffer.prototype.fill = function(val) {
          for (let i=0; i < this.length; i++) {
            this[i] = val & 255;
          }
          return this;
        };
        
        MinimalBuffer.prototype.toString = function(encoding) {
          if (!encoding || encoding === 'utf8' || encoding === 'utf-8') {
            let result = '';
            for (let i=0; i < this.length; i++) {
              result += String.fromCharCode(this[i]);
            }
            return result;
          }
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
              buf[i] = value.charCodeAt(i) & 255;
            }
            return buf;
          }
          
          // Handle ArrayBuffer
          if (value instanceof ArrayBuffer) {
            const view = new Uint8Array(value);
            const buf = new MinimalBuffer(view.length);
            for (let i=0; i < view.length; i++) {
              buf[i] = view[i];
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
        
        // Add byteLength method
        MinimalBuffer.byteLength = function(string, encoding) {
          if (typeof string !== 'string') {
            return 0;
          }
          return string.length;
        };
        
        window.Buffer = MinimalBuffer;
        console.log('Enhanced minimal Buffer polyfill created');
      }
    }
  }
})();
