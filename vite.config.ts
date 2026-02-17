import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { readFileSync, writeFileSync, unlinkSync } from 'fs';

/**
 * Plugin to inline CSS into the IIFE bundle so the embed is a single file.
 */
function inlineCssPlugin(): Plugin {
  return {
    name: 'inline-css',
    enforce: 'post',
    closeBundle() {
      try {
        const cssPath = resolve(__dirname, 'dist/embed/formflow-embed.css');
        const jsPath = resolve(__dirname, 'dist/embed/formflow-embed.iife.js');
        const css = readFileSync(cssPath, 'utf-8');
        const js = readFileSync(jsPath, 'utf-8');

        // Inject CSS at the top of the JS file
        const injector = `(function(){var s=document.createElement('style');s.textContent=${JSON.stringify(css)};document.head.appendChild(s);})();\n`;
        writeFileSync(jsPath, injector + js);
        unlinkSync(cssPath);
      } catch {
        // CSS file may not exist in dev builds
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  // Library build for embed SDK
  if (mode === 'embed') {
    return {
      plugins: [react(), inlineCssPlugin()],
      build: {
        lib: {
          entry: resolve(__dirname, 'src/embed.ts'),
          name: 'FormFlow',
          fileName: 'formflow-embed',
          formats: ['iife'],
        },
        outDir: 'dist/embed',
        rollupOptions: {
          output: {
            inlineDynamicImports: true,
          },
        },
      },
      define: {
        'process.env.NODE_ENV': JSON.stringify('production'),
      },
    };
  }

  // Default: demo app build
  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
    },
  };
});
