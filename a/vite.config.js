import path from 'path';
import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import compress from 'vite-plugin-compress';
import viteEslint from '@ehutch79/vite-eslint';

export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src'),
      },
    ],
  },
  server: {
    open: true,
  },
  plugins: [reactRefresh(), compress(), viteEslint({ include: ['src/**/*{.js,.jsx,.ts,.tsx}'] })],
  build: {
    target: 'esnext',
  },
});
