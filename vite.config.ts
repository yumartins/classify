import { resolve } from "path"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"

export default defineConfig({
  base: "/",

  root: "src",

  mode: "production",

  build: {
    outDir: resolve(__dirname, "lib/dist"),

    assetsDir: "./",

    emptyOutDir: true,

    rollupOptions: {
      input: {
        configuration: "./src/modules/configuration/index.tsx",
      },

      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
  },

  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },

  plugins: [react()],

  optimizeDeps: {
    include: ["react/jsx-runtime"],
  },
})
