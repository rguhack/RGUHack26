import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import viteCompression from "vite-plugin-compression";

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), viteCompression({ algorithm: "brotliCompress" })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
