
/// <reference types="vite/client" />

// Global Buffer definition and Phantom wallet types
interface Window {
  Buffer: typeof Buffer & {
    from: (data: any, encodingOrOffset?: string | number, length?: number) => Buffer;
    alloc: (size: number, fill?: any, encoding?: string) => Buffer;
    allocUnsafe: (size: number) => Buffer;
    isBuffer: (obj: any) => boolean;
    byteLength: (string: string, encoding?: string) => number;
    concat: (list: Uint8Array[], totalLength?: number) => Buffer;
    prototype: Buffer;
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
    };
  };
}
