
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

// Add process polyfill for browser that's compatible with the Process interface
if (typeof window !== 'undefined' && !window.process) {
  // Create a minimal process object that matches the expected type
  const process = {
    env: {} as Record<string, string | undefined>,
    browser: true,
    version: '',
    versions: {
      node: '0.0.0',
      v8: '0.0.0',
      uv: '0.0.0',
      zlib: '0.0.0',
      brotli: '0.0.0',
      ares: '0.0.0',
      modules: '0.0.0',
      nghttp2: '0.0.0',
      napi: '0.0.0',
      llhttp: '0.0.0',
      openssl: '0.0.0',
      cldr: '0.0.0',
      icu: '0.0.0',
      tz: '0.0.0',
      unicode: '0.0.0',
      electron: '0.0.0',
      chrome: '0.0.0',
      http_parser: '0.0.0'
    },
    // Add stub methods required by the Process interface
    stdout: { write: () => {}, isTTY: false } as any,
    stderr: { write: () => {}, isTTY: false } as any,
    stdin: { isTTY: false } as any,
    argv: ['', ''],
    execPath: '',
    execArgv: [],
    abort: () => {},
    chdir: () => {},
    cwd: () => '',
    exit: () => {},
    kill: () => {},
    nextTick: (callback: () => void) => { setTimeout(callback, 0) },
    umask: () => 0,
    uptime: () => 0,
    hrtime: () => [0, 0],
    memoryUsage: () => ({ rss: 0, heapTotal: 0, heapUsed: 0, external: 0, arrayBuffers: 0 }),
    pid: 0,
    ppid: 0,
    platform: 'browser',
    title: ''
  };
  
  window.process = process as any;
}

// Add kB object for backward compatibility
if (typeof window !== 'undefined' && !window.kB) {
  window.kB = {
    from: function(data: any, encoding?: string) {
      return window.Buffer ? window.Buffer.from(data, encoding as BufferEncoding) : new Uint8Array(0);
    },
    alloc: function(size: number, fill?: any) {
      return window.Buffer ? window.Buffer.alloc(size, fill) : new Uint8Array(size);
    }
  };
  
  console.log('kB polyfill loaded');
  console.log('kB available:', typeof window.kB);
  console.log('kB.alloc available:', typeof window.kB.alloc);
  console.log('kB.from available:', typeof window.kB.from);
}
