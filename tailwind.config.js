/** @type {import('tailwindcss').Config} */

/**
 * Shared color tokens imported from the design-system layer.
 * Map semantic tokens first (`canvas`, `surface`, `text*`) and only use raw
 * palette keys for migration/compatibility utilities.
 */
const { colors } = require("./src/shared/theme/colors.js");
/**
 * Shared spatial, sizing, and motion tokens.
 * Keep component dimensions and spacing aligned by consuming these values via
 * Tailwind utilities rather than raw numeric classes.
 */
const { metrics } = require("./src/shared/theme/metrics.js");
/**
 * Shared typography tokens for font families, weights, sizes, and line heights.
 * Use to keep text rhythm consistent across features and avoid ad-hoc text styles.
 */
const { typography } = require("./src/shared/theme/typography.js");

/**
 * Tailwind/NativeWind configuration that translates design-system tokens into
 * utility classes used by app components.
 */
module.exports = {
  /**
   * Source files scanned for class usage.
   * Keep this list aligned with app folder structure so generated utilities stay
   * complete and unused CSS does not accumulate.
   */
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  /** NativeWind preset enables React Native-compatible Tailwind behavior. */
  presets: [require("nativewind/preset")],
  /** Dark mode strategy; class-based to allow explicit theme toggling when needed. */
  darkMode: "class",
  /** Theme extension layer where design-system tokens are converted to utilities. */
  theme: {
    /**
     * Extend instead of replace to preserve Tailwind defaults while layering
     * product-specific tokens on top.
     */
    extend: {
      /**
       * Color utility mapping.
       * Semantics should be the default in product code:
       * - `bg-canvas` / `bg-surface` for layout layers
       * - `text-textPrimary` / `text-textSecondary` for hierarchy
       * - `bg-primary` and `text-primary-foreground` for CTA states
       */
      colors: {
        /**
         * Full palette exposure for compatibility classes.
         * Example: `bg-slate-500`, `text-red-600`.
         * Prefer semantic aliases for new UI work.
         */
        ...colors,

        /** Default app canvas behind cards/sheets and page sections. */
        canvas: colors.canvas,
        /** Primary surface for cards, panels, and elevated blocks. */
        surface: colors.surface,
        /** Divider color for subtle separation between related content blocks. */
        divider: colors.divider,
        /** Primary reading text utility. */
        textPrimary: colors.text.primary,
        /** Secondary metadata and supporting text utility. */
        textSecondary: colors.text.secondary,

        /**
         * Brand/action group.
         * `bg-primary` for action surfaces, `text-primary-foreground` for content on them.
         */
        primary: {
          DEFAULT: colors.primary,
          foreground: colors.primaryForeground,
        },
        /**
         * Secondary emphasis group for lower-priority actions.
         * Useful for neutral action buttons and soft selected states.
         */
        secondary: {
          DEFAULT: colors.secondary,
          foreground: colors.secondaryForeground,
        },
        /**
         * Destructive group for irreversible actions.
         * Keep usage limited to delete/remove flows.
         */
        destructive: {
          DEFAULT: colors.destructive,
          foreground: colors.destructiveForeground,
        },
        /**
         * Muted group for low-emphasis surfaces and helper UI.
         * Typical usage: chips, inline pills, neutral placeholders.
         */
        muted: {
          DEFAULT: colors.muted,
          foreground: colors.mutedForeground,
        },
        /**
         * Accent group for subtle visual emphasis that should not compete with primary CTA.
         */
        accent: {
          DEFAULT: colors.accent,
          foreground: colors.accentForeground,
        },
        /**
         * Popover group for floating menus/tooltips.
         * Keeps overlay content readable and aligned with card surfaces.
         */
        popover: {
          DEFAULT: colors.popover,
          foreground: colors.popoverForeground,
        },
        /**
         * Card group for containerized content modules.
         * Use as the default shell for information clusters.
         */
        card: {
          DEFAULT: colors.card,
          foreground: colors.cardForeground,
        },

        /** Muted text utility (`text-textMuted`). */
        textMuted: colors.text.muted,
        /** Error text utility (`text-textError`). */
        textError: colors.text.error,

        /** Compatibility alias for top-level page/background surfaces. */
        background: colors.background,
        /** Compatibility alias for high-contrast foreground content. */
        foreground: colors.foreground,

        /** Default border color utility (`border`). */
        border: colors.border.DEFAULT,
        /** Input fill utility (`bg-input`) for form controls. */
        input: colors.input,
        /** Focus ring utility (`ring-ring`) for accessibility states. */
        ring: colors.ring,
      },

      /**
       * Border color variants.
       * Enables explicit focus border utility (`border-focus`) while preserving
       * default border behavior and palette-based border classes.
       */
      borderColor: {
        /** Resting border style for fields/cards/dividers. */
        DEFAULT: colors.border.DEFAULT,
        /** Focus-visible border state for active form controls. */
        focus: colors.border.focus,
        /** Palette passthrough for classes like `border-slate-300` when needed. */
        ...colors,
      },

      /**
       * Font family utilities (`font-display`, `font-heading`, `font-body`, `font-mono`).
       * Apply based on content intent, not visual preference.
       */
      fontFamily: {
        ...typography.fontFamily,
      },
      /** Font weight utilities (`font-normal`..`font-extrabold`) from token scale. */
      fontWeight: {
        ...typography.fontWeight,
      },
      /** Line-height utilities to preserve reading rhythm and hierarchy. */
      lineHeight: {
        ...typography.lineHeight,
      },
      /**
       * Font size utilities mapped from token values.
       * Keeps type scale synchronized between JS theme usage and utility classes.
       */
      fontSize: {
        'xs':  `${typography.fontSize.xs}px`,
        'sm':  `${typography.fontSize.sm}px`,
        'base': `${typography.fontSize.base}px`,
        'lg':  `${typography.fontSize.lg}px`,
        'xl':  `${typography.fontSize.xl}px`,
        '2xl': `${typography.fontSize['2xl']}px`,
        '3xl': `${typography.fontSize['3xl']}px`,
        '4xl': `${typography.fontSize['4xl']}px`,
        '5xl': `${typography.fontSize['5xl']}px`,
      },

      /**
       * Letter spacing utilities (`tracking-heading`, `tracking-label`, etc.)
       * from shared typography token scale.
       */
      letterSpacing: {
        display: `${typography.letterSpacing.display}px`,
        heading: `${typography.letterSpacing.heading}px`,
        body:    `${typography.letterSpacing.body}px`,
        label:   `${typography.letterSpacing.label}px`,
        caption: `${typography.letterSpacing.caption}px`,
        caps:    `${typography.letterSpacing.caps}px`,
      },

      /**
       * Spacing utilities (`p-md`, `m-lg`, `gap-sm`) from shared spacing scale.
       * Use these instead of raw spacing literals to keep 8pt rhythm.
       */
      spacing: {
        ...metrics.spacing,
      },

      /**
       * Border radius utilities aligned to design-system shape language.
       * Use `rounded-primary`/`rounded-xl` for card and control consistency.
       */
      borderRadius: {
        ...metrics.borderRadius,
      },

      /**
       * Height utilities for control sizing and spacing aliases.
       * `h-control-*` should be preferred for buttons/inputs to keep tap ergonomics consistent.
       */
      height: {
        'control-xs': metrics.layout.controlHeight.xs,
        'control-sm': metrics.layout.controlHeight.sm,
        'control-md': metrics.layout.controlHeight.md,
        'control-lg': metrics.layout.controlHeight.lg,
        'control-xl': metrics.layout.controlHeight.xl,
        /** Optional spacing-based height helpers (e.g., `h-md`, `h-xl`). */
        ...metrics.spacing,
      },

      /** Minimum touch-safe height utility (`min-h-touch`). */
      minHeight: {
        touch: `${metrics.touchTarget.min}px`,
      },

      /** Transition duration utilities (`duration-fast`..`duration-slower`). */
      transitionDuration: {
        'slower': `${metrics.motion.duration.slower}ms`,
        'slow': `${metrics.motion.duration.slow}ms`,
        'normal': `${metrics.motion.duration.normal}ms`,
        'fast': `${metrics.motion.duration.fast}ms`,
      },

      /**
       * Max-width utilities for responsive content constraints.
       * Use `max-w-screen-*` tokens to keep tablet/web layouts aligned with design breakpoints.
       */
      maxWidth: {
        'screen-sm': `${metrics.layout.container.sm}px`,
        'screen-md': `${metrics.layout.container.md}px`,
        'screen-lg': `${metrics.layout.container.lg}px`,
        'screen-xl': `${metrics.layout.container.xl}px`,
      }
    },
  },
  /** Project has no additional Tailwind plugins at this time. */
  plugins: [],
};
