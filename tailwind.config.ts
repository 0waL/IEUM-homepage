import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          950: "#2e1065",
        },
      },
      fontFamily: {
        sans: ["var(--font-pretendard)", "Pretendard", "system-ui", "sans-serif"],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: "#a1a1aa",
            h1: { color: "#fafafa" },
            h2: { color: "#fafafa" },
            h3: { color: "#fafafa" },
            a: { color: "#a78bfa" },
            strong: { color: "#fafafa" },
            code: {
              color: "#a78bfa",
              backgroundColor: "#18181b",
              padding: "0.1em 0.4em",
              borderRadius: "0.35rem",
            },
            pre: {
              backgroundColor: "#18181b",
              borderColor: "#27272a",
            },
            blockquote: {
              color: "#a1a1aa",
              borderLeftColor: "#7c3aed",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
