
/// <reference types="vite/client" />

// Global buffer definition
interface Window {
  React: typeof import('react');
  require: NodeRequire;
  Buffer: typeof Buffer;
  kB: {
    from: (data: any, encoding?: string) => Uint8Array;
    alloc: (size: number, fill?: any) => Uint8Array;
  };
  global: Window;
}

// Define global Buffer typing
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
  }
  interface Global {
    Buffer: typeof Buffer;
  }
}

// React Router DOM override
declare module 'react-router-dom' {
  export * from '@/lib/router-exports';
}
