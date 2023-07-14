import type { Config } from "tailwindcss"

export default {
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
  },

  plugins: [require("tailwindcss-animate")],

  content: [
    "src/*.tsx",
    "src/**/*.tsx",
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
  ],
} satisfies Config
