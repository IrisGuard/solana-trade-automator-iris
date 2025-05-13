
// Βασικό polyfill για το Buffer
if (typeof window !== 'undefined') {
  // Έλεγχος αν το Buffer υπάρχει
  const hasBuffer = typeof window.Buffer !== 'undefined';
  
  if (!hasBuffer) {
    console.log('Initializing Buffer polyfill in polyfills.ts');
    
    // Αυτό έχει ήδη οριστεί στο index.html, αυτό είναι backup
    if (!window.Buffer) {
      console.log('Creating Buffer fallback in polyfills.ts');
    }
  }

  // Έλεγχος για το kB
  if (!window.kB) {
    console.log('Creating kB fallback in polyfills.ts');
    window.kB = {
      alloc: function(size, fill) {
        if (window.Buffer && typeof window.Buffer.alloc === 'function') {
          return window.Buffer.alloc(size, fill);
        } else {
          const buffer = new Uint8Array(size);
          if (fill !== undefined) {
            buffer.fill(fill);
          }
          return buffer;
        }
      },
      from: function(data, encoding) {
        if (window.Buffer && typeof window.Buffer.from === 'function') {
          return window.Buffer.from(data, encoding);
        } else {
          if (typeof data === 'string') {
            return new Uint8Array([...data].map(c => c.charCodeAt(0)));
          }
          return new Uint8Array(data);
        }
      }
    };
  }
}

// Ορίζουμε global για χρήση σε άλλα modules
declare global {
  interface Window {
    Buffer: any;
    kB: any;
  }
}

export {}; // Απαιτείται για να κάνουμε αυτό το αρχείο module
