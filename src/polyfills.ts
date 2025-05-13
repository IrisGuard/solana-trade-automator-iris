
// Import the full Buffer implementation
import { Buffer } from 'buffer';

// Explicitly create all the necessary Buffer methods and properties
if (typeof window !== 'undefined') {
  // Create a complete Buffer polyfill
  window.Buffer = Buffer;
  
  // Ensure all critical Buffer methods are available
  if (!window.Buffer.prototype) window.Buffer.prototype = Buffer.prototype;
  if (!window.Buffer.from) window.Buffer.from = Buffer.from.bind(Buffer);
  if (!window.Buffer.alloc) window.Buffer.alloc = Buffer.alloc.bind(Buffer);
  if (!window.Buffer.allocUnsafe) window.Buffer.allocUnsafe = Buffer.allocUnsafe.bind(Buffer);
  if (!window.Buffer.isBuffer) window.Buffer.isBuffer = Buffer.isBuffer.bind(Buffer);
  if (!window.Buffer.concat) window.Buffer.concat = Buffer.concat.bind(Buffer);
  if (!window.Buffer.byteLength) window.Buffer.byteLength = Buffer.byteLength.bind(Buffer);
  
  // Add debugging information
  console.log('Polyfills loaded');
  console.log('Buffer available:', typeof window.Buffer);
  console.log('Buffer methods:', Object.keys(window.Buffer));
  console.log('Buffer.from available:', typeof window.Buffer.from);
  console.log('Buffer.alloc available:', typeof window.Buffer.alloc);
  console.log('Buffer.prototype available:', window.Buffer.prototype ? 'yes' : 'no');
}

// Add process polyfill for browser
if (typeof window !== 'undefined' && !window.process) {
  window.process = {
    env: {},
    browser: true,
    version: '',
    versions: { node: '0.0.0' }  // Changed from boolean to string
  };
}
