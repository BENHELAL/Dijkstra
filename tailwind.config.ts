import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 32px rgba(37, 99, 235, 0.22)",
        route: "0 0 34px rgba(245, 158, 11, 0.42)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Arial", "sans-serif"]
      }
    }
  },
  plugins: []
} satisfies Config;
