import path from 'path';
import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';

export default defineConfig({
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, 'src')
      }
    ]
  },
  server: {
    open: true
  },
  plugins: [
    reactRefresh()
  ],
  build: {
    target: "modules"
  }
});