import path from 'path';
import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';

export default defineConfig({
  plugins: [
    reactRefresh(),
    {
      name: 'html-relative-modules',
      transformIndexHtml: html => html.replace(/"\/assets\//g, '"./assets/'),
    },
  ],
  root: './src/renderer',
  build: {
    target: 'modules',
    outDir: '../../dist',
  },
  resolve: {
    alias: [
      {
        find: '@/renderer',
        replacement: path.resolve(__dirname, 'src/renderer'),
      },
      {
        find: '@/common',
        replacement: path.resolve(__dirname, 'src/common'),
      },
    ],
  },
});
