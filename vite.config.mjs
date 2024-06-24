import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import path from "path";
import { readFile, writeFile } from "fs/promises";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

function reactVirtualized() {
  const WRONG_CODE = `import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";`;

  return {
    name: "my:react-virtualized",
    async configResolved() {
      const reactVirtualizedPath = path.dirname(
        fileURLToPath(import.meta.resolve("react-virtualized"))
      );

      const brokenFilePath = path.join(
        reactVirtualizedPath,
        "..", // back to dist
        "es",
        "WindowScroller",
        "utils",
        "onScroll.js"
      );
      const brokenCode = await readFile(brokenFilePath, "utf-8");

      const fixedCode = brokenCode.replace(WRONG_CODE, "");
      await writeFile(brokenFilePath, fixedCode);
    },
  };
}

export default defineConfig({
  plugins: [react(), tsconfigPaths(), reactVirtualized()],
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
  },
});
