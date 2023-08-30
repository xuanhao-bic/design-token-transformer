import { defineConfig } from "tsup"

export default defineConfig({
  clean: true,
  dts: true,
  entry: ["index.ts"],
  sourcemap: true,
  target: "esnext",
  outDir: "dist",
})