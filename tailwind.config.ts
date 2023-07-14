import type { Config } from "tailwindcss"

export default {
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
  },

  plugins: [require("@headlessui/tailwindcss")],

  content: ["./src/*.tsx", "./src/**/*.tsx"],
} satisfies Config
