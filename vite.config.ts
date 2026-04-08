import { defineConfig } from "vite";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json";

export default defineConfig({
  plugins: [crx({ manifest })],
  resolve: {
    alias: {
      "@content": "/src/content",
      "@utils": "/src/utils",
      "@types": "/src/types",
    },
  },
});
