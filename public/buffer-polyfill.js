
// Early Buffer polyfill for browsers
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
      // For ESM environments
      import('buffer').then(bufferModule => {
        const BufferImpl = bufferModule.Buffer;
        
        if (!window.Buffer || !window.Buffer.alloc) {
          console.log('Setting up Buffer from ESM import');
          window.Buffer = BufferImpl;
        }
        
        // Ensure all methods are properly bound
        if (window.Buffer && !window.Buffer.alloc) window.Buffer.alloc = BufferImpl.alloc.bind(BufferImpl);
        if (window.Buffer && !window.Buffer.from) window.Buffer.from = BufferImpl.from.bind(BufferImpl);
        if (window.Buffer && !window.Buffer.allocUnsafe) window.Buffer.allocUnsafe = BufferImpl.allocUnsafe.bind(BufferImpl);
        if (window.Buffer && !window.Buffer.isBuffer) window.Buffer.isBuffer = BufferImpl.isBuffer.bind(BufferImpl);
        if (window.Buffer && !window.Buffer.byteLength) window.Buffer.byteLength = BufferImpl.byteLength.bind(BufferImpl);
        
        console.log('Buffer polyfill complete from ESM:', { 
          hasAlloc: typeof window.Buffer.alloc === 'function',
          hasFrom: typeof window.Buffer.from === 'function'
        });
      }).catch(err => {
        console.warn('ESM Buffer import failed:', err);
        fallbackBufferSetup();
      });
    } catch (e) {
      console.warn('Error importing buffer module:', e);
      fallbackBufferSetup();
    }
    
    function fallbackBufferSetup() {
      console.log('Using fallback Buffer setup');
      
      // Try CommonJS-style require if available
      if (typeof require === 'function') {
        try {
          const bufferModule = require('buffer/');
          
          if (!window.Buffer || !window.Buffer.alloc) {
            window.Buffer = bufferModule.Buffer;
          }
          
          // Ensure critical methods are available
          if (window.Buffer) {
            if (!window.Buffer.from) window.Buffer.from = bufferModule.Buffer.from.bind(bufferModule.Buffer);
            if (!window.Buffer.alloc) window.Buffer.alloc = bufferModule.Buffer.alloc.bind(bufferModule.Buffer);
            if (!window.Buffer.allocUnsafe) window.Buffer.allocUnsafe = bufferModule.Buffer.allocUnsafe.bind(bufferModule.Buffer);
            if (!window.Buffer.isBuffer) window.Buffer.isBuffer = bufferModule.Buffer.isBuffer.bind(bufferModule.Buffer);
            if (!window.Buffer.byteLength) window.Buffer.byteLength = bufferModule.Buffer.byteLength.bind(bufferModule.Buffer);
            if (!window.Buffer.concat) window.Buffer.concat = bufferModule.Buffer.concat.bind(bufferModule.Buffer);
            
            console.log('Buffer polyfill loaded via require');
          }
        } catch (requireErr) {
          console.warn('Failed to load buffer via require:', requireErr);
        }
      }
    }
  }
})();
