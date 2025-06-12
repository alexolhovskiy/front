import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';  // Добавьте этот импорт

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'https://game-socket-4.onrender.com',// 'http://localhost:5000', //проксируем запросы к Django API
      // '/socket.io': 'https://game-socket-4.onrender.com',
      // changeOrigin: true,
      // secure: false, // ⚠️ можно убрать на проде
    },
  },
});
