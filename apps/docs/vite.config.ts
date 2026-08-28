import { resolve } from "node:path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { stylexVite } from "./stylex-vite.js"

export default defineConfig({
  root: resolve(import.meta.dirname),
  base: process.env.VITE_BASE_PATH ?? "/",
  plugins: [stylexVite(), react()],
  resolve: {
    alias: {
      "@nifrajs/ui": resolve(
        import.meta.dirname,
        "../../packages/ui/src/index.ts",
      ),
      "@nifrajs/ui-registry": resolve(
        import.meta.dirname,
        "../../packages/ui-registry/src/index.ts",
      ),
      "@nifrajs/ui-adapters": resolve(
        import.meta.dirname,
        "../../packages/ui-adapters/src/index.ts",
      ),
      "@nifrajs/ui-screens": resolve(
        import.meta.dirname,
        "../../packages/ui-screens/src/index.ts",
      ),
    },
  },
  server: { port: 4178, host: "127.0.0.1" },
  build: {
    outDir: resolve(import.meta.dirname, "../../dist/docs"),
    emptyOutDir: true,
  },
})
