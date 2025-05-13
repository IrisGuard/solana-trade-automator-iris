
import { Buffer } from 'buffer';

// Make Buffer available globally
window.Buffer = Buffer;

// Add other polyfills here as needed
console.log('Buffer polyfill loaded:', typeof window.Buffer);
