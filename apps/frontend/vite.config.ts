import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Expose to Docker container network
    port: 5173, // Fixed port for Docker mapping
    strictPort: true, // Error if port is busy
  },
  build: {
    chunkSizeWarningLimit: 550,
  },
});
