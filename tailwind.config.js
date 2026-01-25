/** @type {import('tailwindcss').Config} */
const themeColors = require("./src/shared/theme/colors");
const themeMetrics = require("./src/shared/theme/metrics");
const themeTypography = require("./src/shared/theme/typography");

/**
 * Tailwind Config - Design System Integration
 *
 * Imports design tokens from the centralized source of truth:
 * - colors.js: Color palette and semantic color mappings
 * - metrics.js: Spacing, border radius, and layout dimensions
 * - typography.js: Font families, sizes, weights, and line heights
 */
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
        ...themeColors,
      },
      textColor: {
        main: themeColors.text.main,
        sub: themeColors.text.sub,
        muted: themeColors.text.muted,
        inverse: themeColors.text.inverse,

        error: themeColors.status.error,

        ...themeColors,
      },

      borderColor: {
        DEFAULT: themeColors.border,
        ...themeColors,
      },

      fontFamily: {
        ...themeTypography.fontFamily,
      },

      fontSize: {
        ...Object.entries(themeTypography.fontSize).reduce((acc, [key, value]) => {
          acc[key] = `${value}px`;
          return acc;
        }, {}),
      },

      fontWeight: {
        ...themeTypography.fontWeight,
      },

      lineHeight: {
        ...themeTypography.lineHeight,
      },

      spacing: {
        ...themeMetrics.spacing,
      },

      borderRadius: {
        ...themeMetrics.borderRadius,
      },

      transitionDuration: {
        ...Object.entries(themeMetrics.duration).reduce((acc, [key, value]) => {
          acc[key] = `${value}ms`;
          return acc;
        }, {}),
      },
    },
  },
  plugins: [],
};
