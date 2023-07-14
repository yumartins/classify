import { resolve } from "path"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"

export default defineConfig({
  base: "/",

  root: "src",

  mode: "production",

  build: {
    outDir: resolve(__dirname, "dist"),

    assetsDir: "./",

    emptyOutDir: true,

    rollupOptions: {
      input: "./src/index.tsx",

      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
  },

  resolve: {
    alias: {
      "~": resolve(__dirname, "./node_modules"),
    },
  },

  plugins: [react()],

  optimizeDeps: {
    include: ["react/jsx-runtime"],
  },
})
