import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      tailwindcss(),    
    ],
    define: {
      "process.env": env,
      'import.meta.env.VITE_GMAPS_API_KEY': JSON.stringify('AIzaSyC6OO39gLvWbZpMzBiLSs1pGNehjJbr2Vg')
    },

    server: {
      port: 5173,
      allowedHosts: ["188.226.136.7"],
      proxy: {
        '/admins': {
          target: 'https://user-api.resque.ng/',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path
        },
        '/lastmadmins': {
          target: 'https://user-api.resque.ng/',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/lastmadmins/, '/lastmadmins')
        },
        '/maps': {
          target: 'https://maps.googleapis.com',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/maps\//, '/maps/api/'), // Fixed this line
        },
        '/wallet': {
          target: 'https://booking-service.resque.ng',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/wallet/, '/admins') // This is correct for your use case
        }
      }
    },

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});