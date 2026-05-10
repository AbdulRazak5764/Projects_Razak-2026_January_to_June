import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/ai': {
        target: 'https://text.pollinations.ai/prompt',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ai\//, '')
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
