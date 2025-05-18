import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";



export default defineConfig(({ mode }) => {
  // Load environment variables based on the mode (development or production)
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
      tailwindcss(),    
    ],
    define: {
      "process.env": env,
    },

    server: {
      port: 5173,
      allowedHosts: [""],
      proxy: {
        '/admins': {
          target: 'https://resq-user.onrender.com/',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path
        },
      }
    },

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
