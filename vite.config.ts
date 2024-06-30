import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: "/",
  plugins: [react(), tsconfigPaths(), sentryVitePlugin({
    org: "theparthenon",
    project: "javascript-react"
  })],

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