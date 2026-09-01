import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const EXCLUDE_PREFIXES = ['/portal', '/consultation-success', '/submit-review', '/prep', '/hq'];

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 5173,
    host: '0.0.0.0',
    strictPort: false
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Target modern browsers only — drops the legacy syntax transforms / polyfills
    // (~47 KiB) that were being shipped to every visitor (PageSpeed: "Legacy JS").
    target: 'es2020',
    rollupOptions: {
      output: {
        // Keep heavy, rarely-changing libraries in their own long-cacheable chunks
        // so they're shared across pages and don't get re-downloaded on each deploy.
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return;
          if (id.includes('@supabase')) return 'supabase';
          if (id.includes('marked') || id.includes('gray-matter')) return 'markdown';
          if (id.includes('lucide-react')) return 'icons';
          if (id.includes('lenis')) return 'lenis';
          if (id.includes('react-router') || id.includes('react-dom') || id.includes('/react/')) return 'react';
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react']
  },
  // vite-react-ssg options
  ssgOptions: {
    dirStyle: 'nested',
    formatting: 'minify',
    // Only prerender public marketing + blog routes; client-only app routes
    // (portal/auth/payments) stay client-rendered.
    includedRoutes(paths: string[]) {
      return paths.filter(
        (p) => !EXCLUDE_PREFIXES.some((prefix) => p === prefix || p.startsWith(prefix + '/'))
      );
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any);