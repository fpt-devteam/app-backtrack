/**
 * Design System Typography - Source of Truth
 *
 * Typography tokens that work across both Web (Tailwind) and Native (RN).
 * These values are imported by:
 * - tailwind.config.js (for web/NativeWind)
 * - React Native components for font styling
 */

module.exports = {
  // ============================================================================
  // FONT FAMILIES
  // ============================================================================
  fontFamily: {
    // Primary display font for headings and emphasis
    display: ["Manrope", "sans-serif"],

    // Body text font (falls back to system defaults)
    body: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],

    // Monospace font for code
    mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
  },

  // ============================================================================
  // FONT SIZES
  // ============================================================================
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
  },

  // ============================================================================
  // FONT WEIGHTS
  // ============================================================================
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // ============================================================================
  // LINE HEIGHTS
  // ============================================================================
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};
