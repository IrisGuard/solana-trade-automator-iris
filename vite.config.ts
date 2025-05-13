
import { defineConfig, type ConfigEnv, type PluginOption } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => {
  // Basic configuration that works with Vite's types
  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
    ].filter(Boolean) as PluginOption[],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        // Fix polyfill path issues - explicitly map each required polyfill
        buffer: 'buffer/',
        // Fix the process polyfill path - important change
        process: 'process', // Modified from 'process/browser' to just 'process'
        stream: 'stream-browserify',
        util: 'util/',
        crypto: 'crypto-browserify',
        assert: 'assert/',
      },
    },
    define: {
      // Node.js polyfills
      global: 'globalThis',
      'process.env': '{}',
      // Add Buffer to the global scope
      Buffer: ['buffer', 'Buffer'],
    },
    optimizeDeps: {
      esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
          global: 'globalThis',
        },
        plugins: [
          NodeGlobalsPolyfillPlugin({
            buffer: true,
            process: true,
          }) as any, // Type assertion to avoid TypeScript errors
        ],
      },
      include: [
        'buffer', 
        'process', // Changed from 'process/browser' to just 'process'
        'stream-browserify', 
        'util/', 
        'crypto-browserify',
        'assert/',
        '@solana/web3.js',
        '@solana/spl-token',
        '@solana/wallet-adapter-base',
        '@solana/wallet-adapter-react'
      ],
    },
    build: {
      commonjsOptions: {
        transformMixedEsModules: true,
        // Add explicit includes for process module
        include: [/node_modules\/process/, /node_modules\/buffer/],
      },
      rollupOptions: {
        plugins: [
          // Enable rollup polyfills plugin
          rollupNodePolyFill() as any,
        ],
        // Add external to prevent Rollup from trying to bundle process
        external: ['process/browser'],
        onwarn(warning, warn) {
          if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
            return;
          }
          warn(warning);
        },
      },
    }
  };
});
