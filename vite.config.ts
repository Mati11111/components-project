import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  base: "/componentes/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@screens": path.resolve(__dirname, "./src/screens"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@lib": path.resolve(__dirname, "./src/lib"),
    },
  },
});
