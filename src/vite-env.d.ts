
/// <reference types="vite/client" />

// Global Buffer definition and Phantom wallet types
interface Window {
  React: any;
  Buffer: any;
  kB?: {
    from: (data: any, encoding?: string) => any;
    alloc: (size: number, fill?: any) => any;
  };
  phantom?: {
    solana?: {
      isPhantom: boolean;
      connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<any>;
      disconnect: () => Promise<void>;
      on: (event: string, callback: Function) => void;
      off: (event: string, callback: Function) => void;
    };
  };
  process?: {
    env: Record<string, string | undefined>;
    browser?: boolean;
    version?: string;
    versions?: {
      node: string;
      v8: string;
      uv: string;
      zlib: string;
      brotli: string;
      ares: string;
      modules: string;
      nghttp2: string;
      napi: string;
      llhttp: string;
      openssl: string;
      cldr: string;
      icu: string;
      tz: string;
      unicode: string;
      electron: string;
      chrome: string;
      http_parser: string;
    };
    stdout?: any;
    stderr?: any;
    stdin?: any;
    argv?: string[];
    execPath?: string;
    execArgv?: string[];
    abort?: () => void;
    chdir?: () => void;
    cwd?: () => string;
    exit?: () => void;
    kill?: () => void;
    nextTick?: (callback: () => void) => void;
    umask?: () => number;
    uptime?: () => number;
    hrtime?: () => [number, number];
    memoryUsage?: () => { rss: number, heapTotal: number, heapUsed: number, external: number, arrayBuffers: number };
    pid?: number;
    ppid?: number;
    platform?: string;
    title?: string;
  };
  require?: any;
}

declare module 'react-router-dom' {
  export * from 'react-router-dom';
}
