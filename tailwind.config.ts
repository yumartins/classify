import type { Config } from "tailwindcss"
import { fontFamily } from "tailwindcss/defaultTheme"

export default {
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
      },
    },

    container: {
      center: true,
      padding: "2rem",
    },

    fontFamily: {
      sans: ["Inter", ...fontFamily.sans],
    },
  },

  content: [
    "./src/*.tsx",
    "./lib/*.php",
    "./lib/**/*.php",
    "./src/**/*.tsx",
    "./src/**/*.scss",
    "./src/**/**/*.tsx",
  ],

  corePlugins: {
    preflight: false,
  },
} satisfies Config
