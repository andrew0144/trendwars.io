import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import {resolve} from 'node:path';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? 'https://trendwars.io/' : 'https://localhost:5173/',
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.mjs',
  },
  resolve: {
    alias: {
      // /esm/icons/index.mjs exports the icons statically, so no separate chunks are created
      "@tabler/icons-react": "@tabler/icons-react/dist/esm/icons/index.mjs",
      "@/assets": resolve(__dirname, "./src/assets"),
    }
  }
}));
