import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        warm: {
          50: '#FDFBF7',
          100: '#FAF6F0',
          200: '#F5EDE3',
        },
        terracotta: {
          400: '#F28F7A',
          500: '#E07A5F',
          600: '#C66A50',
        },
        dark: {
          500: '#4A4D66',
          600: '#3D405B',
          700: '#2F3142',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};
export default config;
