/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#137fec",
        secondary: "#6c757d",
        success: "#28a745",
        error: "#dc2626",
        warning: "#ffc107",
        info: "#17a2b8",
        placeholder: "#a0a9b8",
        input: "#0f172a",
        label: 'slate-900',
        normal: "slate-700",
        "background-light": "#f6f7f8",
        "background-dark": "#101922",

        background: {
          light: "#f6f7f8",
          dark: "#101922",
        },
      },

      fontFamily: {
        display: ["Manrope", "sans-serif"],
      },

      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },

      fontSize: {
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
      }
    },
  },
  plugins: [],
};
