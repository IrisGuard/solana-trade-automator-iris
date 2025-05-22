
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
        // Use the default JSX runtime that comes with React
        jsxImportSource: undefined,
      }),
      mode === 'development' && componentTagger(),
    ].filter(Boolean) as PluginOption[],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        // Custom bridge to fix React 18.3.1 compatibility issues
        'react/jsx-runtime': path.resolve(__dirname, "./src/react-compatibility.ts"),
        'react/jsx-dev-runtime': path.resolve(__dirname, "./src/react-compatibility.ts"),
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
        // Configure externals to improve compatibility
        external: [],
        onwarn(warning, warn) {
          if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
            return;
          }
          // Ignore "mixed named/default exports" warning for React 18.3.1
          if ((warning.code === 'MIXED_EXPORTS' || warning.code === 'CIRCULAR_DEPENDENCY') && 
              warning.id && 
              (warning.id.includes('react') || warning.id.includes('jsx-runtime'))) {
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
