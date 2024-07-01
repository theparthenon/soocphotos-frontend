import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: "/",
  plugins: [react(), tsconfigPaths()],

  server: {
    host: "0.0.0.0",
    port: 3000,
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/styles/_mantine";`,
      },
    },
  }
});