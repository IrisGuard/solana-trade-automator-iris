
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
      react({
        // Use options that are actually supported by the SWC React plugin
        tsDecorators: true,
        // Use our custom JSX runtime with hooks
        jsxImportSource: "react",
      }),
      mode === 'development' && componentTagger(),
    ].filter(Boolean) as PluginOption[],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        // Fix JSX runtime issue with CORRECT absolute paths
        'react/jsx-runtime': path.resolve(__dirname, "./src/jsx-runtime-bridge.ts"),
        'react/jsx-dev-runtime': path.resolve(__dirname, "./src/jsx-runtime-bridge.ts"),
        // Add explicit references to React hooks modules
        'react-router-dom': path.resolve(__dirname, "./node_modules/react-router-dom"),
        'react': path.resolve(__dirname, "./node_modules/react"),
        // Fix polyfill path issues - explicitly map each required polyfill
        buffer: 'buffer/',
        // Fix the process polyfill path - important change
        process: 'process', 
        stream: 'stream-browserify',
        util: 'util/',
        crypto: 'crypto-browserify',
        assert: 'assert/',
      },
      mainFields: ['browser', 'module', 'main'],
      // Add dedupe to avoid duplicate React instances
      dedupe: ['react', 'react-dom', 'react-router-dom']
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
        'process', 
        'stream-browserify', 
        'util/', 
        'crypto-browserify',
        'assert/',
        '@solana/web3.js',
        '@solana/spl-token',
        '@solana/wallet-adapter-base',
        '@solana/wallet-adapter-react',
        // Make sure React and React Router are optimized
        'react',
        'react-dom',
        'react-router-dom',
        // Include specific hooks that are causing issues
        'react/jsx-runtime',
        'react/jsx-dev-runtime'
      ],
      // Force optimization of problematic dependencies
      force: true,
    },
    build: {
      commonjsOptions: {
        transformMixedEsModules: true,
        // Improve CommonJS handling for React
        requireReturnsDefault: 'auto',
        // Add explicit includes for process module
        include: [/node_modules\/process/, /node_modules\/buffer/, /node_modules\/react-router-dom/],
      },
      rollupOptions: {
        plugins: [
          // Enable rollup polyfills plugin
          rollupNodePolyFill() as any,
        ],
        // IMPORTANT: Remove React from external to ensure proper bundling
        external: ['process/browser'],
        onwarn(warning, warn) {
          if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
            return;
          }
          warn(warning);
        },
        // Ensure React Router has access to React hooks
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'react-router': ['react-router-dom'],
          },
        },
      },
      // Ensure sourcemaps are generated
      sourcemap: true,
      // Increase build performance
      minify: 'esbuild',
      // Improve chunk size
      chunkSizeWarningLimit: 1000,
    }
  };
});
