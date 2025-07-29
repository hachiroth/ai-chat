import { defineConfig } from 'tsup'

export default defineConfig({
  format: ['esm'],
  entry: ["index.ts"],
  dts: true,
  clean: true,
  outDir: 'dist',
})
