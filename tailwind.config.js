/** @type {import('tailwindcss').Config} */

const { colors } = require("./src/shared/theme/colors.js");
const { metrics } = require("./src/shared/theme/metrics.js");
const { typography } = require("./src/shared/theme/typography.js");

module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      // --- 1. COLORS CONFIGURATION ---
      colors: {
        // Load the entire original palette (enables classes like bg-slate-500, text-red-600)
        ...colors,

        // MAPPING FOR BNA UI (Semantic Grouping)
        primary: {
          DEFAULT: colors.primary,
          foreground: colors.primaryForeground,
        },
        secondary: {
          DEFAULT: colors.secondary,
          foreground: colors.secondaryForeground,
        },
        destructive: {
          DEFAULT: colors.destructive,
          foreground: colors.destructiveForeground,
        },
        muted: {
          DEFAULT: colors.muted,
          foreground: colors.mutedForeground,
        },
        accent: {
          DEFAULT: colors.accent,
          foreground: colors.accentForeground,
        },
        popover: {
          DEFAULT: colors.popover,
          foreground: colors.popoverForeground,
        },
        card: {
          DEFAULT: colors.card,
          foreground: colors.cardForeground,
        },

        // Standalone UI variables
        background: colors.background,
        foreground: colors.foreground,

        // Form & Border Mappings
        // Note: Your colors.border is an object { DEFAULT, focus }
        border: colors.border.DEFAULT,
        input: colors.input,
        ring: colors.ring,
      },

      // Specific config for Border Color to support focus states
      borderColor: {
        DEFAULT: colors.border.DEFAULT,
        focus: colors.border.focus, // Enables class: border-focus
        ...colors,
      },

      // --- 2. TYPOGRAPHY CONFIGURATION ---
      fontFamily: {
        ...typography.fontFamily,
      },
      fontWeight: {
        ...typography.fontWeight,
      },
      lineHeight: {
        ...typography.lineHeight,
      },
      fontSize: {
        'xs': `${typography.fontSize.xs}px`,
        'sm': `${typography.fontSize.sm}px`,
        'base': `${typography.fontSize.base}px`,
        'lg': `${typography.fontSize.lg}px`,
        'xl': `${typography.fontSize.xl}px`,
        '2xl': `${typography.fontSize['2xl']}px`,
        '3xl': `${typography.fontSize['3xl']}px`,
        '4xl': `${typography.fontSize['4xl']}px`,
        '5xl': `${typography.fontSize['5xl']}px`,
        '6xl': `${typography.fontSize['6xl']}px`,
      },

      // --- 3. METRICS CONFIGURATION ---
      spacing: {
        ...metrics.spacing, // Enables classes: p-md (16px), m-xl (32px)
      },

      borderRadius: {
        ...metrics.borderRadius, // Enables classes: rounded-primary (6px), rounded-lg (12px)
      },

      // Mapping Height for Controls (Utility derived from metrics.layout)
      height: {
        'control-xs': metrics.layout.controlHeight.xs,
        'control-sm': metrics.layout.controlHeight.sm,
        'control-md': metrics.layout.controlHeight.md,
        'control-lg': metrics.layout.controlHeight.lg,
        'control-xl': metrics.layout.controlHeight.xl,
        ...metrics.spacing, // Inherit standard spacing for height
      },

      transitionDuration: {
        'slower': `${metrics.motion.duration.slower}ms`,
        'slow': `${metrics.motion.duration.slow}ms`,
        'normal': `${metrics.motion.duration.normal}ms`,
        'fast': `${metrics.motion.duration.fast}ms`,
      },

      maxWidth: {
        'screen-sm': `${metrics.layout.container.sm}px`,
        'screen-md': `${metrics.layout.container.md}px`,
        'screen-lg': `${metrics.layout.container.lg}px`,
        'screen-xl': `${metrics.layout.container.xl}px`,
      }
    },
  },
  plugins: [],
};