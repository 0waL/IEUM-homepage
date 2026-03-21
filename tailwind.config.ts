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
          50: "#f0f4ff",
          100: "#e0e9ff",
          200: "#c7d7fe",
          300: "#a5bbfc",
          400: "#8196f8",
          500: "#6272f1",
          600: "#4f56e5",
          700: "#4044ca",
          800: "#3538a3",
          900: "#303481",
          950: "#1d1f4c",
        },
      },
      fontFamily: {
        sans: ["var(--font-pretendard)", "Pretendard", "system-ui", "sans-serif"],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: "#374151",
            h1: { color: "#111827" },
            h2: { color: "#111827" },
            h3: { color: "#111827" },
            a: { color: "#4f56e5" },
            code: {
              color: "#4f56e5",
              backgroundColor: "#f0f4ff",
              padding: "0.1em 0.3em",
              borderRadius: "0.25rem",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
