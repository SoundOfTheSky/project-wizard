import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: [
      {
        find: "@/renderer",
        replacement: path.resolve(__dirname, 'src/renderer')
      },
      {
        find: "@/common",
        replacement: path.resolve(__dirname, 'src/common')
      }
    ]
  },
  plugins: [
    {
      name: "html-relative-modules",
      transformIndexHtml: html => html.replace(/"\/assets\//g, '"./assets/')
    }
  ],
  root: "./src/renderer",
  build: {
    outDir: "../../dist"
  }
});