import path from 'path';
import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';

export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src'),
      },
    ],
  },
  build: {
    rollupOptions: {
      external: [
        '@nestjs/microservices',
        '@nestjs/microservices/microservices-module',
        '@nestjs/websockets/socket-module',
        'class-transformer',
        'class-validator',
        'cache-manager',
      ],
    },
  },
  plugins: [
    ...VitePluginNode({
      server: 'nest',
      appPath: './index.ts',
      port: 3000,
      tsCompiler: 'swc',
    }),
  ],
  ssr: {
    external: [
      '@nestjs/microservices',
      '@nestjs/microservices/microservices-module',
      '@nestjs/websockets/socket-module',
      'class-transformer',
      'class-validator',
      'cache-manager',
    ],
  },
});
