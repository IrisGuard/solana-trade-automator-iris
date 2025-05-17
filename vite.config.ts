
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
        // Use custom JSX runtime implementation
        jsxImportSource: 'react',
      }),
      mode === 'development' && componentTagger(),
    ].filter(Boolean) as PluginOption[],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        // Use our custom JSX runtime implementation
        'react/jsx-runtime': path.resolve(__dirname, 'src/utils/jsx-runtime-fix.ts'),
        'react/jsx-dev-runtime': path.resolve(__dirname, 'src/utils/jsx-runtime-fix.ts'),
        // Fix polyfill path issues
        buffer: 'buffer/',
        process: 'process', 
        stream: 'stream-browserify',
        util: 'util/',
        crypto: 'crypto-browserify',
        assert: 'assert/',
        // Add React alias to ensure consistent version
        "react": path.resolve(__dirname, "node_modules/react"),
        "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
      },
      mainFields: ['browser', 'module', 'main'],
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
        // Add React and React DOM to the optimization
        'react',
        'react-dom',
        'react-router-dom',
        // Add all Radix UI components to the optimization
        '@radix-ui/react-slot',
        '@radix-ui/react-compose-refs'
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
        include: [/node_modules\/process/, /node_modules\/buffer/, /node_modules\/react-router-dom/, /node_modules\/@radix-ui/],
      },
      rollupOptions: {
        plugins: [
          // Enable rollup polyfills plugin
          rollupNodePolyFill() as any,
        ],
        onwarn(warning, warn) {
          if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
            return;
          }
          // Suppress warnings about JSX annotations
          if (warning.code === 'SOURCEMAP_ERROR' && warning.message.includes('/*#__PURE__*/')) {
            return;
          }
          warn(warning);
        },
      },
      // Ensure sourcemaps are generated
      sourcemap: true,
      // Increase build performance
      minify: 'esbuild',
    }
  };
});
