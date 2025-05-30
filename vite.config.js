import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true,
    allowedHosts: 'all' // 👈 esto permite ngrok
  }
});
